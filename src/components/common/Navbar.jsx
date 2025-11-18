import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { UPLOADS_URL } from '../../utils/constants';
import BadgeNotificaciones from '../notificaciones/BadgeNotificaciones';
import '../../styles/navbar.css';

function Navbar() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(usuario?.nombre || 'Usuario');
    const avatarUrl = usuario?.fotoUrl || defaultAvatar;

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    <h2>🌐 SociaNet</h2>
                </div>

                <div className="navbar-user">
                    <BadgeNotificaciones />


                    <img
                        src={avatarUrl}
                        alt={usuario?.nombre}
                        className="navbar-avatar"
                        onClick={() => navigate('/perfil')} // ✅ AGREGAR
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                    <span
                        className="navbar-username"
                        onClick={() => navigate('/perfil')} // ✅ AGREGAR
                        style={{ cursor: 'pointer' }} // ✅ AGREGAR
                    >
            {usuario?.nombre}
          </span>
                    <button onClick={handleLogout} className="btn-logout">
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;