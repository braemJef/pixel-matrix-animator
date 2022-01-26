import {
  faClone,
  faTimes,
  faWaveSquare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styled from 'styled-components';

export const SimpleFrame = styled.div`
  height: 100%;
  min-width: 15%;
  max-width: 15%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0.5rem 0.5rem 0.5rem;
  margin: 0 0 0 1rem;
  font-size: 3rem;
  position: relative;
  color: white;
  border: 1px solid #2c2c30;
  background-color: ${({ isCurrentFrame }) =>
    isCurrentFrame ? '#69696D' : 'transparent'};

  &:hover {
    background-color: ${({ isCurrentFrame }) =>
      isCurrentFrame ? '#69696D' : '#2C2C30'};
  }
  &:last-child:hover {
    background-color: #53844d;
  }
`;

const ActionBar = styled.div`
  top: 0;
  right: 0;
  position: absolute;
  height: 3rem;
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 0 0.5rem 0 0.5rem;
  gap: 0.5rem;
  width: 100%;
`;

const InputContainer = styled.div`
  height: 2rem;
  display: flex;
  flex: 1;
  min-width: 0;
`;

const Icon = styled.div`
  width: 2rem;
  height: 2rem;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top-left-radius: 0.25rem;
  border-bottom-left-radius: 0.25rem;
  background-color: #4d4d53;
`;

const InputField = styled.input`
  height: 2rem;
  background-color: #4d4d53;
  border: none;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  color: white;
  flex: 1;
  min-width: 0;

  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
  width: 2rem;
  height: 2rem;
  min-width: 2rem;
  min-height: 2rem;
  background-color: #4d4d53;
  border-radius: 0.25rem;
  color: white;

  &:hover {
    background-color: #7d7d85;
  }
`;

const DeleteButton = styled(Button)`
  &:hover {
    background-color: #b74242;
  }
`;

const Image = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  image-rendering: pixelated;
`;

function Frame({
  onClick,
  index,
  onClickDelete,
  onClickDuplicate,
  onChangeFrameAmount,
  currentFrame,
  frame,
}) {
  const handleClick = React.useCallback(() => {
    onClick(index);
  }, [onClick, index]);

  const handleClickDelete = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClickDelete(index);
    },
    [onClickDelete, index],
  );

  const handleClickDuplicate = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onClickDuplicate(index);
    },
    [onClickDuplicate, index],
  );

  const handleChangeFrameAmount = React.useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      onChangeFrameAmount(event.target.value, index);
    },
    [onChangeFrameAmount, index],
  );

  return (
    <Draggable draggableId={frame.frameId} index={index}>
      {(provided) => (
        <SimpleFrame
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={handleClick}
          isCurrentFrame={currentFrame === index}
        >
          <ActionBar>
            <InputContainer>
              <Icon>
                <FontAwesomeIcon icon={faWaveSquare} />
              </Icon>
              <InputField
                type="number"
                onChange={handleChangeFrameAmount}
                value={frame.frameAmount}
              />
            </InputContainer>
            <Button onClick={handleClickDuplicate} title="duplicate">
              <FontAwesomeIcon icon={faClone} />
            </Button>
            <DeleteButton onClick={handleClickDelete} title="delete">
              <FontAwesomeIcon icon={faTimes} />
            </DeleteButton>
          </ActionBar>
          <Image src={frame.frameImg} />
        </SimpleFrame>
      )}
    </Draggable>
  );
}

export default Frame;