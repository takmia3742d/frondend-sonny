import axios from './axios.config';

// Obtener comentarios de una publicación de grupo
export const obtenerComentariosPorPublicacion = async (publicacionGrupoId) => {
    try {
        const response = await axios.get(`/api/comentarios-grupo/publicacion/${publicacionGrupoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener comentarios';
    }
};

// Crear comentario en publicación de grupo
export const crearComentarioGrupo = async (usuarioId, publicacionGrupoId, contenido) => {
    try {
        const response = await axios.post(
            `/api/comentarios-grupo/crear/${usuarioId}/${publicacionGrupoId}`,
            { contenido }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al crear comentario';
    }
};