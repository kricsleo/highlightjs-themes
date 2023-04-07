import fs from 'fs/promises'
import path from 'path'
import glob from 'fast-glob'
import { generateHljsTheme } from './index'

export async function generateHljsCSS(VSCodeThemePath: string, hljsCSSDist: string) {
  const content = await fs.readFile(VSCodeThemePath, { encoding: 'utf-8'})
  const theme = JSON.parse(content)
  console.log('Generating', VSCodeThemePath)
  const css = generateHljsTheme(theme)
  const filename = `${normalizeThemeName(theme.name)}.css`
  const filepath = path.resolve(hljsCSSDist, filename)
  await fs.writeFile(filepath, css)
}

export async function batchGenerateHljsCSS(VSCodeThemeGlob: string | string[], hljsCSSDist: string) {
  const files = await glob(VSCodeThemeGlob, { absolute: true })
  await Promise.all(files.map(file => generateHljsCSS(file, hljsCSSDist)))
}

function normalizeThemeName(name: string) {
  const hyphenateRE = /\B([A-Z\s])/g
  return name.trim()
    .replace(/\s/g, '-')
    .replace(hyphenateRE, '-$1')
    .toLowerCase()
}