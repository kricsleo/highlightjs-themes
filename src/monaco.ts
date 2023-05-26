import { VSCodeTheme } from "./types";
import * as monaco from 'monaco-editor';
import { downloadVSCodeTheme, isDarkTheme } from './vscode'

export function vscodeTheme2MonacoTheme(vscodeTheme: VSCodeTheme): monaco.editor.IStandaloneThemeData {
  const base = isDarkTheme(vscodeTheme) ? 'vs-dark' : 'vs'
  const rules = vscodeTheme.tokenColors.map(token => {
    const scopes = typeof token.scope === 'string' 
      ? token.scope.split(',')
      : token.scope || []
    const foreground = token.settings?.foreground?.slice(1)
    const background = token.settings?.background?.slice(1)
    return scopes.map(scope => ({...token.settings, foreground, background, token: scope }))
  }).flat()
  return {
    base,
    inherit: true,
    colors: vscodeTheme.colors || {},
    rules,
    encodedTokensColors: []
  }
}

(async () => {
  const theme = 'kricsleo.gentle-clean.Gentle Clean Vitesse'
  // const theme = 'antfu.theme-vitesse.Vitesse Dark Soft'
  const themeJSON = await downloadVSCodeTheme(theme)
  const monacoThemeJSON = vscodeTheme2MonacoTheme(themeJSON)
  console.log('monacoThemeJSON', JSON.stringify(monacoThemeJSON, null, 2))
})()