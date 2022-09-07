/* eslint-disable react/jsx-no-constructed-context-values */
import './app.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { defaultTheme, Provider } from '@adobe/react-spectrum';

import StoreContext from './store/context';
import pixelAnimatorReducer, { initialState } from './store/reducer';
import V2 from './v2';
import V1 from './v1';

function App() {
  const [state, dispatch] = React.useReducer(
    pixelAnimatorReducer,
    initialState,
  );

  return (
    <Provider theme={defaultTheme} colorScheme="light">
      <StoreContext.Provider value={[state, dispatch]}>
        <BrowserRouter>
          <Routes>
            <Route path="*" element={<V1 />} />
            <Route path="v2" element={<V2 />} />
          </Routes>
        </BrowserRouter>
      </StoreContext.Provider>
    </Provider>
  );
}

export default App;
