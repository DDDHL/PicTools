import { configStoreType } from '@/types'

export const useConfigStore = defineStore('ConfigStore', {
  state: (): configStoreType => ({
    exportPath: 'C:\\export',
  }),
  getters: {},
  actions: {},
})
