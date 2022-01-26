function paintFrameWithMode(frameData, pos, mode, color, size) {
  const { x, y } = pos;
  const { rows, columns } = size;

  const newFrameData = {
    ...frameData,
  };

  if (mode === 'eraser') {
    newFrameData[`${x},${y}`] = '#000000';
  }

  if (mode === 'pencil') {
    newFrameData[`${x},${y}`] = color;
  }

  if (mode === 'rulerHorizontal') {
    for (let xPos = 0; xPos < columns; xPos++) {
      newFrameData[`${xPos},${y}`] = color;
    }
  }

  if (mode === 'rulerVertical') {
    for (let yPos = 0; yPos < rows; yPos++) {
      newFrameData[`${x},${yPos}`] = color;
    }
  }

  return newFrameData;
}

export default paintFrameWithMode;
