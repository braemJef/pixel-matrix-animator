/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import Pica from 'pica';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { debounce, throttle } from 'lodash';
import { convertGif } from '../../utils/importGif';
import StoreContext from '../../store/context';

const pica = new Pica();

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

const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
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

let lastSeenAtX;
let lastSeenAtY;

let panningX = 0;
let panningY = 0;

let locationX = 0;
let locationY = 0;

let bitmapImage;

function ImportGif({ rawGifData, onCancel }) {
  const [state] = React.useContext(StoreContext);
  const { rows, columns } = state.size;

  const [loading, setLoading] = React.useState(true);
  const [canvasDimensions, setCanvasDimensions] = React.useState();
  const [originalImageData, setOriginalImageData] = React.useState();
  const [filter, setFilter] = React.useState('lanczos2');
  const [mouseDown, setMouseDown] = React.useState(false);
  const [originalImageSize, setOriginalImageSize] = React.useState({
    w: 0,
    h: 0,
  });
  const [targetImageSize, setTargetImageSize] = React.useState({
    w: 0,
    h: 0,
  });

  const container = React.useRef(null);

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  const drawBackground = (ctx, canvas) => {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const drawBorderRectangle = (ctx) => {
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeRect(columns / 2 - 0.5, rows / 2 - 0.5, columns + 1, rows + 1);
  };

  const draw = (bitmap) => {
    const canvasElement = document.getElementById('gifCanvas');
    const ctx = canvasElement.getContext('2d');

    // First draw background
    drawBackground(ctx, canvasElement);

    // Draw the gif we are importing
    const bm = bitmap || bitmapImage;
    if (bm) {
      ctx.drawImage(bm, locationX, locationY, bm.width, bm.height);
    }

    // Finally draw rectangle overlay
    drawBorderRectangle(ctx, canvasElement);
  };

  const handleChangeTargetImageSize = useCallback(
    (event) => {
      if (event.target.id === 'width') {
        setTargetImageSize((prev) => ({
          ...prev,
          w: Number(event.target.value),
        }));
      } else {
        setTargetImageSize((prev) => ({
          ...prev,
          h: Number(event.target.value),
        }));
      }
    },
    [setTargetImageSize],
  );

  const updateImageSize = useCallback(
    debounce(async (originalData, newSize, originalSize) => {
      if (newSize.h === originalSize.h && newSize.w === originalSize.w) {
        return;
      }
      const resizedData = await pica.resizeBuffer({
        src: originalData,
        width: originalSize.w,
        height: originalSize.h,
        toWidth: newSize.w,
        toHeight: newSize.h,
        filter,
      });
      const imageData = new ImageData(
        Uint8ClampedArray.from(resizedData),
        newSize.w,
        newSize.h,
      );
      const bitmap = await createImageBitmap(imageData);
      bitmapImage = bitmap;
      draw(bitmap);
    }, 1000),
    [filter],
  );

  const initGif = useCallback(async () => {
    setLoading(true);
    const result = await convertGif(rawGifData);
    const {
      patch: data,
      dims: { width, height },
    } = result[0];
    setOriginalImageSize({ w: width, h: height });
    setTargetImageSize({ w: width, h: height });
    const imageData = new ImageData(data, width, height);
    const bitmap = await createImageBitmap(imageData);
    setOriginalImageData(data);
    bitmapImage = bitmap;
    draw(bitmap);
    setLoading(false);
  }, [rawGifData, setLoading, setOriginalImageData, setTargetImageSize]);

  const handleChangeImageLocation = useCallback(
    throttle(() => {
      let movementX;
      let movementY;

      if (panningX > 0) {
        movementX = Math.floor(panningX / 10);
      } else {
        movementX = Math.ceil(panningX / 10);
      }
      if (panningY > 0) {
        movementY = Math.floor(panningY / 10);
      } else {
        movementY = Math.ceil(panningY / 10);
      }

      if (movementX > 1 || movementX < -1) {
        locationX += movementX;
        panningX = 0;
      }
      if (movementY > 1 || movementY < -1) {
        locationY += movementY;
        panningY = 0;
      }

      draw();
    }, 32),
    [],
  );

  const handleCenter = () => {
    locationX = -(targetImageSize.w / 2) + columns;
    locationY = -(targetImageSize.h / 2) + rows;
    draw();
  };

  const handleChangeFilter = async (e) => {
    setFilter(e.target.value);
    setLoading(true);
    await updateImageSize(
      originalImageData,
      targetImageSize,
      originalImageSize,
    );
    setLoading(false);
  };

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setMouseDown(true);

      const { clientX, clientY } = e;

      lastSeenAtX = clientX;
      lastSeenAtY = clientY;
    },
    [setMouseDown],
  );
  const handleMouseUp = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      setMouseDown(false);

      lastSeenAtX = -1;
      lastSeenAtY = -1;
    },
    [setMouseDown],
  );
  const handleMouseOut = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setMouseDown(false);
    },
    [setMouseDown],
  );
  const handleMouseMove = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!mouseDown) {
        return;
      }
      if (lastSeenAtX === -1 || lastSeenAtY === -1) {
        return;
      }
      const { clientX, clientY } = e;

      const deltaX = lastSeenAtX - clientX;
      const deltaY = lastSeenAtY - clientY;

      lastSeenAtX = clientX;
      lastSeenAtY = clientY;

      panningX += deltaX;
      panningY += deltaY;

      handleChangeImageLocation();
    },
    [mouseDown, handleChangeImageLocation],
  );

  useEffect(() => {
    if (!originalImageData) {
      return;
    }
    updateImageSize(originalImageData, targetImageSize, originalImageSize);
  }, [targetImageSize, originalImageSize, originalImageData]);

  useEffect(() => {
    initGif();
  }, [rawGifData]);

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

  useEffect(() => {
    const canvasElement = document.getElementById('gifCanvas');
    canvasElement.addEventListener('mousedown', handleMouseDown);
    canvasElement.addEventListener('mouseup', handleMouseUp);
    canvasElement.addEventListener('mousemove', handleMouseMove);
    canvasElement.addEventListener('mouseout', handleMouseOut);

    return () => {
      canvasElement.removeEventListener('mousedown', handleMouseDown);
      canvasElement.removeEventListener('mouseup', handleMouseUp);
      canvasElement.removeEventListener('mousemove', handleMouseMove);
      canvasElement.removeEventListener('mouseout', handleMouseOut);
    };
  }, [handleMouseDown, handleMouseUp, handleMouseMove]);

  return (
    <Container>
      <ImageContainer ref={container}>
        <GifCanvas
          width={columns * 2}
          height={rows * 2}
          dimensions={canvasDimensions}
          buffering={loading}
          id="gifCanvas"
        />
        {loading && (
          <LoadingContainer>
            <FontAwesomeIcon pulse size="5x" color="white" icon={faSpinner} />
          </LoadingContainer>
        )}
      </ImageContainer>
      <ControlsContainer>
        <p>Image size</p>
        <span>
          Original w:{originalImageSize.w}, h:{originalImageSize.h}
        </span>
        <Label htmlFor="width">Width</Label>
        <input
          type="number"
          id="width"
          onChange={handleChangeTargetImageSize}
          value={targetImageSize.w}
        />
        <Label htmlFor="height">Height</Label>
        <input
          type="number"
          id="height"
          onChange={handleChangeTargetImageSize}
          value={targetImageSize.h}
        />
        <p>Compression filter</p>
        <select
          name="filter"
          id="filter"
          value={filter}
          onChange={handleChangeFilter}
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
        <Button className="small">Confirm</Button>
        <Button className="small" onClick={handleCancel}>
          Cancel
        </Button>
      </ControlsContainer>
    </Container>
  );
}

export default ImportGif;
