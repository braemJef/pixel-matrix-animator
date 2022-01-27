import {
  faPause,
  faPlay,
  faSpinner,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import StoreContext from '../../store/context';
import generateFramePreviewPlan, {
  generateFramePreview,
} from '../../utils/generateFramePreviewPlan';

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: black;
  padding: 2rem 2rem 0 2rem;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: calc(100% - 5rem);
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingContainer = styled.div`
  width: 100%;
  height: calc(100% - 5rem);
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

const PreviewImage = styled.img`
  display: ${({ buffering }) => (buffering ? 'none' : 'block')};
  width: ${({ dimensions }) => dimensions.width || 0}px;
  height: ${({ dimensions }) => dimensions.height || 0}px;
  border: 1px solid white;
`;

const Controls = styled.div`
  width: 100%;
  min-height: 5rem;
  justify-content: center;
  display: flex;
  padding: 1rem 0 0 0;
  gap: 1rem;
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

function Preview({ onTogglePreview }) {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [intervalHandle, setIntervalHandle] = React.useState(null);
  const [savedFrame, setSavedFrame] = React.useState(0);
  const [previewPlan, setPreviewPlan] = React.useState([]);
  const [planLoading, setPlanLoading] = React.useState(true);
  const [imageDimensions, setImageDimensions] = React.useState(true);
  const container = React.useRef(null);
  const [state] = React.useContext(StoreContext);

  const handlePlay = React.useCallback(() => {
    setIsPlaying(true);
    const { size } = state;

    const imageElement = window.document.getElementById('previewImage');
    let currentFrame = savedFrame;
    const multiplier = window.innerHeight / size.rows;

    const handle = setInterval(() => {
      const data = previewPlan[currentFrame];
      const frame = generateFramePreview(data, size, multiplier);
      imageElement.src = frame;
      imageElement.dataset.frame = currentFrame;

      if (currentFrame + 1 === previewPlan.length) {
        currentFrame = 0;
      } else {
        currentFrame += 1;
      }
    }, MPS);

    setIntervalHandle(handle);
  }, [state, setIntervalHandle, setIsPlaying, savedFrame, previewPlan]);

  const handlePause = React.useCallback(() => {
    clearInterval(intervalHandle);
    setIsPlaying(false);
    const imageElement = window.document.getElementById('previewImage');
    const currentFrame = Number(imageElement.dataset.frame);
    const frameToSave =
      currentFrame + 1 === state.frames.length ? 0 : currentFrame + 1;
    setSavedFrame(frameToSave);
  }, [intervalHandle, setIsPlaying, setSavedFrame, state.frames.length]);

  const handleGeneratePlan = React.useCallback(
    async (providedState) => {
      setIsPlaying(false);
      setSavedFrame(0);

      const { frames, size, mode } = providedState;
      const multiplier = window.innerHeight / size.rows;

      const plan = await generateFramePreviewPlan(frames, size, mode);

      const imageElement = window.document.getElementById('previewImage');
      imageElement.src = generateFramePreview(plan[0], size, multiplier);
      imageElement.dataset.frame = 0;

      setPreviewPlan(plan);
      setPlanLoading(false);
    },
    [
      setPlanLoading,
      setIsPlaying,
      setSavedFrame,
      setPreviewPlan,
      setPlanLoading,
    ],
  );

  useEffect(() => {
    setPlanLoading(true);
    const timeoutHandle = setTimeout(() => {
      handleGeneratePlan(state);
    }, 250);

    return () => {
      clearTimeout(timeoutHandle);
    };
  }, [state.frames, state.mode, state.size, setPlanLoading]);

  useEffect(() => {
    const { rows, columns } = state.size;
    let newPixelSize = 0;
    let timeoutHandle;

    function onResize() {
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }

      if (container?.current) {
        const { width, height } = container.current.getBoundingClientRect();
        const elementRatio = height / width;
        const floorRatio = rows / columns;
        if (elementRatio > floorRatio) {
          newPixelSize = width / columns;
        } else {
          newPixelSize = height / rows;
        }
        timeoutHandle = setTimeout(() => {
          setImageDimensions({
            width: newPixelSize * columns,
            height: newPixelSize * rows,
          });
        }, 250);
      }
    }

    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timeoutHandle);
      window.removeEventListener('resize', onResize);
    };
  }, [container, setImageDimensions, state.size]);

  return (
    <Container>
      <ImageContainer ref={container}>
        <PreviewImage
          dimensions={imageDimensions}
          buffering={planLoading}
          id="previewImage"
          alt="preview"
        />
        {planLoading && (
          <LoadingContainer>
            <FontAwesomeIcon pulse size="5x" color="white" icon={faSpinner} />
          </LoadingContainer>
        )}
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
        <Button onClick={onTogglePreview}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </Controls>
    </Container>
  );
}

export default Preview;
