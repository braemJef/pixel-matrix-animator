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
  size: { rows: 10, columns: 20 },
  mode: 'fade',
  frames: [
    {
      id: uuidv4(),
      data: {},
      img: generateFrameImage({}, { rows: 10, columns: 20 }),
      repeat: 1,
    },
  ],
};

function PixelAnimatorReducer(state, action) {
  switch (action.type) {
    case 'setColor':
      return {
        ...state,
        color: action.payload,
      };
    case 'changeMode':
      return {
        ...state,
        mode: action.payload,
      };
    case 'changeDrawMode':
      return {
        ...state,
        drawMode: action.payload,
      };
    case 'setMatrixSize':
      return {
        ...state,
        size: action.payload,
      };
    case 'addFrame':
      return {
        ...state,
        frames: [
          ...state.frames,
          {
            id: uuidv4(),
            data: {},
            img: generateFrameImage({}, state.size),
            repeat: 1,
          },
        ],
        currentFrame: state.frames.length,
      };
    case 'duplicateFrame':
      return {
        ...state,
        frames: insertArrayElement(state.frames, action.payload + 1, {
          ...state.frames[action.payload],
          id: uuidv4(),
        }),
      };
    case 'changeFrameAmount':
      return {
        ...state,
        frames: replaceArrayElement(state.frames, action.payload.index, {
          ...state.frames[action.payload.index],
          repeat: action.payload.repeat,
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
            : state.currentFrame < action.payload
            ? state.currentFrame
            : state.currentFrame - 1,
        frames: removeArrayElement(state.frames, action.payload),
      };
    case 'moveFrame':
      return {
        ...state,
        frames: switchArrayElements(
          state.frames,
          action.payload.from,
          action.payload.to,
        ),
        currentFrame:
          state.currentFrame === action.payload.from
            ? action.payload.to
            : state.currentFrame,
      };
    case 'setCurrentFrame':
      return {
        ...state,
        currentFrame: action.payload,
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
        action.payload,
        state.drawMode,
        state.color,
        state.size,
      );
      const newFrames = replaceArrayElement(state.frames, state.currentFrame, {
        ...state.frames[state.currentFrame],
        data: newData,
        img: generateFrameImage(newData, state.size),
      });
      return {
        ...state,
        frames: newFrames,
      };
    case 'loadBackup':
      return {
        ...state,
        size: action.payload.size,
        mode: action.payload.mode,
        frames: action.payload.frames.map(({ repeat, data, id }) => ({
          repeat,
          id,
          data,
          img: generateFrameImage(data, action.payload.size),
        })),
      };
    default:
      return state;
  }
}

export default PixelAnimatorReducer;
