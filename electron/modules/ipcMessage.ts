import { ipcMain, app, BrowserWindow, dialog } from 'electron'
import fs from 'fs'
import path from 'path'
import { generateUniqueIds } from './sha256'
import { deleteFolderRecursive } from './deleteFolder'
const { fork } = require('child_process')

export default function ipcMessage(win: BrowserWindow) {
  ipcMain.on('minimize', () => {
    win.minimize()
  })
  ipcMain.on('maximize', () => {
    win.maximize()
  })
  ipcMain.on('restore', () => {
    win.restore()
  })
  ipcMain.on('close', () => {
    app.quit()
  })
  ipcMain.on('relaunch', () => {
    app.relaunch()
    app.exit()
  })
  ipcMain.handle('delete-cache', () => {
    return deleteFolderRecursive(
      app.isPackaged
        ? path.join(app.getAppPath(), '../../cache')
        : path.join(process.env.VITE_PUBLIC, 'cache')
    )
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

  ipcMain.handle('get-pic', (_, concurrency = 5) => {
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
      _,
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
