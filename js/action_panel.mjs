import { preventDefault, toggleState } from "./event_utilities.mjs";
import { startRecording, stopRecording } from "./gif_recorder.mjs";

const videoPlayer = document.getElementById("video-player");
const recordButton = document.getElementById("record-button");
let recordContext;

recordButton.onclick = () => toggleState(recordButton, "record", "stop", () => {
  recordButton.textContent = "Stop Recording";
  recordContext = startRecording(videoPlayer);
  videoPlayer.play();
}, () => {
  recordButton.textContent = "Start Recording";
  videoPlayer.pause();
  stopRecording(recordContext).then(gifBlob => {
    const gifContainer = document.createElement("div");
    const gifImage = document.createElement("img");
    const removeButton = document.createElement("button");
    gifImage.src = URL.createObjectURL(gifBlob);
    removeButton.textContent = "X";
    removeButton.onclick = () => {
      gifContainer.remove();
      URL.revokeObjectURL(gifImage.src);
    };
    gifContainer.append(gifImage, removeButton);
    document.querySelector(".gif-container").append(gifContainer);
  });
});

document.getElementById("seek-frame-button").onclick = () => videoPlayer.currentTime += 0.05;

document.getElementById("seek-form").onsubmit = preventDefault(() =>
  videoPlayer.currentTime += parseTimeInput(document.getElementById("seek-time-input").value));

function parseTimeInput(time) {
  const timeParts = time.split(":");
  let seconds = 0;
  for (let i = 0; i < timeParts.length; i++) {
    seconds += timeParts[i] * Math.pow(60, (timeParts.length - 1) - i);
  }
  return seconds;
}
