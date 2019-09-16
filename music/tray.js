// -- Tray
const path = require('path');
const { remote } = require('electron');
const { Tray, Menu, systemPreferences } = remote;

const assetPath = path.join(rootPath, 'assets', 'tray');

const trayBtns = {
  prev: {
    icon: 'default',
    onClick: function (evt) {
      evt.preventDefault();
      $.qs('.previous-button').click();
    }
  },
  next: {
    icon: 'default',
    onClick: function (evt) {
      evt.preventDefault();
      $.qs('.next-button').click();
    }
  },
  play: {
    icon: 'default',
    onClick: function (evt) {
      evt.preventDefault();
      $.qs('#play-pause-button').click();
    }
  },
  playlist: {
    icon: 'default',
  }
}

function changeTrayIcon(tray, iconName) {
  tray.setImage(getIcon(iconName));
};


let trayListMenuTpl = [];
function setPlayList(tray) {
  let trayMenuTemplate = getPlayList();
  if (trayMenuTemplate.length == 0) {
    trayMenuTemplate = [
      {
        label: 'Currently, there is no music list',
        enabled: false,
      }
    ]
  }

  if (isEqualArray((a, b) => (a.title === b.title && a.musician === b.musician), trayListMenuTpl, trayMenuTemplate)) {
    return tray;
  }

  trayListMenuTpl = trayMenuTemplate;
  let trayMenu = Menu.buildFromTemplate(trayListMenuTpl);
  tray.setToolTip("Youtube Music App");
  tray.setContextMenu(trayMenu);
  return tray;
}

function getPlayList() {
  const gt = (dom, cl) => {
    const el = dom.querySelector(cl);
    if (el) {
      return el.getAttribute('title');
    }
    return null;
  }

  const nowPlayTitle = gt(document, '.title.style-scope.ytmusic-player-bar.complex-string');
  const playListEls = [...$.qsa('ytmusic-player-queue-item')];

  let playList = playListEls.map((dom) => {
    const title = gt(dom, '.song-title');
    const duration = gt(dom, '.duration');
    const musician = gt(dom, '.byline');
    return {
      title: title,
      musician: musician,
      label: `${title} - ${musician} (${duration})`,
      click: function () {
        dom.querySelector('#play-button').click();
      },
      enabled: true,
    }
  });

  const maxSize = Math.min(playList.length, 10);
  if (!nowPlayTitle) {
    return playList.slice(0, maxSize);
  }

  const nowPlayIndex = playList.findIndex(playList => (playList.title === nowPlayTitle));

  if (nowPlayIndex === -1) {
    return playList.slice(0, maxSize);
  }

  playList = playList.map((play, idx) => (play.enabled = (idx !== nowPlayIndex), play));

  let startIndex = Math.max(0, nowPlayIndex - 5);
  let endIndex = Math.min(playList.length, nowPlayIndex + 6);

  // edge
  if (startIndex == 0) {
    endIndex = maxSize;
  } else if (endIndex == playList.length) {
    startIndex = playList.length - maxSize;
  }

  return playList.slice(startIndex, endIndex);
}

function isEqualArray(f, a, b) {
  if (a.length !== b.length) {
    return false;
  }

  const size = a.length;
  for (let i = 0; i < size; i++) {
    if (!f(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

// TODO param as ENUM
// play or pause or default 
function getIcon(iconName) {
  if (process.platform === 'win32') {
    return path.join(assetPath, `${iconName}.ico`);
  }
  if (systemPreferences.isDarkMode()) {
    return path.join(assetPath, `${iconName}-white.png`);
  }
  return path.join(assetPath, `${iconName}.png`);
};

function createPlayCtrl(action) {
  const { icon, onClick } = trayBtns[action];
  const iconImgPath = getIcon(icon);

  tray = new Tray(iconImgPath);
  tray.on('click', onClick);
  return tray;
}

function createPlayListCtrl(action) {
  const { icon } = trayBtns[action];
  const iconImgPath = getIcon(icon);
  tray = new Tray(iconImgPath);
  setPlayList(tray);
  return tray;
}

function initTray(callback) {
  const nextTray = createPlayCtrl('next');
  const playTray = createPlayCtrl('play');
  const prevTray = createPlayCtrl('prev');
  const listTray = createPlayListCtrl('playlist');

  callback({ prevTray, playTray, nextTray, listTray })
}

module.exports = {
  initTray,
  changeTrayIcon,
  setPlayList,
};
