import { ipcMain, app, BrowserWindow, dialog } from 'electron'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import Jimp from 'jimp'

export default function ipcMessage(win: BrowserWindow) {
  ipcMain.on('minimize', (_) => {
    win.minimize()
  })
  ipcMain.on('maximize', (_) => {
    win.maximize()
  })
  ipcMain.on('restore', (_) => {
    win.restore()
  })
  ipcMain.on('close', (_) => {
    app.quit()
    exec(`taskkill /f /pid ${process.pid}`, () => {})
  })

  ipcMain.handle('get-directory-path', () => {
    return new Promise<string>((resolve) => {
      dialog
        .showOpenDialog({
          properties: ['openDirectory'],
        })
        .then((result) => {
          if (!result.canceled && result.filePaths.length > 0) {
            const folderPath = result.filePaths[0]
            resolve(folderPath)
          }
        })
        .catch((err) => {
          console.log(err)
          resolve('')
        })
    })
  })

  ipcMain.handle('get-pic-path', () => {
    return new Promise<string[]>(async (resolve) => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg'] }],
      })
      if (!result.canceled) {
        resolve(result.filePaths)
      } else {
        resolve([])
      }
    })
  })

  ipcMain.handle('read-pic', async (_event, imagePaths: string[]) => {
    try {
      const results = await Promise.all(
        imagePaths.map(async (imagePath) => {
          const data = await fs.promises.readFile(imagePath)
          const fileType = path.extname(imagePath).slice(1)
          return {
            buffer: data.buffer,
            fileType: `image/${fileType.toLowerCase()}`,
          }
        })
      )
      return results
    } catch (error) {
      console.error('Error reading image files:', error)
      return []
    }
  })

  ipcMain.handle(
    'compress-img',
    (_event, imagePaths: string[], outputDir: string, quality: number) => {
      return new Promise((resolve) => {
        const result: number[] = []
        Promise.all(
          imagePaths.map((imagePath, index) => {
            return Jimp.read(imagePath)
              .then((image) => {
                const outputFileName = path.basename(imagePath)
                const outputPath = path.join(outputDir, outputFileName)
                return image.quality(quality).writeAsync(outputPath)
              })
              .catch((err) => {
                console.error(`Error compressing image ${imagePath}:`, err)
                result.push(index)
              })
          })
        ).then(() => {
          resolve(result)
        })
      })
    }
  )

  win.on('maximize', () => {
    win.webContents.send('maximize')
  })

  win.on('resize', () => {
    if (!win.isMaximized()) {
      win.webContents.send('restore')
    }
  })
}
