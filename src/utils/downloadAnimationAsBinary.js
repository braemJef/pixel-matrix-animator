const ModeToNumber = {
  fade: 0,
  retain: 1,
  replace: 2,
};

function normalizeFrames(frames) {
  return frames.map(({ data, repeat }) => {
    const newData = {};

    Object.keys(data).forEach((key) => {
      if (data[key].hex !== '#000000') {
        newData[key] = data[key].rgb;
      }
    });

    return {
      data: newData,
      repeat,
    };
  });
}

function downloadAnimationAsBinary(state) {
  const { mode, frames } = state;

  const binaryData = [];

  binaryData.push(Int8Array.from([ModeToNumber[mode]]));
  binaryData.push(Int16Array.from([frames.length]));

  const normalizedFrames = normalizeFrames(frames);
  normalizedFrames.forEach(({ data, repeat }) => {
    const pixels = Object.keys(data);
    const pixelAmount = pixels.length;

    binaryData.push(Int16Array.from([pixelAmount]));
    binaryData.push(Int16Array.from([repeat]));

    pixels.forEach((pixelKey) => {
      const [x, y] = pixelKey.split(',');
      const color = data[pixelKey];
      const xPos = Number(x);
      const yPos = Number(y);

      binaryData.push(Int8Array.from([xPos, yPos, color.r, color.g, color.b]));
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
