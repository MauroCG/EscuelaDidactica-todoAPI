import axios from "axios";

const API_URL = "/api/users";

/**
 * Sends request to get all users
 * 
 * @returns the list of users fetched from the API
 */
export const getUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

/**
 * Sends request to create a new user
 * 
 * @param {name: string, email: string} userData - Data required to create a new user
 * @returns response from the API
 */
export const createUser = async (userData) => {
    // { name, email }
    const response = await axios.post(API_URL, userData);
    return response.data;
};
