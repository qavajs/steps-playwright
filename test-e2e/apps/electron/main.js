const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path')

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html')
}

function handleOpenNewWindow() {
  const newWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  newWindow.loadFile('newWindow.html')
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
})

app.on('window-all-closed', function () {
  app.quit()
})
