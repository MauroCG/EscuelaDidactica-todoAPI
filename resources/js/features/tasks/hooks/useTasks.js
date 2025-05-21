import { useState, useEffect, useCallback, useMemo } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService'; // Renamed getAllTasks to getTasks

export const useTasks = (userId) => {
    const [loadedTasks, setLoadedTasks] = useState([]); // All tasks loaded for the current user, for all pages
    const [loading, setLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState('all');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalTasksFromServer, setTotalTasksFromServer] = useState(0);

    const fetchUserTasks = useCallback(async (pageToFetch = 1) => {
        if (!userId) {
            setLoadedTasks([]);
            setCurrentPage(1);
            setTotalPages(1);
            setTotalTasksFromServer(0);
            return;
        }

        if (pageToFetch === 1) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }
        setError(null);

        try {
            const response = await getTasks(userId, pageToFetch); // Use new service
            if (pageToFetch === 1) {
                setLoadedTasks(response.data || []);
            } else {
                setLoadedTasks((prevTasks) => [...prevTasks, ...(response.data || [])]);
            }
            setCurrentPage(response.current_page);
            setTotalPages(response.last_page || 1);
            setTotalTasksFromServer(response.total || 0);
        } catch (err) {
            console.error(`Error fetching tasks for user ${userId}, page ${pageToFetch}:`, err);
            setError("Failed to load tasks");
            // Do not clear tasks on error if loading more, to keep existing data
            if (pageToFetch === 1) setLoadedTasks([]);
        } finally {
            if (pageToFetch === 1) {
                setLoading(false);
            } else {
                setIsLoadingMore(false);
            }
        }
    }, [userId]);

    // Initial fetch or fetch when userId changes
    useEffect(() => {
        fetchUserTasks(1); // Fetch first page
    }, [userId, fetchUserTasks]); // fetchUserTasks is stable due to useCallback with only userId as dep

    const loadMoreTasks = useCallback(() => {
        if (currentPage < totalPages && !isLoadingMore && !loading) {
            fetchUserTasks(currentPage + 1);
        }
    }, [currentPage, totalPages, isLoadingMore, loading, fetchUserTasks]);

    // Task mutation handlers: refetch first page for simplicity for now
    // A more advanced implementation might update cache or refetch current page(s)
    const refetchFirstPage = () => {
        fetchUserTasks(1);
    };

    const addTask = useCallback(async (taskData) => {
        if (!userId) return;
        setError(null);
        try {
            const newTaskData = { ...taskData, user_id: userId };
            await createTask(newTaskData);
            refetchFirstPage(); // Refetch to update list and total count
        } catch (err) {
            console.error("Error creating task:", err);
            setError("Failed to create task. Please try again.");
            throw err; // Re-throw for form to handle
        }
    }, [userId, fetchUserTasks]); // Added fetchUserTasks to deps for refetchFirstPage

    const toggleTaskCompletion = useCallback(async (taskId, currentCompletedStatus) => {
        setError(null);
        const originalTasks = [...loadedTasks]; // Keep a copy of all loaded tasks
        
        // Optimistic update on the full list
        setLoadedTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: !currentCompletedStatus } : task
            )
        );

        try {
            await updateTask(taskId); // Backend toggles, no data needed for this specific update
            // Optionally, refetch current page(s) if server might have other changes: refetchFirstPage();
        } catch (err) {
            console.error(`Error updating task ${taskId}:`, err);
            setError("Failed to update task. Please try again.");
            setLoadedTasks(originalTasks); // Revert optimistic update
        }
    }, [loadedTasks, fetchUserTasks]); // Added fetchUserTasks for potential refetch

    const removeTask = useCallback(async (taskId) => {
        setError(null);
        // No optimistic update here for simplicity with pagination, just refetch
        try {
            await deleteTask(taskId);
            refetchFirstPage(); // Refetch to update list and total count
        } catch (err) {
            console.error(`Error deleting task ${taskId}:`, err);
            setError("Failed to delete task. Please try again.");
        }
    }, [fetchUserTasks]); // Added fetchUserTasks

    // Client-side filtering on the currently loaded tasks
    const filteredTasks = useMemo(() => {
        if (activeFilter === 'completed') {
            return loadedTasks.filter((task) => task.completed);
        }
        if (activeFilter === 'pending') {
            return loadedTasks.filter((task) => !task.completed);
        }
        return loadedTasks; // 'all'
    }, [loadedTasks, activeFilter]);

    return {
        tasks: filteredTasks, // These are the tasks to display (loaded & client-filtered)
        // originalTaskCount: totalTasksFromServer, // Renamed for clarity
        totalTasks: totalTasksFromServer,
        loading, // Initial page load
        isLoadingMore, // Loading subsequent pages
        error,
        activeFilter,
        setActiveFilter,
        // fetchTasks: fetchUserTasks, // Expose main fetch if needed, or specific page fetch
        loadMoreTasks,
        currentPage,
        totalPages,
        addTask,
        toggleTaskCompletion,
        removeTask,
        setError,
    };
};
