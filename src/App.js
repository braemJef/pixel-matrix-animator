/* eslint-disable react/jsx-no-constructed-context-values */
import './app.css';
import React from 'react';
import styled from 'styled-components';

import StoreContext from './store/context';
import pixelAnimatorReducer, { initialState } from './store/reducer';
import Editor from './editor';
import Carousel from './carousel';

const Container = styled.div`
  background-color: black;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const EditorContainer = styled.div`
  width: 100%;
  height: 80%;
  position: relative;
`;

const CarouselContainer = styled.div`
  width: 100%;
  height: 25%;
  position: relative;
`;

function App() {
  const [state, dispatch] = React.useReducer(
    pixelAnimatorReducer,
    initialState,
  );

  return (
    <StoreContext.Provider value={[state, dispatch]}>
      <Container>
        <EditorContainer>
          <Editor />
        </EditorContainer>
        <CarouselContainer>
          <Carousel />
        </CarouselContainer>
      </Container>
    </StoreContext.Provider>
  );
}

export default App;
