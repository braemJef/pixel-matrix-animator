import React from 'react';
import Frame from './Frame';

function LazyFramesList({ frames, onClickFrame, size, onClickDeleteFrame, currentFrame, children }) {
  return (
    <>
      {frames.map((frame, index) => (
        <Frame
          key={frame.frameId}
          onClick={onClickFrame}
          onClickDelete={onClickDeleteFrame}
          index={index}
          currentFrame={currentFrame}
          size={size}
          frame={frame}
        />
      ))}
      {children}
    </>
  );
}

export default React.memo(LazyFramesList);