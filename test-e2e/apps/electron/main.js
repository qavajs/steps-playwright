const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('node:path')
const menuTemplate = require('./menuTemplate');
const handleOpenNewWindow = require('./newWindow');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  return mainWindow.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  ipcMain.on('open-new-window', handleOpenNewWindow);
  ipcMain.on('close-current-window', function (event) {
    const window = event.sender.getOwnerBrowserWindow()
    if (window) {
      window.close()
    }
    event.returnValue = null
  })

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
})

app.on('window-all-closed', function () {
  app.quit()
})
