const MULTIPLIER = 20;

function generateFrameImage(frameData, size, multiplier = MULTIPLIER) {
  const { rows, columns } = size;

  let canvasElement = document.getElementById('imageCanvas');

  if (!canvasElement) {
    canvasElement = document.createElement('canvas');
    canvasElement.id = 'imageCanvas';
    document.body.appendChild(canvasElement);
  }

  canvasElement.width = columns * multiplier;
  canvasElement.height = rows * multiplier;

  const ctx = canvasElement.getContext('2d');

  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      const color = frameData[`${x},${y}`];
      ctx.fillStyle = color || '#000000';
      ctx.fillRect(
        x * multiplier,
        (rows - 1 - y) * multiplier,
        multiplier,
        multiplier,
      );
    }
  }

  const img = canvasElement.toDataURL('image/png');

  return img;
}

export default generateFrameImage;
