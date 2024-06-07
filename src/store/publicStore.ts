import { publicStoreType } from '@/types'

export const usePublicStore = defineStore('PublicStore', {
  state: (): publicStoreType => ({
    uploadedImages: [],
    collapsed: true,
  }),
  getters: {},
  actions: {},
})
