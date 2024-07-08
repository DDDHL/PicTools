import { ipcMain, app } from 'electron'
const { exiftool } = require('exiftool-vendored')

let exiftoolInstance: any

export default function exifFunc() {
  // 创建exiftool实例
  exiftoolInstance = exiftool

  ipcMain.handle('get-exif', async (_, imagePath) => {
    try {
      const tags = await exiftoolInstance.read(imagePath)
      return tags
    } catch (error) {
      console.error('读取EXIF数据时出错:', error)
      return {}
    }
  })

  app.on('before-quit', () => {
    exiftoolInstance.end()
  })
}
