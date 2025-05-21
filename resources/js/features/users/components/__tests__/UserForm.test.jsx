import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserForm from '../UserForm'; // Adjust path as needed

// InputField is a child component. It's already tested separately.
// We can let it render or mock it if its behavior interferes.
// For forms, it's often better to let them render to test integration.

describe('UserForm', () => {
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

    test('renders the form title and input fields', () => {
        render(<UserForm {...defaultProps} />);
        expect(screen.getByRole('heading', { name: /Add Nuevo Usuario/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Agregar Usuario/i })).toBeInTheDocument();
    });

    test('allows typing into input fields', () => {
        render(<UserForm {...defaultProps} />);
        const nameInput = screen.getByLabelText(/Nombre/i);
        const emailInput = screen.getByLabelText(/Email/i);

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });

        expect(nameInput).toHaveValue('John Doe');
        expect(emailInput).toHaveValue('john.doe@example.com');
    });

    test('calls onSubmit with form data and clears fields on successful submission', async () => {
        render(<UserForm {...defaultProps} />);
        const nameInput = screen.getByLabelText(/Nombre/i);
        const emailInput = screen.getByLabelText(/Email/i);
        const submitButton = screen.getByRole('button', { name: /Agregar Usuario/i });

        fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
        fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockOnSubmit).toHaveBeenCalledTimes(1);
            expect(mockOnSubmit).toHaveBeenCalledWith({ name: 'Jane Doe', email: 'jane.doe@example.com' });
        });
        
        // Check if fields are cleared
        expect(nameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
    });
    
    test('does not call onSubmit if name is missing', () => {
        render(<UserForm {...defaultProps} />);
        const emailInput = screen.getByLabelText(/Email/i);
        const submitButton = screen.getByRole('button', { name: /Agregar Usuario/i });

        fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
        fireEvent.click(submitButton);
        
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('does not call onSubmit if email is missing', () => {
        render(<UserForm {...defaultProps} />);
        const nameInput = screen.getByLabelText(/Nombre/i);
        const submitButton = screen.getByRole('button', { name: /Agregar Usuario/i });

        fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
        fireEvent.click(submitButton);

        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    test('displays error message when error prop is provided', () => {
        render(<UserForm {...defaultProps} error="Failed to create user." />);
        expect(screen.getByText('Failed to create user.')).toBeInTheDocument();
    });

    test('does not display error message when error prop is null', () => {
        render(<UserForm {...defaultProps} />);
        expect(screen.queryByText('Failed to create user.')).not.toBeInTheDocument();
    });

    test('disables submit button and shows loading text when isLoading is true', () => {
        render(<UserForm {...defaultProps} isLoading={true} />);
        const submitButton = screen.getByRole('button', { name: /Agregando.../i });
        expect(submitButton).toBeDisabled();
    });

    test('enables submit button and shows normal text when isLoading is false', () => {
        render(<UserForm {...defaultProps} isLoading={false} />);
        const submitButton = screen.getByRole('button', { name: /Agregar Usuario/i });
        expect(submitButton).not.toBeDisabled();
    });
});
