import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerUsuarioPorId } from '../api/usuarios';
import { obtenerPublicacionesPorUsuario } from '../api/publicaciones';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import PublicacionCard from '../components/publicaciones/PublicacionCard';
import '../styles/perfil.css';
import EditarPerfilModal from '../components/perfil/EditarPerfilModal';


function PerfilPage() {
    const { id } = useParams();
    const { usuario: usuarioActual } = useAuth();
    const navigate = useNavigate();

    // ✅ PRIMERO: Declarar todos los estados
    const [usuario, setUsuario] = useState(null);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editando, setEditando] = useState(false);

    console.log('=== DEPURACIÓN INICIO ===');
    console.log('1. ID de URL:', id);
    console.log('2. Usuario actual completo:', usuarioActual);
    console.log('3. localStorage usuario:', localStorage.getItem('usuario'));
    console.log('=== FIN DEPURACIÓN ===');

    console.log('🔍 [PerfilPage] Renderizando con:', {
        id_de_url: id,
        usuarioActual,
        usuarioActual_id: usuarioActual?.id
    });

    // ✅ SEGUNDO: Calcular usuarioId y esMiPerfil
    const usuarioId = id ? parseInt(id) : usuarioActual?.id;
    const esMiPerfil = usuarioId === usuarioActual?.id;

    // ✅ TERCERO: Calcular defaultAvatar (ahora usuario ya está declarado)
    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(usuario?.nombre || usuarioActual?.nombre || 'Usuario');

    console.log('🔍 [PerfilPage] IDs calculados:', {
        usuarioId,
        esMiPerfil,
        tipo_usuarioId: typeof usuarioId
    });

    useEffect(() => {
        console.log('🔄 [PerfilPage] useEffect ejecutándose');

        if (!usuarioId) {
            console.error('❌ [PerfilPage] No hay usuarioId disponible');
            setError('No se pudo identificar el usuario');
            setLoading(false);
            return;
        }

        if (isNaN(usuarioId)) {
            console.error('❌ [PerfilPage] usuarioId no es un número:', usuarioId);
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

            console.log('📥 [PerfilPage] Iniciando carga del perfil...');
            console.log('📥 [PerfilPage] Usuario ID a cargar:', usuarioId);

            const [datosUsuario, datosPublicaciones] = await Promise.all([
                obtenerUsuarioPorId(usuarioId),
                obtenerPublicacionesPorUsuario(usuarioId)
            ]);

            console.log('✅ [PerfilPage] Datos cargados exitosamente');
            console.log('✅ [PerfilPage] Usuario:', datosUsuario);
            console.log('✅ [PerfilPage] Publicaciones:', datosPublicaciones.length);

            setUsuario(datosUsuario);
            setPublicaciones(datosPublicaciones.sort((a, b) =>
                new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
            ));
        } catch (error) {
            console.error('❌ [PerfilPage] Error al cargar perfil:', error);
            setError('No se pudo cargar el perfil del usuario');
        } finally {
            setLoading(false);
        }
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
                                    src={usuario.fotoUrl || usuario.fotoBase64 || defaultAvatar}
                                    alt={usuario.nombre}
                                    className="perfil-avatar-grande"
                                    onError={(e) => { e.target.src = defaultAvatar; }}
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