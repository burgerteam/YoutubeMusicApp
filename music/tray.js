// -- Tray
const path = require('path');
const { remote } = require('electron');
const { Tray, Menu, systemPreferences } = remote;

const assetPath = path.join(rootPath, 'assets/tray');

const getIcon = (iconName) => {
  if (process.platform === 'win32') {
    return path.join(assetPath, `${iconName}.ico`);
  } else {
    if(systemPreferences.isDarkMode()) {
      return path.join(assetPath, `${iconName}-white.png`);
    }
    return path.join(assetPath, `${iconName}.png`);
  }
};

function initTray(rootPath) {
  const iconImgPath = getIcon("default");
  let tray = new Tray(iconImgPath);

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
  tray.setContextMenu(trayMenu);
}

module.exports = {
  initTray,
};
