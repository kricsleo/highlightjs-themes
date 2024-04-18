import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'
import glob from 'fast-glob'
import chalk from 'chalk'
import { vscodeTheme2HljsTheme } from '../src/highlight-js'
import { vscodeTheme2PrismjsTheme } from '../src/prism-js'
import { normalizeThemeName } from '../src/vscode'
import { vscodeTheme2MonacoTheme } from '../src/monaco'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(url.fileURLToPath(import.meta.url))

const themeDir = path.resolve(_dirname, '../themes/*.json')
const themeDist = path.resolve(_dirname, '../themes')
const playgroundThemeDist = path.resolve(_dirname, '../playground/public/themes');


(async () => {
  // generate for reference
  await batchGenerateHljsCSS(themeDir, themeDist)

  // generate for playground
  await batchGenerateHljsCSS(themeDir, playgroundThemeDist)
})()

export async function generateCSS(VSCodeThemePath: string, distDir: string) {
  const content = await fs.readFile(VSCodeThemePath, { encoding: 'utf-8' })
  const theme = JSON.parse(content)
  const themeName = normalizeThemeName(theme.name)
  console.log(chalk.yellow('Generating'), '🫧 ', themeName)
  const hljsTheme = vscodeTheme2HljsTheme(theme)
  const prismjsTheme = vscodeTheme2PrismjsTheme(theme)
  const monacoTheme = String(vscodeTheme2MonacoTheme(theme))
  const hljsFilepath = path.resolve(distDir, `highlightjs/${themeName}.css`)
  const prismjsFilepath = path.resolve(distDir, `prismjs/${themeName}.css`)
  const monacoFilepath = path.resolve(distDir, `monaco/${themeName}.json`)
  await Promise.all([
    [hljsTheme, hljsFilepath],
    [prismjsTheme, prismjsFilepath],
    [monacoTheme, monacoFilepath],
  ].map(async ([themeData, filepath]) => {
    fs.mkdir(path.dirname(filepath), { recursive: true })
    fs.writeFile(filepath, themeData)
  }))
}

export async function batchGenerateHljsCSS(VSCodeThemeGlob: string | string[], hljsCSSDist: string) {
  const files = await glob(VSCodeThemeGlob, { absolute: true })
  await Promise.all(files.map(file => generateCSS(file, hljsCSSDist)))
}