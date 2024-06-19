import { ipcMain, app, BrowserWindow, dialog } from 'electron'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'
import { generateUniqueIds } from './sha256'
const { fork } = require('child_process')

console.log(path.join(app.getAppPath(), '../../cache'))

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

  ipcMain.handle('get-pic', (_event, concurrency = 5) => {
    return new Promise(async (resolve) => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Images', extensions: ['jpg', 'png', 'jpeg'] }],
      })
      if (!result.canceled) {
        const ids = await generateUniqueIds(result.filePaths)
        const fileInfos = result.filePaths.map((filePath, index) => {
          const stats = fs.statSync(filePath)
          return {
            name: path.basename(filePath),
            size: stats.size,
            ...ids[index],
            selected: false,
            scale: 1,
            compressCachePath: '',
          }
        })
        // 压缩略缩图
        const compressResult: any = []
        const childProcess = fork(
          path.join(process.env.VITE_PUBLIC, 'process', 'imageCompress.js')
        )
        childProcess.on(
          'message',
          (message: {
            type: 'success' | 'error' | 'compressing' | 'finish'
            data:
              | {
                  path: string
                  selected: boolean
                  scale: number
                  name: string
                  size: number
                  compressSize: number
                }
              | {}
          }) => {
            if (message.type === 'success') compressResult.push(message.data)
            if (message.type === 'finish') resolve(compressResult)
          }
        )
        childProcess.send({
          imagePaths: fileInfos,
          outputDir: app.isPackaged
            ? path.join(app.getAppPath(), '../../cache')
            : path.join(process.env.VITE_PUBLIC, 'cache'),
          quality: 70,
          resolution: 250,
          concurrency: concurrency,
          isCache: true,
        })
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
          id: string
          path: string
          selected: boolean
          scale: number
          name: string
          size: number
          compressCachePath: string
          compressSize?: number
        }[]
        outputDir: string
        quality: number
        resolution: number
        concurrency: number
      }
    ) => {
      // 启动子进程
      const childProcess = fork(
        path.join(process.env.VITE_PUBLIC, 'process', 'imageCompress.js')
      )
      childProcess.on(
        'message',
        (message: {
          type: 'success' | 'error' | 'compressing' | 'finish'
          data:
            | {
                path: string
                selected: boolean
                scale: number
                name: string
                size: number
                compressSize: number
              }
            | {}
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
