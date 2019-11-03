
const fs = require('fs');
const util = require('util');
const path = require('path');
const { app, BrowserWindow } = require("electron");

const debug = /--debug/.test(process.argv[2]);
const readFileP = util.promisify(fs.readFile);

const musicPath = path.join(__dirname, 'music', 'index.js');
const modulesPath = path.join(__dirname, 'modules', '$.js');
const MUSIC_URL = "https://music.youtube.com";

let window = null;

const createWindow = async () => {
  const musics = await Promise.all([
    readFileP(modulesPath, 'utf8'),
    readFileP(musicPath, 'utf8'),
  ]).catch(() => alert('Please restart youtube music app'));

  window = new BrowserWindow({
    show: false,
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  window.loadURL(MUSIC_URL);
  window.once("ready-to-show", () => {
    window.show();

    // -- debug mode
    if (debug) {
      window.webContents.openDevTools();
      window.maximize();
      require('devtron').install()
    }

    // -- insert javascript
    const add = (a, b) => a + b;
    window.webContents.executeJavaScript(musics.reduce(add, ''));
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

