import axios from './axios.config';

// Obtener todas las publicaciones
export const obtenerPublicaciones = async () => {
    try {
        const response = await axios.get('/api/publicaciones');
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener publicaciones';
    }
};

// Crear publicación
export const crearPublicacion = async (usuarioId, formData) => {
    try {
        const response = await axios.post(
            `/api/publicaciones/crear/${usuarioId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al crear publicación';
    }
};

// Eliminar publicación
export const eliminarPublicacion = async (publicacionId) => {
    try {
        const response = await axios.delete(`/api/publicaciones/${publicacionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al eliminar publicación';
    }
};

// Obtener publicaciones de un usuario
export const obtenerPublicacionesPorUsuario = async (usuarioId) => {
    try {
        console.log('📡 [API] Obteniendo publicaciones del usuario:', usuarioId);
        const response = await axios.get(`/api/publicaciones/usuario/${usuarioId}`);
        console.log('✅ [API] Publicaciones obtenidas:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [API] Error al obtener publicaciones:', error);
        console.error('❌ [API] Status:', error.response?.status);
        console.error('❌ [API] Data:', error.response?.data);
        throw error.response?.data || 'Error al obtener publicaciones del usuario';
    }
};
