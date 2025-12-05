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

/**
 * ✅ CORREGIDO: Obtener usuario por ID
 * Línea 18 - Template string con paréntesis correcto
 */
export const obtenerUsuarioPorId = async (usuarioId) => {
    try {
        console.log('📡 [usuarios.js] Obteniendo usuario ID:', usuarioId);
        // ✅ CORREGIDO: backtick con paréntesis (no backtick directo)
        const response = await axios.get(`/api/usuarios/${usuarioId}`);
        console.log('✅ [usuarios.js] Usuario obtenido:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ [usuarios.js] Error:', error);
        throw error.response?.data || 'Error al obtener usuario';
    }
};

/**
 * ✅ CORREGIDO: Actualizar perfil con foto
 * Línea 47 - Template string y FormData correcto
 */
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
            console.log('📸 Foto incluida:', formData.foto.name);
        } else {
            console.log('ℹ️ Sin foto nueva');
        }

        // ✅ CORREGIDO: Template string con paréntesis (backtick + paréntesis)
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

/**
 * ✅ CORREGIDO: Cambiar solo la foto
 * Línea 63 - Template string correcto
 */
export const cambiarFotoPerfil = async (usuarioId, archivo) => {
    try {
        console.log('📤 [usuarios.js] Cambiando foto ID:', usuarioId);

        const formData = new FormData();
        formData.append('foto', archivo);

        // ✅ CORREGIDO: Template string con paréntesis
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