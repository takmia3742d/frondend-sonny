import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eliminarComentario } from '../../api/comentarios';
import { formatearFechaRelativa } from '../../utils/formatters';
import '../../styles/comentarios.css';

function ComentarioItem({ comentario, onActualizar }) {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [eliminando, setEliminando] = useState(false);

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(comentario.usuarioNombre || 'Usuario');

    // Verificar si es mi comentario
    const esMiComentario = comentario.usuarioId === usuario?.id;

    const handleEliminar = async () => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este comentario?')) {
            return;
        }

        setEliminando(true);
        try {
            await eliminarComentario(comentario.id);
            if (onActualizar) onActualizar();
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            alert('Error al eliminar el comentario');
        } finally {
            setEliminando(false);
        }
    };

    return (
        <div className="comentario-item">
            <img
                src={comentario.usuarioFotoUrl || defaultAvatar}
                alt={comentario.usuarioNombre}
                className="comentario-avatar"
                onClick={() => navigate(`/perfil/${comentario.usuarioId}`)}
                style={{ cursor: 'pointer' }}
                onError={(e) => { e.target.src = defaultAvatar; }}
            />
            <div className="comentario-contenido-wrapper">
                <div className="comentario-contenido">
                    <h5
                        onClick={() => navigate(`/perfil/${comentario.usuarioId}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        {comentario.usuarioNombre}
                    </h5>
                    <p>{comentario.contenido}</p>
                </div>
                <div className="comentario-footer">
                    <span className="comentario-fecha">
                        {formatearFechaRelativa(comentario.fechaCreacion)}
                    </span>

                    {/* ✅ Botón eliminar (solo si es mi comentario) */}
                    {esMiComentario && (
                        <button
                            className="btn-eliminar-comentario"
                            onClick={handleEliminar}
                            disabled={eliminando}
                            title="Eliminar comentario"
                        >
                            {eliminando ? '⌛' : '🗑️'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ComentarioItem;