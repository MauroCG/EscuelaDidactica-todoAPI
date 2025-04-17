import axios from 'axios';

const API_URL = '/api/tasks'; // Base URL for tasks

/**
 * Sends request to get all the tasks
 * 
 * @returns the tasks fetched from the API
 */
export const getAllTasks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
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
