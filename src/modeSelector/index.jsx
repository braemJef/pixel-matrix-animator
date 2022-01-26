import React from 'react';
import styled from 'styled-components';

import StoreContext from '../store/context';
import { setModeAction } from '../store/actions';

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
  padding: 0;
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

function ModeSelector() {
  const [state, dispatch] = React.useContext(StoreContext);

  const handleClick = (mode) => {
    dispatch(setModeAction(mode));
  };

  return (
    <Container>
      <Button
        active={state.mode === 'fade'}
        onClick={() => handleClick('fade')}
      >
        Fade
      </Button>
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
