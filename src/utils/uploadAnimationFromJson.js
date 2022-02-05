import generateFrameImage from './generateFrameImage';

function uploadAnimationFromJson(state, payload, fileName) {
  const { size } = payload;
  const { mode } = payload;
  const modeConfig = payload.modeConfig || {
    fadePercentage: 1,
  };
  const fps = payload.fps || 24;
  const frames = payload.frames.map(({ repeat, data, id }) => {
    const parsedData = {};
    Object.keys(data).forEach((key) => {
      const color = data[key];
      if (typeof color === 'object') {
        parsedData[key] = color.hex;
      }
      if (typeof color === 'string') {
        parsedData[key] = color;
      }
    });
    return {
      repeat,
      id,
      data: parsedData,
      img: generateFrameImage(parsedData, payload.size),
    };
  });

  state.size = size;
  state.mode = mode;
  state.modeConfig = modeConfig;
  state.fps = fps;
  state.frames = frames;
  state.name = fileName;
}

export default uploadAnimationFromJson;
