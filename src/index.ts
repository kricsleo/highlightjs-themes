import { VSCodeTheme, VSCodeThemeTokenScope, VSCodeThemeTokenSettings } from './types'

// highlightjs -> TextMate(Used by VS Code)
const SCOPE_MAP = {
  keyword: 'keyword'
}

export function generateHljsTheme(theme: VSCodeTheme) {
  let css = Object.entries(SCOPE_MAP).reduce((all, [hljsScope, VSCodeScope]) => {
    const style = parseVSCodeScopeStyle(VSCodeScope, theme)
    if(style) {
      all += `.hljs-${hljsScope} ${style}`
    }
    return all
  }, '')
  css = `.hljs {
    color:${theme.colors['editor.foreground']};
    background:${theme.colors['editor.background']};
}` + css
  return css
}

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

function formatVSCodeDefaultStyle(theme: VSCodeTheme) {
  // return 
}

function formatVSCodeTokenStyle(settings: VSCodeThemeTokenSettings) {
  const mappings = [
    ['color', settings.foreground],
    ['background', settings.background],
    ['font-style', settings.fontStyle],
  ]
  const styles = mappings.filter(mapping => mapping[1])
    .map(mapping => `${mapping[0]}:${mapping[1]};`)
    .join('\n')
  return `{\n  ${styles}\n}`
}