import React from 'react';
import PixelMatrix from '../PixelMatrix';
import Frame from './Frame';

function LazyFramesList({ frames, onClickFrame, size, onClickDeleteFrame, currentFrame }) {
  return (
      frames.map((frame, index) => (
        <Frame
          key={index}
          onClick={onClickFrame}
          onClickDelete={onClickDeleteFrame}
          index={index}
          currentFrame={currentFrame}
        >
          <PixelMatrix size={size} frame={frame} />
        </Frame>
      ))
  );
}

export default React.memo(LazyFramesList);