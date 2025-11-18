import axios from './axios.config';

// Obtener todos los usuarios
export const obtenerUsuarios = async () => {
    try {
        console.log('📡 [usuarios.js] GET /api/usuarios');
        const response = await axios.get('/api/usuarios');
        console.log('✅ [usuarios.js] Usuarios obtenidos:', response.data.length);
        return response.data;
    } catch (error) {
        console.error('❌ [usuarios.js] Error:', error);
        throw error.response?.data || 'Error al obtener usuarios';
    }
};

// Obtener usuario por ID
export const obtenerUsuarioPorId = async (usuarioId) => {
    try {
        console.log('📡 [usuarios.js] Obteniendo usuario ID:', usuarioId);
        const response = await axios.get(`/api/usuarios/${usuarioId}`);  // ✅ Corregido
        console.log('✅ [usuarios.js] Usuario obtenido:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [usuarios.js] Error:', error);
        throw error.response?.data || 'Error al obtener usuario';
    }
};

// ✅ ACTUALIZAR PERFIL CON FOTO
export const actualizarPerfil = async (usuarioId, formData) => {
    try {
        console.log('📤 [usuarios.js] Actualizando perfil ID:', usuarioId);

        // Crear FormData para enviar archivos
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('email', formData.email);

        if (formData.bio) {
            data.append('bio', formData.bio);
        }

        // ✅ Si hay foto (archivo real), agregarla
        if (formData.foto instanceof File) {
            data.append('foto', formData.foto);
        }

        const response = await axios.put(`/api/usuarios/${usuarioId}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('✅ [usuarios.js] Perfil actualizado:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [usuarios.js] Error al actualizar perfil:', error);
        throw error.response?.data || error.message || 'Error al actualizar perfil';
    }
};

// ✅ CAMBIAR SOLO LA FOTO
export const cambiarFotoPerfil = async (usuarioId, archivo) => {
    try {
        console.log('📤 [usuarios.js] Cambiando foto ID:', usuarioId);

        const formData = new FormData();
        formData.append('foto', archivo);

        const response = await axios.put(`/api/usuarios/${usuarioId}/foto`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log('✅ [usuarios.js] Foto actualizada:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [usuarios.js] Error al cambiar foto:', error);
        throw error.response?.data || error.message || 'Error al cambiar foto';
    }
};
