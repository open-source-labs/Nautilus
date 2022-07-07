/**
 * ************************************
 *
 * @module  index.tsx
 * @author Joshua Nordstrom edited by Jordan Long
 * @date 3/7/20 edited: (6/16/2022)
 * @description entry point for application.  Hangs React app off of #root in index.html
 * App.tsx is the main child of this 
 *
 * ************************************
 */

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { D3State } from '../renderer/App.d';
import store from '../store';

// IMPORT STYLES
import './styles/app.scss';

if (module.hot) {
  module.hot.accept();
}
//boilerplate code for setting up D3 in TS
declare global {
  interface Window { //defining that 'Window' is an object with a property, d3State which is based on the D3State object literal defined in App.d.ts
    d3State: D3State; 
  }
}

//boilerplate code for setting up react app
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app'),
);
