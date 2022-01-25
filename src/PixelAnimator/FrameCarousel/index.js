import React, { useEffect } from 'react';
import styled from 'styled-components';

import PixelAnimatorContext from '../PixelAnimatorContext';
import { SimpleFrame } from './Frame';
import LazyFramesList from './LazyFramesList';

const Container = styled.div`
  background-color: rgba(255,255,255,0.15);
  padding: 1rem 0 1rem 0;
  width: 100%;
  height: 25%;
  display: flex;
  flex-direction: row;
  overflow: auto;
`;

function FrameCarousel() {
  const [state, dispatch] = React.useContext(PixelAnimatorContext);
  const [lazyFrames, setLazyFrames] = React.useState([]);

  const handleAddFrame = () => {
    dispatch({ type: 'addFrame' });
  }

  const handleClickFrame = React.useCallback((index) => {
    dispatch({ type: 'setCurrentFrame', value: index });
  }, [dispatch]);

  const handleClickDeleteFrame = React.useCallback((index) => {
    dispatch({ type: 'deleteFrame', value: index });
  }, [dispatch]);

  useEffect(() => {
    let intervalHandle;
    if (state.frames.length !== lazyFrames.length) {
      setLazyFrames(state.frames);
    } else {
      intervalHandle = setInterval(() => {
        setLazyFrames(state.frames);
      }, 250);
    }

    return () => {
      if (intervalHandle) {
        clearInterval(intervalHandle);
      }
    }
  }, [state.frames, lazyFrames.length]);

  return (
    <Container>
      <LazyFramesList
        size={state.size}
        onClickFrame={handleClickFrame}
        frames={lazyFrames}
        onClickDeleteFrame={handleClickDeleteFrame}
        currentFrame={state.currentFrame}
      />
      <SimpleFrame onClick={handleAddFrame}>
        +
      </SimpleFrame>
    </Container>
  );
}

export default FrameCarousel;