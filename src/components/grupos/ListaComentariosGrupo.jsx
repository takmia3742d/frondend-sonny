import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
    obtenerComentariosPorPublicacion,
    crearComentarioGrupo
} from '../../api/comentariosGrupo';
import ComentarioGrupoItem from './ComentarioGrupoItem';
import '../../styles/comentarios.css';

function ListaComentariosGrupo({ publicacionGrupoId, onActualizar }) {
    const { usuario } = useAuth();
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [contenido, setContenido] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        cargarComentarios();
    }, [publicacionGrupoId]);

    const cargarComentarios = async () => {
        try {
            setLoading(true);
            const data = await obtenerComentariosPorPublicacion(publicacionGrupoId);
            setComentarios(data);
        } catch (error) {
            console.error('Error al cargar comentarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!contenido.trim()) return;

        setEnviando(true);
        try {
            await crearComentarioGrupo(usuario.id, publicacionGrupoId, contenido);
            setContenido('');
            await cargarComentarios();
            if (onActualizar) onActualizar();
        } catch (error) {
            console.error('Error al comentar:', error);
            alert('Error al enviar comentario');
        } finally {
            setEnviando(false);
        }
    };

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(usuario?.nombre || 'Usuario');

    return (
        <div className="lista-comentarios">
            {/* Formulario para crear comentario */}
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
                        disabled={enviando}
                        className="form-comentario-input"
                    />
                    <button
                        type="submit"
                        disabled={enviando || !contenido.trim()}
                        className="btn-enviar-comentario"
                    >
                        {enviando ? '...' : '➤'}
                    </button>
                </div>
            </form>

            {/* Lista de comentarios */}
            {loading ? (
                <div className="comentarios-loading">Cargando comentarios...</div>
            ) : comentarios.length > 0 ? (
                <div className="comentarios-contenedor">
                    {comentarios.map((comentario) => (
                        <ComentarioGrupoItem
                            key={comentario.id}
                            comentario={comentario}
                            onActualizar={cargarComentarios}
                        />
                    ))}
                </div>
            ) : (
                <p className="sin-comentarios">Sé el primero en comentar</p>
            )}
        </div>
    );
}

export default ListaComentariosGrupo;