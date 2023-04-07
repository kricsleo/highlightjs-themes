import { SelectorScope, VSCodeTheme, VSCodeThemeTokenScope, VSCodeThemeTokenSettings } from './types'

export function generateTheme(selectorScope: SelectorScope, theme: VSCodeTheme) {
  const styles = Object.entries(selectorScope)
    .map(([selector, VSCodeScope]) => {
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
  const global = parseDefaultThemeSetting(theme)
  const wrapperCSS = 
    'pre code {\n' +
    '  display: block;\n' +
    `  color: ${global.foreground};\n` + 
    `  background: ${global.background};\n` + 
    '}'
  return wrapperCSS + '\n' + tokenCSS
}

/**
 * todo: using tokenColors.[global settting] (no scope specified)
 * with colors.editor.foreground & colors.editor.background
 */
function parseVSCodeScopeStyle(scope: string, theme: VSCodeTheme) {
  const tokenMatchScores = theme.tokenColors
    .filter(token => token.scope)
    .map(token => ({
      token, 
      score: scoreScopeMatch(scope, token.scope!)
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

/**
 * https://github.com/microsoft/vscode/blob/f7f05dee53fb33fe023db2e06e30a89d3094488f/src/vs/platform/theme/common/colorRegistry.ts#L258-L268
 */
const VSCODE_FALLBACK_EDITOR_FG = { light: '#333333', dark: '#bbbbbb' }
const VSCODE_FALLBACK_EDITOR_BG = { light: '#fffffe', dark: '#1e1e1e' }
/**
 * Forked from shiki
 * https://github.com/shikijs/shiki/blob/db5c62bda448a3c95c66b9cc0b4980b8df856a58/packages/shiki/src/loader.ts#L208
 */
function parseDefaultThemeSetting(theme: VSCodeTheme) {
  const settings = theme.settings || theme.tokenColors
  const globalSetting = settings?.find(s => !s.scope)
  const foreground = parseDefaultColor('foreground')
  const background = parseDefaultColor('background')
  return { foreground, background }

  function parseDefaultColor(key: 'foreground' | 'background') {
    const VSCODE_FALLBACK_SETTING = key === 'foreground' 
      ? VSCODE_FALLBACK_EDITOR_FG
      : VSCODE_FALLBACK_EDITOR_BG
    const VSCODE_FALLBACK_COLOR = theme.type === 'light' 
      ? VSCODE_FALLBACK_SETTING.light 
      : VSCODE_FALLBACK_SETTING.dark
    return globalSetting?.settings?.[key]
      || theme.colors?.[`editor.${key}`]
      || VSCODE_FALLBACK_COLOR
  }
}
