import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { FiHome, FiUsers, FiMessageSquare, FiUser } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import { API_URL } from '../../utils/constants'; // ✅ IMPORTAR
import '../../styles/sidebar.css';

function Sidebar() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [grupos, setGrupos] = useState([]);
    const [loading, setLoading] = useState(true);

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(usuario?.nombre || 'Usuario');

    useEffect(() => {
        const fetchGruposDelUsuario = async () => {
            if (!usuario?.id) return;
            try {
                setLoading(true);
                // ✅ USAR API_URL
                const response = await fetch(`${API_URL}/api/grupos/usuario/${usuario.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setGrupos(data);
                } else {
                    console.error('Error al cargar grupos:', response.status);
                    setGrupos([]);
                }
            } catch (error) {
                console.error('Error al cargar grupos:', error);
                setGrupos([]);
            } finally {
                setLoading(false);
            }
        };
        fetchGruposDelUsuario();
    }, [usuario?.id]);

    const getGrupoColor = (index) => {
        const colores = [
            '#667eea', '#764ba2', '#f59e0b', '#10b981',
            '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'
        ];
        return colores[index % colores.length];
    };

    return (
        <aside className="sidebar">
            {/* Usuario */}
            <div
                className="sidebar-user"
                onClick={() => navigate('/perfil')}
            >
                <img
                    // ✅ USAR API_URL
                    src={usuario?.fotoUrl
                        ? `${API_URL}${usuario.fotoUrl}?t=${Date.now()}`
                        : defaultAvatar
                    }
                    alt={usuario?.nombre}
                    className="sidebar-avatar"
                    onError={(e) => { e.target.src = defaultAvatar; }}
                />
                <div className="sidebar-user-info">
                    <span className="sidebar-username">Tu Perfil</span>
                </div>
            </div>

            {/* Navegación Principal con React Icons */}
            <nav className="sidebar-nav">
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <FiHome className="nav-icon-svg" />
                    <span className="nav-text">Inicio</span>
                </NavLink>
                <NavLink
                    to="/grupos"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <FiUsers className="nav-icon-svg" />
                    <span className="nav-text">Grupos</span>
                </NavLink>
                <NavLink
                    to="/mensajes"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <FiMessageSquare className="nav-icon-svg" />
                    <span className="nav-text">Mensajes</span>
                </NavLink>
                <NavLink
                    to="/perfil"
                    className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                >
                    <FiUser className="nav-icon-svg" />
                    <span className="nav-text">Perfil</span>
                </NavLink>
            </nav>

            {/* Sección de Grupos */}
            <div className="sidebar-grupos">
                <h3 className="sidebar-section-title">Mis Grupos</h3>
                <div className="grupos-lista">
                    {loading ? (
                        <div className="grupos-loading">
                            <p>Cargando grupos...</p>
                        </div>
                    ) : grupos.length > 0 ? (
                        grupos.map((grupo, index) => (
                            <div
                                key={grupo.id}
                                className="grupo-item"
                                onClick={() => navigate(`/grupos/${grupo.id}`)}
                            >
                                <div
                                    className="grupo-indicator"
                                    style={{ backgroundColor: getGrupoColor(index) }}
                                ></div>
                                <span className="grupo-nombre">{grupo.nombre}</span>
                            </div>
                        ))
                    ) : (
                        <div className="grupos-empty">
                            <HiOutlineUserGroup className="grupos-empty-icon" />
                            <p className="grupos-empty-text">No te has unido a ningún grupo</p>
                            <button
                                className="btn-unirse-grupo"
                                onClick={() => navigate('/grupos')}
                            >
                                Explorar grupos
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;