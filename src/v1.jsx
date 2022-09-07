import React from 'react';
import styled from 'styled-components';
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
  height: 100%;
  flex: 1;
  position: relative;
`;

const CarouselContainer = styled.div`
  width: 100%;
  position: relative;
`;
function V1() {
  return (
    <Container>
      <EditorContainer>
        <Editor />
      </EditorContainer>
      <CarouselContainer>
        <Carousel />
      </CarouselContainer>
    </Container>
  );
}

export default V1;
