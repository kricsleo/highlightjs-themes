import { VSCodeTheme, VSCodeThemeId } from "./types";
import { downloadVSCodeTheme, isDarkTheme, normalizeHexColor } from './vscode'

/**
 * Convert VS Code theme to monaco editor theme.
 * 
 * vscode theme(monaco based on it): https://github.com/microsoft/vscode/blob/784e72bc4486b7ea5ad3447c506e31d949848592/src/vs/editor/standalone/common/themes.ts#L11
 * monaco editro full theme tokens: https://github.com/microsoft/monaco-editor/blob/0c6348a71d02351ad7d5c3ac2660cb19902c919d/website/src/website/data/playground-samples/customizing-the-appearence/exposed-colors/sample.js#L8
 * @param vscodeTheme 
 * @returns monaco.editor.IStandaloneThemeData
 */
export function vscodeTheme2MonacoTheme(vscodeTheme: VSCodeTheme) {
  const base = isDarkTheme(vscodeTheme) ? 'vs-dark' : 'vs'
  const rules = vscodeTheme.tokenColors.map(token => {
    const scopes = typeof token.scope === 'string' 
      ? token.scope.split(',')
      : token.scope || []
    const foreground = token.settings?.foreground && normalizeHexColor(token.settings.foreground).slice(1)
    const background = token.settings?.background && normalizeHexColor(token.settings.background).slice(1)
    return scopes.map(scope => ({
      ...token.settings, 
      foreground, 
      background, 
      token: scope 
    }))
  }).flat()

  // https://github.com/brijeshb42/monaco-themes/blob/master/src/index.js#L42
  const colors = Object.entries(vscodeTheme.colors || {}).reduce((all, [k,v]) => {
    all[k] = normalizeHexColor(v)
    return all
  }, {} as Record<string, string>)
  return {
    base,
    inherit: true,
    colors,
    rules,
    encodedTokensColors: []
  }
}

/**
 * Download VS Code theme and convert to monaco theme online.
 */
export async function loadMonacoThemeFromVSCodeTheme(vscodeThemeId: VSCodeThemeId) {
  const themeJSON = await downloadVSCodeTheme(vscodeThemeId)
  const monacoThemeJSON = vscodeTheme2MonacoTheme(themeJSON)
  return monacoThemeJSON
}
