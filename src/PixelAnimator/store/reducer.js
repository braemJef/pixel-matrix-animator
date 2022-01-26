import { v4 as uuidv4 } from 'uuid';

import createReducer from '../../utils/createReducer';
import generateFrameImage from '../../utils/generateFrameImage';
import insertArrayElement from '../../utils/insertArrayElement';
import { actionType } from './actions';

const defaultSize = { rows: 10, columns: 20 };
const getDefaultFrame = (size) => ({
  id: uuidv4(),
  data: {},
  img: generateFrameImage({}, size),
  repeat: 1,
});
const copyFrame = (frame) => ({
  ...frame,
  id: uuidv4(),
});

export const initialState = {
  // Editor related state
  drawMode: 'pencil',
  mouseDown: false,
  currentFrame: 0,
  color: {
    hsl: { h: 0, s: 0, l: 0, a: 1 },
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0, a: 1 },
    hsv: { h: 0, s: 0, v: 0, a: 1 },
    oldHue: 0,
    source: 'hsv',
  },

  // Animation data related state
  size: defaultSize,
  mode: 'fade',
  frames: [getDefaultFrame(defaultSize)],
};

export const pixelAnimatorReducer = createReducer((builder) => {
  return (
    builder
      // ******************* //
      // * Toolbar actions * //
      // ******************* //
      .addCase(actionType.SET_COLOR_ACTION_TYPE, (state, { payload }) => {
        state.color = payload;
      })
      .addCase(actionType.SET_MODE_TYPE, (state, { payload }) => {
        state.mode = payload;
      })
      .addCase(actionType.SET_DRAW_MODE_TYPE, (state, { payload }) => {
        state.drawMode = payload;
      })
      .addCase(actionType.SET_MATRIX_SIZE_TYPE, (state, { payload }) => {
        state.size = payload;
      })

      // ******************** //
      // * Carousel actions * //
      // ******************** //
      .addCase(actionType.ADD_NEW_FRAME_TYPE, (state) => {
        const newFrame = getDefaultFrame(state.size);
        state.frames.push(newFrame);
      })
      .addCase(actionType.DUPLICATE_FRAME_TYPE, (state, { payload }) => {
        const newFrame = copyFrame(state.frames[payload]);
        const newFrameIndex = payload + 1;
        state.frames = insertArrayElement(
          state.frames,
          newFrameIndex,
          newFrame,
        );
      })

    // ****************** //
    // * Editor actions * //
    // ****************** //
  );
});

export default pixelAnimatorReducer;
