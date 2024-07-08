import { ipcMain, app, dialog, BrowserWindow } from 'electron'
import fs from 'fs'
import path from 'path'
import { generateUniqueIds } from './sha256'
import { deleteFolderRecursive } from './deleteFolder'
const { fork } = require('child_process')

export default function ipcFiles(win: BrowserWindow) {
  // 删除根目录缓存
  ipcMain.handle('delete-cache', () => {
    return deleteFolderRecursive(
      app.isPackaged
        ? path.join(app.getAppPath(), '../../cache')
        : path.join(process.env.VITE_PUBLIC, 'cache')
    )
  })

  // 获取文件夹路径
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

  // 获取图片路径并保存略缩图
  ipcMain.handle('get-pic', (_, concurrence = 10) => {
    return new Promise(async (resolve) => {
      const result = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: 'Images',
            extensions: ['jpg', 'webp', 'png', 'jpeg'],
          },
        ],
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
          concurrence,
          isCache: true,
        })
      } else {
        resolve([])
      }
    })
  })

  // 压缩图片
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
          compressExportPath?: string
          compressSize?: number
        }[]
        outputDir: string
        quality: number
        resolution: number
        concurrence: number
        outputName: string
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
          data: {
            id: string
            path: string
            selected: boolean
            scale: number
            name: string
            size: number
            compressSize: number
          }
        }) => {
          win.webContents.send('compress-data', message)
          if (message.type === 'finish') childProcess.kill()
        }
      )
      childProcess.send(arg)
    }
  )
}
