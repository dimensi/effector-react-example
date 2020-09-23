import React from 'react';
import {render} from 'react-dom';
import App from './App';
import {Router} from 'react-router-dom';
import {routerHistory} from './history';

const rootElement = document.getElementById('root');
render(
  <Router history={routerHistory}>
    <App />
  </Router>,
  rootElement,
);
