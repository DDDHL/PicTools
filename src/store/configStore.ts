import { configStoreType } from '@/types'

export const useConfigStore = defineStore('ConfigStore', {
  state: (): configStoreType => ({
    exportPath: 'C:\\export',
    sizeUnit: 'MB',
    menuExpand: false,
    concurrence: 10,
  }),
  getters: {},
  actions: {},
})
