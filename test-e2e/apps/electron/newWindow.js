const { BrowserWindow } = require('electron')
const path = require('node:path')

module.exports = function handleOpenNewWindow() {
    const newWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    newWindow.loadFile('newWindow.html')
}