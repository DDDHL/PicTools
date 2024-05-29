import { themeStoreType } from '@/types'

export const useThemeStore = defineStore('ThemeStore', {
  state: (): themeStoreType => ({
    themeOverrides: {},
    theme: null, // 主题，null为亮色，darkTheme为暗色
  }),
  actions: {},
})
