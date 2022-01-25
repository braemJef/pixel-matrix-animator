const MULTIPLIER = 20;

function generateFrameImage(frameData, size) {
  const { rows, columns } = size;

  let canvasElement = document.getElementById('generatedCanvas');

  if (!canvasElement) {
    canvasElement = document.createElement('canvas');
    canvasElement.id = 'generatedCanvas';
    document.body.appendChild(canvasElement);
  }

  canvasElement.width = columns * MULTIPLIER;
  canvasElement.height = rows * MULTIPLIER;

  const ctx = canvasElement.getContext('2d');

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      const color = frameData[`${x}${y}`];
      ctx.fillStyle = color ? color.hex : '#000000';
      ctx.fillRect(x*MULTIPLIER, (rows-1-y)*MULTIPLIER, MULTIPLIER, MULTIPLIER);
    }
  }

  const img = canvasElement.toDataURL("image/png");

  return img;
}

export default generateFrameImage;