import { useState, useEffect } from 'react';
import { darLike, quitarLike, contarLikes, verificarLike } from '../api/likes';
import { useAuth } from './useAuth';

export function useLikes(publicacionId) {
    const { usuario } = useAuth();
    const [totalLikes, setTotalLikes] = useState(0);
    const [usuarioDioLike, setUsuarioDioLike] = useState(false);
    const [loading, setLoading] = useState(false);

    // Cargar estado inicial
    useEffect(() => {
        const cargarLikes = async () => {
            try {
                // Contar likes
                const total = await contarLikes(publicacionId);
                setTotalLikes(total);

                // Verificar si el usuario actual dio like
                if (usuario?.id) {
                    const dioLike = await verificarLike(usuario.id, publicacionId);
                    setUsuarioDioLike(dioLike);
                }
            } catch (error) {
                console.error('Error al cargar likes:', error);
            }
        };

        cargarLikes();
    }, [publicacionId, usuario]);

    // Toggle like
    const toggleLike = async () => {
        if (!usuario?.id) {
            alert('Debes iniciar sesión para dar like');
            return;
        }

        setLoading(true);
        try {
            if (usuarioDioLike) {
                // Quitar like
                await quitarLike(usuario.id, publicacionId);
                setTotalLikes((prev) => prev - 1);
                setUsuarioDioLike(false);
            } else {
                // Dar like
                await darLike(usuario.id, publicacionId);
                setTotalLikes((prev) => prev + 1);
                setUsuarioDioLike(true);
            }
        } catch (error) {
            console.error('Error al dar/quitar like:', error);
            alert(error.message || 'Error al procesar like');
        } finally {
            setLoading(false);
        }
    };

    return {
        totalLikes,
        usuarioDioLike,
        toggleLike,
        loading,
    };
}