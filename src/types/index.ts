import type { GlobalThemeOverrides, GlobalTheme } from 'naive-ui'
export type publicStoreType = {}

export type themeStoreType = {
  themeOverrides: GlobalThemeOverrides
  theme: GlobalTheme | null
}
