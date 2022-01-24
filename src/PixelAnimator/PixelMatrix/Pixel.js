import React from 'react';
import styled from 'styled-components';

const Container = styled.span`
  background-color: ${({ color }) => color || '#000000'};
  width: ${({ pixelSize }) => `${pixelSize}%`};
  height: 100%;
  border-right: 1px solid white;

  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
`;

function Pixel({ xPos, yPos, pixelSize, color, onClick, onMouseOver }) {
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(xPos, yPos);
    }
  }

  const handleMouseOver = () => {
    if (typeof onClick === 'function') {
      onMouseOver(xPos, yPos);
    }
  }

  return (
    <Container onMouseDown={handleClick} onMouseOver={handleMouseOver} pixelSize={pixelSize} color={color} />
  );
}

export default Pixel;