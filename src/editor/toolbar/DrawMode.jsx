import {
  faPencilAlt,
  faRulerHorizontal,
  faRulerVertical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
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

const drawModeIcons = {
  pencil: faPencilAlt,
  rulerHorizontal: faRulerHorizontal,
  rulerVertical: faRulerVertical,
};

const drawModeTitles = {
  pencil: 'pencil',
  rulerHorizontal: 'horizontal line',
  rulerVertical: 'vertical line',
};

const DRAW_MODES = ['pencil', 'rulerHorizontal', 'rulerVertical'];

function DrawMode() {
  const [state, dispatch] = React.useContext(StoreContext);
  const [latestDrawMode, setLatestDrawMode] = React.useState('pencil');

  const handleChangeDrawMode = (drawMode) => {
    dispatch(setDrawModeAction(drawMode));
  };

  useEffect(() => {
    if (DRAW_MODES.includes(state.drawMode)) {
      setLatestDrawMode(state.drawMode);
    }
  }, [state.drawMode, setLatestDrawMode]);

  const drawModeList = DRAW_MODES.filter((dm) => dm !== latestDrawMode);
  return (
    <Dropdown>
      <Button
        title={drawModeTitles[latestDrawMode]}
        active={state.drawMode === latestDrawMode}
        onClick={() => handleChangeDrawMode(latestDrawMode)}
      >
        <FontAwesomeIcon icon={drawModeIcons[latestDrawMode]} />
      </Button>
      <DropdownContent className="dropdown-content">
        {drawModeList.map((mode) => (
          <Button
            key={mode}
            title={drawModeTitles[mode]}
            className="small"
            onClick={() => handleChangeDrawMode(mode)}
          >
            <FontAwesomeIcon icon={drawModeIcons[mode]} />
          </Button>
        ))}
      </DropdownContent>
    </Dropdown>
  );
}

export default DrawMode;
