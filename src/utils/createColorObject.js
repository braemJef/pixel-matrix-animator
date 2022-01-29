import tinycolor from 'tinycolor2';

function createColorObject(data) {
  const color = tinycolor(data);
  return {
    rgb: color.toRgb(),
    hex: color.toHexString(),
  };
}

export default createColorObject;
