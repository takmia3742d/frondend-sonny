import axios from 'axios';
import { API_URL } from '../utils/constants';

// Configuración base de Axios
const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar token (futuro)
axiosInstance.interceptors.request.use(
    (config) => {
        // Aquí podrías agregar un token JWT en el futuro
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;