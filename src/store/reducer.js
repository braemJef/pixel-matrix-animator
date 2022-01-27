import { original } from 'immer';
import { v4 as uuidv4 } from 'uuid';

import createReducer from '../utils/createReducer';
import checkFrameEqual from '../utils/checkFrameEqual';
import generateFrameImage from '../utils/generateFrameImage';
import insertArrayElement from '../utils/insertArrayElement';
import paintFrameWithMode from '../utils/paintFrameWithMode';
import removeArrayElement from '../utils/removeArrayElement';
import switchArrayElement from '../utils/switchArrayElement';
import { actionType } from './actions';
import createColorObject from '../utils/createColorObject';

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
    hex: '#ffffff',
    rgb: { r: 0, g: 0, b: 0, a: 1 },
    hsv: { h: 0, s: 0, v: 0, a: 1 },
  },

  // Animation data related state
  size: defaultSize,
  mode: 'fade',
  modeConfig: {
    fadePercentage: 1,
  },
  frames: [getDefaultFrame(defaultSize)],

  // History
  history: {},
};

const pixelAnimatorReducer = createReducer((builder) => {
  return (
    builder
      // ******************* //
      // * Toolbar actions * //
      // ******************* //
      .addCase(actionType.SET_COLOR_ACTION_TYPE, (state, { payload }) => {
        state.color = {
          hsv: payload.hsv,
          rgb: payload.rgb,
          hex: payload.hex,
        };
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
      .addCase(actionType.UNDO_FRAME_STEP_TYPE, (state) => {
        const frame = original(state.frames[state.currentFrame]);
        const size = original(state.size);

        state.history?.[frame.id].pop();
        const newDataDraft = state.history?.[frame.id].pop();
        const newData = newDataDraft ? original(newDataDraft) : {};
        state.frames[state.currentFrame].data = newData;
        state.frames[state.currentFrame].img = generateFrameImage(
          newData,
          size,
        );
      })
      .addCase(actionType.SET_FADE_PERCENTAGE_TYPE, (state, { payload }) => {
        state.modeConfig.fadePercentage = payload;
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
        state.currentFrame = newFrameIndex;
      })
      .addCase(actionType.SET_FRAME_REPEAT_TYPE, (state, { payload }) => {
        const { frameIndex, repeat } = payload;
        state.frames[frameIndex].repeat = repeat;
      })
      .addCase(actionType.DELETE_FRAME_TYPE, (state, { payload }) => {
        if (state.frames.length === 1) {
          return;
        }
        state.frames = removeArrayElement(state.frames, payload);
        if (state.currentFrame >= payload && state.currentFrame !== 0) {
          state.currentFrame -= 1;
        }
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
      .addCase(actionType.MOUSE_UP_TYPE, (state) => {
        const currentFrame = state.frames[state.currentFrame];
        const dataBeforeEdit = state.history?.[currentFrame.id]?.at(-1);
        const dataAfterEdit = currentFrame.data;
        const isEqual = checkFrameEqual(
          dataBeforeEdit ? original(dataBeforeEdit) : {},
          original(dataAfterEdit),
        );

        if (!isEqual) {
          if (!state.history[currentFrame.id]) {
            state.history[currentFrame.id] = [dataAfterEdit];
          } else {
            state.history[currentFrame.id].push(dataAfterEdit);
          }
        }

        state.mouseDown = false;
      })
      .addCase(actionType.MOUSE_DOWN_PIXEL_TYPE, (state, { payload }) => {
        const { x, y } = payload;
        const currentFrame = state.frames[state.currentFrame];
        state.mouseDown = true;

        if (state.drawMode === 'eyeDropper') {
          state.color =
            currentFrame.data[`${x},${y}`] || createColorObject('#000000');
          return;
        }

        const newData = paintFrameWithMode(
          original(currentFrame.data),
          payload,
          state.drawMode,
          original(state.color),
          original(state.size),
        );
        const newImg = generateFrameImage(newData, original(state.size));

        state.frames[state.currentFrame].data = newData;
        state.frames[state.currentFrame].img = newImg;
      })
      .addCase(actionType.MOUSE_OVER_PIXEL_TYPE, (state, { payload }) => {
        if (state.mouseDown === false) {
          return;
        }
        const currentFrame = state.frames[state.currentFrame];

        const newData = paintFrameWithMode(
          original(currentFrame.data),
          payload,
          state.drawMode,
          original(state.color),
          original(state.size),
        );
        const newImg = generateFrameImage(newData, original(state.size));

        state.frames[state.currentFrame].data = newData;
        state.frames[state.currentFrame].img = newImg;
      })

      // ****************** //
      // * Backup actions * //
      // ****************** //
      .addCase(actionType.LOAD_BACKUP_TYPE, (state, { payload }) => {
        state.size = payload.size;
        state.mode = payload.mode;
        state.frames = payload.frames.map(({ repeat, data, id }) => ({
          repeat,
          id,
          data,
          img: generateFrameImage(data, payload.size),
        }));
      })
  );
});

export default pixelAnimatorReducer;
