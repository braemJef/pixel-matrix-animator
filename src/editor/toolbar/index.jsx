import {
  faEraser,
  faFileDownload,
  faFileUpload,
  faPencilAlt,
  faPlay,
  faRulerHorizontal,
  faRulerVertical,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';
import { PhotoshopPicker } from 'react-color';

import StoreContext from '../../store/context';
import {
  loadBackupAction,
  setColorAction,
  setDrawModeAction,
  undoFrameStepAction,
} from '../../store/actions';
import Preview from '../preview';

const Container = styled.div`
  width: 10rem;
  gap: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  background-color: ${({ active }) => (active ? '#545353' : '#171619')};
  color: white;

  &:hover {
    background-color: ${({ active }) => (active ? '#545353' : '#3A383C')};
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
  background-color: ${({ active }) => (active ? '#545353' : '#171619')};
  color: white;

  text-align: center;
  line-height: 3vw;

  &:hover {
    background-color: ${({ active }) => (active ? '#545353' : '#3A383C')};
  }
`;

const FloatingMiddle = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Toolbar() {
  const [state, dispatch] = React.useContext(StoreContext);
  const [pickerColor, setPickerColor] = React.useState(state.color);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [showPreview, setShowPreview] = React.useState(false);
  const [renderFileInput, setRenderFileInput] = React.useState(true);

  const handleChangeColor = () => {
    setShowColorPicker(true);
  };

  const handleChangeColorComplete = (newColor) => {
    setPickerColor(newColor);
  };

  const handleAccept = () => {
    dispatch(setColorAction(pickerColor));
    setShowColorPicker(false);
  };

  const handleCancel = () => {
    setPickerColor(state.color);
    setShowColorPicker(false);
  };

  const handleChangeDrawMode = (drawMode) => {
    dispatch(setDrawModeAction(drawMode));
  };

  const handleUndo = () => {
    dispatch(undoFrameStepAction());
  };

  const handleShowPreview = () => {
    setShowPreview(true);
  };

  const handleDownloadBackup = () => {
    const dataString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify({
        frames: state.frames.map((frame) => ({
          data: frame.data,
          repeat: frame.repeat,
          id: frame.id,
        })),
        mode: state.mode,
        size: state.size,
      }),
    )}`;
    const downloadElement = document.getElementById('downloadAnchorElem');
    downloadElement.setAttribute('href', dataString);
    downloadElement.setAttribute('download', 'backup.json');
    downloadElement.click();
  };

  const handleFileLoad = (event) => {
    try {
      const fileContent = JSON.parse(event.target.result);
      dispatch(loadBackupAction(fileContent));
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    } finally {
      // Very hacky way to reset the file input field
      setRenderFileInput(false);
      setRenderFileInput(true);
    }
  };

  const handleUploadBackup = (event) => {
    const reader = new FileReader();
    reader.onload = handleFileLoad;
    reader.readAsText(event.target.files[0]);
  };

  return (
    <>
      <Container>
        <Color onClick={handleChangeColor} color={state.color.hex}>
          <ColorText>{state.color.hex}</ColorText>
        </Color>
        <Button
          active={state.drawMode === 'pencil'}
          onClick={() => handleChangeDrawMode('pencil')}
        >
          <FontAwesomeIcon icon={faPencilAlt} />
        </Button>
        <Button
          active={state.drawMode === 'rulerHorizontal'}
          onClick={() => handleChangeDrawMode('rulerHorizontal')}
        >
          <FontAwesomeIcon icon={faRulerHorizontal} />
        </Button>
        <Button
          active={state.drawMode === 'rulerVertical'}
          onClick={() => handleChangeDrawMode('rulerVertical')}
        >
          <FontAwesomeIcon icon={faRulerVertical} />
        </Button>
        <Button
          active={state.drawMode === 'eraser'}
          onClick={() => handleChangeDrawMode('eraser')}
        >
          <FontAwesomeIcon icon={faEraser} />
        </Button>
        <Button onClick={handleUndo}>
          <FontAwesomeIcon icon={faUndo} />
        </Button>
        <Button onClick={handleShowPreview}>
          <FontAwesomeIcon icon={faPlay} />
        </Button>
        <Button onClick={handleDownloadBackup}>
          <FontAwesomeIcon icon={faFileDownload} />
        </Button>
        {renderFileInput && (
          <>
            <FileInputLabel htmlFor="upload-backup">
              <FontAwesomeIcon icon={faFileUpload} />
            </FileInputLabel>
            <FileInput
              type="file"
              id="upload-backup"
              onChange={handleUploadBackup}
            />
          </>
        )}
      </Container>
      {showPreview && (
        <FloatingMiddle>
          <Preview />
        </FloatingMiddle>
      )}
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
  );
}

export default Toolbar;
