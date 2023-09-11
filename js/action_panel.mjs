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
  stopRecording(recordContext).then(URL.createObjectURL).then(gifUrl => {
    const gifContainer = document.createElement("div");
    const gifImage = document.createElement("img");
    const removeButton = document.createElement("button");
    gifImage.src = gifUrl;
    removeButton.textContent = "X";
    removeButton.onclick = event => {
      event.stopImmediatePropagation();
      gifContainer.remove();
      URL.revokeObjectURL(gifUrl);
    };
    gifContainer.onclick = () => {
      const previewImage = document.createElement("img");
      previewImage.src = gifUrl;
      gifModal.querySelector(".preview-container").replaceChildren(previewImage);
      gifModal.showModal();
    };
    gifContainer.append(gifImage, removeButton);
    document.querySelector(".gif-container").append(gifContainer);
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
