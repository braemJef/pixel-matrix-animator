import { original } from 'immer';
import { v4 as uuidv4 } from 'uuid';

import createReducer from '../utils/createReducer';
import generateFrameImage from '../utils/generateFrameImage';
import insertArrayElement from '../utils/insertArrayElement';
import paintFrameWithMode from '../utils/paintFrameWithMode';
import removeArrayElement from '../utils/removeArrayElement';
import switchArrayElement from '../utils/switchArrayElement';
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

const pixelAnimatorReducer = createReducer((builder) => {
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
      .addCase(actionType.SET_FRAME_REPEAT_TYPE, (state, { payload }) => {
        const { frameIndex, repeat } = payload;
        state.frames[frameIndex].repeat = repeat;
      })
      .addCase(actionType.DELETE_FRAME_TYPE, (state, { payload }) => {
        state.frames = removeArrayElement(state.frames, payload);
      })
      .addCase(actionType.MOVE_FRAME_TYPE, (state, { payload }) => {
        const { from, to } = payload;
        state.frames = switchArrayElement(state.frames, from, to);
      })
      .addCase(actionType.SET_CURRENT_FRAME_TYPE, (state, { payload }) => {
        state.currentFrame = payload;
      })

      // ****************** //
      // * Editor actions * //
      // ****************** //
      .addCase(actionType.MOUSE_DOWN_TYPE, (state) => {
        state.mouseDown = true;
      })
      .addCase(actionType.MOUSE_UP_TYPE, (state) => {
        state.mouseDown = false;
      })
      .addCase(
        [actionType.MOUSE_OVER_PIXEL_TYPE, actionType.MOUSE_DOWN_PIXEL_TYPE],
        (state, { type, payload }) => {
          if (
            type === actionType.MOUSE_OVER_PIXEL_TYPE &&
            state.mouseDown === false
          ) {
            return;
          }

          const newData = paintFrameWithMode(
            original(state.frames[state.currentFrame].data),
            payload,
            state.drawMode,
            original(state.color),
            original(state.size),
          );
          const newImg = generateFrameImage(newData, original(state.size));

          state.frames[state.currentFrame].data = newData;
          state.frames[state.currentFrame].img = newImg;
        },
      )

      // ****************** //
      // * Backup actions * //
      // ****************** //
      .addCase(actionType.LOAD_BACKUP_TYPE, (state, { payload }) => {
        state.size = payload.size;
        state.mode = payload.mode;
        state.frames = state.frames.map(({ repeat, data, id }) => ({
          repeat,
          id,
          data,
          img: generateFrameImage(data, payload.size),
        }));
      })
  );
});

export default pixelAnimatorReducer;
