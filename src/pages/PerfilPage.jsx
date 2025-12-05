import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerUsuarioPorId } from '../api/usuarios';
import { obtenerPublicacionesPorUsuario } from '../api/publicaciones';
import { getAvatarUrl } from '../utils/imageUtils';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import PublicacionCard from '../components/publicaciones/PublicacionCard';
import '../styles/perfil.css';
import EditarPerfilModal from '../components/perfil/EditarPerfilModal';

function PerfilPage() {
    const { id } = useParams();
    const { usuario: usuarioActual } = useAuth();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editando, setEditando] = useState(false);
    const [avatarKey, setAvatarKey] = useState(0); // ✅ NUEVO: Para forzar recarga de imagen

    const usuarioId = id ? parseInt(id) : usuarioActual?.id;
    const esMiPerfil = usuarioId === usuarioActual?.id;

    useEffect(() => {
        if (!usuarioId) {
            setError('No se pudo identificar el usuario');
            setLoading(false);
            return;
        }

        if (isNaN(usuarioId)) {
            setError('ID de usuario inválido');
            setLoading(false);
            return;
        }

        cargarPerfil();
    }, [usuarioId]);

    const cargarPerfil = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('📥 [PerfilPage] Cargando perfil del usuario:', usuarioId);

            const [datosUsuario, datosPublicaciones] = await Promise.all([
                obtenerUsuarioPorId(usuarioId),
                obtenerPublicacionesPorUsuario(usuarioId)
            ]);

            console.log('✅ [PerfilPage] Usuario cargado:', datosUsuario);
            console.log('📸 [PerfilPage] FotoUrl:', datosUsuario.fotoUrl);

            setUsuario(datosUsuario);
            setPublicaciones(datosPublicaciones.sort((a, b) =>
                new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
            ));

            // ✅ NUEVO: Forzar recarga de imagen incrementando avatarKey
            setAvatarKey(prev => prev + 1);
            console.log('🔄 [PerfilPage] Recargando imagen de avatar');

        } catch (error) {
            console.error('❌ Error al cargar perfil:', error);
            setError('No se pudo cargar el perfil del usuario');
        } finally {
            setLoading(false);
        }
    };

    /**
     * ✅ NUEVO: Función para construir URL con cache busting
     * Agrega timestamp a la URL de la foto para forzar recarga
     */
    const getAvatarUrlConTimestamp = (fotoUrl, nombre) => {
        if (!fotoUrl) {
            return getAvatarUrl(null, nombre);
        }

        // Si ya tiene parámetro, agregar con &
        if (fotoUrl.includes('?')) {
            return `${fotoUrl}&t=${Date.now()}`;
        }
        // Si no tiene parámetro, agregar con ?
        return `${fotoUrl}?t=${Date.now()}`;
    };

    if (loading) {
        return (
            <div className="perfil-page">
                <Navbar />
                <div className="perfil-container">
                    <Sidebar />
                    <div className="perfil-loading">
                        <div className="spinner"></div>
                        <p>Cargando perfil...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !usuario) {
        return (
            <div className="perfil-page">
                <Navbar />
                <div className="perfil-container">
                    <Sidebar />
                    <div className="perfil-error">
                        <h2>Usuario no encontrado</h2>
                        <p>{error || 'El usuario que buscas no existe'}</p>
                        <button onClick={() => navigate('/')} className="btn-volver">
                            Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="perfil-page">
            <Navbar />

            <div className="perfil-container">
                <Sidebar />

                <div className="perfil-contenido">
                    <div className="perfil-header">
                        <div className="perfil-portada">
                            <div className="portada-gradient"></div>
                        </div>

                        <div className="perfil-info-principal">
                            <div className="perfil-avatar-container">
                                <img
                                    key={avatarKey} // ✅ NUEVO: Key para forzar re-render
                                    src={getAvatarUrlConTimestamp(usuario.fotoUrl, usuario.nombre)} // ✅ USAR URL CON TIMESTAMP
                                    alt={usuario.nombre}
                                    className="perfil-avatar-grande"
                                    onError={(e) => {
                                        e.target.src = getAvatarUrl(null, usuario.nombre);
                                    }}
                                />
                            </div>

                            <div className="perfil-datos">
                                <h1>{usuario.nombre}</h1>
                                <p className="perfil-email">{usuario.email}</p>
                                {usuario.bio && (
                                    <p className="perfil-bio">{usuario.bio}</p>
                                )}
                            </div>

                            {esMiPerfil && (
                                <button
                                    className="btn-editar-perfil"
                                    onClick={() => setEditando(true)}
                                >
                                    ✏️ Editar perfil
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="perfil-estadisticas">
                        <div className="stat-item">
                            <span className="stat-numero">{publicaciones.length}</span>
                            <span className="stat-label">Publicaciones</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-numero">0</span>
                            <span className="stat-label">Likes recibidos</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-numero">0</span>
                            <span className="stat-label">Comentarios</span>
                        </div>
                    </div>

                    <div className="perfil-publicaciones">
                        <h2>Publicaciones de {esMiPerfil ? 'tu perfil' : usuario.nombre}</h2>

                        {publicaciones.length > 0 ? (
                            <div className="lista-publicaciones-perfil">
                                {publicaciones.map((publicacion) => (
                                    <PublicacionCard
                                        key={publicacion.id}
                                        publicacion={publicacion}
                                        onActualizar={cargarPerfil}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="sin-publicaciones-perfil">
                                <span className="icono-vacio">📝</span>
                                <p>{esMiPerfil ? 'Aún no has publicado nada' : 'Este usuario no tiene publicaciones'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {editando && (
                <EditarPerfilModal
                    onCerrar={() => setEditando(false)}
                    onActualizar={cargarPerfil}
                />
            )}
        </div>
    )
}

export default PerfilPage;