// -- Tray
const path = require('path');
const { remote } = require('electron');
const { Tray, Menu } = remote;

function createTray(rootPath) {
  const asssetPath = path.join(rootPath, 'assets');
  const iconImgPath = path.join(asssetPath, 'icon.jpg');

  let trayIcon = new Tray(iconImgPath);

  const trayMenuTemplate = [
    {
      label: 'Music',
      enabled: false
    },

    {
      label: 'Settings',
      click: function () {
        console.log("Clicked on settings")
      }
    },
    {
      label: 'Help',
      click: function () {
        console.log("Clicked on Help")
      }
    }
  ];

  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate);
  trayIcon.setContextMenu(trayMenu);
}

module.exports = {
  createTray,
};
