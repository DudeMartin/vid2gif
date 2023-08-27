const videoPlayer = document.getElementById("video-player");
const progressBar = document.getElementById("video-progress");
const playButton = document.getElementById("play-button");
const muteButton = document.getElementById("mute-button");

videoPlayer.onloadstart = () => {
  progressBar.value = 0;
  playButton.setAttribute("data-state", "play");
};

videoPlayer.ontimeupdate = () => {
  if (videoPlayer.currentTime && videoPlayer.duration) {
    progressBar.value = videoPlayer.currentTime / videoPlayer.duration;
  }
};

videoPlayer.onended = () => playButton.setAttribute("data-state", "play");

progressBar.onmousemove = event => {
  const progressContainer = document.getElementById("progress-container");
  const progressBarBounds = progressBar.getBoundingClientRect();
  const relativeX = event.clientX - progressBarBounds.left;
  const fraction = relativeX / progressBarBounds.width;
  progressContainer.setAttribute("data-tooltip", formatTime(fraction * videoPlayer.duration));
  progressContainer.style.setProperty("--tooltip-x", `${relativeX.toString()}px`);
};

progressBar.onmouseup = event => {
  const progressBarBounds = progressBar.getBoundingClientRect();
  const fraction = (event.clientX - progressBarBounds.left) / progressBarBounds.width;
  videoPlayer.currentTime = fraction * videoPlayer.duration;
};

playButton.onmouseup = () => {
  toggleState(playButton, "play", "pause", () => videoPlayer.play(), () => videoPlayer.pause());
};

muteButton.onmouseup = () => {
  toggleState(muteButton, "mute", "unmute", () => videoPlayer.muted = true, () => videoPlayer.muted = false);
};

function formatTime(seconds) {
  let result = "";
  if (seconds >= 3600) {
    result += `${Math.trunc(seconds / 3600)}:`;
    result += `${Math.trunc(seconds % 3600 / 60).toString().padStart(2, "0")}:`;
  } else {
    result += `${Math.trunc(seconds % 3600 / 60).toString()}:`;
  }
  result += Math.trunc(seconds % 60).toString().padStart(2, "0");
  return result;
}

function toggleState(element, stateOne, stateTwo, stateOneCallback = () => {}, stateTwoCallback = () => {}) {
  if (element.getAttribute("data-state") === stateOne) {
    stateOneCallback();
    element.setAttribute("data-state", stateTwo);
  } else {
    stateTwoCallback();
    element.setAttribute("data-state", stateOne);
  }
}
