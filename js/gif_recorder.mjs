export function startRecording(videoPlayer, options = {}) {
  if (!options.frameRate) {
    options.frameRate = 5;
  }
  if (!options.crop) {
    options.crop = [0, 0, 1, 1];
  }
  const recordX = Math.floor(options.crop[0] * videoPlayer.videoWidth);
  const recordY = Math.floor(options.crop[1] * videoPlayer.videoHeight);
  const recordWidth = Math.floor(options.crop[2] * videoPlayer.videoWidth);
  const recordHeight = Math.floor(options.crop[3] * videoPlayer.videoHeight);
  const offscreenContext = new OffscreenCanvas(videoPlayer.videoWidth, videoPlayer.videoHeight).getContext("2d");
  const frameDelayMillis = 1000 / options.frameRate;
  const animatedGif = new Animated_GIF({
    width: recordWidth,
    height: recordHeight,
    delay: frameDelayMillis
  });
  initializeDetails(recordWidth, recordHeight, options.frameRate);
  const intervalId = setInterval(() => {
    if (!isVideoPlaying(videoPlayer)) {
      return;
    }
    offscreenContext.drawImage(videoPlayer, 0, 0);
    animatedGif.addFrameImageData(offscreenContext.getImageData(recordX, recordY, recordWidth, recordHeight));
    countFrame();
  }, frameDelayMillis);
  return {
    options: options,
    recorder: animatedGif,
    intervalId: intervalId
  };
}

export function stopRecording(context) {
  clearInterval(context.intervalId);
  return new Promise(resolve => context.recorder.getBlobGIF(blob => {
    context.recorder.destroy();
    resolve({
      options: context.options,
      blob: blob
    });
  }));
}

function initializeDetails(width, height, frameRate) {
  document.getElementById("dimensions-output").textContent = `${width}px by ${height}px`;
  document.getElementById("frame-rate-output").textContent = `${frameRate}`;
  document.getElementById("frames-recorded-output").textContent = "0";
}

function isVideoPlaying(videoPlayer) {
  return videoPlayer.currentTime > 0 && !videoPlayer.paused && !videoPlayer.ended && videoPlayer.readyState > 2;
}

function countFrame() {
  const frameCounter = document.getElementById("frames-recorded-output");
  frameCounter.textContent = `${Number(frameCounter.textContent) + 1}`;
}
