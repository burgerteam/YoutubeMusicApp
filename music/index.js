
const playbarBtn = $.qs('#play-pause-button');

function playCheck() {
  if (playbarBtn.getAttribute('title') == '일시중지') {
    console.log('플레이중 ~');
  } else {
    console.log('플레이중이 아닙니다 ~');
  }
}

window.setInterval(playCheck, 1000 * 1);
