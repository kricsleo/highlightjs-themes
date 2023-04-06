export type VSCodeThemeTokenScope = string | string[]
export type VSCodeThemeTokenSettings = {
  foreground?: string
  background?: string
  fontStyle?: string
}

export interface VSCodeTheme {
  name: string
  type?: 'dark' | 'light' | string
  colors?: {
    'editor.foreground'?: string
    'editor.background'?: string
  }
  tokenColors: Array<{
    scope: VSCodeThemeTokenScope
    settings: VSCodeThemeTokenSettings
  }>
}