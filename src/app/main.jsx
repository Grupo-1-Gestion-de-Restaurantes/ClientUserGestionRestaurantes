import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import '../styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  // En producción está perfecto el StrictMode, pero ten en cuenta que en Desarrollo (localhost) 
  // hace que los UseEffect se ejecuten 2 veces. Las animaciones de GSAP podrían requerir cleanup.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);