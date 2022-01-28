function moveFramePixelsDirection(data, direction) {
  const newData = {};
  Object.keys(data).forEach((key) => {
    const [x, y] = key.split(',');
    const xPos = Number(x) + direction.x;
    const yPos = Number(y) + direction.y;

    if (xPos < 0 || yPos < 0) {
      return;
    }
    newData[`${xPos},${yPos}`] = data[key];
  });
  return newData;
}

export default moveFramePixelsDirection;
