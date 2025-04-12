// src/services/api.js
import axios from 'axios';

// URL Base de tu API .NET
const API_URL = 'https://localhost:7299/api'; // Asegúrate que sea HTTPS si tu backend lo usa

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- Usuarios ---
export const getUsers = (params) => {
    // El backend actual no parece soportar filtrado por query params directamente en el GET /usuarios
    // El filtrado lo haremos en el frontend por ahora, o necesitarías ajustar el backend
    return apiClient.get('/usuarios');
};

export const createUser = (userData) => {
    // userData debe ser un objeto UserDto completo, incluyendo los objetos DepartamentoDto y CargoDto
    return apiClient.post('/usuarios', userData);
};

export const updateUser = (userId, userData) => {
    // userId es el Guid
    // userData debe ser un objeto UserDto completo, incluyendo los objetos DepartamentoDto y CargoDto
    return apiClient.put(`/usuarios/${userId}`, userData);
};

export const deleteUser = (userId) => {
    // userId es el Guid
    return apiClient.delete(`/usuarios/${userId}`);
};

// --- Departamentos y Cargos ---
export const getDepartments = () => {
    return apiClient.get('/departamentos');
};

export const getPositions = () => {
    return apiClient.get('/cargos');
};

// No necesitamos getUserById porque el GET /usuarios ya trae toda la info necesaria
// Si en algún momento lo necesitas:
// export const getUserById = (userId) => {
//     return apiClient.get(`/usuarios/${userId}`);
// };