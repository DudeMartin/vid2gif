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

videoPlayer.onplay = () => playButton.setAttribute("data-state", "pause");

videoPlayer.onpause = () => playButton.setAttribute("data-state", "play");

videoPlayer.onended = () => playButton.setAttribute("data-state", "play");

videoPlayer.onvolumechange = () => {
  if (videoPlayer.volume === 0 || videoPlayer.muted) {
    muteButton.setAttribute("data-state", "unmute");
  } else if (muteButton.getAttribute("data-state") === "unmute") {
    muteButton.setAttribute("data-state", "mute");
  }
};

progressBar.onmousemove = event => {
  const progressContainer = document.getElementById("progress-container");
  const progressBarBounds = progressBar.getBoundingClientRect();
  const relativeX = event.clientX - progressBarBounds.left;
  const fraction = relativeX / progressBarBounds.width;
  progressContainer.setAttribute("data-tooltip", formatTime(fraction * videoPlayer.duration));
  progressContainer.style.setProperty("--tooltip-x", `${relativeX.toString()}px`);
  if (isLeftMouseButtonPressed(event)) {
    videoPlayer.currentTime = fraction * videoPlayer.duration;
  }
};

progressBar.onmousedown = event => {
  if (!isLeftMouseButtonPressed(event)) {
    return;
  }
  const progressBarBounds = progressBar.getBoundingClientRect();
  const fraction = (event.clientX - progressBarBounds.left) / progressBarBounds.width;
  videoPlayer.currentTime = fraction * videoPlayer.duration;
};

progressBar.ontouchstart = event => {
  const progressBarBounds = progressBar.getBoundingClientRect();
  const fraction = (event.targetTouches[0].clientX - progressBarBounds.left) / progressBarBounds.width;
  videoPlayer.currentTime = fraction * videoPlayer.duration;
};

playButton.onmouseup = () => {
  if (playButton.getAttribute("data-state") === "play") {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
};

muteButton.onmouseup = () => videoPlayer.muted = muteButton.getAttribute("data-state") === "mute";

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

function isLeftMouseButtonPressed(mouseEvent) {
  return (mouseEvent.buttons & 1) === 1;
}
