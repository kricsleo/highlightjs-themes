import { SelectorScope, VSCodeTheme, VSCodeThemeId, VSCodeThemePkgJSON, VSCodeThemeTokenScope, VSCodeThemeTokenSettings } from './types'
import JSZip from 'jszip'
import {ofetch} from 'ofetch'
// @ts-expect-error no types
import resolvePath from 'resolve-pathname'
import json5 from 'json5'
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";

extend([namesPlugin])

/**
 * Download theme from VS Code market.
 * `<Identifier>.<ThemeName>`
 * .Eg. `kricsleo.gentle-clen.Gentle Clean Vitesse`
 */
export async function downloadVSCodeTheme(vscodeThemeId: VSCodeThemeId) {
  const [publisher, extId, theme] = vscodeThemeId.split('.')
  const themeLink = 
    `https://${publisher}.gallery.vsassets.io` +
    `/_apis/public/gallery/publisher/${publisher}` +
    `/extension/${extId}/latest` +
    `/assetbyname/Microsoft.VisualStudio.Services.VSIXPackage`
  const buffer = await ofetch(themeLink, { responseType: 'arrayBuffer'})
  const zip = await JSZip.loadAsync(buffer)
  const pkgContent = await zip.file('extension/package.json')!.async('string')
  const pkgJSON: VSCodeThemePkgJSON = JSON.parse(pkgContent);
  const themeConfig = (pkgJSON.contributes.themes || []).find(
    t => t.label.toLowerCase() === theme.toLowerCase()
  )
  if(!themeConfig) {
    const avaliableThemes = (pkgJSON.contributes.themes || [])
      .map(t => `\`${t.label}\``)
      .join(' | ')
    throw new Error(`Not found theme \`${theme}\`, but found ${avaliableThemes}`)
  }
  const themePath = resolvePath(themeConfig.path, 'extension/')
  const themeContent = await zip.file(themePath)!.async('string')
  // TODO: Is it possible to not use json5?
  const themeJSON = json5.parse(themeContent)
  return themeJSON
}

export function isDarkTheme(vscodeTheme: VSCodeTheme) {
  if(vscodeTheme.type === 'dark') {
    return true
  }
  const background = vscodeTheme.colors?.['editor.background']
  const foreground = vscodeTheme.colors?.['editor.foreground']
  if((background && isDarkColor(background)) || (foreground && !isDarkColor(foreground))) {
    return true
  }
  return false
}

export function isDarkColor(color: string) {
  const hex = normalizeHexColor(color).replace(/#/, '')
  const [r, g, b] = hex.match(/.{2}/g)!.map(hex => parseInt(hex, 16))
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness <= 155
}

export function normalizeHexColor(color: string) {
  return colord(color).toHex()
}

export function normalizeThemeName(name: string) {
  const hyphenateRE = /\B([A-Z\s])/g
  return name.trim()
    .replace(/\s/g, '-')
    .replace(hyphenateRE, '-$1')
    .toLowerCase()
}

export function getThemeStyle(selectorScope: SelectorScope, theme: VSCodeTheme) {
  const styles = Object.entries(selectorScope)
    .map(([selector, VSCodeScope]) => {
      const style = getVSCodeScopeStyle(VSCodeScope, theme)
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
  const global = getDefaultThemeSetting(theme)
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
export function getVSCodeScopeStyle(scope: string, theme: VSCodeTheme) {
  const tokenMatchScores = theme.tokenColors
    .filter(token => token.scope)
    .map(token => ({
      token, 
      score: scoreScopeMatch(scope, token.scope!)
    }))
  const maxMatchedToken = tokenMatchScores.reduce((all, cur) => cur.score > all.score ? cur : all, tokenMatchScores[0])
  return maxMatchedToken.score
    ? getVSCodeTokenStyle(maxMatchedToken.token.settings)
    : null
}

export function scoreScopeMatch(sourceScope: string, targetScope: VSCodeThemeTokenScope): number {
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

export function getVSCodeTokenStyle(settings: VSCodeThemeTokenSettings) {
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
export const VSCODE_FALLBACK_EDITOR_FG = { light: '#333333', dark: '#bbbbbb' }
export const VSCODE_FALLBACK_EDITOR_BG = { light: '#fffffe', dark: '#1e1e1e' }
/**
 * Forked from shiki
 * https://github.com/shikijs/shiki/blob/db5c62bda448a3c95c66b9cc0b4980b8df856a58/packages/shiki/src/loader.ts#L208
 */
export function getDefaultThemeSetting(theme: VSCodeTheme) {
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

