export type publicStoreType = {
  uploadedImages: uploadedImagesType[]
  collapsed: boolean
}
export type configStoreType = {
  exportPath: string
  sizeUnit: 'MB' | 'KB'
}
export type uploadedImagesType = {
  path: string
  selected: boolean
  scale: number
  name: string
  size: number
  compressSize?: number
}
