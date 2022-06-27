import tinycolor from 'tinycolor2';
import { v4 as uuidv4 } from 'uuid';
import generateFrameImage from './generateFrameImage';

function importImage(state, imageData) {
  const { size, frames } = state;
  const { rows, columns } = size;

  const dataArray = Array.from(imageData);
  const frameData = {};
  for (let y = rows - 1; y >= 0; y--) {
    for (let x = 0; x < columns; x++) {
      const r = dataArray.shift();
      const g = dataArray.shift();
      const b = dataArray.shift();
      const a = dataArray.shift();
      const color = tinycolor({ r, g, b, a }).toHexString();
      frameData[`${x},${y}`] = color;
    }
  }
  const newFrame = {
    id: uuidv4(),
    data: frameData,
    img: generateFrameImage(frameData, size),
    repeat: 1,
  };
  frames.push(newFrame);
}

export default importImage;
