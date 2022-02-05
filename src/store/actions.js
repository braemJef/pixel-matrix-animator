export const actionType = {
  // ******************* //
  // * Toolbar actions * //
  // ******************* //
  SET_COLOR_ACTION_TYPE: 'setColor',
  SET_MODE_TYPE: 'setMode',
  SET_DRAW_MODE_TYPE: 'setDrawMode',
  SET_MATRIX_SIZE_TYPE: 'setMatrixSize',
  UNDO_FRAME_STEP_TYPE: 'undoFrameStep',
  SET_FADE_PERCENTAGE_TYPE: 'setFadePercentage',
  SET_FPS_TYPE: 'setFps',
  MOVE_PIXELS_TYPE: 'movePixels',
  SET_NAME_TYPE: 'setName',

  // ******************** //
  // * Carousel actions * //
  // ******************** //
  ADD_NEW_FRAME_TYPE: 'addNewFrame',
  DUPLICATE_FRAME_TYPE: 'duplicateFrame',
  SET_FRAME_REPEAT_TYPE: 'setFrameRepeat',
  DELETE_FRAME_TYPE: 'deleteFrame',
  MOVE_FRAME_TYPE: 'moveFrame',
  SET_CURRENT_FRAME_TYPE: 'setCurrentFrame',

  // ****************** //
  // * Editor actions * //
  // ****************** //
  MOUSE_UP_TYPE: 'mouseUp',
  MOUSE_DOWN_PIXEL_TYPE: 'mouseDownPixel',
  MOUSE_OVER_PIXEL_TYPE: 'mouseOverPixel',
  PICK_COLOR_TYPE: 'pickColor',
  ERASE_PIXEL_TYPE: 'erasePixel',

  // ****************** //
  // * Backup actions * //
  // ****************** //
  LOAD_BACKUP_TYPE: 'loadBackup',
};

// ******************* //
// * Toolbar actions * //
// ******************* //
export const setColorAction = (color) => ({
  type: actionType.SET_COLOR_ACTION_TYPE,
  payload: color,
});
export const setModeAction = (mode) => ({
  type: actionType.SET_MODE_TYPE,
  payload: mode,
});
export const setDrawModeAction = (drawMode) => ({
  type: actionType.SET_DRAW_MODE_TYPE,
  payload: drawMode,
});
export const setMatrixSizeAction = (rows, columns) => ({
  type: actionType.SET_MATRIX_SIZE_TYPE,
  payload: {
    rows,
    columns,
  },
});
export const undoFrameStepAction = () => ({
  type: actionType.UNDO_FRAME_STEP_TYPE,
});
export const setFadePercentageAction = (percentage) => ({
  type: actionType.SET_FADE_PERCENTAGE_TYPE,
  payload: percentage,
});
export const setFpsAction = (fps) => ({
  type: actionType.SET_FPS_TYPE,
  payload: fps,
});
export const movePixelsAction = (direction) => ({
  type: actionType.MOVE_PIXELS_TYPE,
  payload: direction,
});
export const setNameAction = (name) => ({
  type: actionType.SET_NAME_TYPE,
  payload: name,
});

// ******************** //
// * Carousel actions * //
// ******************** //
export const addNewFrameAction = () => ({
  type: actionType.ADD_NEW_FRAME_TYPE,
});
export const duplicateFrameAction = (frameIndex) => ({
  type: actionType.DUPLICATE_FRAME_TYPE,
  payload: frameIndex,
});
export const setFrameRepeatAction = (frameIndex, repeat) => ({
  type: actionType.SET_FRAME_REPEAT_TYPE,
  payload: {
    frameIndex,
    repeat,
  },
});
export const deleteFrameAction = (frameIndex) => ({
  type: actionType.DELETE_FRAME_TYPE,
  payload: frameIndex,
});
export const moveFrameAction = (from, to) => ({
  type: actionType.MOVE_FRAME_TYPE,
  payload: {
    from,
    to,
  },
});
export const setCurrentFrameAction = (frameIndex) => ({
  type: actionType.SET_CURRENT_FRAME_TYPE,
  payload: frameIndex,
});

// ****************** //
// * Editor actions * //
// ****************** //
export const mouseUpAction = () => ({
  type: actionType.MOUSE_UP_TYPE,
});
export const mouseDownPixelAction = (xPos, yPos) => ({
  type: actionType.MOUSE_DOWN_PIXEL_TYPE,
  payload: {
    x: xPos,
    y: yPos,
  },
});
export const mouseOverPixelAction = (xPos, yPos) => ({
  type: actionType.MOUSE_OVER_PIXEL_TYPE,
  payload: {
    x: xPos,
    y: yPos,
  },
});
export const pickColorAction = (xPos, yPos) => ({
  type: actionType.PICK_COLOR_TYPE,
  payload: {
    x: xPos,
    y: yPos,
  },
});
export const erasePixelAction = (xPos, yPos) => ({
  type: actionType.ERASE_PIXEL_TYPE,
  payload: {
    x: xPos,
    y: yPos,
  },
});

// ****************** //
// * Backup actions * //
// ****************** //
export const loadBackupAction = (data, fileName) => ({
  type: actionType.LOAD_BACKUP_TYPE,
  payload: {
    data,
    fileName,
  },
});
