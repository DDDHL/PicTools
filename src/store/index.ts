import { usePublicStore } from './publicStore'
import { useConfigStore } from './configStore'
import { createPinia } from 'pinia'

const pinia = createPinia()
export { usePublicStore, useConfigStore }
export default pinia
