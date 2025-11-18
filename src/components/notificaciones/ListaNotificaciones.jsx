import { useNotificaciones } from '../../hooks/useNotificaciones';
import { marcarTodasComoLeidas } from '../../api/notificaciones';
import { useAuth } from '../../hooks/useAuth';
import NotificacionItem from './NotificacionItem';
import '../../styles/notificaciones.css';

function ListaNotificaciones({ onCerrar }) {
    const { usuario } = useAuth();
    const { notificaciones, loading, cargarNotificaciones, marcarLeida } = useNotificaciones();

    const handleMarcarTodasLeidas = async () => {
        try {
            await marcarTodasComoLeidas(usuario.id);
            await cargarNotificaciones();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="lista-notificaciones-dropdown">
            <div className="notificaciones-header">
                <h3>Notificaciones</h3>
                {notificaciones.length > 0 && (
                    <button
                        className="btn-marcar-todas"
                        onClick={handleMarcarTodasLeidas}
                    >
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            <div className="notificaciones-body">
                {loading ? (
                    <div className="notificaciones-loading">
                        <div className="spinner-small"></div>
                        <p>Cargando...</p>
                    </div>
                ) : notificaciones.length > 0 ? (
                    notificaciones.map((notificacion) => (
                        <NotificacionItem
                            key={notificacion.id}
                            notificacion={notificacion}
                            onMarcarLeida={marcarLeida}
                        />
                    ))
                ) : (
                    <div className="sin-notificaciones">
                        <span className="icono-vacio">🔔</span>
                        <p>No tienes notificaciones nuevas</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListaNotificaciones;