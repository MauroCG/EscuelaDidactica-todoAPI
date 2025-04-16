import './bootstrap';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './components/Main'; // Example: Your root React component

// Find the root element defined in your Blade file
const container = document.getElementById('app');

if (container) {
    // Create a root and render your main React component
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <Main />
        </React.StrictMode>
    );
} else {
    console.error("Could not find root element with id 'app'");
}