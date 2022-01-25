import { v4 as uuidv4 } from 'uuid';
import generateFrameImage from '../utils/generateFrameImage';
import removeArrayElement from '../utils/removeArrayElement';
import replaceArrayElement from '../utils/replaceArrayElement';
import switchArrayElements from '../utils/switchArrayElements';

export const pixelAnimatorReducerInitialState = {
  mouseDown: false,
  color: {
    hsl: { h:0, s:0, l:0, a:1 },
    hex:"#000000",
    rgb: { r:0, g:0, b:0, a:1 },
    hsv: { h:0, s:0, v:0, a:1 },
    oldHue: 0,
    source: "hsv"
  },
  size: { rows: 10, columns: 20 },
  currentFrame: 0,
  frames: [
    {
      frameId: uuidv4(),
      data: {},
      frameImg: generateFrameImage({}, { rows: 10, columns: 20 }),
    }
  ],
};

function PixelAnimatorReducer(state, action) {
  switch(action.type) {
    case 'setColor':
      return {
        ...state,
        color: action.value,
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
          }
        ],
      };
    case 'deleteFrame':
      return {
        ...state,
        currentFrame: state.currentFrame < action.value  ? state.currentFrame : (state.currentFrame - 1),
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
        currentFrame: state.currentFrame === action.value.from ? action.value.to : state.currentFrame,
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
      if (!state.mouseDown) {
        return state;
      };
      const newMouseOverData = {
        ...state.frames[state.currentFrame].data,
        [`${action.value.x}${action.value.y}`]: state.color,
      };
      const newMouseOverFrames = replaceArrayElement(
        state.frames,
        state.currentFrame,
        {
          ...state.frames[state.currentFrame],
          data: newMouseOverData,
          frameImg: generateFrameImage(newMouseOverData, state.size),
        }
      );
      return {
        ...state,
        frames: newMouseOverFrames,
      }
    case 'mouseDownPixel':
      const newMouseDownData = {
        ...state.frames[state.currentFrame].data,
        [`${action.value.x}${action.value.y}`]: state.color,
      };
      const newMouseDownFrames = replaceArrayElement(
        state.frames,
        state.currentFrame,
        {
          ...state.frames[state.currentFrame],
          data: newMouseDownData,
          frameImg: generateFrameImage(newMouseDownData, state.size),
        }
      );
      return {
        ...state,
        frames: newMouseDownFrames,
      }
    default:
      return state;
  }
}

export default PixelAnimatorReducer;