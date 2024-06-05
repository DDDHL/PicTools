import { publicStoreType } from '@/types'

export const usePublicStore = defineStore('PublicStore', {
  state: (): publicStoreType => ({
    uploadedImages: [],
  }),
  getters: {},
  actions: {},
})
