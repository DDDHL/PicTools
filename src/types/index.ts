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
  compressSize?: number
}
