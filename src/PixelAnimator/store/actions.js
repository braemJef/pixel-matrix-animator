export const actionType = {
  // ******************* //
  // * Toolbar actions * //
  // ******************* //
  SET_COLOR_ACTION_TYPE: 'setColor',
  SET_MODE_TYPE: 'setMode',
  SET_DRAW_MODE_TYPE: 'setDrawMode',
  SET_MATRIX_SIZE_TYPE: 'setMatrixSize',

  // ******************** //
  // * Carousel actions * //
  // ******************** //
  ADD_NEW_FRAME_TYPE: 'addNewFrame',
  DUPLICATE_FRAME_TYPE: 'duplicateFrame',

  // ****************** //
  // * Editor actions * //
  // ****************** //

  // TODO
  SET_FRAME_REPEAT_TYPE: 'setFrameRepeat',
  DELETE_FRAME_TYPE: 'deleteFrame',
  MOVE_FRAME_TYPE: 'moveFrame',
  SET_CURRENT_FRAME: 'setCurrentFrame',
  MOUSE_DOWN_TYPE: 'mouseDown',
  MOUSE_UP_TYPE: 'mouseUp',
  MOUSE_DOWN_PIXEL_TYPE: 'mouseDownPixel',
  MOUSE_OVER_PIXEL_TYPE: 'mouseOverPixel',
  LOAD_BACKUP: 'loadBackup',
};

// ******************* //
// * Toolbar actions * //
// ******************* //
export const setColorAction = (color) => ({
  type: actionType.SET_COLOR_ACTION_TYPE,
  payload: color,
});
export const setModeAction = (mode) => ({
  type: actionType.SET_MODE_ACTION,
  payload: mode,
});
export const setDrawModeAction = (drawMode) => ({
  type: actionType.SET_MODE_ACTION,
  payload: drawMode,
});
export const setMatrixSizeAction = (rows, columns) => ({
  type: actionType.SET_MATRIX_SIZE_TYPE,
  payload: {
    rows,
    columns,
  },
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

// ****************** //
// * Editor actions * //
// ****************** //
