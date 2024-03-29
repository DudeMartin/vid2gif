import { preventDefault, toggleState } from "./event_utilities.mjs";
import { startRecording, stopRecording } from "./gif_recorder.mjs";
import { clearCropping, startCropping, stopCropping } from "./crop_select.mjs";

const videoPlayer = document.getElementById("video-player");
const cropButton = document.getElementById("crop-button");
const clearCropButton = document.getElementById("clear-crop-button");
const frameRateInput = document.getElementById("frame-rate-input");
const gifModal = document.querySelector(".gif-modal");

let recordContext;
let cropBounds;

document.getElementById("record-button").addEventListener("click", event => toggleState(event.currentTarget, "record", "stop", () => {
  recordContext = startRecording(videoPlayer, { frameRate: frameRateInput.value, crop: cropBounds });
  videoPlayer.play();
}, () => {
  videoPlayer.pause();
  stopRecording(recordContext).then(gifResult => {
    const gifBlob = gifResult.blob;
    const gifUrl = URL.createObjectURL(gifBlob);
    const container = document.createElement("div");
    const image = document.createElement("img");
    const removeButton = document.createElement("button");
    image.src = gifUrl;
    removeButton.textContent = "X";
    removeButton.addEventListener("click", event => {
      event.stopPropagation();
      container.remove();
      URL.revokeObjectURL(gifUrl);
    });
    container.addEventListener("click", () => {
      const previewImage = document.createElement("img");
      const detailsContainer = document.createElement("div");
      const dimensionsText = document.createElement("span");
      const sizeText = document.createElement("span");
      previewImage.src = gifUrl;
      previewImage.classList.add("centered");
      dimensionsText.textContent = `${previewImage.naturalWidth}px by ${previewImage.naturalHeight}px at ${gifResult.options.frameRate} FPS`;
      sizeText.textContent = formatFileSize(gifBlob.size);
      detailsContainer.append(dimensionsText, sizeText);
      gifModal.querySelector(".preview-container").replaceChildren(previewImage, detailsContainer);
      gifModal.showModal();
    });
    container.append(image, removeButton);
    document.querySelector(".gif-container").append(container);
  });
}));

cropButton.addEventListener("click", () => toggleState(cropButton, "crop", "stop", startCropping, stopCropping));

cropButton.addEventListener("crop", event => cropBounds = event.detail);

clearCropButton.addEventListener("click", () => {
  clearCropping();
  cropBounds = undefined;
});

document.getElementById("seek-frame-button").addEventListener("click", () => videoPlayer.currentTime += 0.05);

document.getElementById("seek-time-form").addEventListener("submit", preventDefault(() =>
  videoPlayer.currentTime = parseTimeInput(document.getElementById("seek-time-input").value)));

document.getElementById("seek-seconds-form").addEventListener("submit", preventDefault(() =>
  videoPlayer.currentTime += parseTimeInput(document.getElementById("seek-seconds-input").value)));

gifModal.querySelector("button").addEventListener("click", () => gifModal.close());

function formatFileSize(byteCount) {
  if (byteCount >= 1000000) {
    return (byteCount / 1000000).toFixed(1) + " MB";
  } else if (byteCount >= 1000) {
    return (byteCount / 1000).toFixed(1) + " KB";
  } else {
    return byteCount + " bytes";
  }
}

function parseTimeInput(time) {
  const timeParts = time.split(":");
  let seconds = 0;
  for (let i = 0; i < timeParts.length; i++) {
    seconds += timeParts[i] * Math.pow(60, (timeParts.length - 1) - i);
  }
  return seconds;
}
