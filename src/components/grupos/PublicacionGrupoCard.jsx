import {useState} from 'react';
import {useAuth} from '../../hooks/useAuth';
import {useNavigate} from 'react-router-dom';
import {formatearFechaRelativa} from '../../utils/formatters';
import ListaComentariosGrupo from './ListaComentariosGrupo';
import '../../styles/grupos.css';

function PublicacionGrupoCard({publicacion, onActualizar}) {
    const {usuario} = useAuth();
    const navigate = useNavigate();
    const [mostrarComentarios, setMostrarComentarios] = useState(false);

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(publicacion.usuario?.nombre || 'Usuario');

    const esMiPublicacion = publicacion.usuario?.id === usuario?.id;

    return (
        <div className="publicacion-grupo-card">
            <div className="publicacion-header">
                <img
                    src={publicacion.usuario?.fotoUrl || defaultAvatar}
                    alt={publicacion.usuario?.nombre}
                    className="avatar"
                    onClick={() => navigate(`/perfil/${publicacion.usuario.id}`)}
                    style={{cursor: 'pointer'}}
                    onError={(e) => {
                        e.target.src = defaultAvatar;
                    }}
                />
                <div className="publicacion-info">
                    <h4
                        onClick={() => navigate(`/perfil/${publicacion.usuario.id}`)}
                        style={{cursor: 'pointer'}}
                    >
                        {publicacion.usuario?.nombre}
                    </h4>
                    <span className="publicacion-fecha">
            {formatearFechaRelativa(publicacion.fechaCreacion)}
          </span>
                </div>
            </div>

            <div className="publicacion-contenido">
                <p>{publicacion.contenido}</p>
            </div>

            <div className="publicacion-actions">
                <button
                    className="btn-action"
                    onClick={() => setMostrarComentarios(!mostrarComentarios)}
                >
                    💬 {mostrarComentarios ? 'Ocultar' : 'Comentar'}
                </button>
            </div>

            {mostrarComentarios && (
                <ListaComentariosGrupo
                    publicacionGrupoId={publicacion.id}
                    onActualizar={onActualizar}
                />
            )}
        </div>
    );
}

export default PublicacionGrupoCard;