import { View } from '@adobe/react-spectrum';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import CanvasController from './CanvasController';

const CANVAS_NAME = 'MAIN_DRAWING_BOARD';

const StyledCanvas = styled.canvas`
  position: absolute;
`;

function Canvas() {
  const [canvasController] = useState(new CanvasController(CANVAS_NAME));

  const initializeCanvas = useCallback(async () => {
    await canvasController.initialize();
    console.log('register onMousedown event');
    canvasController.onMousedown((event) => {
      console.log('onMousedown', event);
    });
  }, [canvasController]);

  useEffect(() => {
    return () => {
      canvasController.cleanup();
    };
  }, [canvasController]);

  useEffect(() => {
    initializeCanvas();
  }, []);

  return (
    <View height="100%" width="100%">
      <StyledCanvas id={CANVAS_NAME} />
    </View>
  );
}

export default Canvas;
