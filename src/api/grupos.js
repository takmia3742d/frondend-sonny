import axios from './axios.config';

// Obtener todos los grupos
export const obtenerGrupos = async () => {
    try {
        const response = await axios.get('/api/grupos/listar');
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener grupos';
    }
};

// Crear grupo
export const crearGrupo = async (creadorId, grupoData) => {
    try {
        const response = await axios.post(`/api/grupos/crear/${creadorId}`, grupoData);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al crear grupo';
    }
};

// Unirse a un grupo
export const unirseAGrupo = async (usuarioId, grupoId) => {
    try {
        const response = await axios.post(`/api/grupos/unirse/${grupoId}/${usuarioId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al unirse al grupo';
    }
};

// Obtener grupo por ID
export const obtenerGrupoPorId = async (grupoId) => {
    try {
        const response = await axios.get(`/api/grupos/${grupoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener grupo';
    }
};

// Obtener miembros de un grupo
export const obtenerMiembros = async (grupoId) => {
    try {
        const response = await axios.get(`/api/grupos/miembros/${grupoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener miembros';
    }
};