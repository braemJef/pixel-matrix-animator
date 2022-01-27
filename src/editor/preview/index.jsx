import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import StoreContext from '../../store/context';
import generateFramePreviewPath from '../../utils/generateFramePreviewPath';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const InnerContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  padding: 2rem 2rem 0 2rem;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: calc(100% - 6rem);
  flex: 1;
  display: flex;
  justify-content: center;
`;

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
`;

const Controls = styled.div`
  width: 100%;
  min-height: 6rem;
  justify-content: center;
  display: flex;
  padding: 1rem 0;
`;

const Button = styled.button`
  border-radius: 0.25rem;
  width: 4rem;
  height: 4rem;
  font-size: 2rem;
  border: none;

  background-color: transparent;
  border: none;
  padding: 0;
  background-color: ${({ active }) => (active ? '#545353' : '#171619')};
  color: white;

  &:hover {
    background-color: ${({ active }) => (active ? '#545353' : '#3A383C')};
  }
`;

const MPS = 1000 / 30;

function Preview() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [intervalHandle, setIntervalHandle] = React.useState(null);
  const [savedFrame, setSavedFrame] = React.useState(0);
  const [previewPath, setPreviewPath] = React.useState([]);
  const [state] = React.useContext(StoreContext);

  const handlePlay = React.useCallback(() => {
    setIsPlaying(true);
    const { frames } = state;

    const imageElement = window.document.getElementById('previewImage');
    let currentFrame = savedFrame;

    const timeout = frames[currentFrame].repeat * MPS;
    const handle = setInterval(() => {
      const start = Date.now();
      const frame = previewPath[currentFrame];
      imageElement.src = frame;
      imageElement.dataset.frame = currentFrame;
      const end = Date.now();
      console.log('RenderTime:', currentFrame, end - start);

      if (currentFrame + 1 === frames.length) {
        currentFrame = 0;
      } else {
        currentFrame += 1;
      }
    }, timeout);

    setIntervalHandle(handle);
  }, [state, setIntervalHandle, setIsPlaying, savedFrame]);

  const handlePause = React.useCallback(() => {
    clearInterval(intervalHandle);
    setIsPlaying(false);
    const imageElement = window.document.getElementById('previewImage');
    const currentFrame = Number(imageElement.dataset.frame);
    const frameToSave =
      currentFrame + 1 === state.frames.length ? 0 : currentFrame + 1;
    setSavedFrame(frameToSave);
  }, [intervalHandle, setIsPlaying, setSavedFrame, state.frames.length]);

  useEffect(() => {
    setSavedFrame(0);
    setIsPlaying(false);
    const path = generateFramePreviewPath(state.frames, state.size, state.mode);
    setPreviewPath(path);
  }, [state.frames, state.mode, state.size]);

  return (
    <Container>
      <InnerContainer>
        <ImageContainer>
          <PreviewImage id="previewImage" alt="preview" />
        </ImageContainer>
        <Controls>
          {isPlaying ? (
            <Button onClick={handlePause}>
              <FontAwesomeIcon icon={faPause} />
            </Button>
          ) : (
            <Button onClick={handlePlay}>
              <FontAwesomeIcon icon={faPlay} />
            </Button>
          )}
        </Controls>
      </InnerContainer>
    </Container>
  );
}

export default Preview;
