
var {
  initTray,
  changeTrayIcon,
  setPlayList,
  $,
} = window.readConfig();

var isPlaying = null;
var grabInterval = null;
var trayInfo = null;

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

  window.onbeforeunload = function () {
    clearInterval(this.playInterval);
    clearInterval(this.refreshInteval);

    // -- Destroy tray, before close
    Object
      .values(trayInfo)
      .map(tray => tray.destroy());


    isPlaying = null;
    trayInfo = null;
    grabInterval = null;
  }
}

function init() {
  grabInterval = setInterval(grabTrigger, 500);
}

init();
