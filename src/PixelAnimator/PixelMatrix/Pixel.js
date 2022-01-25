import React from 'react';
import styled from 'styled-components';

const Container = styled.span`
  background-color: ${({ color }) => color || '#000000'};
  width: ${({ pixelSize }) => `${pixelSize}px`};
  height: 100%;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
  user-drag: none;
  user-select: none;

  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

function Pixel({ xPos, yPos, pixelSize, color, onMouseDown, onMouseOver }) {
  const handleMouseDown = React.useCallback(() => {
    if (typeof onMouseDown === 'function') {
      onMouseDown(xPos, yPos);
    }
  }, [onMouseDown, xPos, yPos]);

  const handleMouseOver = React.useCallback(() => {
    if (typeof onMouseOver === 'function') {
      onMouseOver(xPos, yPos);
    }
  }, [onMouseOver, xPos, yPos]);

  return (
    <Container onMouseDown={handleMouseDown} onMouseOver={handleMouseOver} pixelSize={pixelSize} color={color?.hex} />
  );
}

export default Pixel;