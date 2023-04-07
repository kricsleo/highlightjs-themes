import { VSCodeTheme, VSCodeThemeTokenScope, VSCodeThemeTokenSettings } from './types'
import fs from 'fs/promises'
import path from 'path'
import glob from 'fast-glob'
import { SCOPE_MAPPINGS } from './mappings'

export function generateHljsTheme(theme: VSCodeTheme) {
  const styles = Object.entries(SCOPE_MAPPINGS)
    .map(([hljsScope, VSCodeScope]) => {
      const selector = formatHljsSelector(hljsScope)
      const style = parseVSCodeScopeStyle(VSCodeScope, theme)
      return { selector, style }
    })
    .filter(css => css.style) as Array<{selector: string; style: string}>
  const combinedStyles = styles.reduce((all, style) => {
    if(all[style.style]) {
      all[style.style] += `,\n${style.selector}`
    } else {
      all[style.style] = style.selector
    }
    return all
  }, {} as Record<string, string>)
  const tokenCSS = Object.entries(combinedStyles)
    .map(([style, selector]) => `${selector} ${style}`)
    .join('\n')
  const foreground = theme.colors?.['editor.foreground']
  const background = theme.colors?.['editor.background']
  const wrapperCSS = 
    'pre code.hljs {\n' +
    '  display: block;\n' +
    (foreground ? `  color: ${foreground};\n` : '') + 
    (background ? `  background: ${background};\n` : '') + 
    '}'
  return wrapperCSS + '\n' + tokenCSS
}

export async function generateHljsCSS(VSCodeThemePath: string, hljsCSSDist: string) {
  const content = await fs.readFile(VSCodeThemePath, { encoding: 'utf-8'})
  const theme = JSON.parse(content)
  console.log('VSCodeThemePath', VSCodeThemePath)
  const css = generateHljsTheme(theme)
  const filename = `${normalizeThemeName(theme.name)}.css`
  const filepath = path.resolve(hljsCSSDist, filename)
  await fs.writeFile(filepath, css)
}

export async function batchGenerateHljsCSS(VSCodeThemeSource: string | string[], hljsCSSDist: string) {
  const files = await glob(VSCodeThemeSource, { absolute: true })
  await Promise.all(files.map(file => generateHljsCSS(file, hljsCSSDist)))
}

/**
 * todo: using tokenColors.[global settting] (no scope specified)
 * with colors.editor.foreground & colors.editor.background
 */
function parseVSCodeScopeStyle(scope: string, theme: VSCodeTheme) {
  const tokenMatchScores = theme.tokenColors.map(token => ({
    token, 
    score: scoreScopeMatch(scope, token.scope)
  }))
  const maxMatchedToken = tokenMatchScores.reduce((all, cur) => cur.score > all.score ? cur : all, tokenMatchScores[0])
  return maxMatchedToken.score
    ? formatVSCodeTokenStyle(maxMatchedToken.token.settings)
    : null
}

function scoreScopeMatch(sourceScope: string, targetScope: VSCodeThemeTokenScope): number {
  if(Array.isArray(targetScope)) {
    const isExactlyMathched = targetScope.some(s => s === sourceScope)
    if(isExactlyMathched) {
      return Infinity
    } else {
      const scores = targetScope.map(s => scoreScopeMatch(sourceScope, s))
      const maxScore = scores.reduce((all, cur) => Math.max(all, cur), 0)
      return maxScore
    }
  } else if(!targetScope) {
    return 0
  } else {
    if(sourceScope === targetScope) {
      return Infinity
    } else {
      const sourceTokens = sourceScope.split('.')
      const targetTokens = targetScope.split('.')
      let score = 0
      while(sourceTokens.length && targetTokens.length) {
        const sourceToken = sourceTokens.shift()
        const targetToken = targetTokens.shift()
        if(sourceToken === targetToken) {
          score += 1
        } else {
          break;
        }
      }
      return score
    }
  }
}

function formatVSCodeTokenStyle(settings: VSCodeThemeTokenSettings) {
  const mappings = [
    ['color', settings.foreground],
    ['background', settings.background],
    ['font-style', settings.fontStyle],
  ]
  const styles = mappings.filter(mapping => mapping[1])
    .map(mapping => `  ${mapping[0]}: ${mapping[1]};`)
    .join('\n')
  return styles ? `{\n${styles}\n}` : null
}

function formatHljsSelector(hljsScope: string) {
  const [parent, ...children] = hljsScope.split('.')
  const parentSelector = `.hljs-${parent}`
  const childrenSelector = children.reduce(
    (all, cur, idx) => all + `.${cur}${'_'.repeat(idx + 1)}`, 
    ''
  )
  return parentSelector + childrenSelector
}

function normalizeThemeName(name: string) {
  const hyphenateRE = /\B([A-Z\s])/g
  return name.trim()
    .replace(/\s/g, '-')
    .replace(hyphenateRE, '-$1')
    .toLowerCase()
}