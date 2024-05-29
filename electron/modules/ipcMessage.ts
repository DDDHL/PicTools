import { ipcMain } from 'electron'

export default function ipcMessage() {
  ipcMain.on('minimize', (_) => {})
}
