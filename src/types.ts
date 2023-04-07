export type VSCodeThemeTokenScope = string | string[]
export interface VSCodeThemeTokenSettings {
  foreground?: string
  background?: string
  fontStyle?: string
}
export interface VSCodeThemeTokenColor {
  name?: string
  scope?: VSCodeThemeTokenScope
  settings: VSCodeThemeTokenSettings
}

export interface VSCodeTheme {
  name: string
  type?: 'dark' | 'light' | string
  settings?: VSCodeThemeTokenColor[]
  colors?: {
    'editor.foreground'?: string
    'editor.background'?: string
  }
  tokenColors: VSCodeThemeTokenColor[]
}

export type SelectorScope = Record<string, string>