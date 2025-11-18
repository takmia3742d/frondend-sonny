import axios from './axios.config';

// Dar like a una publicación
export const darLike = async (usuarioId, publicacionId) => {
    try {
        const response = await axios.post(`/api/likes/dar/${usuarioId}/${publicacionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al dar like';
    }z
};

// Quitar like
export const quitarLike = async (usuarioId, publicacionId) => {
    try {
        const response = await axios.delete(`/api/likes/quitar/${usuarioId}/${publicacionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al quitar like';
    }
};

// Obtener likes de una publicación
export const obtenerLikesPorPublicacion = async (publicacionId) => {
    try {
        const response = await axios.get(`/api/likes/publicacion/${publicacionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener likes';
    }
};

// Contar likes
export const contarLikes = async (publicacionId) => {
    try {
        const response = await axios.get(`/api/likes/contar/${publicacionId}`);
        return response.data.totalLikes;
    } catch (error) {
        throw error.response?.data || 'Error al contar likes';
    }
};

// Verificar si usuario dio like
export const verificarLike = async (usuarioId, publicacionId) => {
    try {
        const response = await axios.get(`/api/likes/verificar/${usuarioId}/${publicacionId}`);
        return response.data.dioLike;
    } catch (error) {
        throw error.response?.data || 'Error al verificar like';
    }
};