import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/grupos';

// Obtener todos los grupos
export const obtenerGrupos = async () => {
    const response = await axios.get(`${BASE_URL}/listar`);
    return response.data;
};

// Obtener grupo por ID
export const obtenerGrupoPorId = async (grupoId) => {
    const response = await axios.get(`${BASE_URL}/${grupoId}`);
    return response.data;
};

// Obtener miembros del grupo
export const obtenerMiembros = async (grupoId) => {
    const response = await axios.get(`${BASE_URL}/${grupoId}/miembros`);
    return response.data;
};

// Crear grupo
export const crearGrupo = async (usuarioId, nombre, descripcion, foto) => {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    if (foto) {
        formData.append('foto', foto);
    }

    const response = await axios.post(
        `${BASE_URL}/crear/${usuarioId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
};

// ✅ EDITADO: Editar grupo
export const editarGrupo = async (grupoId, usuarioId, nombre, descripcion, foto) => {
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    if (foto) {
        formData.append('foto', foto);
    }

    const response = await axios.put(
        `${BASE_URL}/${grupoId}/editar/${usuarioId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
};

// ✅ EDITADO: Eliminar grupo
export const eliminarGrupo = async (grupoId, usuarioId) => {
    const response = await axios.delete(
        `${BASE_URL}/${grupoId}/eliminar/${usuarioId}`
    );
    return response.data;
};

/**
 * ✅ CORREGIDO: Unirse a un grupo
 * Orden correcto: (usuarioId, grupoId)
 *
 * Antes: unirseAGrupo(grupoId, usuarioId) ❌
 * Ahora: unirseAGrupo(usuarioId, grupoId) ✅
 */
export const unirseAGrupo = async (usuarioId, grupoId) => {
    const response = await axios.post(
        `${BASE_URL}/unirse/${grupoId}/${usuarioId}`
    );
    return response.data;
};

// Obtener grupos del usuario
export const obtenerGruposDelUsuario = async (usuarioId) => {
    const response = await axios.get(`${BASE_URL}/usuario/${usuarioId}`);
    return response.data;
};