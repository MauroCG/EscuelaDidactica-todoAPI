import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskSection from '../TaskSection';

// Mock child components
jest.mock('../TaskFilters', () => jest.fn((props) => <div data-testid="task-filters" {...props} />));
jest.mock('../TaskList', () => jest.fn((props) => <div data-testid="task-list" {...props} />));
jest.mock('../TaskForm', () => jest.fn((props) => <div data-testid="task-form" {...props} />));

describe('TaskSection', () => {
    const mockSelectedUser = { id: 1, name: 'Test User' };
    const defaultProps = {
        selectedUser: null,
        tasks: [],
        loadingTasks: false,
        taskError: null,
        activeFilter: 'all',
        onFilterChange: jest.fn(),
        onTaskSubmit: jest.fn(),
        onToggleComplete: jest.fn(),
        onDeleteTask: jest.fn(),
        originalTaskCount: 0,
    };

    beforeEach(() => {
        // Clear mocks
        defaultProps.onFilterChange.mockClear();
        defaultProps.onTaskSubmit.mockClear();
        defaultProps.onToggleComplete.mockClear();
        defaultProps.onDeleteTask.mockClear();
        require('../TaskFilters').mockClear();
        require('../TaskList').mockClear();
        require('../TaskForm').mockClear();
    });

    test('displays "select user" message and correct title when no user is selected', () => {
        render(<TaskSection {...defaultProps} />);
        expect(screen.getByText(/Por favor selecciona un usuario de la lista para ver y administrar sus tareas./i)).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /Selecciona un usuario/i, level: 2 })).toBeInTheDocument();
        expect(screen.queryByTestId('task-filters')).not.toBeInTheDocument();
        expect(screen.queryByTestId('task-list')).not.toBeInTheDocument();
        expect(screen.queryByTestId('task-form')).not.toBeInTheDocument();
    });

    test('displays user-specific title and child components when a user is selected', () => {
        render(<TaskSection {...defaultProps} selectedUser={mockSelectedUser} />);
        expect(screen.getByRole('heading', { name: `Tareas de ${mockSelectedUser.name}`, level: 2 })).toBeInTheDocument();
        expect(screen.queryByText(/Por favor selecciona un usuario de la lista para ver y administrar sus tareas./i)).not.toBeInTheDocument();
        
        expect(screen.getByTestId('task-filters')).toBeInTheDocument();
        expect(screen.getByTestId('task-list')).toBeInTheDocument();
        expect(screen.getByTestId('task-form')).toBeInTheDocument();
    });

    test('passes correct props to TaskFilters when user is selected', () => {
        render(<TaskSection {...defaultProps} selectedUser={mockSelectedUser} activeFilter="completed" />);
        const taskFiltersProps = require('../TaskFilters').mock.calls[0][0];
        expect(taskFiltersProps.activeFilter).toBe('completed');
        expect(taskFiltersProps.onFilterChange).toBe(defaultProps.onFilterChange);
    });

    test('passes correct props to TaskList when user is selected', () => {
        const tasks = [{ id: 1, title: 'Test Task', completed: false, user_id: 1 }];
        render(<TaskSection {...defaultProps} selectedUser={mockSelectedUser} tasks={tasks} loadingTasks={true} originalTaskCount={1} />);
        const taskListProps = require('../TaskList').mock.calls[0][0];
        expect(taskListProps.tasks).toEqual(tasks);
        expect(taskListProps.onToggleComplete).toBe(defaultProps.onToggleComplete);
        expect(taskListProps.onDelete).toBe(defaultProps.onDeleteTask);
        expect(taskListProps.loading).toBe(true);
        expect(taskListProps.originalTaskCount).toBe(1);
    });

    test('passes correct props to TaskForm when user is selected', () => {
        render(<TaskSection {...defaultProps} selectedUser={mockSelectedUser} taskError="Submit Error" loadingTasks={true} />);
        const taskForm = screen.getByTestId('task-form');
        
        // Check attribute for primitive types or use mock.calls for functions/objects
        const taskFormProps = require('../TaskForm').mock.calls[0][0];
        expect(taskFormProps.onSubmit).toBe(defaultProps.onTaskSubmit);
        expect(taskFormProps.error).toBe("Submit Error");
        expect(taskFormProps.isLoading).toBe(true);
    });
});
