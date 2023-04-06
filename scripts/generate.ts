import { batchGenerateHljsCSS } from '../src/index'
import path from 'path'
import url from 'url'
import chalk from 'chalk'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(url.fileURLToPath(import.meta.url))

const themeDir = path.resolve(_dirname, '../vscode-themes/*.json')
const themeDist = path.resolve(_dirname, '../themes')
const playgroundThemeDist = path.resolve(_dirname, '../playground/public/themes');

(async () => {
  console.log(chalk.green('Generating highlightjs themes from VS Code themes...'))
  // generate for reference
  await batchGenerateHljsCSS(themeDir, themeDist)
  console.log(chalk.green('Themes generated.'))

  // generate for playground
  await batchGenerateHljsCSS(themeDir, playgroundThemeDist)
  console.log(chalk.green('Themes generated for playground.'))
})()