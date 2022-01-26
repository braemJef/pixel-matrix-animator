import tinycolor from 'tinycolor2';

function createColorObject(data) {
  const color = tinycolor(data);
  return {
    hsv: color.toHsv(),
    rgb: color.toRgb(),
    hex: color.toHex(),
  };
}

export default createColorObject;
