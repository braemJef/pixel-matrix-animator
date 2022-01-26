import React, { useEffect } from 'react';
import styled from 'styled-components';

import Pixel from './Pixel';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InnerContainer = styled.div``;

const Row = styled.div`
  border-left: 1px solid white;
  display: flex;
  flex-direction: row;
  height: ${({ pixelSize }) => pixelSize}px;

  &:first-child {
    border-top: 1px solid white;
  }
`;

function PixelMatrix({ size, frame, onMouseDownPixel, onMouseOverPixel }) {
  const container = React.useRef(null);
  const [pixelSize, setPixelSize] = React.useState(0);
  const { rows, columns } = size;

  useEffect(() => {
    let newPixelSize = 0;
    let timeoutHandle;

    function onResize() {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      if (container?.current) {
        const { width, height } = container.current.getBoundingClientRect();
        const elementRatio = height / width;
        const floorRatio = rows / columns;
        if (elementRatio > floorRatio) {
          newPixelSize = width / columns;
        } else {
          newPixelSize = height / rows;
        }
        timeoutHandle = setTimeout(() => {
          setPixelSize(newPixelSize);
        }, 250);
      }
    }

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeoutHandle);
      window.removeEventListener('resize', onResize);
    };
  }, [container, setPixelSize, columns, rows]);

  return (
    <Container ref={container}>
      <InnerContainer>
        {Array(rows)
          .fill()
          .map((_, rowIndex) => (
            <Row pixelSize={pixelSize} key={`row_${rows - rowIndex - 1}`}>
              {Array(columns)
                .fill()
                .map((__, columnIndex) => {
                  const xPos = columnIndex;
                  const yPos = rows - rowIndex - 1;
                  return (
                    <Pixel
                      key={`${xPos},${yPos}`}
                      pixelSize={pixelSize}
                      xPos={xPos}
                      yPos={yPos}
                      color={frame.data?.[`${xPos},${yPos}`]}
                      onMouseDown={onMouseDownPixel}
                      onMouseOver={onMouseOverPixel}
                    />
                  );
                })}
            </Row>
          ))}
      </InnerContainer>
    </Container>
  );
}

export default React.memo(PixelMatrix);
