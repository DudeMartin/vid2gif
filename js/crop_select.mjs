const canvas = document.querySelector("canvas");
const drawingContext = canvas.getContext("2d");
const cropButton = document.getElementById("crop-button");

let normalizedStartX;
let normalizedStartY;

export function startCropping() {
  canvas.removeAttribute("hidden");
  canvas.addEventListener("mousedown", cropPress);
  canvas.addEventListener("mousemove", cropMove);
  canvas.addEventListener("mouseup", cropRelease);
  canvas.addEventListener("touchstart", cropTouchPress);
  canvas.addEventListener("touchmove", cropTouchMove);
  canvas.addEventListener("touchend", cropTouchRelease);
}

export function stopCropping() {
  canvas.removeEventListener("mousedown", cropPress);
  canvas.removeEventListener("mousemove", cropMove);
  canvas.removeEventListener("mouseup", cropRelease);
  canvas.removeEventListener("touchstart", cropTouchPress);
  canvas.removeEventListener("touchmove", cropTouchMove);
  canvas.removeEventListener("touchend", cropTouchRelease);
}

export function clearCropping() {
  canvas.setAttribute("hidden", "");
  canvasDraw(canvasBounds => drawingContext.fillRect(0, 0, canvasBounds.width, canvasBounds.height));
}

function cropPress(event) {
  const canvasBounds = canvas.getBoundingClientRect();
  normalizedStartX = (event.clientX - canvasBounds.left) / canvasBounds.width;
  normalizedStartY = (event.clientY - canvasBounds.top) / canvasBounds.height;
  canvasDraw(() => {
    drawingContext.fillStyle = "#dddddd60";
    drawingContext.fillRect(0, 0, canvasBounds.width, canvasBounds.height);
  }, canvasBounds);
}

function cropTouchPress(touchEvent) {
  cropPress(transformTouchEvent(touchEvent));
}

function cropMove(event) {
  if (!normalizedStartX || !normalizedStartY) {
    return;
  }
  canvasDraw(canvasBounds => {
    const startX = normalizedStartX * canvasBounds.width;
    const startY = normalizedStartY * canvasBounds.height;
    const cropWidth = (event.clientX - canvasBounds.left) - startX;
    const cropHeight = (event.clientY - canvasBounds.top) - startY;
    drawingContext.fillStyle = "#dddddd60";
    drawingContext.fillRect(0, 0, canvasBounds.width, canvasBounds.height);
    drawingContext.clearRect(startX, startY, cropWidth, cropHeight);
    drawingContext.lineWidth = 0.5;
    drawingContext.strokeStyle = "black";
    drawingContext.strokeRect(startX, startY, cropWidth, cropHeight);
  });
}

function cropTouchMove(touchEvent) {
  cropMove(transformTouchEvent(touchEvent));
}

function cropRelease(event) {
  const canvasBounds = canvas.getBoundingClientRect();
  const startX = normalizedStartX * canvasBounds.width;
  const startY = normalizedStartY * canvasBounds.height;
  const endX = event.clientX - canvasBounds.left;
  const endY = event.clientY - canvasBounds.top;
  const cropWidth = endX - startX;
  const cropHeight = endY - startY;
  const cropBounds = [
    Math.min(startX, endX) / canvasBounds.width,
    Math.min(startY, endY) / canvasBounds.height,
    Math.abs(cropWidth) / canvasBounds.width,
    Math.abs(cropHeight) / canvasBounds.height
  ];
  stopCropping();
  canvasDraw(() => {
    drawingContext.clearRect(0, 0, canvasBounds.width, canvasBounds.height);
    drawingContext.fillStyle = "#eeeeee20";
    drawingContext.fillRect(startX, startY, cropWidth, cropHeight);
    drawingContext.lineWidth = 0.5;
    drawingContext.strokeStyle = "black";
    drawingContext.strokeRect(startX, startY, cropWidth, cropHeight);
  }, canvasBounds);
  cropButton.dispatchEvent(new CustomEvent("crop", { detail: cropBounds }));
  cropButton.setAttribute("data-state", "crop");
  normalizedStartX = undefined;
  normalizedStartY = undefined;
}

function cropTouchRelease(touchEvent) {
  cropRelease(transformTouchEvent(touchEvent));
}

function canvasDraw(drawFunction, canvasBounds = canvas.getBoundingClientRect()) {
  const scale = window.devicePixelRatio;
  const scaledWidth = Math.floor(canvasBounds.width * scale);
  const scaledHeight = Math.floor(canvasBounds.height * scale);
  canvas.width = scaledWidth;
  canvas.height = scaledHeight;
  drawingContext.save();
  try {
    drawingContext.scale(scale, scale);
    drawFunction(canvasBounds);
  } finally {
    drawingContext.restore();
  }
}

function transformTouchEvent(touchEvent) {
  const touch = touchEvent.targetTouches[0] || touchEvent.changedTouches[0];
  touchEvent.clientX = touch.clientX;
  touchEvent.clientY = touch.clientY;
  return touchEvent;
}
