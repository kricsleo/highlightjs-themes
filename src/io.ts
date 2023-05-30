import fs from 'fs-extra'
import path from 'path'
import glob from 'fast-glob'
import { vscodeTheme2HljsTheme } from './highlight-js'
import { vscodeTheme2PrismjsTheme } from './prism-js'
import chalk from 'chalk'

export async function generateCSS(VSCodeThemePath: string, distDir: string) {
  const content = await fs.readFile(VSCodeThemePath, { encoding: 'utf-8'})
  const theme = JSON.parse(content)
  const themeName = normalizeThemeName(theme.name)
  console.log(chalk.yellow('Generating'), '🫧 ', themeName)
  const hljsTheme = vscodeTheme2HljsTheme(theme)
  const prismjsTheme = vscodeTheme2PrismjsTheme(theme)
  const hljsFilepath = path.resolve(distDir, `highlightjs/${themeName}.css`)
  const prismjsFilepath = path.resolve(distDir, `prismjs/${themeName}.css`)
  await Promise.all([
    fs.ensureDir(path.dirname(hljsFilepath)),
    fs.ensureDir(path.dirname(prismjsFilepath))
  ])
  await Promise.all([
    fs.writeFile(hljsFilepath, hljsTheme),
    fs.writeFile(prismjsFilepath, prismjsTheme)
  ])
}

export async function batchGenerateHljsCSS(VSCodeThemeGlob: string | string[], hljsCSSDist: string) {
  const files = await glob(VSCodeThemeGlob, { absolute: true })
  await Promise.all(files.map(file => generateCSS(file, hljsCSSDist)))
}

function normalizeThemeName(name: string) {
  const hyphenateRE = /\B([A-Z\s])/g
  return name.trim()
    .replace(/\s/g, '-')
    .replace(hyphenateRE, '-$1')
    .toLowerCase()
}