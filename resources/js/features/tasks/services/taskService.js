import axios from 'axios';

const API_URL = '/api/tasks'; // Base URL for tasks

export const getAllTasks = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createTask = async (taskData) => {
    const response = await axios.post(API_URL, taskData);
    return response.data;
};

export const updateTask = async (taskId, taskData) => {
    const response = await axios.put(`${API_URL}/${taskId}`, taskData);
    return response.data;
};

export const deleteTask = async (taskId) => {
    await axios.delete(`${API_URL}/${taskId}`);
};
