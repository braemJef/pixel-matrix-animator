function downloadAnimationAsJson(state) {
  const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(
    JSON.stringify({
      frames: state.frames.map((frame) => ({
        data: frame.data,
        repeat: frame.repeat,
        id: frame.id,
      })),
      mode: state.mode,
      modeConfig: state.modeConfig,
      size: state.size,
      fps: state.fps,
    }),
  )}`;
  const downloadElement = document.getElementById('downloadAnchorElem');
  downloadElement.setAttribute('href', dataString);
  downloadElement.setAttribute('download', `${state.name}.json`);
  downloadElement.click();
}

export default downloadAnimationAsJson;
