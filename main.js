const {
  app,
  BrowserWindow
} = require('electron')
const path = require('path')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, `icons${path.sep}icon.png`),
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.setMenuBarVisibility(false)
  win.loadFile(`views${path.sep}online${path.sep}menu.html`)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
