import axios from './axios.config';

// Enviar mensaje
export const enviarMensaje = async (emisorId, receptorId, contenido) => {
    try {
        const response = await axios.post(
            `/api/mensajes/enviar/${emisorId}/${receptorId}`,
            { contenido }
        );
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al enviar mensaje';
    }
};

// Obtener conversación entre dos usuarios
export const obtenerConversacion = async (usuario1Id, usuario2Id) => {
    try {
        const response = await axios.get(`/api/mensajes/conversacion/${usuario1Id}/${usuario2Id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener conversación';
    }
};