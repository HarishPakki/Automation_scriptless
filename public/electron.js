const { app, BrowserWindow , ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
        nodeIntegration: true, // ✅ allow Node.js modules
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'), // path to preload script
      },
  });

  win.webContents.openDevTools()
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
}

ipcMain.handle('dialog:openFile', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile']
  });
  if (canceled) {
    return null;
  } else {
    return filePaths[0]; // or return all filePaths if you want
  }
});

app.whenReady().then(createWindow);
