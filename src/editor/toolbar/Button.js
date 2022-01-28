import styled from 'styled-components';

const Button = styled.button`
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

  &.small {
    width: 2rem;
    height: 2rem;
    font-size: 1rem;
  }

  &:hover {
    background-color: ${({ active }) => (active ? '#545353' : '#3A383C')};
  }
`;

export default Button;
