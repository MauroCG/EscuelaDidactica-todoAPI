import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserSection from '../UserSection';

// Mock child components
jest.mock('../UserForm', () => jest.fn((props) => <div data-testid="user-form" {...props} />));
jest.mock('../UserList', () => jest.fn((props) => <div data-testid="user-list" {...props} />));
// Mock SectionCard indirectly by checking its output or mock it if it has complex logic not tested separately
// For now, we assume SectionCard is tested and works, and we look for its structural impact (e.g., title)

describe('UserSection', () => {
    const defaultProps = {
        users: [{ id: 1, name: 'Test User', email: 'test@example.com' }],
        loadingUsers: false,
        userError: null,
        onUserSubmit: jest.fn(),
        selectedUser: null,
        onUserSelect: jest.fn(),
    };

    beforeEach(() => {
        // Clear mocks if they are stateful or have call counters
        defaultProps.onUserSubmit.mockClear();
        defaultProps.onUserSelect.mockClear();
        // Clear mocks for child components if necessary (jest.clearAllMocks() or specific ones)
        require('../UserForm').mockClear();
        require('../UserList').mockClear();
    });

    test('renders the section title', () => {
        render(<UserSection {...defaultProps} />);
        expect(screen.getByRole('heading', { name: /Usuarios/i, level: 2 })).toBeInTheDocument();
    });

    test('renders UserForm and UserList components', () => {
        render(<UserSection {...defaultProps} />);
        expect(screen.getByTestId('user-form')).toBeInTheDocument();
        expect(screen.getByTestId('user-list')).toBeInTheDocument();
    });

    test('passes correct props to UserForm', () => {
        render(<UserSection {...defaultProps} />);
        const userForm = screen.getByTestId('user-form');
        
        expect(userForm).toHaveAttribute('onSubmit'); // Checks if prop exists
        // To check the actual function, you might need to access mock.calls if UserForm itself was interactive in the test
        // For now, checking existence or comparing mock function instances is fine.
        // expect(require('../UserForm').mock.calls[0][0].onSubmit).toBe(defaultProps.onUserSubmit);
        
        expect(userForm).toHaveAttribute('error', defaultProps.userError ? defaultProps.userError.toString() : ''); // Prop might be null
        expect(userForm).toHaveAttribute('isLoading', defaultProps.loadingUsers.toString());
    });
    
    test('passes correct props to UserList', () => {
        render(<UserSection {...defaultProps} />);
        const userList = screen.getByTestId('user-list');

        // Check a few key props
        // Note: Directly checking object/array props like 'users' for deep equality via attributes is not straightforward.
        // We rely on the mock receiving the correct props.
        const userListProps = require('../UserList').mock.calls[0][0];
        expect(userListProps.users).toEqual(defaultProps.users);
        expect(userListProps.selectedUser).toBe(defaultProps.selectedUser);
        expect(userListProps.onSelectUser).toBe(defaultProps.onUserSelect);
        expect(userListProps.loading).toBe(defaultProps.loadingUsers);
        expect(userListProps.error).toBe(defaultProps.userError);
    });

    test('passes loading state correctly to UserForm and UserList', () => {
        render(<UserSection {...defaultProps} loadingUsers={true} />);
        expect(screen.getByTestId('user-form')).toHaveAttribute('isLoading', 'true');
        
        const userListProps = require('../UserList').mock.calls[0][0];
        expect(userListProps.loading).toBe(true);
    });

    test('passes error state correctly to UserForm and UserList', () => {
        const errorProps = { ...defaultProps, userError: "Failed to load" };
        render(<UserSection {...errorProps} />);
        expect(screen.getByTestId('user-form')).toHaveAttribute('error', "Failed to load");

        const userListProps = require('../UserList').mock.calls[0][0];
        expect(userListProps.error).toBe("Failed to load");
    });
});
