import React from 'react';

import PixelAnimator from "./PixelAnimator";
import PixelAnimatorContext from "./PixelAnimator/PixelAnimatorContext";

import './app.css';
import PixelAnimatorReducer, { pixelAnimatorReducerInitialState } from './PixelAnimator/PixelAnimatorReducer';

function App() {
  const [state, dispatch] = React.useReducer(PixelAnimatorReducer, pixelAnimatorReducerInitialState);

  return (
    <div className="App">
      <PixelAnimatorContext.Provider value={[ state, dispatch ]} >
        <PixelAnimator />
      </PixelAnimatorContext.Provider>
    </div>
  );
}

export default App;
