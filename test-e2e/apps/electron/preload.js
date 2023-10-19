const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openNewWindow: () => ipcRenderer.send('open-new-window'),
  closeCurrentWindow: () => ipcRenderer.send('close-current-window')
})
window.addEventListener('DOMContentLoaded', () => {})
