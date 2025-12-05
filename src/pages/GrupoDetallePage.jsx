import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerGrupoPorId, obtenerMiembros, editarGrupo, eliminarGrupo } from '../api/grupos';
import { obtenerPublicacionesPorGrupo, crearPublicacionGrupo } from '../api/publicacionesGrupo';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import PublicacionGrupoCard from '../components/grupos/PublicacionGrupoCard';
import ChatGrupo from '../components/grupos/ChatGrupo';
import EditarGrupoModal from '../components/grupos/EditarGrupoModal';
import '../styles/grupos.css';

const BASE_URL = 'http://localhost:8081';

function GrupoDetallePage() {
    const { id } = useParams();
    const { usuario } = useAuth();
    const navigate = useNavigate();

    // Estados principales
    const [grupo, setGrupo] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imagenKey, setImagenKey] = useState(Date.now());

    // Estados del formulario
    const [contenido, setContenido] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [imagenFile, setImagenFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [previewImagen, setPreviewImagen] = useState('');
    const [previewVideo, setPreviewVideo] = useState('');

    // Estados de UI
    const [mostrarMiembros, setMostrarMiembros] = useState(false);
    const [vistaActual, setVistaActual] = useState('publicaciones');
    const [mostrarEditarModal, setMostrarEditarModal] = useState(false);
    const [mostrarDeleteDialog, setMostrarDeleteDialog] = useState(false);
    const [eliminando, setEliminando] = useState(false);

    useEffect(() => {
        cargarDatosGrupo();
    }, [id]);

    const cargarDatosGrupo = async () => {
        try {
            setLoading(true);
            const timestamp = Date.now();

            const [grupoData, miembrosData, publicacionesData] = await Promise.all([
                obtenerGrupoPorId(id),
                obtenerMiembros(id),
                obtenerPublicacionesPorGrupo(id)
            ]);

            setGrupo(grupoData);
            setMiembros(miembrosData);
            setPublicaciones(publicacionesData);
            setImagenKey(timestamp);

            console.log('✅ Grupo cargado:', grupoData);
            console.log('🖼️ ImagenUrl:', grupoData.imagenUrl);

            if (grupoData.imagenUrl) {
                const img = new Image();
                img.src = `${BASE_URL}${grupoData.imagenUrl}?v=${timestamp}`;
                console.log('🔄 Precargando imagen:', img.src);
            }
        } catch (error) {
            console.error('Error al cargar datos del grupo:', error);
            alert('Error al cargar el grupo');
            navigate('/grupos');
        } finally {
            setLoading(false);
        }
    };

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Por favor selecciona una imagen válida');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert('La imagen no debe pesar más de 5MB');
                return;
            }

            setImagenFile(file);
            setVideoFile(null);
            setPreviewVideo('');

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImagen(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                alert('Por favor selecciona un video válido');
                return;
            }

            if (file.size > 50 * 1024 * 1024) {
                alert('El video no debe pesar más de 50MB');
                return;
            }

            setVideoFile(file);
            setImagenFile(null);
            setPreviewImagen('');
            setPreviewVideo(URL.createObjectURL(file));
        }
    };

    const quitarArchivo = () => {
        setImagenFile(null);
        setVideoFile(null);
        setPreviewImagen('');
        setPreviewVideo('');
    };

    const handlePublicar = async (e) => {
        e.preventDefault();

        if (!contenido.trim() && !imagenFile && !videoFile) {
            alert('Escribe algo o agrega una imagen/video para publicar');
            return;
        }

        setEnviando(true);
        try {
            await crearPublicacionGrupo(usuario.id, id, contenido, imagenFile, videoFile);

            setContenido('');
            quitarArchivo();

            await cargarDatosGrupo();
            alert('✅ Publicación creada exitosamente');
        } catch (error) {
            console.error('Error al publicar:', error);
            alert(error.message || 'Error al publicar');
        } finally {
            setEnviando(false);
        }
    };

    // ✅ NUEVA FUNCIÓN: Eliminar grupo
    const handleEliminarGrupo = async () => {
        setEliminando(true);
        try {
            await eliminarGrupo(id, usuario.id);
            alert('✅ Grupo eliminado exitosamente');
            navigate('/grupos');
        } catch (error) {
            console.error('Error al eliminar grupo:', error);
            alert('❌ Error al eliminar grupo: ' + error.message);
        } finally {
            setEliminando(false);
            setMostrarDeleteDialog(false);
        }
    };

    const esMiembro = miembros.some(m => m.id === usuario.id);
    const esCreador = grupo?.creador?.id === usuario.id;

    const defaultAvatar = (nombre) =>
        'https://ui-avatars.com/api/?name=' + encodeURIComponent(nombre || 'Usuario');
    const defaultGrupoImg = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(grupo?.nombre || 'Grupo') + '&background=667eea&color=fff&size=256';

    if (loading) {
        return (
            <div className="grupo-detalle-page">
                <Navbar />
                <div className="grupo-detalle-container">
                    <Sidebar />
                    <div className="grupo-loading">
                        <div className="spinner"></div>
                        <p>Cargando grupo...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!grupo || !esMiembro) {
        return (
            <div className="grupo-detalle-page">
                <Navbar />
                <div className="grupo-detalle-container">
                    <Sidebar />
                    <div className="grupo-error">
                        <h2>No tienes acceso a este grupo</h2>
                        <p>Debes ser miembro para ver el contenido</p>
                        <button onClick={() => navigate('/grupos')} className="btn-volver">
                            Volver a Grupos
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grupo-detalle-page">
            <Navbar />

            <div className="grupo-detalle-container">
                <Sidebar />

                <div className="grupo-detalle-contenido">
                    {/* Header del grupo */}
                    <div className="grupo-detalle-header">
                        <img
                            key={`grupo-img-${imagenKey}`}
                            src={grupo.imagenUrl
                                ? `${BASE_URL}${grupo.imagenUrl}?cache=${imagenKey}`
                                : defaultGrupoImg
                            }
                            alt={grupo.nombre}
                            className="grupo-portada"
                            onError={(e) => { e.target.src = defaultGrupoImg; }}
                        />
                        <div className="grupo-detalle-info">
                            <h1>{grupo.nombre}</h1>
                            <p className="grupo-detalle-descripcion">{grupo.descripcion}</p>
                            <div className="grupo-detalle-stats">
                                <span>👥 {miembros.length} miembros</span>
                                <span>👤 Creador: {grupo.creador?.nombre}</span>
                                <button
                                    className="btn-ver-miembros"
                                    onClick={() => setMostrarMiembros(!mostrarMiembros)}
                                >
                                    {mostrarMiembros ? 'Ocultar' : 'Ver'} miembros
                                </button>

                                {esCreador && (
                                    <div className="grupo-creador-actions">
                                        <button
                                            className="btn-editar-grupo"
                                            onClick={() => setMostrarEditarModal(true)}
                                        >
                                            ✏️ Editar Grupo
                                        </button>
                                        <button
                                            className="btn-eliminar-grupo"
                                            onClick={() => setMostrarDeleteDialog(true)}
                                        >
                                            🗑️ Eliminar Grupo
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Lista de miembros */}
                    {mostrarMiembros && (
                        <div className="grupo-miembros">
                            <h3>Miembros del grupo</h3>
                            <div className="miembros-grid">
                                {miembros.map((miembro) => (
                                    <div
                                        key={miembro.id}
                                        className="miembro-item"
                                        onClick={() => navigate(`/perfil/${miembro.id}`)}
                                    >
                                        <img
                                            src={miembro.fotoUrl
                                                ? `${BASE_URL}${miembro.fotoUrl}?t=${Date.now()}`
                                                : defaultAvatar(miembro.nombre)
                                            }
                                            alt={miembro.nombre}
                                            className="miembro-avatar"
                                            onError={(e) => { e.target.src = defaultAvatar(miembro.nombre); }}
                                        />
                                        <div className="miembro-info">
                                            <h4>{miembro.nombre}</h4>
                                            <p>{miembro.email}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tabs: Publicaciones / Chat */}
                    <div className="grupo-tabs">
                        <button
                            className={`tab-btn ${vistaActual === 'publicaciones' ? 'active' : ''}`}
                            onClick={() => setVistaActual('publicaciones')}
                        >
                            📝 Publicaciones
                        </button>
                        <button
                            className={`tab-btn ${vistaActual === 'chat' ? 'active' : ''}`}
                            onClick={() => setVistaActual('chat')}
                        >
                            💬 Chat
                        </button>
                    </div>

                    {/* Contenido según vista */}
                    {vistaActual === 'publicaciones' ? (
                        <>
                            <div className="grupo-crear-publicacion">
                                <h3>Publicar en el grupo</h3>
                                <form onSubmit={handlePublicar}>
                                    <textarea
                                        value={contenido}
                                        onChange={(e) => setContenido(e.target.value)}
                                        placeholder={`¿Qué quieres compartir con ${grupo.nombre}?`}
                                        rows="3"
                                        disabled={enviando}
                                    />

                                    {previewImagen && (
                                        <div className="preview-multimedia">
                                            <img src={previewImagen} alt="Preview" />
                                            <button
                                                type="button"
                                                className="btn-quitar-archivo"
                                                onClick={quitarArchivo}
                                                disabled={enviando}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    {previewVideo && (
                                        <div className="preview-multimedia">
                                            <video src={previewVideo} controls />
                                            <button
                                                type="button"
                                                className="btn-quitar-archivo"
                                                onClick={quitarArchivo}
                                                disabled={enviando}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}

                                    <div className="publicacion-acciones">
                                        <label className="btn-archivo">
                                            📷 Foto
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImagenChange}
                                                disabled={enviando || videoFile !== null}
                                                style={{ display: 'none' }}
                                            />
                                        </label>

                                        <label className="btn-archivo">
                                            🎥 Video
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoChange}
                                                disabled={enviando || imagenFile !== null}
                                                style={{ display: 'none' }}
                                            />
                                        </label>

                                        <button
                                            type="submit"
                                            className="btn-publicar-grupo"
                                            disabled={enviando || (!contenido.trim() && !imagenFile && !videoFile)}
                                        >
                                            {enviando ? 'Publicando...' : 'Publicar'}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="grupo-publicaciones">
                                <h3>Publicaciones</h3>
                                {publicaciones.length > 0 ? (
                                    <div className="lista-publicaciones-grupo">
                                        {publicaciones.map((publicacion) => (
                                            <PublicacionGrupoCard
                                                key={publicacion.id}
                                                publicacion={publicacion}
                                                onActualizar={cargarDatosGrupo}
                                                esCreador={esCreador}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="sin-publicaciones-grupo">
                                        <span className="icono-vacio">📝</span>
                                        <p>No hay publicaciones aún. ¡Sé el primero en publicar!</p>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <ChatGrupo grupoId={id} esCreador={esCreador} />
                    )}
                </div>
            </div>

            {/* Modal Editar Grupo */}
            {mostrarEditarModal && (
                <EditarGrupoModal
                    grupo={grupo}
                    usuarioId={usuario.id}
                    onCerrar={() => setMostrarEditarModal(false)}
                    onActualizar={cargarDatosGrupo}
                />
            )}

            {/* ✅ NUEVO: Diálogo de confirmación para eliminar */}
            {mostrarDeleteDialog && (
                <div className="modal-overlay">
                    <div className="modal-dialog">
                        <div className="modal-header">
                            <h2>⚠️ Eliminar Grupo</h2>
                            <button
                                className="modal-close"
                                onClick={() => setMostrarDeleteDialog(false)}
                                disabled={eliminando}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de que deseas eliminar este grupo?</p>
                            <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>
                                Esta acción no se puede deshacer.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn-cancel"
                                onClick={() => setMostrarDeleteDialog(false)}
                                disabled={eliminando}
                            >
                                Cancelar
                            </button>
                            <button
                                className="btn-delete-confirm"
                                onClick={handleEliminarGrupo}
                                disabled={eliminando}
                            >
                                {eliminando ? 'Eliminando...' : 'Sí, eliminar grupo'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GrupoDetallePage;