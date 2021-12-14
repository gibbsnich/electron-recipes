const {app, BrowserWindow, ipcMain} = require('electron');
const Path = require('path');
const axios = require('axios');
const fs = require('fs');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: Path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.env.NODE_ENV === 'development') {
    const rendererPort = process.argv[2];
    mainWindow.loadURL(`http://localhost:${rendererPort}`);
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(Path.join(app.getAppPath(), 'renderer', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on('message', (event, message) => {
  console.log(message);
})

ipcMain.handle('request', async (event, url) => {
  const result = await axios.get(url);
  return result.data;
});

function getDataPath(fileName) {
  if (fileName) {
    return Path.join(app.getAppPath(), 'data', `${fileName}.json`);
  } 
  return Path.join(app.getAppPath(), 'data');
}

ipcMain.handle('readJSON', async (event, fileName) => {
  const dirPath = getDataPath(null);
  const dirExists = fs.existsSync(dirPath);
  if (!dirExists) {
    const mkdirErr = await fs.promises.mkdir(dirPath);
    if (mkdirErr) {
      console.warn(mkdirErr);
      return;
    }
  }
  const path = getDataPath(fileName);
  const exists = fs.existsSync(path);
  if (exists) {
    const data = await fs.promises.readFile(path, {encoding: 'UTF-8'});
    return JSON.parse(data);
  } else {
    return [];
  }
});

ipcMain.handle('writeJSON', async (event, data) => {
  await fs.promises.writeFile(getDataPath(data.fileName), data.data);
});
