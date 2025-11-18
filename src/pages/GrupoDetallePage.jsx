import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerGrupoPorId, obtenerMiembros } from '../api/grupos';
import { obtenerPublicacionesPorGrupo, crearPublicacionGrupo } from '../api/publicacionesGrupo';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import PublicacionGrupoCard from '../components/grupos/PublicacionGrupoCard';
import ChatGrupo from '../components/grupos/ChatGrupo';  // ✅ IMPORTAR
import '../styles/grupos.css';

function GrupoDetallePage() {
    const { id } = useParams();
    const { usuario } = useAuth();
    const navigate = useNavigate();

    const [grupo, setGrupo] = useState(null);
    const [miembros, setMiembros] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contenido, setContenido] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [mostrarMiembros, setMostrarMiembros] = useState(false);
    const [vistaActual, setVistaActual] = useState('publicaciones');  // ✅ NUEVO: 'publicaciones' o 'chat'

    useEffect(() => {
        cargarDatosGrupo();
    }, [id]);

    const cargarDatosGrupo = async () => {
        try {
            setLoading(true);
            const [grupoData, miembrosData, publicacionesData] = await Promise.all([
                obtenerGrupoPorId(id),
                obtenerMiembros(id),
                obtenerPublicacionesPorGrupo(id)
            ]);

            setGrupo(grupoData);
            setMiembros(miembrosData);
            setPublicaciones(publicacionesData);
        } catch (error) {
            console.error('Error al cargar datos del grupo:', error);
            alert('Error al cargar el grupo');
            navigate('/grupos');
        } finally {
            setLoading(false);
        }
    };

    const handlePublicar = async (e) => {
        e.preventDefault();

        if (!contenido.trim()) {
            alert('Escribe algo para publicar');
            return;
        }

        setEnviando(true);
        try {
            await crearPublicacionGrupo(usuario.id, id, contenido);
            setContenido('');
            await cargarDatosGrupo();
        } catch (error) {
            console.error('Error al publicar:', error);
            alert(error.message || 'Error al publicar');
        } finally {
            setEnviando(false);
        }
    };

    const esMiembro = miembros.some(m => m.id === usuario.id);
    const esCreador = grupo?.creador?.id === usuario.id;  // ✅ NUEVO
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
                            src={grupo.imagenUrl || defaultGrupoImg}
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
                                            src={miembro.fotoUrl || defaultAvatar(miembro.nombre)}
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

                    {/* ✅ NUEVO: Botones para cambiar entre Publicaciones y Chat */}
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

                    {/* ✅ Mostrar Publicaciones o Chat según la vista */}
                    {vistaActual === 'publicaciones' ? (
                        <>
                            {/* Crear publicación */}
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
                                    <button
                                        type="submit"
                                        className="btn-publicar-grupo"
                                        disabled={enviando || !contenido.trim()}
                                    >
                                        {enviando ? 'Publicando...' : 'Publicar'}
                                    </button>
                                </form>
                            </div>

                            {/* Publicaciones del grupo */}
                            <div className="grupo-publicaciones">
                                <h3>Publicaciones</h3>
                                {publicaciones.length > 0 ? (
                                    <div className="lista-publicaciones-grupo">
                                        {publicaciones.map((publicacion) => (
                                            <PublicacionGrupoCard
                                                key={publicacion.id}
                                                publicacion={publicacion}
                                                onActualizar={cargarDatosGrupo}
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
                        /* ✅ NUEVO: Mostrar Chat */
                        <ChatGrupo grupoId={id} esCreador={esCreador} />
                    )}
                </div>
            </div>
        </div>
    );
}

export default GrupoDetallePage;