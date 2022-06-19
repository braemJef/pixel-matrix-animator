import decodeGif from 'decode-gif';
import { v4 as uuidv4 } from 'uuid';
import tinycolor from 'tinycolor2';

import generateFrameImage from './generateFrameImage';

function importGif(state, gifData) {
  const { size, frames } = state;
  const { rows, columns } = size;

  const { frames: gifFrames } = decodeGif(new Uint8Array(gifData));

  gifFrames.forEach(({ timeCode, data }) => {
    const dataArray = Array.from(data);
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
  });
}

export default importGif;
