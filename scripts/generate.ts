import { batchGenerateHljsCSS } from '../src/index'
import path from 'path'
import url from 'url'

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