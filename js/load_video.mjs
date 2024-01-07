import { preventDefault } from "./event_utilities.mjs";

const videoFileInput = document.getElementById("video-file-input");
const videoSelectArea = document.getElementById("video-select-area");
const videoPlayer = document.getElementById("video-player");

document.addEventListener("dragenter", () => videoSelectArea.setAttribute("data-hover", ""));

document.addEventListener("dragleave", () => videoSelectArea.removeAttribute("data-hover"));

document.addEventListener("dragover", preventDefault(() => videoSelectArea.setAttribute("data-hover", "")));

document.addEventListener("drop", preventDefault(event => {
  videoSelectArea.removeAttribute("data-hover");
  handleSelectedVideos(event.dataTransfer.files);
}));

videoFileInput.addEventListener("change", () => handleSelectedVideos(videoFileInput.files));

videoSelectArea.addEventListener("click", () => videoFileInput.click());

function handleSelectedVideos(videoFiles) {
  if (videoFiles.length === 0) {
    return;
  }
  const videoFile = videoFiles[0];
  const videoType = videoFile.type;
  if (videoType === "") {
    showVideoSelectError("The file you selected is not recognized.");
  } else if (!videoPlayer.canPlayType(videoType)) {
    showVideoSelectError(`The file type "${videoType}" cannot be played as a video.`);
  } else {
    openVideo(videoFile);
  }
}

function showVideoSelectError(message) {
  document.getElementById("error-message").textContent = message;
  document.getElementById("error-container").removeAttribute("hidden");
  document.getElementById("main-container").setAttribute("data-state", "hide");
  videoSelectArea.removeAttribute("data-shrink");
}

function openVideo(videoFile) {
  document.querySelector("#record-button[data-state=stop]")?.click();
  document.getElementById("error-container").setAttribute("hidden", "");
  document.getElementById("main-container").setAttribute("data-state", "show");
  videoSelectArea.setAttribute("data-shrink", "");
  videoPlayer.src = URL.createObjectURL(videoFile);
}
