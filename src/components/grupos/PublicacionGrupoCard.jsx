// src/components/grupos/PublicacionGrupoCard.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eliminarPublicacionGrupo } from '../../api/publicacionesGrupo';
import { formatearFechaRelativa } from '../../utils/formatters';
import { API_URL } from '../../utils/constants'; // ✅ IMPORTAR
import ListaComentariosGrupo from './ListaComentariosGrupo';
import '../../styles/grupos.css';

function PublicacionGrupoCard({ publicacion, onActualizar, esCreador }) {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(publicacion.usuario?.nombre || 'Usuario');

    const esMiPublicacion = publicacion.usuario?.id === usuario?.id;
    const puedeEliminar = esMiPublicacion || esCreador;

    // ✅ Eliminar publicación
    const handleEliminar = async () => {
        if (!window.confirm('¿Estás seguro de eliminar esta publicación?')) {
            return;
        }

        setEliminando(true);
        try {
            await eliminarPublicacionGrupo(publicacion.id, usuario.id);
            alert('✅ Publicación eliminada');
            if (onActualizar) {
                onActualizar();
            }
        } catch (error) {
            console.error('Error al eliminar publicación:', error);
            alert('❌ Error al eliminar publicación');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="publicacion-grupo-card">
            <div className="publicacion-header">
                <img
                    // ✅ USAR API_URL
                    src={publicacion.usuario?.fotoUrl
                        ? `${API_URL}${publicacion.usuario.fotoUrl}?t=${Date.now()}`
                        : defaultAvatar
                    }
                    alt={publicacion.usuario?.nombre}
                    className="avatar"
                    onClick={() => navigate(`/perfil/${publicacion.usuario.id}`)}
                    style={{ cursor: 'pointer' }}
                    onError={(e) => { e.target.src = defaultAvatar; }}
                />
                <div className="publicacion-info">
                    <h4
                        onClick={() => navigate(`/perfil/${publicacion.usuario.id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        {publicacion.usuario?.nombre}
                    </h4>
                    <span className="publicacion-fecha">
                        {formatearFechaRelativa(publicacion.fechaCreacion)}
                    </span>
                </div>

                {/* ✅ Botón eliminar */}
                {puedeEliminar && (
                    <button
                        className="btn-eliminar-publicacion-grupo"
                        onClick={handleEliminar}
                        disabled={eliminando}
                        title="Eliminar publicación"
                    >
                        {eliminando ? '⏳' : '🗑️'}
                    </button>
                )}
            </div>

            {/* ✅ Mostrar CONTENIDO si existe */}
            {publicacion.contenido && (
                <div className="publicacion-contenido">
                    <p>{publicacion.contenido}</p>
                </div>
            )}

            {/* ✅ Mostrar IMAGEN si existe */}
            {publicacion.imagenUrl && (
                <div className="publicacion-media">
                    <img
                        // ✅ USAR API_URL
                        src={`${API_URL}${publicacion.imagenUrl}`}
                        alt="Publicación"
                        onError={(e) => {
                            console.error('❌ Error cargando imagen:', e.target.src);
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            {/* ✅ Mostrar VIDEO si existe */}
            {publicacion.videoUrl && (
                <div className="publicacion-media">
                    <video
                        // ✅ USAR API_URL
                        src={`${API_URL}${publicacion.videoUrl}`}
                        controls
                        onError={(e) => {
                            console.error('❌ Error cargando video:', e.target.src);
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

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