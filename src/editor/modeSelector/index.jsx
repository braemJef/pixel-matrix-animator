import React from 'react';
import styled from 'styled-components';

import StoreContext from '../../store/context';
import {
  setFadePercentageAction,
  setFpsAction,
  setMatrixSizeAction,
  setModeAction,
  setNameAction,
} from '../../store/actions';

const Container = styled.div`
  height: 4rem;
  padding: 1rem 0 1rem 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  border: none;
  height: 2rem;
  min-height: 2rem;
  background-color: ${({ active }) => (active ? '#4442FC' : '#171619')};
  border-radius: 0.25rem;
  color: white;
  padding: 0 1rem;

  &:hover {
    background-color: ${({ active }) => (active ? '#4442FC' : '#6664FD')};
  }
`;

const InputButton = styled(Button)`
  padding: 0 1rem;
`;

const InputLabel = styled.label`
  border: none;
  height: 2rem;
  min-height: 2rem;
  background-color: #171619;
  border-radius: 0.25rem;
  color: white;
  padding: 0 1rem;
`;

const InputField = styled.input`
  height: 2rem;
  background-color: transparent;
  border: none;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  color: white;
  flex: 1;
  width: 2rem;
  margin: 0 0.25rem;
  text-align: right;

  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  &[type='text'] {
    width: 6rem;
  }
  &:nth-child(2) {
    text-align: left;
  }
`;

function ModeSelector() {
  const [state, dispatch] = React.useContext(StoreContext);

  const handleClick = (mode) => {
    dispatch(setModeAction(mode));
  };

  const handleChangeFadePercentage = React.useCallback(
    (event) => {
      const value = Number(event.target.value);
      if (value <= 100 && value >= 0) {
        dispatch(setFadePercentageAction(value));
      }
    },
    [dispatch],
  );

  const handleChangeFps = React.useCallback(
    (event) => {
      const value = Number(event.target.value);
      if (value <= 60 && value >= 0) {
        dispatch(setFpsAction(value));
      }
    },
    [dispatch],
  );

  const handleChangeSizeRows = React.useCallback(
    (event) => {
      const value = Number(event.target.value);
      if (value <= 64 && value >= 0) {
        dispatch(setMatrixSizeAction(value, state.size.columns));
      }
    },
    [dispatch, state.size.columns],
  );

  const handleChangeSizeColumns = React.useCallback(
    (event) => {
      const value = Number(event.target.value);
      if (value <= 64 && value >= 0) {
        dispatch(setMatrixSizeAction(state.size.rows, value));
      }
    },
    [dispatch, state.size.rows],
  );

  const handleChangeName = React.useCallback(
    (event) => {
      if (event.target.value.length >= 0 && event.target.value.length <= 8) {
        dispatch(setNameAction(event.target.value));
      }
    },
    [dispatch],
  );

  return (
    <Container>
      <InputLabel>
        Name
        <InputField
          type="text"
          onChange={handleChangeName}
          value={state.name}
        />
      </InputLabel>
      <InputLabel>
        Size
        <InputField
          type="number"
          onChange={handleChangeSizeRows}
          value={state.size.rows}
        />
        x
        <InputField
          type="number"
          onChange={handleChangeSizeColumns}
          value={state.size.columns}
        />
      </InputLabel>
      <InputLabel>
        Fps
        <InputField
          type="number"
          onChange={handleChangeFps}
          value={state.fps}
        />
      </InputLabel>
      <InputButton
        active={state.mode === 'fade'}
        onClick={() => handleClick('fade')}
      >
        Fade
        <InputField
          type="number"
          onChange={handleChangeFadePercentage}
          value={state.modeConfig.fadePercentage}
        />
        %
      </InputButton>
      <Button
        active={state.mode === 'retain'}
        onClick={() => handleClick('retain')}
      >
        Retain
      </Button>
      <Button
        active={state.mode === 'replace'}
        onClick={() => handleClick('replace')}
      >
        Replace
      </Button>
    </Container>
  );
}

export default ModeSelector;
