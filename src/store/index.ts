import { usePublicStore } from './publicStore'
import { useThemeStore } from './themeStore'

const store = createPinia()
export { useThemeStore, usePublicStore }
export default store
