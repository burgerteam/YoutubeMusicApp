
const {
  initTray,
  changeTrayIcon,
  setPlayList,
  $,
} = window.readConfig();

let isPlaying = null;
let grabInterval = null;
let trayInfo = null;

function intervalPlayCheck({ playTray }) {
  const videoEl = $.qs('.video-stream');
  const skipEl = $.qs('.ytp-ad-skip-button-text');

  isPlaying = !videoEl.paused;

  // -- skip
  if (skipEl) {
    skipEl.click();
  }

  if (isPlaying) {
    changeTrayIcon(playTray, "pause");
  } else {
    changeTrayIcon(playTray, "play");
  }
}

function intervalRefreshPlayList({ listTray }) {
  setPlayList(listTray);
}

function grabTrigger() {
  const videoEl = $.qs('.video-stream');
  if (!videoEl || videoEl.paused || trayInfo) {
    return;
  }

  clearInterval(grabInterval);
  isPlaying = !videoEl.paused;
  trayInfo = initTray();

  // -- interval work about playing
  this.playInterval = window.setInterval(() => intervalPlayCheck(trayInfo), 300);

  // -- interval work about play list (TODO we should use event method not interval)
  this.refreshInteval = window.setInterval(() => intervalRefreshPlayList(trayInfo), 300);


  window.onbeforeunload = function (evt) {
    clearInterval(this.playInterval);
    clearInterval(this.refreshInteval);

    // -- Destroy tray, before close
    function destroyTray(trayInfo) {
      Object
        .values(trayInfo)
        .map(tray => tray.destroy());

      const is = Object
        .values(trayInfo)
        .find(tray => !tray.isDestroyed);

      if (is) return destroyTray(trayInfo);
    }

    destroyTray(trayInfo);
    isPlaying = null;
    trayInfo = null;
    grabInterval = null;
    return;
  }
}

function init() {
  grabInterval = setInterval(grabTrigger, 500);
}

init();
