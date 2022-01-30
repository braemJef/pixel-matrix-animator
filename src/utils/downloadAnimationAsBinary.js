const ModeToNumber = {
  fade: 0,
  retain: 1,
  replace: 2,
};

function fromHexString(hexString) {
  return new Uint8Array(
    hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
  );
}

function normalizeFrames(frames) {
  return frames.map(({ data, repeat }) => {
    const newData = {};

    Object.keys(data).forEach((key) => {
      if (data[key] !== '#000000') {
        newData[key] = data[key];
      }
    });

    return {
      data: newData,
      repeat,
    };
  });
}

function downloadAnimationAsBinary(state) {
  const { mode, frames, fps } = state;

  const binaryData = [];

  // Animation
  // byte 1 is the mode
  binaryData.push(Int8Array.from([ModeToNumber[mode]]));
  // byte 2 is the fps
  binaryData.push(Int8Array.from([fps]));
  // byte 3-4 is the amount of frames
  binaryData.push(Int16Array.from([frames.length]));

  const normalizedFrames = normalizeFrames(frames);
  normalizedFrames.forEach(({ data, repeat }) => {
    const pixels = Object.keys(data);
    const pixelAmount = pixels.length;

    // Frame
    // byte 1-2 in a frame is the amount of pixels
    binaryData.push(Int16Array.from([pixelAmount]));
    // byte 3-4 is the amount of times the frame should get repeated
    binaryData.push(Int16Array.from([repeat]));

    pixels.forEach((pixelKey) => {
      const [x, y] = pixelKey.split(',');
      const color = data[pixelKey];
      const xPos = Number(x);
      const yPos = Number(y);

      // Pixel
      // byte 1 is the x position
      // byte 2 is the y position
      binaryData.push(Int8Array.from([xPos, yPos]));
      // byte 3 is the red value
      // byte 4 is the green value
      // byte 5 is the blue value
      binaryData.push(fromHexString(color));
    });
  });

  const blob = new Blob(binaryData, { type: 'application/octet-stream' });
  const url = window.URL.createObjectURL(blob);

  const downloadElement = document.getElementById('downloadAnchorElem');
  downloadElement.setAttribute('href', url);
  downloadElement.setAttribute('download', 'backup.bin');
  downloadElement.click();
}

export default downloadAnimationAsBinary;
