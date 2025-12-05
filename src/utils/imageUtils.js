// src/utils/imageUtils.js
import { API_URL } from './constants'; // ✅ IMPORTAR API_URL

/**
 * Construye la URL completa para una imagen de usuario
 * @param {string|null} fotoUrl - URL relativa de la foto (ej: "/uploads/foto.jpg")
 * @param {string} nombreUsuario - Nombre del usuario para el avatar por defecto
 * @returns {string} URL completa de la imagen
 */
export const getAvatarUrl = (fotoUrl, nombreUsuario = 'Usuario') => {
    if (fotoUrl) {
        // Si la URL ya es absoluta (empieza con http), devolverla tal cual
        if (fotoUrl.startsWith('http')) {
            return fotoUrl;
        }
        // Si es relativa, construir URL completa con timestamp para evitar caché
        return `${API_URL}${fotoUrl}?t=${Date.now()}`;
    }

    // Avatar por defecto de UI Avatars
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreUsuario)}`;
};

/**
 * Construye la URL completa para una imagen de grupo
 * @param {string|null} imagenUrl - URL relativa de la imagen
 * @param {string} nombreGrupo - Nombre del grupo para la imagen por defecto
 * @returns {string} URL completa de la imagen
 */
export const getGrupoImagenUrl = (imagenUrl, nombreGrupo = 'Grupo') => {
    if (imagenUrl) {
        if (imagenUrl.startsWith('http')) {
            return imagenUrl;
        }
        return `${API_URL}${imagenUrl}?t=${Date.now()}`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(nombreGrupo)}&background=667eea&color=fff&size=256`;
};

/**
 * Construye la URL completa para una imagen de publicación
 * @param {string} mediaUrl - URL relativa del medio (imagen o video)
 * @returns {string} URL completa
 */
export const getMediaUrl = (mediaUrl) => {
    if (!mediaUrl) return '';

    if (mediaUrl.startsWith('http')) {
        return mediaUrl;
    }

    return `${API_URL}${mediaUrl}`;
};

export default {
    getAvatarUrl,
    getGrupoImagenUrl,
    getMediaUrl,
    API_URL
};