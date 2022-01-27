import React from 'react';

import styled from 'styled-components';
import Canvas from './canvas';
import Toolbar from './toolbar';
import ModeSelector from './modeSelector';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const HorizontalContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
`;

function Editor() {
  return (
    <Container>
      <HorizontalContainer>
        <Canvas />
        <Toolbar />
      </HorizontalContainer>
      <ModeSelector />
    </Container>
  );
}

export default Editor;
