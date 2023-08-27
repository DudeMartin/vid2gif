const videoPlayer = document.getElementById("video-player");
const progressBar = document.getElementById("video-progress");
const playButton = document.getElementById("play-button");
const muteButton = document.getElementById("mute-button");

videoPlayer.ontimeupdate = () => progressBar.value = videoPlayer.currentTime / videoPlayer.duration;

playButton.onmouseup = () => {
  toggleState(playButton, "play", "pause", () => videoPlayer.play(), () => videoPlayer.pause());
};

muteButton.onmouseup = () => {
  toggleState(muteButton, "mute", "unmute", () => videoPlayer.muted = true, () => videoPlayer.muted = false);
};

function toggleState(element, stateOne, stateTwo, stateOneCallback = () => {}, stateTwoCallback = () => {}) {
  if (element.getAttribute("data-state") === stateOne) {
    stateOneCallback();
    element.setAttribute("data-state", stateTwo);
  } else {
    stateTwoCallback();
    element.setAttribute("data-state", stateOne);
  }
}
