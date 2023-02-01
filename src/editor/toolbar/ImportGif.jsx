/* eslint-disable no-await-in-loop */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash';
import { decompressFrames, parseGIF } from 'gifuct-js';
import StoreContext from '../../store/context';
import ImportImageController from '../../utils/ImportImageController';
import { importImageAction } from '../../store/actions';
import GifFramesController from '../../utils/GifFramesController';

const ImageContainer = styled.div`
  width: 75%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Label = styled.label`
  margin-bottom: 0.15rem;
  font-size: 0.8rem;
  font-weight: bold;
`;

const Button = styled.button`
  border: none;
  height: 2rem;
  min-height: 2rem;
  background-color: ${({ active }) => (active ? '#545353' : '#171619')};
  border-radius: 0.25rem;
  color: white;
  padding: 0 1rem;
  margin-top: 0.5rem;

  &:hover {
    background-color: ${({ active }) => (active ? '#545353' : '#3A383C')};
  }
`;

const ControlsContainer = styled.div`
  max-width: 25%;
  width: 25%;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 1rem;

  & p {
    font-weight: bold;
  }

  & span {
    font-size: 0.8rem;
    font-weight: bold;
    color: #171619;
    margin-bottom: 0.5rem;
  }

  & input {
    margin-bottom: 0.5rem;
  }
`;

const Container = styled.div`
  width: 80vw;
  height: 40vw;
  background-color: #4d4d53;
  padding: 1rem;
  display: flex;
`;

const GifCanvas = styled.canvas`
  display: ${({ buffering }) => (buffering ? 'none' : 'block')};
  width: ${({ dimensions }) => dimensions?.width || 0}px;
  height: ${({ dimensions }) => dimensions?.height || 0}px;
  border: none;
  image-rendering: pixelated;
  cursor: move;
`;

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

function ImportGif({ rawGifData, onClose }) {
  const [state, dispatch] = React.useContext(StoreContext);
  const { rows, columns } = state.size;
  const [imageController, setImageController] = React.useState(
    new ImportImageController(),
  );
  const [canvasDimensions, setCanvasDimensions] = React.useState();

  const [filter, setFilter] = React.useState('lanczos2');
  const [rotation, setRotation] = React.useState(0);
  const [imageWidth, setImageWidth] = React.useState(0);
  const [imageHeight, setImageHeight] = React.useState(0);

  const container = React.useRef(null);

  const handleConfirm = useCallback(async () => {
    const gif = parseGIF(new Uint8Array(rawGifData));
    const frames = decompressFrames(gif, true);

    console.debug(`🔐 Decoded gif`, gif);

    const gifFramesController = new GifFramesController(gif, frames);

    let finished = false;
    while (!finished) {
      await delay(16);
      const frame = await gifFramesController.getNextFrameData();
      if (!frame) {
        finished = true;
      } else {
        await imageController.setImageData(
          frame.data,
          frame.width,
          frame.height,
        );
        const { data: imageData } = imageController.getCurrentImage();
        imageController.draw(true);
        dispatch(importImageAction(imageData));
      }
    }

    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose, imageController, rawGifData]);

  const handleCancel = useCallback(() => {
    if (typeof onClose === 'function') {
      onClose();
    }
  }, [onClose]);

  const handleChangeFilter = useCallback(
    (e) => {
      setFilter(e.target.value);
    },
    [setFilter],
  );

  const handleChangeRotation = useCallback(
    (e) => {
      const newRotation = Number(e.target.value);
      setRotation(Number(e.target.value));
      imageController.rotation = newRotation;
      imageController.rotateImage();
    },
    [imageController, setRotation],
  );

  const handleChangeImageWidth = useCallback(
    (event) => {
      setImageWidth(Number(event.target.value));
    },
    [setImageWidth],
  );

  const handleChangeImageHeight = useCallback(
    (event) => {
      setImageHeight(Number(event.target.value));
    },
    [setImageHeight],
  );

  const handleCenter = useCallback(() => {
    imageController.setImageLocationX(
      -(imageController.imageSizeX / 2) + columns,
    );
    imageController.setImageLocationY(-(imageController.imageSizeY / 2) + rows);
  }, [imageController, columns, rows]);

  const resizeImage = useCallback(
    debounce((...args) => {
      if (!imageController) {
        return;
      }
      imageController.resizeImage(...args);
    }, 1000),
    [imageController],
  );

  const initializeImageController = useCallback(
    async (...args) => {
      const importGifController = new ImportImageController(...args);
      setImageController(importGifController);
      setImageWidth(importGifController.imageData.width);
      setImageHeight(importGifController.imageData.height);
      await importGifController.initialize();
    },
    [setImageController, setImageWidth, setImageHeight],
  );

  useEffect(() => {
    // Use debounced resizeImage function
    resizeImage(imageWidth, imageHeight, filter);
  }, [imageWidth, imageHeight, filter, resizeImage]);

  useEffect(() => {
    const gif = parseGIF(new Uint8Array(rawGifData));
    const frames = decompressFrames(gif, true);
    const {
      patch: data,
      dims: { width, height },
    } = frames[0];
    initializeImageController(data, width, height, rows, columns);
  }, [rawGifData, rows, columns, initializeImageController]);

  useEffect(() => {
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
          setCanvasDimensions({
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
  }, [container, setCanvasDimensions, state.size]);

  return (
    <Container>
      <ImageContainer ref={container}>
        <GifCanvas
          width={columns * 2}
          height={rows * 2}
          dimensions={canvasDimensions}
          id="gifCanvas"
        />
      </ImageContainer>
      <ControlsContainer>
        <p>Image size</p>
        <span>
          Original w:{imageController?.imageData?.width || 0}, h:
          {imageController?.imageData?.height || 0}
        </span>
        <Label htmlFor="width">Width</Label>
        <input
          type="number"
          id="width"
          onChange={handleChangeImageWidth}
          value={imageWidth}
        />
        <Label htmlFor="height">Height</Label>
        <input
          type="number"
          id="height"
          onChange={handleChangeImageHeight}
          value={imageHeight}
        />
        <p>Image rotation</p>
        <select
          name="rotation"
          id="rotation"
          onChange={handleChangeRotation}
          value={rotation}
        >
          <option value="0">0&#176;</option>
          <option value="1">90&#176;</option>
          <option value="2">180&#176;</option>
          <option value="3">270&#176;</option>
        </select>
        <p>Compression filter</p>
        <select
          name="filter"
          id="filter"
          onChange={handleChangeFilter}
          value={filter}
        >
          <option value="box">Nearest neighbor</option>
          <option value="hamming">Hamming</option>
          <option value="lanczos2">Lanczos, win = 2</option>
          <option value="lanczos3">Lanczos, win = 3</option>
          <option value="mks2013">Magic Kernel Sharp 2013, win = 2.5</option>
        </select>
        <Button className="small" onClick={handleCenter}>
          Center image
        </Button>
        <Button className="small" onClick={handleConfirm}>
          Confirm
        </Button>
        <Button className="small" onClick={handleCancel}>
          Cancel
        </Button>
      </ControlsContainer>
    </Container>
  );
}

export default ImportGif;
