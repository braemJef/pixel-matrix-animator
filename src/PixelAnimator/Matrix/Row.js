import React from 'react';
import Pixel from './Pixel';

function Row({ yPos, size }) { 
  return (
    <>
      {Array(size).map((_, index) => <Pixel yPos={yPos} xPos={index} />)}
    </>
  );
}

export default Row;