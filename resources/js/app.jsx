import './bootstrap'; // Laravel's bootstrap

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App'; // Import the main App component

const container = document.getElementById('app');

if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Target container 'app' not found in the DOM.");
}
