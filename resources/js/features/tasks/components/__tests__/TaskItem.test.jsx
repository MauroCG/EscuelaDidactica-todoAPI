import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskItem from '../TaskItem'; // Adjust path as needed

describe('TaskItem', () => {
    const mockOnToggleComplete = jest.fn();
    const mockOnDelete = jest.fn();

    const taskPending = {
        id: 1,
        title: 'Pending Task',
        completed: false,
        user_id: 1,
    };

    const taskCompleted = {
        id: 2,
        title: 'Completed Task',
        completed: true,
        user_id: 1,
    };

    beforeEach(() => {
        mockOnToggleComplete.mockClear();
        mockOnDelete.mockClear();
    });

    test('renders task title', () => {
        render(<TaskItem task={taskPending} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        expect(screen.getByText('Pending Task')).toBeInTheDocument();
    });

    test('checkbox is unchecked for a pending task', () => {
        render(<TaskItem task={taskPending} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    test('checkbox is checked for a completed task', () => {
        render(<TaskItem task={taskCompleted} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    test('calls onToggleComplete with correct arguments when checkbox is clicked', () => {
        render(<TaskItem task={taskPending} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
        expect(mockOnToggleComplete).toHaveBeenCalledWith(taskPending.id, taskPending.completed);
    });
    
    test('calls onToggleComplete for an already completed task', () => {
        render(<TaskItem task={taskCompleted} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        expect(mockOnToggleComplete).toHaveBeenCalledTimes(1);
        expect(mockOnToggleComplete).toHaveBeenCalledWith(taskCompleted.id, taskCompleted.completed);
    });

    test('calls onDelete with correct task id when delete button is clicked', () => {
        render(<TaskItem task={taskPending} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        const deleteButton = screen.getByRole('button', { name: /Eliminar/i });
        fireEvent.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalledTimes(1);
        expect(mockOnDelete).toHaveBeenCalledWith(taskPending.id);
    });

    test('applies line-through style to completed task title', () => {
        render(<TaskItem task={taskCompleted} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        const titleElement = screen.getByText(taskCompleted.title);
        expect(titleElement).toHaveClass('line-through');
    });

    test('does not apply line-through style to pending task title', () => {
        render(<TaskItem task={taskPending} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        const titleElement = screen.getByText(taskPending.title);
        expect(titleElement).not.toHaveClass('line-through');
    });
    
    test('has correct aria-label for delete button', () => {
        render(<TaskItem task={taskPending} onToggleComplete={mockOnToggleComplete} onDelete={mockOnDelete} />);
        const deleteButton = screen.getByRole('button', { name: /Eliminar/i });
        expect(deleteButton).toHaveAttribute('aria-label', `Delete task ${taskPending.title}`);
    });
});
