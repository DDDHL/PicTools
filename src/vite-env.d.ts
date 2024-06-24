/// <reference types="vite/client" />
import type { SafeIpcRenderer } from '@/types'

declare global {
  interface Window {
    showDirectoryPicker(): any
    safeIpc: SafeIpcRenderer
  }
}
