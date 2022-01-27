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
  padding: 1rem 0 0.25rem 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    background-color: #171619;
    width: 16px;
  }

  /* background of the scrollbar except button or resizer */
  &::-webkit-scrollbar-track {
    background-color: #171619;
  }
  &::-webkit-scrollbar-track:hover {
    background-color: #171619;
  }

  /* scrollbar itself */
  &::-webkit-scrollbar-thumb {
    background-color: #38373b;
    border-radius: 16px;
    border: 5px solid #171619;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #565558;
    border: 4px solid #171619;
  }

  /* set button(top and bottom of the scrollbar) */
  &::-webkit-scrollbar-button {
    display: none;
  }
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

  const handleWheel = React.useCallback(
    (event) => {
      const carouselElement = document.getElementById('carousel');
      const currentLeft = carouselElement.scrollLeft;
      // carouselElement.scrollTo({
      //   left: currentLeft + event.deltaY,
      // });
      carouselElement.scrollBy({
        left: event.deltaY,
      });
    },
    [dispatch],
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="lazyFramesList" direction="horizontal">
        {(provided) => (
          <Container
            {...provided.droppableProps}
            ref={provided.innerRef}
            onWheel={handleWheel}
            id="carousel"
          >
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
            <SimpleFrame onClick={handleAddFrame} wide>
              <FontAwesomeIcon icon={faPlusSquare} />
            </SimpleFrame>
          </Container>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default FrameCarousel;
