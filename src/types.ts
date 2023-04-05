export type VSCodeThemeTokenScope = string | string[]
export type VSCodeThemeTokenSettings = {
  foreground?: string
  background?: string
  fontStyle?: string
}

export interface VSCodeTheme {
  name: string
  type?: 'dark' | 'light'
  colors: {
    foreground: string
    background: string
  }
  tokenColors: Array<{
    scope: VSCodeThemeTokenScope
    settings: VSCodeThemeTokenSettings
  }>
}