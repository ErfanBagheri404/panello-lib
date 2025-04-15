import axios from 'axios';

const API_URL = `/api/auth`; 

export const loginUser = async (email: string, password: string) => {
    return axios.post(`${API_URL}/login`, { email, password });
};

export const registerUser = async (name: string, email: string, password: string) => {
    return axios.post(`${API_URL}/register`, { name, email, password });
};

export const logoutUser = () => {
    localStorage.removeItem('token');
};
