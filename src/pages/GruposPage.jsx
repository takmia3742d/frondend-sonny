import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerGrupos, crearGrupo, unirseAGrupo } from '../api/grupos';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import '../styles/grupos.css';

function GruposPage() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [nuevoGrupo, setNuevoGrupo] = useState({
        nombre: '',
        descripcion: '',
        imagenUrl: ''
    });

    useEffect(() => {
        cargarGrupos();
    }, []);

    const cargarGrupos = async () => {
        try {
            setLoading(true);
            const data = await obtenerGrupos();
            setGrupos(data);
        } catch (error) {
            console.error('Error al cargar grupos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCrearGrupo = async (e) => {
        e.preventDefault();

        if (!nuevoGrupo.nombre.trim()) {
            alert('El nombre del grupo es obligatorio');
            return;
        }

        try {
            await crearGrupo(usuario.id, nuevoGrupo);
            setMostrarModal(false);
            setNuevoGrupo({ nombre: '', descripcion: '', imagenUrl: '' });
            await cargarGrupos();
        } catch (error) {
            console.error('Error al crear grupo:', error);
            alert('Error al crear grupo');
        }
    };

    const handleUnirse = async (grupoId) => {
        try {
            await unirseAGrupo(usuario.id, grupoId);
            await cargarGrupos();
            alert('Te has unido al grupo exitosamente');
        } catch (error) {
            console.error('Error al unirse al grupo:', error);
            alert('Error al unirse al grupo');
        }
    };

    const esMiembro = (grupo) => {
        return grupo.miembros?.some(m => m.id === usuario.id);
    };

    const defaultGrupoImg = 'https://ui-avatars.com/api/?name=Grupo&background=667eea&color=fff&size=128';

    if (loading) {
        return (
            <div className="grupos-page">
                <Navbar />
                <div className="grupos-container">
                    <Sidebar />
                    <div className="grupos-loading">
                        <div className="spinner"></div>
                        <p>Cargando grupos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grupos-page">
            <Navbar />

            <div className="grupos-container">
                <Sidebar />

                <div className="grupos-contenido">
                    <div className="grupos-header">
                        <h1>Grupos</h1>
                        <button
                            className="btn-crear-grupo"
                            onClick={() => setMostrarModal(true)}
                        >
                            + Crear Grupo
                        </button>
                    </div>

                    <div className="grupos-grid">
                        {grupos.length > 0 ? (
                            grupos.map((grupo) => (
                                <div key={grupo.id} className="grupo-card">
                                    <img
                                        src={grupo.imagenUrl || defaultGrupoImg}
                                        alt={grupo.nombre}
                                        className="grupo-imagen"
                                        onError={(e) => { e.target.src = defaultGrupoImg; }}
                                    />
                                    <div className="grupo-info">
                                        <h3>{grupo.nombre}</h3>
                                        <p className="grupo-descripcion">{grupo.descripcion}</p>
                                        <div className="grupo-stats">
                                            <span>👥 {grupo.miembros?.length || 0} miembros</span>
                                            <span>👤 Creador: {grupo.creador?.nombre}</span>
                                        </div>
                                        <div className="grupo-acciones">
                                            {esMiembro(grupo) ? (
                                                <button
                                                    className="btn-ver-grupo"
                                                    onClick={() => navigate(`/grupos/${grupo.id}`)}
                                                >
                                                    Ver Grupo
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn-unirse"
                                                    onClick={() => handleUnirse(grupo.id)}
                                                >
                                                    Unirse
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="sin-grupos">
                                <span className="icono-vacio">👥</span>
                                <h3>No hay grupos aún</h3>
                                <p>Sé el primero en crear un grupo</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal crear grupo */}
            {mostrarModal && (
                <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                    <div className="modal-crear-grupo" onClick={(e) => e.stopPropagation()}>
                        <h2>Crear Nuevo Grupo</h2>
                        <form onSubmit={handleCrearGrupo}>
                            <div className="form-group">
                                <label>Nombre del grupo *</label>
                                <input
                                    type="text"
                                    value={nuevoGrupo.nombre}
                                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, nombre: e.target.value})}
                                    placeholder="Ej: Desarrolladores JS"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    value={nuevoGrupo.descripcion}
                                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, descripcion: e.target.value})}
                                    placeholder="Describe de qué trata el grupo..."
                                    rows="3"
                                />
                            </div>
                            <div className="form-group">
                                <label>URL de imagen (opcional)</label>
                                <input
                                    type="url"
                                    value={nuevoGrupo.imagenUrl}
                                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, imagenUrl: e.target.value})}
                                    placeholder="https://ejemplo.com/imagen.jpg"
                                />
                            </div>
                            <div className="modal-acciones">
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setMostrarModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-crear">
                                    Crear Grupo
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default GruposPage;