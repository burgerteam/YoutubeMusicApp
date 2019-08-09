
const playbarBtn = $.qs('#play-pause-button');
const SECOND = 1000;

function isPlaying() {
  if (playbarBtn.getAttribute('title') == '일시중지') {
    console.log('플레이중 ~');
  } else {
    console.log('플레이중이 아닙니다 ~');
  }
}

window.setInterval(isPlaying, SECOND);
