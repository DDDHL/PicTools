export type publicStoreType = {
  uploadedImages: {
    path: string
    selected: boolean
    scale: number
    name: string
    size: number
    compressSize?: number
  }[]
  collapsed: boolean
}
export type configStoreType = {
  exportPath: string
}
