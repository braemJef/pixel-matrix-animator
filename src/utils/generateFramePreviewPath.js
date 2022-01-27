function generateFramePreviewPath(frameData, size, mode) {
  const multiplier = window.innerHeight / size.rows;
  const { rows, columns } = size;

  let canvasElement = document.getElementById('previewCanvas');

  if (!canvasElement) {
    console.log('appendCanvas');
    canvasElement = document.createElement('canvas');
    canvasElement.id = 'previewCanvas';
    document.body.appendChild(canvasElement);
    canvasElement.width = columns * multiplier;
    canvasElement.height = rows * multiplier;
  }

  const ctx = canvasElement.getContext('2d');

  if (mode === 'replace') {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const color = frameData[`${x},${y}`];
        ctx.fillStyle = color ? color.hex : '#000000';
        ctx.fillRect(
          x * multiplier,
          (rows - 1 - y) * multiplier,
          multiplier,
          multiplier,
        );
      }
    }
  }

  if (mode === 'retain') {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const color = frameData[`${x},${y}`];
        if (color?.hex && color?.hex !== '#000000') {
          ctx.fillStyle = color.hex;
          ctx.fillRect(
            x * multiplier,
            (rows - 1 - y) * multiplier,
            multiplier,
            multiplier,
          );
        }
      }
    }
  }

  if (mode === 'fade') {
    ctx.globalCompositeOperation = 'luminosity';
    ctx.fillStyle = 'hsl(0,0,50%)';
    ctx.fillRect(0, 0, columns * multiplier, rows * multiplier);
    ctx.globalCompositeOperation = 'source-over';
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        const color = frameData[`${x},${y}`];
        if (color?.hex && color?.hex !== '#000000') {
          ctx.fillStyle = color.hex;
          ctx.fillRect(
            x * multiplier,
            (rows - 1 - y) * multiplier,
            multiplier,
            multiplier,
          );
        }
      }
    }
  }

  const img = canvasElement.toDataURL('image/png');

  return img;
}

export default generateFramePreviewPath;
