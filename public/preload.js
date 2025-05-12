// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const fs = require("fs");

contextBridge.exposeInMainWorld('electronAPI', {
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  readFile: (filePath) => fs.readFileSync(filePath), // Expose as sync read
  writeFile: (filePath, data) => fs.writeFileSync(filePath, data),
});
