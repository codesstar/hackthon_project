import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // This will be for Tailwind CSS
import App from './App'; // Import your App component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);