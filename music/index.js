
const { remote } = require('electron');
const path = require('path');

// TODO other method
const rootPath = remote.app.getAppPath();
const musicPath = path.join(rootPath, 'music');

const {
  initTray,
  changeTrayIcon,
  setPlayList,
} = require(path.join(musicPath, 'tray'));

const INTERVAL_TIME = 300;

function isPlaying({ playTray }) {
  const videoEl = $.qs('.video-stream');
  const skipEl = $.qs('.ytp-ad-skip-button-text');

  const isPlaying = videoEl.paused;

  // -- skip
  if (skipEl) {
    skipEl.click();
  }

  if (!isPlaying) {
    changeTrayIcon(playTray, "pause");
  } else {
    changeTrayIcon(playTray, "play");
  }
}

function refreshPlayList({ listTray }) {
  setPlayList(listTray);
}

initTray((info) => {

  // -- interval work about playing
  window.setInterval(() => isPlaying(info), INTERVAL_TIME);

  // -- interval work about play list (TODO we should use event method not interval)
  window.setInterval(() => refreshPlayList(info), 1000);
});
