import { configStoreType } from '@/types'

export const useConfigStore = defineStore('ConfigStore', {
  state: (): configStoreType => ({
    exportPath: '',
    readPath: '',
  }),
  getters: {},
  actions: {},
})
