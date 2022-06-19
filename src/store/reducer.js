import { isDraft, original } from 'immer';
import { v4 as uuidv4 } from 'uuid';

import createReducer from '../utils/createReducer';
import checkFrameEqual from '../utils/checkFrameEqual';
import generateFrameImage from '../utils/generateFrameImage';
import insertArrayElement from '../utils/insertArrayElement';
import paintFrameWithMode from '../utils/paintFrameWithMode';
import removeArrayElement from '../utils/removeArrayElement';
import switchArrayElement from '../utils/switchArrayElement';
import { actionType } from './actions';
import moveFramePixelsDirection from '../utils/moveFramePixelsDirection';
import uploadAnimationFromJson from '../utils/uploadAnimationFromJson';
import importGif from '../utils/importGif';

const defaultSize = { rows: 16, columns: 32 };
export const getDefaultFrame = (size) => ({
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
  erasing: false,
  mouseDown: false,
  currentFrame: 0,
  color: '#ffffff',

  // Animation data related state
  name: 'ANIM0001',
  fps: 24,
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
        state.color = payload.hex || '#000000';
      })
      .addCase(actionType.SET_MODE_TYPE, (state, { payload }) => {
        state.mode = payload;
      })
      .addCase(actionType.SET_DRAW_MODE_TYPE, (state, { payload }) => {
        state.drawMode = payload;
      })
      .addCase(actionType.SET_MATRIX_SIZE_TYPE, (state, { payload }) => {
        console.log(payload);
        state.size = payload;
      })
      .addCase(actionType.UNDO_FRAME_STEP_TYPE, (state) => {
        const frame = original(state.frames[state.currentFrame]);
        const size = original(state.size);

        state.history?.[frame.id]?.pop();
        const newDataDraft = state.history?.[frame.id]?.pop();
        const newData =
          newDataDraft && isDraft(newDataDraft) ? original(newDataDraft) : {};
        state.frames[state.currentFrame].data = newData;
        state.frames[state.currentFrame].img = generateFrameImage(
          newData,
          size,
        );
      })
      .addCase(actionType.SET_FADE_PERCENTAGE_TYPE, (state, { payload }) => {
        state.modeConfig.fadePercentage = payload;
      })
      .addCase(actionType.SET_FPS_TYPE, (state, { payload }) => {
        state.fps = payload;
      })
      .addCase(actionType.MOVE_PIXELS_TYPE, (state, { payload }) => {
        const currentFrame = state.frames[state.currentFrame];
        const currentData = original(currentFrame.data);
        const newData = moveFramePixelsDirection(currentData, payload);
        currentFrame.data = newData;
        currentFrame.img = generateFrameImage(newData, original(state.size));
      })
      .addCase(actionType.SET_NAME_TYPE, (state, { payload }) => {
        state.name = payload;
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
        state.erasing = false;
      })
      .addCase(actionType.MOUSE_DOWN_PIXEL_TYPE, (state, { payload }) => {
        const currentFrame = state.frames[state.currentFrame];

        const newData = paintFrameWithMode(
          original(currentFrame.data),
          payload,
          state.drawMode,
          state.color,
          original(state.size),
        );

        currentFrame.data = newData;
        currentFrame.img = generateFrameImage(newData, original(state.size));
        state.mouseDown = true;
      })
      .addCase(actionType.MOUSE_OVER_PIXEL_TYPE, (state, { payload }) => {
        const { x, y } = payload;
        const currentFrame = state.frames[state.currentFrame];
        const originalData = original(currentFrame.data);

        if (state.erasing === true) {
          const { [`${x},${y}`]: erasedPixel, ...erasedData } = originalData;
          currentFrame.data = erasedData;
        } else if (state.mouseDown === true) {
          currentFrame.data = paintFrameWithMode(
            originalData,
            payload,
            state.drawMode,
            state.color,
            original(state.size),
          );
        } else {
          return;
        }

        const newImg = generateFrameImage(
          currentFrame.data,
          original(state.size),
        );
        currentFrame.img = newImg;
      })
      .addCase(actionType.PICK_COLOR_TYPE, (state, { payload }) => {
        const { x, y } = payload;
        const pixelColor =
          state.frames[state.currentFrame].data[`${x},${y}`] || '#000000';

        state.color = pixelColor;
      })
      .addCase(actionType.ERASE_PIXEL_TYPE, (state, { payload }) => {
        const { x, y } = payload;
        const currentFrame = state.frames[state.currentFrame];
        const originalData = original(currentFrame.data);
        const { [`${x},${y}`]: erasedPixel, ...erasedData } = originalData;

        currentFrame.data = erasedData;

        const newImg = generateFrameImage(
          currentFrame.data,
          original(state.size),
        );

        currentFrame.img = newImg;
        state.erasing = true;
      })

      // ****************** //
      // * Backup actions * //
      // ****************** //
      .addCase(actionType.LOAD_BACKUP_TYPE, (state, { payload }) => {
        uploadAnimationFromJson(state, payload.data, payload.fileName);
      })

      // ****************** //
      // * Import actions * //
      // ****************** //
      .addCase(actionType.IMPORT_GIF_ACTION, (state, { payload }) => {
        importGif(state, payload.data);
      })
  );
});

export default pixelAnimatorReducer;
