import { useState, useEffect, useCallback } from 'react';
import { getUsers, createUser } from '../services/userService';

// Custom hook for handling users logic (get and create users)
export const useUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users.");
            setUsers([]); // Clear on error
        } finally {
            setLoading(false);
        }
    }, []);

    const addUser = useCallback(async (userData) => {
        setError(null); // Clear previous errors
        try {
            const newUser = await createUser(userData);
            setUsers((prevUsers) => [...prevUsers, newUser]);
            return newUser; // Return the created user if needed
        } catch (err) {
            console.error("Error creating user:", err);
            setError("Failed to create user.");
            throw err;
        }
    }, []);

    // Fetch users on initial load
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        loading,
        error,
        fetchUsers, // Expose if manual refresh is needed
        addUser,
        setError, // Allow clearing error from component if needed
    };
};
