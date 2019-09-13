
const path = require('path');

// TODO other method
const rootPath = path.join(__dirname, '../', '../', '../', '../', '../', '../', '../', '../');
const musicPath = path.join(rootPath, 'music');

const { initTray } = require(path.join(musicPath, 'tray'));

const playbarBtn = $.qs('#play-pause-button');
const INTERVAL_TIME = 300;

function isPlaying() {
  if (playbarBtn.getAttribute('title') == '일시중지') {
    console.log('플레이중 ~');
  } else {
    console.log('플레이중이 아닙니다 ~');
  }
}

initTray(rootPath);

window.setInterval(isPlaying, INTERVAL_TIME);
