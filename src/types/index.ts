export type publicStoreType = {
  uploadedImages: uploadedImagesType[]
  collapsed: boolean
}
export type configStoreType = {
  exportPath: string
  sizeUnit: 'MB' | 'KB'
  menuExpand: boolean
  concurrence: number
}
export type uploadedImagesType = {
  id: string
  path: string
  selected: boolean
  scale: number
  name: string
  size: number
  compressCachePath: string
  compressExportPath?: string
  compressSize?: number
}
export interface SafeIpcRenderer {
  send: (channel: string, data?: any) => void
  on: (channel: string, listener: (data?: any) => void) => () => void
  off: (channel: string, listener: (...args: any[]) => void) => void
  invoke: (channel: string, ...args: any[]) => Promise<any>
}
