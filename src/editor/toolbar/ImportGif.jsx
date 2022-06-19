import React from 'react';
import styled from 'styled-components';

import { importGifAction } from '../../store/actions';
import StoreContext from '../../store/context';

const Text = styled.p`
  color: white;
  font-size: 1rem;
  font-weight: bold;
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
  line-height: 3rem;

  &:hover {
    background-color: ${({ active }) => (active ? '#545353' : '#3A383C')};
  }
`;

function ImportGif() {
  const [_, dispatch] = React.useContext(StoreContext);
  const [renderFileInput, setRenderFileInput] = React.useState(true);

  const handleFileLoad = (event) => {
    try {
      dispatch(importGifAction(event.target.result));
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
    const file = event.target.files[0];
    reader.onload = (e) => {
      handleFileLoad(e);
    };
    reader.readAsArrayBuffer(file);
  };

  if (!renderFileInput) {
    return null;
  }
  return (
    <>
      <FileInputLabel title="open" htmlFor="upload-backup">
        <Text>GIF</Text>
      </FileInputLabel>
      <FileInput type="file" id="upload-backup" onChange={handleUploadBackup} />
    </>
  );
}

export default ImportGif;
