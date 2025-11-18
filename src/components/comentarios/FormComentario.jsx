import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { crearComentario } from '../../api/comentarios';
import '../../styles/comentarios.css';

function FormComentario({ publicacionId, onComentarioCreado }) {
    const { usuario } = useAuth();
    const [contenido, setContenido] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(usuario?.nombre || 'Usuario');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!contenido.trim()) {
            setError('Escribe un comentario');
            return;
        }

        setLoading(true);
        try {
            await crearComentario(usuario.id, publicacionId, contenido);
            setContenido('');

            // Notificar al padre para recargar comentarios
            if (onComentarioCreado) {
                onComentarioCreado();
            }
        } catch (err) {
            setError(err.message || 'Error al comentar');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="form-comentario" onSubmit={handleSubmit}>
            <img
                src={usuario?.fotoUrl || defaultAvatar}
                alt={usuario?.nombre}
                className="comentario-avatar"
                onError={(e) => { e.target.src = defaultAvatar; }}
            />
            <div className="form-comentario-input-wrapper">
                <input
                    type="text"
                    value={contenido}
                    onChange={(e) => setContenido(e.target.value)}
                    placeholder="Escribe un comentario..."
                    disabled={loading}
                    className="form-comentario-input"
                />
                <button
                    type="submit"
                    disabled={loading || !contenido.trim()}
                    className="btn-enviar-comentario"
                >
                    {loading ? '...' : '➤'}
                </button>
            </div>
            {error && <div className="comentario-error">{error}</div>}
        </form>
    );
}

export default FormComentario;