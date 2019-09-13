
const path = require('path');
const {desktopCapturer} = require("electron");
// TODO other method
const rootPath = path.join(__dirname, '../', '../', '../', '../', '../', '../', '../', '../');
const musicPath = path.join(rootPath, 'music');

const { initTray, changeIcon } = require(path.join(musicPath, 'tray'));

const playbarBtn = $.qs('#play-pause-button');
let prevProgressBarValue = 0;

const INTERVAL_TIME = 1100;

function isPlaying() {
  //TODO possible get around : https://developer.chrome.com/extensions/tabs
  const progressBarValue = $.qs("#progress-bar").value;
  if (prevProgressBarValue != progressBarValue) {
    prevProgressBarValue = progressBarValue;
    changeIcon("pause");
    console.log('플레이중 ~');
  } else {
    changeIcon("play");
    console.log('플레이중이 아닙니다 ~');
  }
}

initTray(rootPath);
window.setInterval(isPlaying, INTERVAL_TIME);