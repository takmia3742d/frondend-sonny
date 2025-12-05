import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../utils/constants';
import BadgeNotificaciones from '../notificaciones/BadgeNotificaciones';
import Iridescence from './Iridescence';
import '../../styles/navbar.css';

function Navbar() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(usuario?.nombre || 'Usuario');

    const avatarUrl = usuario?.fotoUrl
        ? `${API_URL}${usuario.fotoUrl}?t=${Date.now()}`
        : defaultAvatar;

    return (
        <nav className="navbar">
            {/* ✅ Fondo iridiscente */}
            <div className="navbar-background">
                <Iridescence
                    color={[0.8, 0.6, 1.0]}
                    mouseReact={false}
                    amplitude={0.15}
                    speed={1.2}
                />
            </div>

            {/* ✅ Contenido sobre el fondo */}
            <div className="navbar-container">
                <div className="navbar-logo" onClick={() => navigate('/')}>
                    {/* ✅ NUEVO: Imagen circular en lugar de emoji */}
                    <img
                        src="/images/hoja.png"
                        alt="SociaNet Logo"
                        className="navbar-logo-img"
                    />
                    <h2>SociaNet</h2>
                </div>
                <div className="navbar-user">
                    <BadgeNotificaciones />
                    <img
                        src={avatarUrl}
                        alt={usuario?.nombre}
                        className="navbar-avatar"
                        onClick={() => navigate('/perfil')}
                        onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                    <span
                        className="navbar-username"
                        onClick={() => navigate('/perfil')}
                        style={{ cursor: 'pointer' }}
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