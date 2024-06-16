import { ipcMain, app, BrowserWindow, dialog } from 'electron'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
const { fork } = require('child_process')

export default function ipcMessage(win: BrowserWindow, publicPath: string) {
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

  ipcMain.handle('get-pic', () => {
    return new Promise(async (resolve) => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg'] }],
      })
      if (!result.canceled) {
        const fileInfos = result.filePaths.map((filePath) => {
          const stats = fs.statSync(filePath)
          return {
            name: path.basename(filePath),
            path: filePath,
            size: stats.size,
          }
        })
        resolve(fileInfos)
      } else {
        resolve([])
      }
    })
  })

  ipcMain.handle(
    'compress-img',
    (
      _event,
      arg: {
        imagePaths: {
          path: string
          selected: boolean
          scale: number
          name: string
          size: number
          compressSize?: number
        }[]
        outputDir: string
        quality: number
        resolution: number
      }
    ) => {
      // 启动子进程
      const childProcess = fork(
        path.join(publicPath, 'process', 'imageCompress.js')
      )
      childProcess.on(
        'message',
        (message: {
          type: 'success' | 'error' | 'compressing'
          data: {
            path: string
            selected: boolean
            scale: number
            name: string
            size: number
            compressSize: number
          }
        }) => {
          console.log('接收到子进程消息：', message)
        }
      )
      childProcess.send(arg)
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
