import axios from './axios.config';

// Obtener todas las notificaciones del usuario
export const obtenerNotificaciones = async (usuarioId) => {
    try {
        const response = await axios.get(`/api/notificaciones/usuario/${usuarioId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener notificaciones';
    }
};

// Obtener solo notificaciones no leídas
export const obtenerNotificacionesNoLeidas = async (usuarioId) => {
    try {
        const response = await axios.get(`/api/notificaciones/usuario/${usuarioId}/no-leidas`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener notificaciones no leídas';
    }
};

// Contar notificaciones no leídas
export const contarNotificacionesNoLeidas = async (usuarioId) => {
    try {
        const response = await axios.get(`/api/notificaciones/usuario/${usuarioId}/contar-no-leidas`);
        return response.data.totalNoLeidas;
    } catch (error) {
        throw error.response?.data || 'Error al contar notificaciones';
    }
};

// Marcar notificación como leída
export const marcarComoLeida = async (notificacionId) => {
    try {
        const response = await axios.put(`/api/notificaciones/marcar-leida/${notificacionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al marcar notificación';
    }
};

// Marcar todas como leídas
export const marcarTodasComoLeidas = async (usuarioId) => {
    try {
        const response = await axios.put(`/api/notificaciones/marcar-todas-leidas/${usuarioId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al marcar todas como leídas';
    }
};

// Eliminar notificación
export const eliminarNotificacion = async (notificacionId, usuarioId) => {
    try {
        const response = await axios.delete(`/api/notificaciones/${notificacionId}/usuario/${usuarioId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al eliminar notificación';
    }
};