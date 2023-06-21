import { VSCodeTheme, VSCodeThemeId, downloadVSCodeTheme } from '../../../src'

export const themes = reactive<Record<string, VSCodeTheme>>({})

export async function fetchTheme(theme: VSCodeThemeId) {
  if(!themes[theme]) {
    const themeJSON = await downloadVSCodeTheme(theme)
    themeJSON.name = theme
    themes[theme] = themeJSON
  }
  return themes[theme]
}

export function insertTheme(css: string) {
  const id = 'theme';
  (document.getElementById(id) as HTMLLinkElement)?.remove()
  const themeEle = document.createElement('style') as HTMLStyleElement
  themeEle.id = id
  themeEle.innerHTML = css
  document.head.appendChild(themeEle)
}