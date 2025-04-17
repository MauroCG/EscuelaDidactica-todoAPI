import axios from "axios";

const API_URL = "/api/users";

export const getUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createUser = async (userData) => {
    // userData should be { name: '...', email: '...' }
    const response = await axios.post(API_URL, userData);
    return response.data;
};
