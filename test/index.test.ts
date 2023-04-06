import { describe, expect, it } from 'vitest'
import theme from './themes/gentle-clean-vitesse.json'
import { batchGenerateHljsCSS, generateHljsCSS, generateHljsTheme } from '../src'
import path from 'path'
import { fileURLToPath } from 'url'

const _dirname = typeof __dirname !== 'undefined'
  ? __dirname
  : path.dirname(fileURLToPath(import.meta.url))

const themeDir = _dirname + '/themes/**/*.json'
const gentleCleanThemePath = path.resolve(_dirname, './themes/gentle-clean-vitesse.json')
const vitesseThemePath = path.resolve(_dirname, './themes/vitesse-light.json')
const dest = path.resolve(_dirname, './themes')
describe('generateHljsTheme', () => {
  it('batchGenerateFiles', async () => {
    const p = batchGenerateHljsCSS(themeDir, dest)
    await expect(p).resolves.toMatchInlineSnapshot('undefined')
  })

  it('generateFile', async () => {
    const p = generateHljsCSS(vitesseThemePath, dest)
    await expect(p).resolves.toMatchInlineSnapshot('undefined')
  })

  it('generateCSS', () => {
    expect(generateHljsTheme(theme)).toMatchInlineSnapshot(`
      "pre code.hljs {
        display: block;
        color:#dbd7caee;
        background:#1e1e1e;
      }
      .hljs-keyword,
      .hljs-operator,
      .hljs-meta.keyword_,
      .hljs-selector-tag,
      .hljs-selector-class,
      .hljs-template-tag,
      .hljs-variable.language_,
      .hljs-tag {
        color: #d4976cef;
      }
      .hljs-built_in,
      .hljs-function,
      .hljs-attr,
      .hljs-code,
      .hljs-formula,
      .hljs-link,
      .hljs-deletion,
      .hljs-title.function_,
      .hljs-meta.prompt_ {
        color: #6394bfef;
      }
      .hljs-type,
      .hljs-property,
      .hljs-subst,
      .hljs-class,
      .hljs-variable,
      .hljs-title,
      .hljs-meta,
      .hljs-attribute,
      .hljs-selector-id,
      .hljs-selector-attr,
      .hljs-selector-pseudo,
      .hljs-title.class_,
      .hljs-title.class_.inherited__,
      .hljs-title.function_.invoke__,
      .hljs-name {
        color: #5eaab5ef;
      }
      .hljs-literal,
      .hljs-number,
      .hljs-regexp,
      .hljs-string,
      .hljs-char.escape_,
      .hljs-symbol,
      .hljs-meta.string_,
      .hljs-quote {
        color: #4d9375ef;
      }
      .hljs-punctuation {
        color: #eeeeee95;
      }
      .hljs-params,
      .hljs-template-variable,
      .hljs-variable.constant_ {
        color: #d88c9aef;
      }
      .hljs-comment,
      .hljs-doctag {
        color: #848890cc;
      }
      .hljs-section {
        color: #d4976cf2;
        font-style: bold;
      }
      .hljs-strong {
        font-style: bold;
      }
      .hljs-addition {
        color: #99C794;
      }
      .hljs-bullet {
        color: #A3CE9E;
      }"
    `)
  })
})