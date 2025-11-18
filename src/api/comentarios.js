import axios from './axios.config';

// Crear comentario
export const crearComentario = async (usuarioId, publicacionId, contenido) => {
    try {
        const response = await axios.post(
            `/api/comentarios/crear/${usuarioId}/${publicacionId}`,
            { contenido }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al crear comentario';
    }
};

// Obtener comentarios de una publicación
export const obtenerComentariosPorPublicacion = async (publicacionId) => {
    try {
        const response = await axios.get(`/api/comentarios/publicacion/${publicacionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener comentarios';
    }
};

// Obtener todos los comentarios
export const obtenerTodosComentarios = async () => {
    try {
        const response = await axios.get('/api/comentarios');
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener comentarios';
    }
};

// ✅ NUEVO: Eliminar comentario
export const eliminarComentario = async (comentarioId) => {
    try {
        const response = await axios.delete(`/api/comentarios/${comentarioId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al eliminar comentario';
    }
};