import { useState, useRef, useEffect } from 'react';
import { useNotificaciones } from '../../hooks/useNotificaciones';
import ListaNotificaciones from './ListaNotificaciones';
import '../../styles/notificaciones.css';

function BadgeNotificaciones() {
    const { totalNoLeidas } = useNotificaciones();
    const [mostrarLista, setMostrarLista] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setMostrarLista(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="badge-notificaciones" ref={dropdownRef}>
            <button
                className="btn-notificaciones"
                onClick={() => setMostrarLista(!mostrarLista)}
            >
                <span className="icono-campana">🔔</span>
                {totalNoLeidas > 0 && (
                    <span className="badge-numero">{totalNoLeidas > 9 ? '9+' : totalNoLeidas}</span>
                )}
            </button>

            {mostrarLista && (
                <div className="dropdown-notificaciones">
                    <ListaNotificaciones onCerrar={() => setMostrarLista(false)} />
                </div>
            )}
        </div>
    );
}

export default BadgeNotificaciones;