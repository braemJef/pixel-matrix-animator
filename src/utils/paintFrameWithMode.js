function paintFrameWithMode({ ...frameData }, pos, mode, color, size) {
  const { x, y } = pos;
  const { rows, columns } = size;

  if (mode === 'pencil') {
    if (color.hex === '#000000') {
      delete frameData[`${x},${y}`];
    } else {
      frameData[`${x},${y}`] = color;
    }
  }

  if (mode === 'rulerHorizontal') {
    for (let xPos = 0; xPos < columns; xPos++) {
      if (color.hex === '#000000') {
        delete frameData[`${xPos},${y}`];
      } else {
        frameData[`${xPos},${y}`] = color;
      }
    }
  }

  if (mode === 'rulerVertical') {
    for (let yPos = 0; yPos < rows; yPos++) {
      if (color.hex === '#000000') {
        delete frameData[`${x},${yPos}`];
      } else {
        frameData[`${x},${yPos}`] = color;
      }
    }
  }

  console.log(frameData);

  return frameData;
}

export default paintFrameWithMode;
