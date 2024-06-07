export type publicStoreType = {
  uploadedImages: { file: File; scale: number; selected: boolean }[]
  collapsed: boolean
}
export type configStoreType = {
  exportPath: string
}
