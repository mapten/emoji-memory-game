import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { ignoreAnimationIterationListeners } from './utils/dom.utils';

const container = document.getElementById('root')!;
// Keeps the animated backgrounds off the main thread (see the function for details).
ignoreAnimationIterationListeners(container);

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
