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
  const normalized = [];

  frames.forEach(({ data, repeat }) => {
    const newData = {};

    Object.keys(data).forEach((key) => {
      if (data[key] !== '#000000') {
        newData[key] = data[key].substring(1);
      }
    });

    for (let i = 0; i < repeat; i++) {
      normalized.push(newData);
    }
  });

  return normalized;
}

function downloadAnimationAsBinary(state) {
  const { mode, frames, fps, name, modeConfig } = state;
  const binaryData = [];
  const normalizedFrames = normalizeFrames(frames);

  // Animation info 16 bytes
  // byte 1 is the mode
  binaryData.push(Uint8Array.from([ModeToNumber[mode]]));
  // byte 2 is the fps
  binaryData.push(Uint8Array.from([fps]));
  // byte 3-4 is the amount of frames
  binaryData.push(Uint16Array.from([normalizedFrames.length]));
  // byte 5 is the amount of frames
  binaryData.push(Uint8Array.from([modeConfig.fadePercentage]));
  // byte 6-16 unused
  binaryData.push(Uint8Array.from(new Array(11).fill(0)));

  normalizedFrames.forEach((data) => {
    const pixels = Object.keys(data);
    const pixelAmount = pixels.length;

    // Frame info 8 bytes
    // byte 1-2 in a frame is the amount of pixels
    binaryData.push(Int16Array.from([pixelAmount]));
    // byte 3-8 unused
    binaryData.push(Uint8Array.from(new Array(6).fill(0)));

    pixels.forEach((pixelKey) => {
      const [x, y] = pixelKey.split(',');
      const color = data[pixelKey];
      const xPos = Number(x);
      const yPos = Number(y);

      // Pixel
      // byte 1 is the x position
      // byte 2 is the y position
      binaryData.push(Uint8Array.from([xPos, yPos]));
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
  downloadElement.setAttribute('download', `${name}.bin`);
  downloadElement.click();
}

export default downloadAnimationAsBinary;
