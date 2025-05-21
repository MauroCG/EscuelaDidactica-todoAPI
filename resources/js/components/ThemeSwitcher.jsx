import React from 'react';
import { useTheme }
from '../context/ThemeContext'; // Adjusted path

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 text-sm font-medium rounded-lg shadow-sm 
                 text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 
                 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-600
                 dark:focus:ring-offset-slate-800
                 transition-all duration-200 ease-in-out" // Added transition classes & updated palette
    >
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeSwitcher;
