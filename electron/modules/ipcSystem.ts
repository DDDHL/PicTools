import { ipcMain, app, BrowserWindow } from 'electron'

export default function ipcSystem(win: BrowserWindow) {
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
  win.on('maximize', () => {
    win.webContents.send('maximize')
  })
  win.on('resize', () => {
    if (!win.isMaximized()) {
      win.webContents.send('restore')
    }
  })
}
