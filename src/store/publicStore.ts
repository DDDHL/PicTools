import { publicStoreType } from '@/types'

export const usePublicStore = defineStore('PublicStore', {
  state: (): publicStoreType => ({
    currentPicList: [],
  }),
  getters: {},
  actions: {},
})
