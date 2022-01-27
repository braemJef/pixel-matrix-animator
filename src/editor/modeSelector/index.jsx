import React from 'react';
import styled from 'styled-components';

import StoreContext from '../../store/context';
import { setFadePercentage, setModeAction } from '../../store/actions';

const Container = styled.div`
  height: 4rem;
  padding: 1rem 0 1rem 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const Button = styled.button`
  background-color: transparent;
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
  padding: 0 0 0 1rem;
`;

const InputField = styled.input`
  height: 2rem;
  background-color: transparent;
  border: none;
  border-top-right-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  color: white;
  flex: 1;
  width: 4rem;
  padding: 0 1rem;

  &[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
`;

function ModeSelector() {
  const [state, dispatch] = React.useContext(StoreContext);

  const handleClick = (mode) => {
    dispatch(setModeAction(mode));
  };

  const handleChangeFadePercentage = React.useCallback(
    (event) => {
      dispatch(setFadePercentage(event.target.value));
    },
    [dispatch],
  );

  return (
    <Container>
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
