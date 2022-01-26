/* eslint-disable no-nested-ternary */
/* eslint-disable no-case-declarations */
import { v4 as uuidv4 } from 'uuid';
import generateFrameImage from '../utils/generateFrameImage';
import insertArrayElement from '../utils/insertArrayElement';
import paintFrameWithMode from '../utils/paintFrameWithMode';
import removeArrayElement from '../utils/removeArrayElement';
import replaceArrayElement from '../utils/replaceArrayElement';
import switchArrayElements from '../utils/switchArrayElements';

export const pixelAnimatorReducerInitialState = {
  mode: 'fade',
  drawMode: 'pencil',
  mouseDown: false,
  color: {
    hsl: { h: 0, s: 0, l: 0, a: 1 },
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0, a: 1 },
    hsv: { h: 0, s: 0, v: 0, a: 1 },
    oldHue: 0,
    source: 'hsv',
  },
  size: { rows: 10, columns: 20 },
  currentFrame: 0,
  frames: [
    {
      frameId: uuidv4(),
      data: {},
      frameImg: generateFrameImage({}, { rows: 10, columns: 20 }),
      frameAmount: 1,
    },
  ],
};

function PixelAnimatorReducer(state, action) {
  switch (action.type) {
    case 'setColor':
      return {
        ...state,
        color: action.value,
      };
    case 'changeMode':
      return {
        ...state,
        mode: action.value,
      };
    case 'changeDrawMode':
      return {
        ...state,
        drawMode: action.value,
      };
    case 'setMatrixSize':
      return {
        ...state,
        size: action.value,
      };
    case 'addFrame':
      return {
        ...state,
        frames: [
          ...state.frames,
          {
            frameId: uuidv4(),
            data: {},
            frameImg: generateFrameImage({}, state.size),
            frameAmount: 1,
          },
        ],
        currentFrame: state.frames.length,
      };
    case 'duplicateFrame':
      return {
        ...state,
        frames: insertArrayElement(state.frames, action.value + 1, {
          ...state.frames[action.value],
          frameId: uuidv4(),
        }),
      };
    case 'changeFrameAmount':
      return {
        ...state,
        frames: replaceArrayElement(state.frames, action.value.index, {
          ...state.frames[action.value.index],
          frameAmount: action.value.amount,
        }),
      };
    case 'deleteFrame':
      if (state.frames.length === 1) {
        return state;
      }
      return {
        ...state,
        currentFrame:
          state.currentFrame === 0
            ? 0
            : state.currentFrame < action.value
            ? state.currentFrame
            : state.currentFrame - 1,
        frames: removeArrayElement(state.frames, action.value),
      };
    case 'moveFrame':
      return {
        ...state,
        frames: switchArrayElements(
          state.frames,
          action.value.from,
          action.value.to,
        ),
        currentFrame:
          state.currentFrame === action.value.from
            ? action.value.to
            : state.currentFrame,
      };
    case 'setCurrentFrame':
      return {
        ...state,
        currentFrame: action.value,
      };
    case 'mouseDown':
      return {
        ...state,
        mouseDown: true,
      };
    case 'mouseUp':
      return {
        ...state,
        mouseDown: false,
      };
    case 'mouseOverPixel':
    case 'mouseDownPixel':
      if (action.type === 'mouseOverPixel' && !state.mouseDown) {
        return state;
      }
      const newData = paintFrameWithMode(
        state.frames[state.currentFrame].data,
        action.value,
        state.drawMode,
        state.color,
        state.size,
      );
      const newFrames = replaceArrayElement(state.frames, state.currentFrame, {
        ...state.frames[state.currentFrame],
        data: newData,
        frameImg: generateFrameImage(newData, state.size),
      });
      return {
        ...state,
        frames: newFrames,
      };
    case 'loadBackup':
      return {
        ...state,
        size: action.value.size,
        mode: action.value.mode,
        frames: action.value.frames.map(({ amount, data, id }) => ({
          frameAmount: amount,
          frameId: id,
          data,
          frameImg: generateFrameImage(data, action.value.size),
        })),
      };
    default:
      return state;
  }
}

export default PixelAnimatorReducer;
