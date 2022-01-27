import React from 'react';

import styled from 'styled-components';
import Canvas from './canvas';
import Toolbar from './toolbar';
import ModeSelector from './modeSelector';
import Preview from './preview';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

function Editor() {
  const [showPreview, setShowPreview] = React.useState(false);

  const handleTogglePreview = () => {
    console.log(showPreview);
    setShowPreview(!showPreview);
  };

  return (
    <Container>
      {showPreview ? (
        <Preview onTogglePreview={handleTogglePreview} />
      ) : (
        <>
          <Canvas />
          <Toolbar onTogglePreview={handleTogglePreview} />
        </>
      )}
      <ModeSelector />
    </Container>
  );
}

export default Editor;
