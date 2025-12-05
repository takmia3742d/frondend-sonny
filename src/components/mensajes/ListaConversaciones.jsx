import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerUsuarios } from '../../api/usuarios';
import { useAuth } from '../../hooks/useAuth';
import { getAvatarUrl } from '../../utils/imageUtils'; // ✅ IMPORTAR
import '../../styles/mensajes.css';

function ListaConversaciones({ onSeleccionarUsuario, usuarioSeleccionado }) {
    const { usuario: usuarioActual } = useAuth();
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const cargarUsuarios = async () => {
            try {
                const data = await obtenerUsuarios();
                const otrosUsuarios = data.filter(u => u.id !== usuarioActual.id);
                setUsuarios(otrosUsuarios);
            } catch (error) {
                console.error('Error al cargar usuarios:', error);
            }
        };

        cargarUsuarios();
    }, [usuarioActual.id]);

    const usuariosFiltrados = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );

    /**
     * ✅ CORREGIDO: Usar getAvatarUrl() en lugar de defaultAvatar
     * getAvatarUrl() maneja correctamente:
     * - Fotos reales con timestamp (cache busting)
     * - Fallback a placeholder con iniciales
     */
    const handleClickUsuario = (usuario, e) => {
        if (e.target.tagName === 'IMG') {
            navigate(`/perfil/${usuario.id}`);
        } else {
            onSeleccionarUsuario(usuario);
        }
    };

    return (
        <div className="lista-conversaciones">
            <div className="conversaciones-header">
                <h2>Mensajes</h2>
            </div>

            <div className="conversaciones-buscar">
                <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="buscar-input"
                />
            </div>

            <div className="conversaciones-lista">
                {usuariosFiltrados.length > 0 ? (
                    usuariosFiltrados.map((usuario) => (
                        <div
                            key={usuario.id}
                            className={`conversacion-item ${usuarioSeleccionado?.id === usuario.id ? 'active' : ''}`}
                            onClick={(e) => handleClickUsuario(usuario, e)}
                        >
                            {/* ✅ CORREGIDO: Usar getAvatarUrl() */}
                            <img
                                src={getAvatarUrl(usuario.fotoUrl, usuario.nombre)}
                                alt={usuario.nombre}
                                className="conversacion-avatar"
                                style={{ cursor: 'pointer' }}
                                onError={(e) => {
                                    e.target.src = getAvatarUrl(null, usuario.nombre);
                                }}
                            />
                            <div className="conversacion-info">
                                <h4>{usuario.nombre}</h4>
                                <p>{usuario.email}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="sin-usuarios">
                        {busqueda ? 'No se encontraron usuarios' : 'No hay usuarios disponibles'}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListaConversaciones;