import React, { useEffect } from 'react';
import styled from "styled-components";
import { PhotoshopPicker } from "react-color";

import Matrix from "./PixelMatrix";
import PixelAnimatorContext from './PixelAnimatorContext';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MatrixContainer = styled.div`
  width: 80%;
  position: relative;
`;

const FrameEditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1rem 0 1rem 0;
`;

const FloatingMiddle = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Color = styled.button`
  background-color: ${({ color }) => color};
  border: 1px solid white;
  border-radius: 0;
  width: 5vw;
  height: 5vw;
`;

const FrameCarousel = styled.div`
  background-color: rgba(255,255,255,0.2);
  padding: 1rem 0 1rem 0;
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const Frame = styled.div`
  height: 100%;
  width: 25%;
  display: flex;
  align-items: center;
  margin: 0 1rem 0 1rem;
`;

const SIZE = {
  rows: 10,
  columns: 20,
};

function PixelAnimator() {
  const [state, dispatch] = React.useContext(PixelAnimatorContext);
  const [pickerColor, setPickerColor] = React.useState(state.color);
  const [showColorPicker, setShowColorPicker] = React.useState();

  const handleChangeColor = () => {
    setShowColorPicker(true);
  }

  const handleChangeColorComplete = (newColor) => {
    setPickerColor(newColor);
  }

  const handleAccept = () => {
    dispatch({ type: 'setColor', value: pickerColor });
    setShowColorPicker(false);
  }

  const handleCancel = () => {
    setPickerColor(state.color);
    setShowColorPicker(false);
  }

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
    <>
      <Container>
        <FrameEditorContainer>
          <MatrixContainer>
            <Matrix size={state.size} frame={state.frames[state.currentFrame]} />
          </MatrixContainer>
          <Color onClick={handleChangeColor} color={state.color.hex} />
        </FrameEditorContainer>
        <FrameCarousel>
          {state.frames.map((frame) => (
            <Frame>
              <Matrix size={state.size} frame={frame} />
            </Frame>
          ))}
        </FrameCarousel>
      </Container>
      {showColorPicker && (
        <FloatingMiddle>
          <PhotoshopPicker
            onChangeComplete={handleChangeColorComplete}
            onAccept={handleAccept}
            onCancel={handleCancel}
            color={pickerColor}
          />
        </FloatingMiddle>
      )}
    </>
  );
}

export default PixelAnimator;
