import { preventDefault, toggleState } from "./event_utilities.mjs";
import { startRecording, stopRecording } from "./gif_recorder.mjs";

const videoPlayer = document.getElementById("video-player");
const gifModal = document.querySelector(".gif-modal");

let recordContext;

document.getElementById("record-button").onclick = event => toggleState(event.target, "record", "stop", () => {
  recordContext = startRecording(videoPlayer);
  videoPlayer.play();
}, () => {
  videoPlayer.pause();
  stopRecording(recordContext).then(gifBlob => {
    const gifUrl = URL.createObjectURL(gifBlob);
    const container = document.createElement("div");
    const image = document.createElement("img");
    const removeButton = document.createElement("button");
    image.src = gifUrl;
    removeButton.textContent = "X";
    removeButton.onclick = event => {
      event.stopImmediatePropagation();
      container.remove();
      URL.revokeObjectURL(gifUrl);
    };
    container.onclick = () => {
      const previewImage = document.createElement("img");
      const detailsContainer = document.createElement("div");
      const dimensionsText = document.createElement("span");
      const sizeText = document.createElement("span");
      previewImage.src = gifUrl;
      previewImage.classList.add("centered");
      dimensionsText.textContent = `${previewImage.naturalWidth}px by ${previewImage.naturalHeight}px`;
      sizeText.textContent = `${gifBlob.size} bytes`;
      detailsContainer.append(dimensionsText, sizeText);
      gifModal.querySelector(".preview-container").replaceChildren(previewImage, detailsContainer);
      gifModal.showModal();
    };
    container.append(image, removeButton);
    document.querySelector(".gif-container").append(container);
  });
});

document.getElementById("seek-frame-button").onclick = () => videoPlayer.currentTime += 0.05;

document.getElementById("seek-form").onsubmit = preventDefault(() =>
  videoPlayer.currentTime += parseTimeInput(document.getElementById("seek-time-input").value));

gifModal.querySelector("button").onclick = () => gifModal.close();

function parseTimeInput(time) {
  const timeParts = time.split(":");
  let seconds = 0;
  for (let i = 0; i < timeParts.length; i++) {
    seconds += timeParts[i] * Math.pow(60, (timeParts.length - 1) - i);
  }
  return seconds;
}
