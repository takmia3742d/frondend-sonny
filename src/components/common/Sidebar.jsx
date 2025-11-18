// Primero instala react-icons si no lo tienes:
// npm install react-icons

import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
// Importar iconos de react-icons
import { FiHome, FiUsers, FiMessageSquare, FiUser } from 'react-icons/fi';
import { HiOutlineUserGroup } from 'react-icons/hi';
import '../../styles/sidebar.css';

function Sidebar() {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [grupos, setGrupos] = useState([]);

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(usuario?.nombre || 'Usuario');

    // Cargar grupos
    useEffect(() => {
        const fetchGrupos = async () => {
            try {
                const response = await fetch('/api/grupos');
                const data = await response.json();
                setGrupos(data);
            } catch (error) {
                console.error('Error al cargar grupos:', error);
                // Grupos de ejemplo
                setGrupos([
                    { id: 1, nombre: 'Desarrollo Web', color: '#667eea' },
                    { id: 2, nombre: 'Diseño UI/UX', color: '#764ba2' },
                    { id: 3, nombre: 'Marketing Digital', color: '#f59e0b' },
                    { id: 4, nombre: 'Emprendedores', color: '#10b981' }
                ]);
            }
        };

        fetchGrupos();
    }, []);

    return (
        <aside className="sidebar">
            {/* Usuario */}
            <div
                className="sidebar-user"
                onClick={() => navigate('/perfil')}
            >
                <img
                    src={usuario?.fotoUrl || defaultAvatar}
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
                    {grupos.length > 0 ? (
                        grupos.map((grupo) => (
                            <div
                                key={grupo.id}
                                className="grupo-item"
                                onClick={() => navigate(`/grupos/${grupo.id}`)}
                            >
                                <div
                                    className="grupo-indicator"
                                    style={{ backgroundColor: grupo.color }}
                                ></div>
                                <span className="grupo-nombre">{grupo.nombre}</span>
                            </div>
                        ))
                    ) : (
                        <div className="grupos-empty">
                            <HiOutlineUserGroup className="grupos-empty-icon" />
                            <p className="grupos-empty-text">No tienes grupos aún</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;