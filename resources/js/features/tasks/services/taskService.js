import axios from 'axios';

const API_URL = '/api/tasks'; // Base URL for tasks

/**
 * Sends request to get all the tasks
 * 
 * @returns the tasks fetched from the API
 */
export const getTasks = async (userId, page = 1) => {
    if (!userId) {
        // Return a structure consistent with Laravel's paginated response for an empty set
        return { 
            data: [], 
            current_page: 1, 
            last_page: 1, 
            total: 0, 
            per_page: 15, // Assuming default per_page is 15
            from: null,
            to: null,
            links: [],
            first_page_url: `${API_URL}?page=1`,
            last_page_url: `${API_URL}?page=1`,
            prev_page_url: null,
            next_page_url: null,
            path: API_URL,
        };
    }
    const response = await axios.get(`${API_URL}?user_id=${userId}&page=${page}`);
    return response.data; // This will be the paginated response object from Laravel
};

/**
 * Sends request to create a new task
 * 
 * @param {{user_id: string, title: string}} taskData - Data required to create a new Task
 * @returns the created Task is success
 */
export const createTask = async (taskData) => {
    const response = await axios.post(API_URL, taskData);
    return response.data;
};

/**
 * Toggle completion status of a Task
 * 
 * @param {string} taskId 
 * @returns the API response
 */
export const updateTask = async (taskId, taskData) => {
    const response = await axios.put(`${API_URL}/${taskId}`);
    return response.data;
};

/**
 * Sends request to delete the given task
 * 
 * @param {string} taskId - The id of the task to be deleted
 */
export const deleteTask = async (taskId) => {
    await axios.delete(`${API_URL}/${taskId}`);
};
