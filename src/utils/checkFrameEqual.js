function checkFrameEqual(frameData1, frameData2) {
  if (frameData1 === frameData2) {
    // it's just the same object. No need to compare.
    return true;
  }

  const allKeys = Object.keys({ ...frameData1, ...frameData2 });
  for (const key of allKeys) {
    const color1 = frameData1[key];
    const color2 = frameData2[key];
    if (color1?.hex === color2?.hex) {
      continue;
    }
    if (!color1 && color2?.hex === '#000000') {
      continue;
    }
    if (!color2 && color1?.hex === '#000000') {
      continue;
    }
    return false;
  }

  return true;
}

export default checkFrameEqual;
