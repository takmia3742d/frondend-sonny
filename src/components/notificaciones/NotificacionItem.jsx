import { formatearFechaRelativa } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import '../../styles/notificaciones.css';

function NotificacionItem({ notificacion, onMarcarLeida }) {
    const navigate = useNavigate();

    const getIcono = (tipo) => {
        switch (tipo) {
            case 'LIKE': return '❤️';
            case 'COMENTARIO': return '💬';
            case 'COMENTARIO_GRUPO': return '💬';
            case 'MENSAJE': return '✉️';
            case 'GRUPO': return '👥';
            default: return '🔔';
        }
    };

    const handleClick = () => {
        // Marcar como leída
        if (!notificacion.leida) {
            onMarcarLeida(notificacion.id);
        }

        // Redirigir según el tipo
        switch (notificacion.tipo) {
            case 'MENSAJE':
                navigate('/mensajes');
                break;
            case 'GRUPO':
            case 'COMENTARIO_GRUPO':
                navigate('/grupos');
                break;
            default:
                navigate('/');
                break;
        }
    };

    return (
        <div
            className={`notificacion-item ${!notificacion.leida ? 'no-leida' : ''}`}
            onClick={handleClick}
        >
            <span className="notificacion-icono">{getIcono(notificacion.tipo)}</span>
            <div className="notificacion-contenido">
                <p className="notificacion-mensaje">{notificacion.mensaje}</p>
                <span className="notificacion-fecha">
          {formatearFechaRelativa(notificacion.fechaCreacion)}
        </span>
            </div>
            {!notificacion.leida && <span className="punto-azul"></span>}
        </div>
    );
}

export default NotificacionItem;