import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';

import StoreContext from '../store/context';
import {
  addNewFrameAction,
  deleteFrameAction,
  duplicateFrameAction,
  moveFrameAction,
  setCurrentFrameAction,
  setFrameRepeatAction,
} from '../store/actions';
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
  const [state, dispatch] = React.useContext(StoreContext);

  const handleAddFrame = () => {
    dispatch(addNewFrameAction());
  };

  const handleDragEnd = React.useCallback(
    (event) => {
      dispatch(moveFrameAction(event.source.index, event.destination.index));
    },
    [dispatch],
  );

  const handleClickFrame = React.useCallback(
    (index) => {
      dispatch(setCurrentFrameAction(index));
    },
    [dispatch],
  );

  const handleClickDeleteFrame = React.useCallback(
    (index) => {
      dispatch(deleteFrameAction(index));
    },
    [dispatch],
  );

  const handleClickDuplicateFrame = React.useCallback(
    (index) => {
      dispatch(duplicateFrameAction(index));
    },
    [dispatch],
  );

  const handleChangeFrameAmount = React.useCallback(
    (value, index) => {
      dispatch(setFrameRepeatAction(index, value));
    },
    [dispatch],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="lazyFramesList" direction="horizontal">
        {(provided) => (
          <Container {...provided.droppableProps} ref={provided.innerRef}>
            {state.frames.map((frame, index) => (
              <Frame
                key={frame.id}
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
