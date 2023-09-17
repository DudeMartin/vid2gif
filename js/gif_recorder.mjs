export function startRecording(videoPlayer, options = {}) {
  options.frameRate ??= 5;
  if (options.crop) {
    return startCroppedRecording(videoPlayer, options);
  } else {
    return startFullRecording(videoPlayer, options);
  }
}

export function stopRecording(context) {
  clearInterval(context.intervalId);
  return new Promise(resolve => context.recorder.getBlobGIF(blob => {
    context.recorder.destroy();
    resolve(blob);
  }));
}

function startCroppedRecording(videoPlayer, options) {
  const cropX = Math.floor(options.crop[0] * videoPlayer.videoWidth);
  const cropY = Math.floor(options.crop[1] * videoPlayer.videoHeight);
  const width = Math.floor(options.crop[2] * videoPlayer.videoWidth);
  const height = Math.floor(options.crop[3] * videoPlayer.videoHeight);
  const offscreenContext = new OffscreenCanvas(videoPlayer.videoWidth, videoPlayer.videoHeight).getContext("2d");
  const frameDelay = 1000 / options.frameRate;
  const animatedGif = new Animated_GIF({
    width: width,
    height: height,
    delay: frameDelay
  });
  initializeDetails(width, height, options.frameRate);
  const intervalId = setInterval(() => {
    if (!isVideoPlaying(videoPlayer)) {
      return;
    }
    offscreenContext.drawImage(videoPlayer, 0, 0);
    animatedGif.addFrameImageData(offscreenContext.getImageData(cropX, cropY, width, height));
    countFrame();
  }, frameDelay);
  return {
    recorder: animatedGif,
    intervalId: intervalId
  };
}

function startFullRecording(videoPlayer, options) {
  const [width, height] = calculateSize(videoPlayer, options.width, options.height);
  const frameDelay = 1000 / options.frameRate;
  const animatedGif = new Animated_GIF({
    width: width,
    height: height,
    delay: frameDelay
  });
  initializeDetails(width, height, options.frameRate);
  const intervalId = setInterval(() => {
    if (!isVideoPlaying(videoPlayer)) {
      return;
    }
    animatedGif.addFrame(videoPlayer);
    countFrame();
  }, frameDelay);
  return {
    recorder: animatedGif,
    intervalId: intervalId
  };
}

function calculateSize(videoPlayer, width, height) {
  if (width && height) {
    return [width, height];
  } else if (width) {
    return [width, videoPlayer.videoHeight * width / videoPlayer.videoWidth]
  } else if (height) {
    return [videoPlayer.videoWidth * height / videoPlayer.videoHeight, height];
  } else {
    let scaledWidth = videoPlayer.videoWidth;
    let scaledHeight = videoPlayer.videoHeight;
    for (let factor = 1; Math.max(scaledWidth, scaledHeight) > 1000; factor += 0.5) {
      scaledWidth = Math.round(videoPlayer.videoWidth / factor);
      scaledHeight = Math.round(videoPlayer.videoHeight / factor);
    }
    return [scaledWidth, scaledHeight];
  }
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
