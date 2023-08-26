const videoFileInput = document.getElementById("video-file-input");
const videoSelectArea = document.getElementById("video-select-area");
const videoPlayer = document.getElementById("video-player");

document.ondragenter = () => videoSelectArea.classList.add("video-select-hover");

document.ondragleave = () => videoSelectArea.classList.remove("video-select-hover");

document.ondragover = event => {
  event.preventDefault();
  videoSelectArea.classList.add("video-select-hover");
};

document.ondrop = event => {
  event.preventDefault();
  videoSelectArea.classList.remove("video-select-hover");
  handleSelectedVideos(event.dataTransfer.files);
};

videoFileInput.onchange = () => handleSelectedVideos(videoFileInput.files);

videoSelectArea.onclick = () => document.getElementById("video-file-input").click();

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
  videoPlayer.setAttribute("hidden", "");
  document.getElementById("error-message").textContent = message;
  document.getElementById("error-container").removeAttribute("hidden");
}

function openVideo(videoFile) {
  videoPlayer.removeAttribute("hidden");
  document.getElementById("error-container").setAttribute("hidden", "");
  videoPlayer.src = URL.createObjectURL(videoFile);
}
