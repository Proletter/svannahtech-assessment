import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Get the root element
const container = document.getElementById('root');

// Ensure the container exists
if (!container) {
  throw new Error('Root element not found in the document');
}

// Create a root
const root = createRoot(container);

// Render the application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);