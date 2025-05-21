import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputField from '../InputField'; // Adjust path as needed

describe('InputField', () => {
    const defaultProps = {
        id: 'test-input',
        label: 'Test Label',
        value: '',
        onChange: jest.fn(),
    };

    beforeEach(() => {
        defaultProps.onChange.mockClear();
    });

    test('renders label and input field', () => {
        render(<InputField {...defaultProps} />);
        expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
        expect(screen.getByRole('textbox', { name: 'Test Label' })).toBeInTheDocument();
    });

    test('displays the provided value', () => {
        render(<InputField {...defaultProps} value="Test Value" />);
        expect(screen.getByRole('textbox', { name: 'Test Label' })).toHaveValue('Test Value');
    });

    test('calls onChange when input value changes', () => {
        render(<InputField {...defaultProps} />);
        const inputElement = screen.getByRole('textbox', { name: 'Test Label' });
        fireEvent.change(inputElement, { target: { value: 'New Value' } });
        expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
        // Optionally, check if it's called with the event or value, depending on implementation
        // For this component, it's called with the event:
        expect(defaultProps.onChange).toHaveBeenCalledWith(expect.objectContaining({
            target: expect.objectContaining({ value: 'New Value' })
        }));
    });

    test('is disabled when disabled prop is true', () => {
        render(<InputField {...defaultProps} disabled={true} />);
        expect(screen.getByRole('textbox', { name: 'Test Label' })).toBeDisabled();
    });

    test('displays placeholder when provided', () => {
        render(<InputField {...defaultProps} placeholder="Test Placeholder" />);
        expect(screen.getByPlaceholderText('Test Placeholder')).toBeInTheDocument();
    });

    test('displays error message when error prop is provided', () => {
        render(<InputField {...defaultProps} error="Test Error Message" />);
        expect(screen.getByText('Test Error Message')).toBeInTheDocument();
        // Check if error message has appropriate classes if any are applied for styling
        expect(screen.getByText('Test Error Message')).toHaveClass('text-red-500');
    });

    test('does not display error message when error prop is not provided', () => {
        render(<InputField {...defaultProps} />);
        expect(screen.queryByText('Test Error Message')).not.toBeInTheDocument();
    });
    
    test('applies custom className to input', () => {
        render(<InputField {...defaultProps} className="custom-input-class" />);
        expect(screen.getByRole('textbox', { name: 'Test Label' })).toHaveClass('custom-input-class');
    });

    test('applies custom labelClassName to label', () => {
        render(<InputField {...defaultProps} labelClassName="custom-label-class" />);
        // The label element itself is not easily selectable by role without text if we only want to check class
        // We can get it by text and check its class
        const labelElement = screen.getByText('Test Label'); // This gets the label content
        expect(labelElement).toHaveClass('custom-label-class');
    });

    test('applies custom wrapperClassName to wrapper div', () => {
        const { container } = render(<InputField {...defaultProps} wrapperClassName="custom-wrapper-class" />);
        expect(container.firstChild).toHaveClass('custom-wrapper-class');
        expect(container.firstChild).not.toHaveClass('mb-4'); // Check if default is overridden
    });

    test('applies default wrapperClassName if none provided', () => {
        const { container } = render(<InputField {...defaultProps} />);
        expect(container.firstChild).toHaveClass('mb-4');
    });
});
