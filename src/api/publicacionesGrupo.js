import axios from './axios.config';

// Obtener publicaciones de un grupo
export const obtenerPublicacionesPorGrupo = async (grupoId) => {
    try {
        const response = await axios.get(`/api/publicaciones-grupo/grupo/${grupoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener publicaciones del grupo';
    }
};

// Crear publicación en grupo
export const crearPublicacionGrupo = async (usuarioId, grupoId, contenido) => {
    try {
        const formData = new FormData();
        formData.append('contenido', contenido);

        const response = await axios.post(
            `/api/publicaciones-grupo/crear/${usuarioId}/${grupoId}`,
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

// Eliminar publicación de grupo
export const eliminarPublicacionGrupo = async (publicacionId, usuarioId) => {
    try {
        const response = await axios.delete(`/api/publicaciones-grupo/${publicacionId}/usuario/${usuarioId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al eliminar publicación';
    }
};