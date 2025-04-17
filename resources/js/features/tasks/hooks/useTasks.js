import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/taskService';
// If using Option 2 from service: import { getTasksByUser, ... } from '../services/taskService';

// Custom hook for handling tasks logic (get, create, update and delete)
export const useTasks = (userId) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'completed', 'pending'

    const fetchTasks = useCallback(async () => {
        if (!userId) {
            setTasks([]); // Clear tasks if no user ID
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const allTasks = await getAllTasks();
            const userTasks = allTasks.filter(task => task.user_id === userId);
            setTasks(userTasks);
        } catch (err) {
            console.error(`Error fetching tasks for user ${userId}:`, err);
            setError("Failed to load tasks");
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const addTask = useCallback(async (taskData) => {
        if (!userId) return;

        setError(null);

        try {
            const newTaskData = { ...taskData, user_id: userId };
            const newTask = await createTask(newTaskData);
            setTasks((prevTasks) => [...prevTasks, newTask]);
            return newTask;
        } catch (err) {
            console.error("Error creating task:", err);
            setError("Failed to create task");
            throw err;
        }
    }, [userId]);

    const toggleTaskCompletion = useCallback(async (taskId, currentCompletedStatus) => {
        setError(null);
        const updatedCompletedStatus = !currentCompletedStatus;

        // Optimistic update
        const originalTasks = tasks;
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === taskId
                    ? { ...task, completed: updatedCompletedStatus }
                    : task
            )
        );

        try {
            await updateTask(taskId);
        } catch (err) {
            console.error(`Error updating task ${taskId}:`, err);
            setError("Failed to update task status");
            setTasks(originalTasks); // Revert optimistic update
        }
    }, [tasks]);

    const removeTask = useCallback(async (taskId) => {
        setError(null);
        const originalTasks = tasks;

        // Optimistic update
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        try {
            await deleteTask(taskId);
        } catch (err) {
            console.error(`Error deleting task ${taskId}:`, err);
            setError("Failed to delete task");
            setTasks(originalTasks); // Revert optimistic update
        }
    }, [tasks]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Calculate filtered tasks
    const filterTasks = useMemo(() => {
        if (activeFilter === 'completed') {
            return tasks.filter((task) => task.completed);
        }
        if (activeFilter === 'pending') {
            return tasks.filter((task) => !task.completed);
        }
        return tasks; // 'all'
    }, [tasks, activeFilter]); // Recalculate only when tasks or filter change

    return {
        tasks: filterTasks, 
        originalTaskCount: tasks.length,
        loading,
        error,
        activeFilter,
        setActiveFilter,
        fetchTasks, // Expose if manual refresh is needed
        addTask,
        toggleTaskCompletion,
        removeTask,
        setError, // Allow clearing error if needed
    };
};
