import { VSCodeTheme, VSCodeThemeId, VSCodeThemePkgJSON } from './types'
import JSZip from 'jszip'
import {ofetch} from 'ofetch'
// @ts-expect-error no types
import resolvePath from 'resolve-pathname'
import json5 from 'json5'

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
  let hex = color.replace(/#/, '')
  if(hex.length < 6) {
    hex = hex.split('').map(char => char + char).join('')
  }
  return '#' + hex
}
