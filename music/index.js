
const path = require('path');
// TODO other method
const rootPath = path.join(__dirname, '../', '../', '../', '../', '../', '../', '../', '../');
const musicPath = path.join(rootPath, 'music');

const { initTray, changeIcon } = require(path.join(musicPath, 'tray'));

const INTERVAL_TIME = 300;

function isPlaying() {
  const isPlaying = !$.qs("video").paused;
  if (isPlaying) {
    changeIcon("pause");
    console.log('플레이중 ~');
  } else {
    changeIcon("play");
    console.log('플레이중이 아닙니다 ~');
  }
}

initTray(rootPath);
window.setInterval(isPlaying, INTERVAL_TIME);