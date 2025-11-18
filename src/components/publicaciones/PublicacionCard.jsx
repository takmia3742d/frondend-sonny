import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eliminarPublicacion } from '../../api/publicaciones';
import { UPLOADS_URL } from '../../utils/constants';
import { formatearFechaRelativa } from '../../utils/formatters';
import BotonLike from '../likes/BotonLike';
import ListaComentarios from '../comentarios/ListaComentarios';
import '../../styles/publicaciones.css';

function PublicacionCard({ publicacion, onActualizar }) {
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const navigate = useNavigate();
    const { usuario } = useAuth();

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(publicacion.usuario?.nombre || 'Usuario');

    // Verificar si es mi publicación
    const esMiPublicacion = publicacion.usuario?.id === usuario?.id;

    const irAlPerfil = () => {
        navigate(`/perfil/${publicacion.usuario.id}`);
    };

    const handleEliminar = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
            return;
        }

        setEliminando(true);
        try {
            await eliminarPublicacion(publicacion.id);
            alert('Publicación eliminada correctamente');
            if (onActualizar) onActualizar();
        } catch (error) {
            console.error('Error al eliminar publicación:', error);
            alert('Error al eliminar la publicación');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="publicacion-card">
            <div className="publicacion-header">
                <img
                    src={publicacion.usuario?.fotoUrl || defaultAvatar}
                    alt={publicacion.usuario?.nombre}
                    className="avatar"
                    onClick={irAlPerfil}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => { e.target.src = defaultAvatar; }}
                />
                <div className="publicacion-info">
                    <h4
                        onClick={irAlPerfil}
                        style={{ cursor: 'pointer' }}
                    >
                        {publicacion.usuario?.nombre}
                    </h4>
                    <span className="publicacion-fecha">
                        {formatearFechaRelativa(publicacion.fechaCreacion)}
                    </span>
                </div>

                {/* ✅ NUEVO: Botón eliminar (solo si es mi publicación) */}
                {esMiPublicacion && (
                    <button
                        className="btn-eliminar-publicacion"
                        onClick={handleEliminar}
                        disabled={eliminando}
                        title="Eliminar publicación"
                    >
                        {eliminando ? '⌛' : '🗑️'}
                    </button>
                )}
            </div>

            <div className="publicacion-contenido">
                <p>{publicacion.contenido}</p>
            </div>

            {publicacion.imagenUrl && (
                <div className="publicacion-media">
                    <img
                        src={`${UPLOADS_URL}${publicacion.imagenUrl}`}
                        alt="Publicación"
                    />
                </div>
            )}

            {publicacion.videoUrl && (
                <div className="publicacion-media">
                    <video
                        src={`${UPLOADS_URL}${publicacion.videoUrl}`}
                        controls
                    />
                </div>
            )}

            <div className="publicacion-actions">
                <BotonLike publicacionId={publicacion.id} />
                <button
                    className="btn-action"
                    onClick={() => setMostrarComentarios(!mostrarComentarios)}
                >
                    💬 {mostrarComentarios ? 'Ocultar' : 'Comentar'}
                </button>
            </div>

            {mostrarComentarios && (
                <ListaComentarios
                    publicacionId={publicacion.id}
                    onActualizar={onActualizar}
                />
            )}
        </div>
    );
}

export default PublicacionCard;