import { usePublicStore } from './publicStore'
import { useConfigStore } from './configStore'

const store = createPinia()
export { usePublicStore, useConfigStore }
export default store
