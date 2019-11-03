
const fs = require('fs');
const util = require('util');
const path = require('path');
const { app, BrowserWindow } = require("electron");

const debug = /--debug/.test(process.argv[2]);
const readFileP = util.promisify(fs.readFile);

const rootPath = app.getAppPath();
const musicPath = path.join(rootPath, 'src', 'music.js');
const MUSIC_URL = "https://music.youtube.com";

let window = null;
let musics = [];

const createWindow = async () => {
  try {
    musics = await Promise.all([
      // other ...
      readFileP(musicPath, 'utf8'),
    ]);
  } catch (error) {
    alert('Please restart youtube music app')
    console.error(error);
    return;
  }

  const add = (a, b) => a + b;
  const fileList = musics.reduce(add, '');

  window = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
    webPreferences: { preload: path.join(rootPath, 'src', 'preload.js') }
  });

  window.loadURL(MUSIC_URL);

  window.webContents.on('dom-ready', () => {
    window.webContents.executeJavaScript(fileList);
  });

  window.once("ready-to-show", () => {
    window.show();

    // -- debug mode
    if (debug) {
      window.webContents.openDevTools();
      window.maximize();
      require('devtron').install()
    }

    // -- insert javascript
    window.webContents.executeJavaScript(fileList);
  });

  window.on("closed", () => {
    window = null;
  });
};

function initialize() {
  app.on("ready", function () {
    createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });

  app.on('activate', () => {
    if (window === null) {
      createWindow()
    }
  });
}

initialize();
