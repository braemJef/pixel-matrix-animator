import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import PixelAnimatorContext from '../PixelAnimatorContext';
import Frame, { SimpleFrame } from './Frame';

const Container = styled.div`
  background-color: #171619;
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

  const handleClickDuplicateFrame = React.useCallback((index) => {
    dispatch({ type: 'duplicateFrame', value: index });
  }, [dispatch]);

  const handleChangeFrameAmount = React.useCallback((value, index) => {
    dispatch({
      type: 'changeFrameAmount',
      value: {
        amount: value,
        index,
      },
    });
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
            {state.frames.map((frame, index) => (
              <Frame
                key={frame.frameId}
                onClick={handleClickFrame}
                onClickDelete={handleClickDeleteFrame}
                onClickDuplicate={handleClickDuplicateFrame}
                onChangeFrameAmount={handleChangeFrameAmount}
                index={index}
                currentFrame={state.currentFrame}
                size={state.size}
                frame={frame}
              />
            ))}
            {provided.placeholder}
            <SimpleFrame onClick={handleAddFrame}>
              <FontAwesomeIcon icon={faPlusSquare} />
            </SimpleFrame>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default FrameCarousel;