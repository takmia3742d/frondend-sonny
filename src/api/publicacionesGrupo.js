// src/api/publicacionesGrupo.js

import axios from './axios.config';
import { API_URL } from '../utils/constants'; // ✅ IMPORTAR

// Obtener publicaciones de un grupo
export const obtenerPublicacionesPorGrupo = async (grupoId) => {
    try {
        const response = await axios.get(`/api/publicaciones-grupo/grupo/${grupoId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || 'Error al obtener publicaciones del grupo';
    }
};

// ✅ Crear publicación en grupo CON IMAGEN/VIDEO
export const crearPublicacionGrupo = async (usuarioId, grupoId, contenido, imagen, video) => {
    try {
        const formData = new FormData();
        formData.append('contenido', contenido);

        if (imagen) {
            formData.append('imagen', imagen);
        }

        if (video) {
            formData.append('video', video);
        }

        // ✅ USAR API_URL
        const response = await fetch(
            `${API_URL}/api/publicaciones-grupo/crear/${usuarioId}/${grupoId}`,
            {
                method: 'POST',
                body: formData
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Error al crear publicación');
        }

        return await response.json();
    } catch (error) {
        throw error.message || 'Error al crear publicación';
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