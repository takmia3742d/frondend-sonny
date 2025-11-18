import { useState, useEffect } from 'react';
import {
    obtenerNotificacionesNoLeidas,
    contarNotificacionesNoLeidas,
    marcarComoLeida
} from '../api/notificaciones';
import { useAuth } from './useAuth';

export function useNotificaciones() {
    const { usuario } = useAuth();
    const [notificaciones, setNotificaciones] = useState([]);
    const [totalNoLeidas, setTotalNoLeidas] = useState(0);
    const [loading, setLoading] = useState(false);

    const cargarNotificaciones = async () => {
        if (!usuario?.id) return;

        try {
            setLoading(true);
            const [notifs, total] = await Promise.all([
                obtenerNotificacionesNoLeidas(usuario.id),
                contarNotificacionesNoLeidas(usuario.id)
            ]);
            setNotificaciones(notifs);
            setTotalNoLeidas(total);
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarNotificaciones();

        // Recargar cada 30 segundos
        const interval = setInterval(cargarNotificaciones, 30000);

        return () => clearInterval(interval);
    }, [usuario?.id]);

    const marcarLeida = async (notificacionId) => {
        try {
            await marcarComoLeida(notificacionId);
            await cargarNotificaciones();
        } catch (error) {
            console.error('Error al marcar notificación:', error);
        }
    };

    return {
        notificaciones,
        totalNoLeidas,
        loading,
        cargarNotificaciones,
        marcarLeida
    };
}