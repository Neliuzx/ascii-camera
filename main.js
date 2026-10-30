const { app, BrowserWindow, session } = require('electron')
const path = require('node:path')

function createWindow() {
    const win = new BrowserWindow({
        width: 1100, height: 750,
        backgroundColor: '#0d0d11',
        webPreferences: { preload: path.join(__dirname, 'preload.js') },
        autoHideMenuBar: true, 
    })
    win.loadFile('src/index.html')
}
app.whenReady().then(() => {
    session.defaultSession.setPermissionRequestHandler((_wc, permission, callback) => {
        callback(permission === 'media')
    })
    createWindow()
})
app.on('window-all-closed', () => app.quit())