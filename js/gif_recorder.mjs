export function startRecording(videoPlayer, options = {}) {
  const [width, height] = calculateSize(videoPlayer, options.width, options.height);
  const frameDelay = 1000 / (options.frameRate || 5);
  const animatedGif = new Animated_GIF({
    width: width,
    height: height,
    delay: frameDelay
  });
  const intervalId = setInterval(() => {
    if (isVideoPlaying(videoPlayer)) {
      animatedGif.addFrame(videoPlayer);
    }
  }, frameDelay);
  return {
    videoPlayer: videoPlayer,
    frameDelay: frameDelay,
    recorder: animatedGif,
    intervalId: intervalId
  };
}

export function stopRecording(context) {
  clearInterval(context.intervalId);
  return new Promise(resolve => context.recorder.getBlobGIF(blob => {
    context.recorder.destroy();
    resolve(blob);
  }));
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

function isVideoPlaying(videoPlayer) {
  return videoPlayer.currentTime > 0 && !videoPlayer.paused && !videoPlayer.ended && videoPlayer.readyState > 2;
}
