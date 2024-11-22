import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import './index.css';
import { initializeDefaultSet } from './db';

// Initialize IndexedDB and add default set before rendering
initializeDefaultSet().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  );
});