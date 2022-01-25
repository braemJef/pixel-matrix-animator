import { faEraser, faFileDownload, faFileUpload, faPencilAlt, faPlay, faRulerHorizontal, faRulerVertical, faUndo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { PhotoshopPicker } from "react-color";

import PixelAnimatorContext from '../PixelAnimatorContext';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Color = styled.button`
  background-color: ${({ color }) => color};
  border: 1px solid white;
  border-radius: 0.25rem;
  width: 3vw;
  height: 3vw;
`;

const ColorText = styled.p`
  color: white;
  mix-blend-mode: difference;
  font-size: 0.6vw;
`;

const Button = styled.button`
  border-radius: 0.25rem;
  width: 3vw;
  height: 3vw;
  font-size: 1.25vw;
  border: none;

  background-color: transparent;
  border: none;
  padding: 0;
  background-color: ${({ active }) => active ? '#545353' : '#171619'};
  color: white;

  &:hover {
    background-color: ${({ active }) => active ? '#545353' : '#3A383C'};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  border-radius: 0.25rem;
  width: 3vw;
  height: 3vw;
  font-size: 1.25vw;
  border: none;

  background-color: transparent;
  border: none;
  padding: 0;
  background-color: ${({ active }) => active ? '#545353' : '#171619'};
  color: white;

  text-align: center;
  line-height: 3vw;

  &:hover {
    background-color: ${({ active }) => active ? '#545353' : '#3A383C'};
  }
`;

const FloatingMiddle = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Toolbar() {
  const [state, dispatch] = React.useContext(PixelAnimatorContext);
  const [pickerColor, setPickerColor] = React.useState(state.color);
  const [showColorPicker, setShowColorPicker] = React.useState();

  const handleChangeColor = () => {
    setShowColorPicker(true);
  }

  const handleChangeColorComplete = (newColor) => {
    setPickerColor(newColor);
  }

  const handleAccept = () => {
    dispatch({ type: 'setColor', value: pickerColor });
    setShowColorPicker(false);
  }

  const handleCancel = () => {
    setPickerColor(state.color);
    setShowColorPicker(false);
  }

  const handleChangeDrawMode = (value) => {
    dispatch({ type: 'changeDrawMode', value });
  }

  const handleDownloadBackup = () => {
    var dataString = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      frames: state.frames.map(frame => ({
        data: frame.data,
        amount: frame.frameAmount,
        id: frame.frameId,
      })),
      mode: state.mode,
      size: state.size,
    }));
    var downloadElement = document.getElementById('downloadAnchorElem');
    downloadElement.setAttribute("href",dataString);
    downloadElement.setAttribute("download", "backup.json");
    downloadElement.click();
  }

  const handleFileLoad = (event) => {
    try {
      const state = JSON.parse(event.target.result);
      dispatch({ type: 'loadBackup', value: state });
    } catch(e) {
      console.error(e);
    }
  }

  const handleUploadBackup = (event) => {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
  }

  const handleNotImplemented = () => {
    alert('This does not work yet!');
  }

  return (
    <>
      <Container>
        <Color onClick={handleChangeColor} color={state.color.hex}>
          <ColorText>{state.color.hex}</ColorText>
        </Color>
        <Button active={state.drawMode === 'pencil'} onClick={() => handleChangeDrawMode('pencil')}>
          <FontAwesomeIcon icon={faPencilAlt} />
        </Button>
        <Button active={state.drawMode === 'rulerHorizontal'} onClick={() => handleChangeDrawMode('rulerHorizontal')}>
          <FontAwesomeIcon icon={faRulerHorizontal} />
        </Button>
        <Button active={state.drawMode === 'rulerVertical'} onClick={() => handleChangeDrawMode('rulerVertical')}>
          <FontAwesomeIcon icon={faRulerVertical} />
        </Button>
        <Button active={state.drawMode === 'eraser'} onClick={handleNotImplemented}>
          <FontAwesomeIcon icon={faEraser} />
        </Button>
        <Button onClick={handleNotImplemented}>
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button onClick={handleNotImplemented}>
          <FontAwesomeIcon icon={faPlay} />
        </Button>
        <Button onClick={handleDownloadBackup}>
          <FontAwesomeIcon icon={faFileDownload} />
        </Button>
        <FileInputLabel htmlFor="upload-backup">
          <FontAwesomeIcon icon={faFileUpload} />
        </FileInputLabel>
        <FileInput type="file" id="upload-backup" onChange={handleUploadBackup} />
      </Container>
      {showColorPicker && (
        <FloatingMiddle>
          <PhotoshopPicker
            onChangeComplete={handleChangeColorComplete}
            onAccept={handleAccept}
            onCancel={handleCancel}
            color={pickerColor}
          />
        </FloatingMiddle>
      )}
    </>
  )
}

export default Toolbar;