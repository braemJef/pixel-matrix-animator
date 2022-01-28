import { faEyeDropper } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

import { setDrawModeAction } from '../../store/actions';
import StoreContext from '../../store/context';
import Button from './Button';

const Dropdown = styled.div`
  position: relative;

  &:hover .dropdown-content {
    display: flex;
  }
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  z-index: 1;
  bottom: 3rem;
  flex-direction: column;
  padding: 0 0 0.25rem;
  gap: 0.25rem;
  width: 100%;
  align-items: center;
`;

const Color = styled.button`
  background-color: ${({ color }) => color};
  border: 1px solid white;
  border-radius: 0.25rem;
  width: 3rem;
  height: 3rem;

  & .inverse-color {
    mix-blend-mode: difference;
  }
`;

const ColorText = styled.p`
  color: white;
  font-size: 0.6rem;
`;

function ColorPicker({ onChangeColor }) {
  const [state, dispatch] = React.useContext(StoreContext);

  const handleChangeDrawMode = (drawMode) => {
    dispatch(setDrawModeAction(drawMode));
  };

  return (
    <Dropdown>
      <Color
        title="color picker"
        onClick={onChangeColor}
        color={state.color.hex}
      >
        {state.drawMode === 'eyeDropper' ? (
          <FontAwesomeIcon
            className="inverse-color"
            color="white"
            icon={faEyeDropper}
          />
        ) : (
          <ColorText className="inverse-color">{state.color.hex}</ColorText>
        )}
      </Color>
      <DropdownContent className="dropdown-content">
        {state.drawMode !== 'eyeDropper' && (
          <Button
            title="eye dropper"
            className="small"
            onClick={() => handleChangeDrawMode('eyeDropper')}
          >
            <FontAwesomeIcon icon={faEyeDropper} />
          </Button>
        )}
      </DropdownContent>
    </Dropdown>
  );
}

export default ColorPicker;
