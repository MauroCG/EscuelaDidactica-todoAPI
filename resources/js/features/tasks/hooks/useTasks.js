import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllTasks, createTask, updateTask, deleteTask } from '../services/taskService';
// If using Option 2 from service: import { getTasksByUser, ... } from '../services/taskService';

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
            // Using Option 1 (fetch all, filter client-side)
            const allTasks = await getAllTasks();
            const userTasks = allTasks.filter(task => task.user_id === userId);
            setTasks(userTasks);

            // If using Option 2 (fetch by user)
            // const userTasks = await getTasksByUser(userId);
            // setTasks(userTasks);

        } catch (err) {
            console.error(`Error fetching tasks for user ${userId}:`, err);
            setError("Failed to load tasks.");
            setTasks([]); // Clear on error
        } finally {
            setLoading(false);
        }
    }, [userId]); // Re-fetch when userId changes

    const addTask = useCallback(async (taskData) => {
        if (!userId) return; // Should not happen if form is disabled, but good check
        setError(null);
        try {
            // Ensure user_id is included
            const newTaskData = { ...taskData, user_id: userId };
            const newTask = await createTask(newTaskData);
            setTasks((prevTasks) => [...prevTasks, newTask]);
            return newTask;
        } catch (err) {
            console.error("Error creating task:", err);
            setError("Failed to create task.");
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
            // Send only the necessary update data
            // Assuming PUT /api/tasks/{taskId} handles the toggle based on its logic
            // If it expects the 'completed' field, send it:
            // await updateTask(taskId, { completed: updatedCompletedStatus });
            await updateTask(taskId, {}); // Sending empty object if PUT endpoint handles toggle itself
        } catch (err) {
            console.error(`Error updating task ${taskId}:`, err);
            setError("Failed to update task status.");
            setTasks(originalTasks); // Revert optimistic update
        }
    }, [tasks]); // Dependency on tasks needed for optimistic revert

    const removeTask = useCallback(async (taskId) => {
        setError(null);
        const originalTasks = tasks;
        // Optimistic update
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));

        try {
            await deleteTask(taskId);
        } catch (err) {
            console.error(`Error deleting task ${taskId}:`, err);
            setError("Failed to delete task.");
            setTasks(originalTasks); // Revert optimistic update
        }
    }, [tasks]); // Dependency on tasks needed for optimistic revert

    // Fetch tasks when the hook mounts or userId changes
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]); // fetchTasks depends on userId

    // Calculate filtered tasks using useMemo for performance
    const filteredTasks = useMemo(() => {
        if (activeFilter === 'completed') {
            return tasks.filter((task) => task.completed);
        }
        if (activeFilter === 'pending') {
            return tasks.filter((task) => !task.completed);
        }
        return tasks; // 'all'
    }, [tasks, activeFilter]); // Recalculate only when tasks or filter change

    return {
        tasks: filteredTasks, // Return filtered tasks for rendering
        originalTaskCount: tasks.length, // Useful for "No tasks found" message logic
        loading,
        error,
        activeFilter,
        setActiveFilter,
        fetchTasks, // Expose if manual refresh is needed
        addTask,
        toggleTaskCompletion,
        removeTask,
        setError, // Allow clearing error from component
    };
};
