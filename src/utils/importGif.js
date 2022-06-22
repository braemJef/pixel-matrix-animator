import { parseGIF, decompressFrames } from 'gifuct-js';

export async function convertGif(rawGifData) {
  const gif = parseGIF(new Uint8Array(rawGifData));
  const frames = decompressFrames(gif, true);

  return frames;
}

function importGif(state, gifData) {
  const { size, frames } = state;
  const { rows, columns } = size;

  // const {
  //   frames: gifFrames,
  //   width,
  //   height,
  // } = decodeGif(new Uint8Array(gifData));

  // gifFrames.forEach(async ({ timeCode, data }) => {
  //   const imageData = new ImageData(data, width, height);
  //   const bitmapImage = createImageBitmap(imageData);

  //   const result = await pica.resizeBuffer({
  //     src: data,
  //     width,
  //     height,
  //     toWidth: 32,
  //     toHeight: 16,
  //     filter: 'lanczos3',
  //   });

  //   const dataArray = Array.from(result);
  //   const frameData = {};
  //   for (let y = rows - 1; y >= 0; y--) {
  //     for (let x = 0; x < columns; x++) {
  //       const r = dataArray.shift();
  //       const g = dataArray.shift();
  //       const b = dataArray.shift();
  //       const a = dataArray.shift();
  //       const color = tinycolor({ r, g, b, a }).toHexString();
  //       frameData[`${x},${y}`] = color;
  //     }
  //   }
  //   const newFrame = {
  //     id: uuidv4(),
  //     data: frameData,
  //     img: generateFrameImage(frameData, size),
  //     repeat: 1,
  //   };
  //   frames.push(newFrame);
  // });
}

export default importGif;
