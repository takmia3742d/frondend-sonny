import { useNavigate } from 'react-router-dom';
import { formatearFechaRelativa } from '../../utils/formatters';
import '../../styles/comentarios.css';

function ComentarioGrupoItem({ comentario }) {
    const navigate = useNavigate();

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(comentario.usuario?.nombre || 'Usuario');

    const irAlPerfil = () => {
        if (comentario.usuario?.id) {
            navigate(`/perfil/${comentario.usuario.id}`);
        }
    };

    return (
        <div className="comentario-item">
            <img
                src={comentario.usuario?.fotoUrl || defaultAvatar}
                alt={comentario.usuario?.nombre}
                className="comentario-avatar"
                onClick={irAlPerfil}
                style={{ cursor: 'pointer' }}
                onError={(e) => { e.target.src = defaultAvatar; }}
            />
            <div className="comentario-contenido">
                <div className="comentario-header">
          <span
              className="comentario-autor"
              onClick={irAlPerfil}
              style={{ cursor: 'pointer' }}
          >
            {comentario.usuario?.nombre}
          </span>
                    <span className="comentario-fecha">
            {formatearFechaRelativa(comentario.fechaCreacion)}
          </span>
                </div>
                <p className="comentario-texto">{comentario.contenido}</p>
            </div>
        </div>
    );
}

export default ComentarioGrupoItem;