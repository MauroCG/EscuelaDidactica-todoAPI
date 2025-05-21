import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider, useTheme } from '../../context/ThemeContext'; // Adjust path as needed
import ThemeSwitcher from '../ThemeSwitcher'; // Adjust path as needed

// Mock the ThemeContext for testing
const mockToggleTheme = jest.fn();
let currentTheme = 'light';

// Custom hook mock to be used by the component under test
jest.mock('../../context/ThemeContext', () => ({
    ...jest.requireActual('../../context/ThemeContext'), // Import and retain default exports
    useTheme: () => ({
        theme: currentTheme,
        toggleTheme: mockToggleTheme,
    }),
}));

// Helper function to render ThemeSwitcher with a specific theme
const renderThemeSwitcher = (theme) => {
    currentTheme = theme;
    return render(
        // No need to wrap with ThemeProvider here since useTheme is directly mocked
        <ThemeSwitcher />
    );
};

describe('ThemeSwitcher', () => {
    beforeEach(() => {
        // Reset mocks before each test
        mockToggleTheme.mockClear();
    });

    test('renders correctly and displays initial theme (light)', () => {
        renderThemeSwitcher('light');
        expect(screen.getByRole('button', { name: /Switch to Dark Mode/i })).toBeInTheDocument();
    });

    test('renders correctly and displays initial theme (dark)', () => {
        renderThemeSwitcher('dark');
        expect(screen.getByRole('button', { name: /Switch to Light Mode/i })).toBeInTheDocument();
    });

    test('calls toggleTheme when clicked (light to dark)', () => {
        renderThemeSwitcher('light');
        const button = screen.getByRole('button', { name: /Switch to Dark Mode/i });
        fireEvent.click(button);
        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('calls toggleTheme when clicked (dark to light)', () => {
        renderThemeSwitcher('dark');
        const button = screen.getByRole('button', { name: /Switch to Light Mode/i });
        fireEvent.click(button);
        expect(mockToggleTheme).toHaveBeenCalledTimes(1);
    });

    test('displays correct text based on theme prop', () => {
        const { rerender } = renderThemeSwitcher('light');
        expect(screen.getByRole('button')).toHaveTextContent('Switch to Dark Mode');

        // Update theme and rerender (simulating theme change)
        currentTheme = 'dark';
        rerender(<ThemeSwitcher />); // Rerender with the same component instance
        expect(screen.getByRole('button')).toHaveTextContent('Switch to Light Mode');
    });
});
