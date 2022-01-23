import React from 'react';
import Row from './Row';

function Matrix({ size }) {
  const { rows, columns } = size;

  return (
    <>
      {Array(rows).map((_, rowIndex) => <Row yPos={rows - rowIndex} size={columns} />)}
    </>
  );
}

export default Matrix;