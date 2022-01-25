import React, { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
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

  const handleDragEnd = React.useCallback((event) => {
    console.log(event);
    dispatch({ type: 'moveFrame', value: {
      frameId: event.draggableId,
      from: event.source.index,
      to: event.destination.index,
    } });
  }, [dispatch]);

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
      }, 0);
    }

    return () => {
      if (intervalHandle) {
        clearInterval(intervalHandle);
      }
    }
  }, [state.frames, lazyFrames.length]);

  return (
    <DragDropContext
      onDragEnd={handleDragEnd}
    >
      <Droppable
        droppableId="lazyFramesList"
        direction="horizontal"
      >
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            <LazyFramesList
              {...provided.droppableProps}
              size={state.size}
              onClickFrame={handleClickFrame}
              frames={lazyFrames}
              onClickDeleteFrame={handleClickDeleteFrame}
              currentFrame={state.currentFrame}
            >
              {provided.placeholder}
            </LazyFramesList>
            <SimpleFrame onClick={handleAddFrame}>
              +
            </SimpleFrame>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default FrameCarousel;