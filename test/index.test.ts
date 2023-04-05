import { describe, expect, it } from 'vitest'
import theme from '../playground/gentle-clean-vitesse.json'
import { generateHljsTheme } from '../src'

describe('generateHljsTheme', () => {
  it('generate', () => {
    expect(generateHljsTheme(theme)).toMatchInlineSnapshot(`
      ".hljs {
          color:#dbd7caee;
          background:#1e1e1e;
      }.hljs-keyword {
        color:#d4976cef;
      }"
    `)
  })
})