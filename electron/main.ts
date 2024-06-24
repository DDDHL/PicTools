import { app, BrowserWindow, Menu, globalShortcut } from 'electron'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import ipcFiles from './modules/ipcFiles'
import ipcSystem from './modules/ipcSystem'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
process.env.APP_ROOT = path.join(__dirname, '..')
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST
let win: BrowserWindow | null

function createWindow() {
  Menu.setApplicationMenu(null)

  win = new BrowserWindow({
    frame: false,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    minHeight: 710,
    minWidth: 860,
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  globalShortcut.register('CommandOrControl+Shift+I', () => {
    win && !win.isDestroyed() && win.webContents.toggleDevTools()
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }

  ipcFiles()
  ipcSystem(win)
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
