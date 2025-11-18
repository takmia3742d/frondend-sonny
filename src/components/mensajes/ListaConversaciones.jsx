import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ IMPORTAR
import { obtenerUsuarios } from '../../api/usuarios';
import { useAuth } from '../../hooks/useAuth';
import '../../styles/mensajes.css';

function ListaConversaciones({ onSeleccionarUsuario, usuarioSeleccionado }) {
    const { usuario: usuarioActual } = useAuth();
    const navigate = useNavigate(); // ✅ NUEVO
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

    const defaultAvatar = (nombre) =>
        'https://ui-avatars.com/api/?name=' + encodeURIComponent(nombre || 'Usuario');

    // ✅ NUEVA FUNCIÓN
    const handleClickUsuario = (usuario, e) => {
        // Si hace clic en el avatar, va al perfil
        if (e.target.tagName === 'IMG') {
            navigate(`/perfil/${usuario.id}`);
        } else {
            // Si hace clic en cualquier otra parte, abre el chat
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
                            onClick={(e) => handleClickUsuario(usuario, e)} // ✅ ACTUALIZAR
                        >
                            <img
                                src={usuario.fotoUrl || defaultAvatar(usuario.nombre)}
                                alt={usuario.nombre}
                                className="conversacion-avatar"
                                style={{ cursor: 'pointer' }} // ✅ AGREGAR
                                onError={(e) => { e.target.src = defaultAvatar(usuario.nombre); }}
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
