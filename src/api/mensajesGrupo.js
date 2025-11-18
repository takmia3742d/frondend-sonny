import axios from './axios.config';

// Enviar mensaje al grupo
export const enviarMensajeGrupo = async (usuarioId, grupoId, contenido) => {
    try {
        const response = await axios.post(
            `/api/mensajes-grupo/enviar/${usuarioId}/${grupoId}`,
            { contenido }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al enviar mensaje';
    }
};

// Obtener mensajes de un grupo
export const obtenerMensajesPorGrupo = async (grupoId) => {
    try {
        const response = await axios.get(`/api/mensajes-grupo/grupo/${grupoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener mensajes';
    }
};

// Eliminar mensaje
export const eliminarMensajeGrupo = async (mensajeId, usuarioId) => {
    try {
        const response = await axios.delete(`/api/mensajes-grupo/${mensajeId}/usuario/${usuarioId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al eliminar mensaje';
    }
};