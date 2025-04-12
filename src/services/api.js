// src/services/api.js
import axios from 'axios';

// URL Base de tu API .NET
const API_URL = 'https://localhost:7299/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Usuarios ---
export const getUsers = (params) => {
    
    return apiClient.get('/usuarios');
};

export const createUser = (userData) => {
   
    return apiClient.post('/usuarios', userData);
};

export const updateUser = (userId, userData) => {
   
    return apiClient.put(`/usuarios/${userId}`, userData);
};

export const deleteUser = (userId) => {

    return apiClient.delete(`/usuarios/${userId}`);
};

// --- Departamentos y Cargos ---
export const getDepartments = () => {
    return apiClient.get('/departamentos');
};

export const getPositions = () => {
    return apiClient.get('/cargos');
};
