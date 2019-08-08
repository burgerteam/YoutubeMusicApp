
const fs = require('fs');
const util = require('util');
const path = require('path');
const { app, BrowserWindow } = require("electron");

const debug = /--debug/.test(process.argv[2]);
const readFileP = util.promisify(fs.readFile);

const root = __dirname;
const musicPath = path.join(root, 'music', 'index.js');
const modulesPath = path.join(root, 'modules', '$.js');

// -- constants
const MUSIC_URL = "https://music.youtube.com";

// -- variable
let window = null;

const createWindow = async () => {

  const musics = await Promise.all([
    readFileP(modulesPath, 'utf8'),
    readFileP(musicPath, 'utf8'),
  ]);


  window = new BrowserWindow({ show: false });
  window.loadURL(MUSIC_URL);

  window.once("ready-to-show", () => {
    window.show();

    // -- debug mode
    if (debug) {
      window.webContents.openDevTools()
      window.maximize()
      require('devtron').install()
    }

    // -- insert javascript
    const fileAdd = (a, b) => a + b;
    window.webContents.executeJavaScript(musics.reduce(fileAdd, ''));
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
    if (mainWindow === null) {
      createWindow()
    }
  });
}

initialize();