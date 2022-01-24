import React from 'react';
import styled from 'styled-components';

import PixelAnimatorContext from '../PixelAnimatorContext';
import Pixel from './Pixel';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  border-bottom: none;
  border-right: none;
  width: 100%;
  height: fit-content;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid white;
  width: 100%;
`;

function Matrix({ size, frame }) {
  const [_, dispatch] = React.useContext(PixelAnimatorContext);
  const { rows, columns } = size;
  const pixelSize = 100 / columns;

  const handleClick = (xPos, yPos) => {
    dispatch({
      type: 'clickPixel',
      value: {
        x: xPos,
        y: yPos,
      },
    });
  }

  const handleMouseOver = (xPos, yPos) => {
    dispatch({
      type: 'hoverPixel',
      value: {
        x: xPos,
        y: yPos,
      },
    });
  }

  return (
    <Container>
      {Array(rows).fill().map((_, rowIndex) => (
        <Row pixelSize={pixelSize}>
          {Array(columns).fill().map((_, columnIndex) => {
            const xPos = columnIndex;
            const yPos = rows - rowIndex - 1;
            return (
              <Pixel
                pixelSize={pixelSize}
                xPos={xPos}
                yPos={yPos}
                color={frame.data?.[`${xPos}${yPos}`]}
                onClick={handleClick}
                onMouseOver={handleMouseOver}
              />
            );
          })}
        </Row>
      ))}
    </Container>
  );
}

export default Matrix;