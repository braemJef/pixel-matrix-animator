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
      data: {}
    }
  ],
}

function setPixelColor(frames, framePos, pixelPos, color) {
  const currentFrame = frames[framePos];
  const { x, y } = pixelPos;
  return [
    ...frames.slice(0, framePos),
    {
      ...currentFrame,
      data: {
        ...currentFrame.data,
        [`${x}${y}`]: color,
      }
    },
    ...frames.slice(framePos + 1),
  ];
}

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
        frames: [...state.frames, { data: {} }],
      };
    case 'deleteFrame':
      return {
        ...state,
        currentFrame: state.currentFrame < action.value  ? state.currentFrame : (state.currentFrame - 1),
        frames: [
          ...state.frames.slice(0, action.value),
          ...state.frames.slice(action.value + 1)
        ],
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
      const newFramesHover = setPixelColor(
        state.frames,
        state.currentFrame,
        action.value,
        state.color.hex,
      );
      return {
        ...state,
        frames: newFramesHover,
      }
    case 'mouseDownPixel':
      const newFramesClick = setPixelColor(
        state.frames,
        state.currentFrame,
        action.value,
        state.color.hex,
      );
      return {
        ...state,
        frames: newFramesClick,
      }
    default:
      return state;
  }
}

export default PixelAnimatorReducer;