/* eslint-disable react/jsx-no-constructed-context-values */
import './app.css';
import React from 'react';
import styled from 'styled-components';

import StoreContext from './store/context';
import pixelAnimatorReducer, { initialState } from './store/reducer';
import Editor from './editor';
import FrameCarousel from './frameCarousel';
import ModeSelector from './modeSelector';
import Toolbar from './toolbar';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MatrixContainer = styled.div`
  width: 80%;
  height: 100%;
  position: relative;
`;

const FrameEditorContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: 1rem 0 1rem 0;
  height: 80%;
  flex: 1;
`;

function App() {
  const [state, dispatch] = React.useReducer(
    pixelAnimatorReducer,
    initialState,
  );

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      <div className="App">
        <Container>
          <FrameEditorContainer>
            <MatrixContainer>
              <Editor />
            </MatrixContainer>
            <Toolbar />
          </FrameEditorContainer>
          <ModeSelector />
          <FrameCarousel />
        </Container>
      </div>
    </StoreContext.Provider>
  );
}

export default App;
