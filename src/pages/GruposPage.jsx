import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { obtenerGrupos, crearGrupo, unirseAGrupo } from '../api/grupos';
import { API_URL } from '../utils/constants'; // ✅ IMPORTAR
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
        descripcion: ''
    });
    const [fotoFile, setFotoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [creando, setCreando] = useState(false);

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

    const handleFotoChange = (e) => {
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
            setFotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCrearGrupo = async (e) => {
        e.preventDefault();
        if (!nuevoGrupo.nombre.trim()) {
            alert('El nombre del grupo es obligatorio');
            return;
        }
        setCreando(true);
        try {
            // ✅ Crear FormData
            const formData = new FormData();
            formData.append('nombre', nuevoGrupo.nombre);
            formData.append('descripcion', nuevoGrupo.descripcion || '');
            if (fotoFile) {
                formData.append('foto', fotoFile);
            }

            // ✅ Usar API_URL
            const response = await fetch(`${API_URL}/api/grupos/crear/${usuario.id}`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error('Error al crear grupo');
            }
            const grupoCreado = await response.json();
            console.log('✅ Grupo creado:', grupoCreado);
            setMostrarModal(false);
            setNuevoGrupo({ nombre: '', descripcion: '' });
            setFotoFile(null);
            setPreviewUrl('');
            await cargarGrupos();
            alert('¡Grupo creado exitosamente!');
        } catch (error) {
            console.error('Error al crear grupo:', error);
            alert('Error al crear grupo');
        } finally {
            setCreando(false);
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
                                        // ✅ USAR API_URL
                                        src={grupo.imagenUrl
                                            ? `${API_URL}${grupo.imagenUrl}?t=${Date.now()}`
                                            : defaultGrupoImg
                                        }
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

            {/* ✅ MODAL CREAR GRUPO CON FOTO */}
            {mostrarModal && (
                <div className="modal-overlay" onClick={() => setMostrarModal(false)}>
                    <div className="modal-crear-grupo" onClick={(e) => e.stopPropagation()}>
                        <h2>Crear Nuevo Grupo</h2>
                        <form onSubmit={handleCrearGrupo}>
                            {/* ✅ Preview de foto */}
                            <div className="form-group foto-grupo-container">
                                <div className="preview-foto-grupo">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" />
                                    ) : (
                                        <div className="grupo-placeholder">
                                            {nuevoGrupo.nombre.charAt(0).toUpperCase() || '👥'}
                                        </div>
                                    )}
                                </div>
                                <label htmlFor="foto-grupo" className="btn-cambiar-foto-grupo">
                                    📷 Seleccionar foto del grupo
                                </label>
                                <input
                                    type="file"
                                    id="foto-grupo"
                                    accept="image/*"
                                    onChange={handleFotoChange}
                                    style={{ display: 'none' }}
                                />
                                <small style={{ color: '#a8a8a8', fontSize: '12px', textAlign: 'center', display: 'block', marginTop: '8px' }}>
                                    Formatos: JPG, PNG, GIF. Máximo 5MB
                                </small>
                            </div>
                            <div className="form-group">
                                <label>Nombre del grupo *</label>
                                <input
                                    type="text"
                                    value={nuevoGrupo.nombre}
                                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, nombre: e.target.value})}
                                    placeholder="Ej: Desarrolladores JS"
                                    required
                                    disabled={creando}
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    value={nuevoGrupo.descripcion}
                                    onChange={(e) => setNuevoGrupo({...nuevoGrupo, descripcion: e.target.value})}
                                    placeholder="Describe de qué trata el grupo..."
                                    rows="3"
                                    disabled={creando}
                                />
                            </div>
                            <div className="modal-acciones">
                                <button
                                    type="button"
                                    className="btn-cancelar"
                                    onClick={() => setMostrarModal(false)}
                                    disabled={creando}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn-crear"
                                    disabled={creando}
                                >
                                    {creando ? 'Creando...' : 'Crear Grupo'}
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