import axios from './axios.config';

// Registro de usuario
export const register = async (userData) => {
    try {
        const response = await axios.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al registrarse';
    }
};

// Login de usuario
export const login = async (credentials) => {
    try {
        const response = await axios.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al iniciar sesión';
    }
};