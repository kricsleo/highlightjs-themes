import { VSCodeTheme, VSCodeThemeId } from "./types";
import { downloadVSCodeTheme, isDarkTheme } from './vscode'

/**
 * @param vscodeTheme 
 * @returns monaco.editor.IStandaloneThemeData
 */
export function vscodeTheme2MonacoTheme(vscodeTheme: VSCodeTheme) {
  const base = isDarkTheme(vscodeTheme) ? 'vs-dark' : 'vs'
  const rules = vscodeTheme.tokenColors.map(token => {
    const scopes = typeof token.scope === 'string' 
      ? token.scope.split(',')
      : token.scope || []
    const foreground = token.settings?.foreground?.slice(1)
    const background = token.settings?.background?.slice(1)
    return scopes.map(scope => ({
      ...token.settings, 
      foreground, 
      background, 
      token: scope 
    }))
  }).flat()

  // https://github.com/brijeshb42/monaco-themes/blob/master/src/index.js#L42
  const colors = vscodeTheme.colors || {}
  return {
    base,
    inherit: true,
    colors,
    rules,
    encodedTokensColors: []
  }
}

export async function loadMonacoThemeFromVSCodeTheme(vscodeThemeId: VSCodeThemeId) {
  const themeJSON = await downloadVSCodeTheme(vscodeThemeId)
  const monacoThemeJSON = vscodeTheme2MonacoTheme(themeJSON)
  return monacoThemeJSON
}

// (async () => {
//   const theme = 'kricsleo.gentle-clean.Gentle Clean Vitesse'
//   // const theme = 'antfu.theme-vitesse.Vitesse Dark Soft'
//   const monacoThemeJSON = loadMonacoThemeFromVSCodeTheme(theme)
//   console.log('monacoThemeJSON', JSON.stringify(monacoThemeJSON, null, 2))
// })()