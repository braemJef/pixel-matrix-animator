import React from 'react';
import styled from 'styled-components';

export const SimpleFrame = styled.div`
  height: 100%;
  min-width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 0.5rem 0.5rem 0.5rem;
  margin: 0 0 0 1rem;
  font-size: 3rem;
  position: relative;
  color: white;
  border: 1px solid rgba(255,255,255,0.20);
  background-color: ${({ isCurrentFrame }) => isCurrentFrame ? "rgba(255,255,255,0.20)" : "transparent"};

  &:hover {
    background-color: ${({ isCurrentFrame }) => isCurrentFrame ? "rgba(255,255,255,0.20)" : "rgba(255,255,255,0.05)"};
  }
  &:last-child:hover {
    background-color: rgba(0,255,0,0.15);
  }
`;

const DeleteButton = styled.button`
  top: 0.5rem;
  right: 0.5rem;
  position: absolute;
  background-color: transparent;
  border: none;
  padding: 0;
  width: 2rem;
  height: 2rem;
  background-color: rgba(255,255,255,0.15);
  border-radius: 1rem;
  color: white;

  &:hover {
    background-color: rgba(255,0,0,0.40);
  }
`;

function Frame({ children, onClick, index, onClickDelete, currentFrame }) {
  const handleClick = React.useCallback(() => {
    onClick(index);
  }, [onClick, index]);

  const handleClickDelete = React.useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    onClickDelete(index);
  }, [onClickDelete, index]);

  return (
    <SimpleFrame onClick={handleClick} isCurrentFrame={currentFrame === index}>
      {index !== 0 && <DeleteButton onClick={handleClickDelete}>
        <span>x</span>
      </DeleteButton>}
      {children}
    </SimpleFrame>
  );
}

export default Frame;