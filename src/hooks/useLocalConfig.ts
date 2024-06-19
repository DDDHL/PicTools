import pinia, { useConfigStore, usePublicStore } from '@/store'
const configStore = useConfigStore(pinia)
const publicStore = usePublicStore(pinia)

export const useLocalConfig = () => {
  onMounted(() => {
    const localStorageConfig = JSON.parse(
      localStorage.getItem('config') || '{}'
    )
    recursiveUpdate(configStore, localStorageConfig)
  })

  onUnmounted(() => {
    setLocalStore()
  })
}

export const setLocalStore = () => {
  localStorage.setItem('config', JSON.stringify(configStore.$state))
}

function recursiveUpdate(store: any, newConfig: any) {
  for (const key in newConfig) {
    if (newConfig.hasOwnProperty(key)) {
      if (typeof newConfig[key] === 'object' && newConfig[key] !== null) {
        if (!store[key]) {
          store[key] = Array.isArray(newConfig[key]) ? [] : {}
        }
        recursiveUpdate(store[key], newConfig[key])
      } else {
        store[key] = newConfig[key]
        if (key === 'menuExpand') {
          publicStore.collapsed = !newConfig[key]
        }
      }
    }
  }
}
