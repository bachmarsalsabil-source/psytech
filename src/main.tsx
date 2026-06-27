import { StrictMode, createElement } from 'react';
// @ts-ignore: module declaration missing for react-dom/client
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// @ts-ignore: CSS module declaration missing
import './index.css';

createRoot(document.getElementById('root')!).render(
  createElement(
    StrictMode,
    null,
    createElement(App, null),
  ),
);
