import { ipcMain, app, BrowserWindow, dialog } from 'electron'
import { exec } from 'child_process'

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

  ipcMain.handle('get-path', () => {
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

  win.on('maximize', () => {
    win.webContents.send('maximize')
  })

  win.on('resize', () => {
    if (!win.isMaximized()) {
      win.webContents.send('restore')
    }
  })
}
