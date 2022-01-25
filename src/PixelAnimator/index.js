import React, { useEffect } from 'react';
import styled from "styled-components";

import PixelMatrix from "./PixelMatrix";
import PixelAnimatorContext from './PixelAnimatorContext';
import FrameCarousel from './FrameCarousel';
import ModeSelector from './ModeSelector';
import Toolbar from './Toolbar';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MatrixContainer = styled.div`
  width: 80%;
  height: 100%;
  position: relative;
`;

const FrameEditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1rem 0 1rem 0;
  height: 80%;
  flex: 1;
`;

const SIZE = {
  rows: 10,
  columns: 20,
};

function PixelAnimator() {
  const [state, dispatch] = React.useContext(PixelAnimatorContext);

  const handleMouseDownPixel = React.useCallback((xPos, yPos) => {
    dispatch({
      type: 'mouseDownPixel',
      value: {
        x: xPos,
        y: yPos,
      },
    });
  }, [dispatch]);

  const handleMouseOverPixel = React.useCallback((xPos, yPos) => {
    dispatch({
      type: 'mouseOverPixel',
      value: {
        x: xPos,
        y: yPos,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    dispatch({ type: 'setMatrixSize', value: SIZE });

    const handleMouseDown = () => {
      dispatch({ type: 'mouseDown' });
    }
    const handleMouseUp = () => {
      dispatch({ type: 'mouseUp' });
    }

    document.body.addEventListener('mousedown', handleMouseDown);
    document.body.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.body.removeEventListener('mousedown', handleMouseDown);
      document.body.removeEventListener('mouseup', handleMouseUp);
    }
  }, []);

  return (
    <Container>
      <FrameEditorContainer>
        <MatrixContainer>
          <PixelMatrix
            onMouseDownPixel={handleMouseDownPixel}
            onMouseOverPixel={handleMouseOverPixel}
            size={state.size}
            frame={state.frames[state.currentFrame]}
          />
        </MatrixContainer>
        <Toolbar />
      </FrameEditorContainer>
      <ModeSelector />
      <FrameCarousel />
    </Container>
  );
}

export default PixelAnimator;
