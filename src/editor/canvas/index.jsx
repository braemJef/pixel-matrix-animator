import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  erasePixelAction,
  mouseDownPixelAction,
  mouseOverPixelAction,
  mouseUpAction,
  pickColorAction,
} from '../../store/actions';
import StoreContext from '../../store/context';

import Pixel from './Pixel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  margin: 1rem;
  width: 100%;
`;

const Row = styled.div`
  border-left: 1px solid white;
  display: flex;
  flex-direction: row;
  height: ${({ pixelSize }) => pixelSize}px;

  &:first-child {
    border-top: 1px solid white;
  }
`;

const DRAW_MODES = { pencil: true, rulerHorizontal: true, rulerVertical: true };
const MOUSE_BUTTONS = {
  leftButton: 1,
  rightButton: 3,
  middleButton: 2,
};

function Canvas() {
  const [state, dispatch] = React.useContext(StoreContext);
  const container = React.useRef(null);
  const [pixelSize, setPixelSize] = React.useState(0);

  const { rows, columns } = state.size;
  const frame = state.frames[state.currentFrame];

  const handleMouseDownPixel = React.useCallback(
    ({ event, xPos, yPos }) => {
      const eventButton = event.nativeEvent.which;
      if (eventButton === MOUSE_BUTTONS.middleButton) {
        dispatch(pickColorAction(xPos, yPos));
      } else if (eventButton === MOUSE_BUTTONS.rightButton) {
        dispatch(erasePixelAction(xPos, yPos));
      } else if (eventButton === MOUSE_BUTTONS.leftButton) {
        if (DRAW_MODES[state.drawMode]) {
          dispatch(mouseDownPixelAction(xPos, yPos));
        }
        if (state.drawMode === 'eyeDropper') {
          dispatch(pickColorAction(xPos, yPos));
        }
        if (state.drawMode === 'eraser') {
          dispatch(erasePixelAction(xPos, yPos));
        }
      }
    },
    [dispatch, state.drawMode],
  );

  const handleMouseOverPixel = React.useCallback(
    (xPos, yPos) => {
      dispatch(mouseOverPixelAction(xPos, yPos));
    },
    [dispatch],
  );

  const handleContextMenu = React.useCallback((event) => {
    event.preventDefault();
  });

  useEffect(() => {
    let newPixelSize = 0;
    let timeoutHandle;

    function onResize() {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      if (container?.current) {
        const { width, height } = container.current.getBoundingClientRect();
        const elementRatio = height / width;
        const floorRatio = rows / columns;
        if (elementRatio > floorRatio) {
          newPixelSize = width / columns;
        } else {
          newPixelSize = height / rows;
        }
        timeoutHandle = setTimeout(() => {
          setPixelSize(newPixelSize);
        }, 250);
      }
    }

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeoutHandle);
      window.removeEventListener('resize', onResize);
    };
  }, [container, setPixelSize, columns, rows]);

  useEffect(() => {
    const handleMouseUp = () => {
      dispatch(mouseUpAction());
    };

    document.body.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.body.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <Container ref={container} onContextMenu={handleContextMenu}>
      {Array(rows)
        .fill()
        .map((_, rowIndex) => (
          <Row pixelSize={pixelSize} key={`row_${rows - rowIndex - 1}`}>
            {Array(columns)
              .fill()
              .map((__, columnIndex) => {
                const xPos = columnIndex;
                const yPos = rows - rowIndex - 1;
                return (
                  <Pixel
                    key={`${xPos},${yPos}`}
                    pixelSize={pixelSize}
                    xPos={xPos}
                    yPos={yPos}
                    color={frame.data?.[`${xPos},${yPos}`]}
                    onMouseDown={handleMouseDownPixel}
                    onMouseOver={handleMouseOverPixel}
                  />
                );
              })}
          </Row>
        ))}
    </Container>
  );
}

export default React.memo(Canvas);
