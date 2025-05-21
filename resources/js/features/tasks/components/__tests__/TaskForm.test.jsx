import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskForm from '../TaskForm'; // Adjust path as needed

describe('TaskForm', () => {
    const mockOnSubmit = jest.fn();
    const defaultProps = {
        onSubmit: mockOnSubmit,
        error: null,
        isLoading: false,
    };

    beforeEach(() => {
        mockOnSubmit.mockClear();
        // Mock onSubmit to resolve successfully for testing form clearing
        mockOnSubmit.mockImplementation(() => Promise.resolve());
    });

    test('renders the form title, input field, and button', () => {
        render(<TaskForm {...defaultProps} />);
        expect(screen.getByRole('heading', { name: /Agregar Nueva Tarea/i })).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Descripción de la tarea.../i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Agregar Tarea/i })).toBeInTheDocument();
    });

    test('allows typing into the title input field', () => {
        render(<TaskForm {...defaultProps} />);
        const titleInput = screen.getByPlaceholderText(/Descripción de la tarea.../i);
        fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
        expect(titleInput).toHaveValue('New Task Title');
    });

    test('calls onSubmit with form data and clears field on successful submission', async () => {
        render(<TaskForm {...defaultProps} />);
        const titleInput = screen.getByPlaceholderText(/Descripción de la tarea.../i);
        const submitButton = screen.getByRole('button', { name: /Agregar Tarea/i });

        fireEvent.change(titleInput, { target: { value: 'A Valid Task' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockOnSubmit).toHaveBeenCalledWith({ title: 'A Valid Task' });
        });
        
        expect(titleInput).toHaveValue('');
    });

    test('does not call onSubmit if title is empty', () => {
        render(<TaskForm {...defaultProps} />);
        const submitButton = screen.getByRole('button', { name: /Agregar Tarea/i });
        fireEvent.click(submitButton);
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('does not call onSubmit if title is only whitespace', () => {
        render(<TaskForm {...defaultProps} />);
        const titleInput = screen.getByPlaceholderText(/Descripción de la tarea.../i);
        const submitButton = screen.getByRole('button', { name: /Agregar Tarea/i });

        fireEvent.change(titleInput, { target: { value: '   ' } }); // Whitespace only
        fireEvent.click(submitButton);
        
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('displays error message when error prop is provided', () => {
        render(<TaskForm {...defaultProps} error="Failed to create task." />);
        expect(screen.getByText('Failed to create task.')).toBeInTheDocument();
    });

    test('does not display error message when error prop is null', () => {
        render(<TaskForm {...defaultProps} />);
        expect(screen.queryByText('Failed to create task.')).not.toBeInTheDocument();
    });

    test('disables submit button and shows loading text when isLoading is true', () => {
        render(<TaskForm {...defaultProps} isLoading={true} />);
        const submitButton = screen.getByRole('button', { name: /Agregando.../i });
        expect(submitButton).toBeDisabled();
    });

    test('enables submit button and shows normal text when isLoading is false', () => {
        render(<TaskForm {...defaultProps} isLoading={false} />);
        const submitButton = screen.getByRole('button', { name: /Agregar Tarea/i });
        expect(submitButton).not.toBeDisabled();
    });
});
