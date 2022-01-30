import tinycolor from 'tinycolor2';
import nonBlockingTask from './nonBlockingTask';

export function generateFramePreview(data, size, multiplier) {
  const { rows, columns } = size;
  const canvasElement = document.getElementById('previewCanvas');

  const ctx = canvasElement.getContext('2d');
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, columns * multiplier, rows * multiplier);
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      const color = data[`${x},${y}`];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(
          x * multiplier,
          (rows - 1 - y) * multiplier,
          multiplier,
          multiplier,
        );
      }
    }
  }
}

async function generateFramePreviewPlan(frames, size, mode, modeConfig) {
  const flattenedFrames = [];

  frames.forEach((frame) => {
    const { data, repeat } = frame;
    for (let r = 0; r < repeat; r++) {
      flattenedFrames.push(data);
    }
  });

  const dataPlan = new Array(flattenedFrames.length);

  const { rows, columns } = size;

  // Fade has dynamic colors depending on previous frames
  // We loop the whole animation retries amount of times
  // This way we get the most accurate coloring possible
  if (mode === 'fade') {
    for (let r = 0; r < 2; r++) {
      for (const [index, data] of flattenedFrames.entries()) {
        // eslint-disable-next-line no-await-in-loop
        await nonBlockingTask(() => {
          const frameData = {};
          const prevFrameData = dataPlan.at(index - 1) || {};

          for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
              const color = data[`${x},${y}`];
              const prevColor = prevFrameData[`${x},${y}`];
              if (color && color !== '#000000') {
                frameData[`${x},${y}`] = color;
              } else if (prevColor) {
                frameData[`${x},${y}`] = tinycolor(prevColor)
                  .darken(modeConfig.fadePercentage)
                  .toHexString();
              }
            }
          }

          dataPlan[index] = frameData;
        });
      }
    }
  }

  // If mode is retain nothing will be dynamic
  // After 2 passes we have calculated the correct colors for each frame
  if (mode === 'retain') {
    for (let r = 0; r < 2; r++) {
      flattenedFrames.forEach((data, index) => {
        const frameData = {};
        const prevFrameData = dataPlan.at(index - 1) || {};
        for (let x = 0; x < columns; x++) {
          for (let y = 0; y < rows; y++) {
            const color = data[`${x},${y}`];
            const prevColor = prevFrameData[`${x},${y}`];
            if (color && color !== '#000000') {
              frameData[`${x},${y}`] = color;
            } else if (prevColor) {
              frameData[`${x},${y}`] = prevColor;
            }
          }
        }

        dataPlan[index] = frameData;
      });
    }
  }

  // If mode is replace, each frame gets replaced
  // So we just have to construct the plan once
  if (mode === 'replace') {
    flattenedFrames.forEach((data, index) => {
      const frameData = {};
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          const color = data[`${x},${y}`];
          if (color) {
            frameData[`${x},${y}`] = color;
          }
        }
      }

      dataPlan[index] = frameData;
    });
  }

  return dataPlan;
}

export default generateFramePreviewPlan;
