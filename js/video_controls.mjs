const videoPlayer = document.getElementById("video-player");
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("video-progress");
const timeDisplay = document.getElementById("video-time-display");
const playButton = document.getElementById("play-button");
const muteButton = document.getElementById("mute-button");

videoPlayer.addEventListener("loadstart", () => {
  progressBar.value = 0;
  playButton.setAttribute("data-state", "play");
});

videoPlayer.addEventListener("loadedmetadata", () =>
  timeDisplay.textContent = `${formatTime(0)}/${formatTime(videoPlayer.duration)}`);

videoPlayer.addEventListener("timeupdate", () => {
  if (!videoPlayer.currentTime || !videoPlayer.duration) {
    return;
  }
  progressBar.value = videoPlayer.currentTime / videoPlayer.duration;
  timeDisplay.textContent = `${formatTime(videoPlayer.currentTime)}/${formatTime(videoPlayer.duration)}`;
});

videoPlayer.addEventListener("play", () => playButton.setAttribute("data-state", "pause"));

videoPlayer.addEventListener("pause", () => playButton.setAttribute("data-state", "play"));

videoPlayer.addEventListener("ended", () => playButton.setAttribute("data-state", "play"));

videoPlayer.addEventListener("volumechange", () => {
  if (videoPlayer.volume === 0 || videoPlayer.muted) {
    muteButton.setAttribute("data-state", "unmute");
  } else if (muteButton.getAttribute("data-state") === "unmute") {
    muteButton.setAttribute("data-state", "mute");
  }
});

progressContainer.addEventListener("mousemove", event => {
  const containerBounds = progressContainer.getBoundingClientRect();
  const relativeX = event.clientX - containerBounds.left;
  const fraction = relativeX / containerBounds.width;
  progressContainer.setAttribute("data-tooltip", formatTime(fraction * videoPlayer.duration));
  progressContainer.style.setProperty("--tooltip-x", `${relativeX.toString()}px`);
  if (isLeftMouseButtonPressed(event)) {
    videoPlayer.currentTime = fraction * videoPlayer.duration;
  }
});

progressContainer.addEventListener("mousedown", event => {
  if (!isLeftMouseButtonPressed(event)) {
    return;
  }
  const containerBounds = progressContainer.getBoundingClientRect();
  const fraction = (event.clientX - containerBounds.left) / containerBounds.width;
  videoPlayer.currentTime = fraction * videoPlayer.duration;
});

progressContainer.addEventListener("touchstart", event => {
  const containerBounds = progressContainer.getBoundingClientRect();
  const fraction = (event.targetTouches[0].clientX - containerBounds.left) / containerBounds.width;
  videoPlayer.currentTime = fraction * videoPlayer.duration;
});

playButton.addEventListener("mouseup", () => {
  if (playButton.getAttribute("data-state") === "play") {
    videoPlayer.play();
  } else {
    videoPlayer.pause();
  }
});

muteButton.addEventListener("mouseup", () => videoPlayer.muted = muteButton.getAttribute("data-state") === "mute");

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
