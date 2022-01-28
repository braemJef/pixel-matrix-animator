import {
  faEraser,
  faFileExport,
  faFolderOpen,
  faPlay,
  faSave,
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
import downloadAnimationAsJson from '../../utils/downloadAnimationAsJson';
import downloadAnimationAsBinary from '../../utils/downloadAnimationAsBinary';
import Button from './Button';
import DrawMode from './DrawMode';
import ColorPicker from './ColorPicker';

const Container = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const LeftGroup = styled.div`
  gap: 0.5rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 13.5rem;
`;

const ColorText = styled.p`
  color: white;
  mix-blend-mode: difference;
  font-size: 0.8rem;
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

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  border-radius: 0.25rem;
  width: 3rem;
  height: 3rem;
  font-size: 1.6rem;
  border: none;

  background-color: transparent;
  border: none;
  padding: 0;
  background-color: ${({ active }) => (active ? '#545353' : '#171619')};
  color: white;

  text-align: center;
  line-height: 4rem;

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

function Toolbar({ onTogglePreview }) {
  const [state, dispatch] = React.useContext(StoreContext);
  const [pickerColor, setPickerColor] = React.useState(state.color);
  const [showColorPicker, setShowColorPicker] = React.useState(false);
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

  const handleUndo = () => {
    dispatch(undoFrameStepAction());
  };

  const handleDownloadBackup = () => {
    downloadAnimationAsJson(state);
  };

  const handleDownloadExport = () => {
    downloadAnimationAsBinary(state);
  };

  const handleChangeDrawMode = (drawMode) => {
    dispatch(setDrawModeAction(drawMode));
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
        <LeftGroup>
          <ColorPicker onChangeColor={handleChangeColor} />
          <DrawMode />
          <Button
            title="eraser"
            active={state.drawMode === 'eraser'}
            onClick={() => handleChangeDrawMode('eraser')}
          >
            <FontAwesomeIcon icon={faEraser} />
          </Button>
          <Button title="undo" onClick={handleUndo}>
            <FontAwesomeIcon icon={faUndo} />
          </Button>
          <Button title="preview animation" onClick={onTogglePreview}>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
          <Button title="save" onClick={handleDownloadBackup}>
            <FontAwesomeIcon icon={faSave} />
          </Button>
          {renderFileInput && (
            <>
              <FileInputLabel title="open" htmlFor="upload-backup">
                <FontAwesomeIcon icon={faFolderOpen} />
              </FileInputLabel>
              <FileInput
                type="file"
                id="upload-backup"
                onChange={handleUploadBackup}
              />
            </>
          )}
          <Button title="export" onClick={handleDownloadExport}>
            <FontAwesomeIcon icon={faFileExport} />
          </Button>
        </LeftGroup>
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
  );
}

export default Toolbar;
