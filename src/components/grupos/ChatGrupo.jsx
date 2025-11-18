import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { enviarMensajeGrupo, obtenerMensajesPorGrupo, eliminarMensajeGrupo } from '../../api/mensajesGrupo';
import { formatearFechaRelativa } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';
import '../../styles/chat-grupo.css';

function ChatGrupo({ grupoId, esCreador }) {
    const { usuario } = useAuth();
    const navigate = useNavigate();
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [loading, setLoading] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const mensajesEndRef = useRef(null);

    const scrollToBottom = () => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        cargarMensajes();
        // Recargar mensajes cada 5 segundos
        const interval = setInterval(cargarMensajes, 5000);
        return () => clearInterval(interval);
    }, [grupoId]);

    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    const cargarMensajes = async () => {
        try {
            const data = await obtenerMensajesPorGrupo(grupoId);
            setMensajes(data);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEnviar = async (e) => {
        e.preventDefault();

        if (!nuevoMensaje.trim()) return;

        setEnviando(true);
        try {
            await enviarMensajeGrupo(usuario.id, grupoId, nuevoMensaje);
            setNuevoMensaje('');
            await cargarMensajes();
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            alert('Error al enviar mensaje');
        } finally {
            setEnviando(false);
        }
    };

    const handleEliminar = async (mensajeId) => {
        if (!window.confirm('¿Eliminar este mensaje?')) return;

        try {
            await eliminarMensajeGrupo(mensajeId, usuario.id);
            await cargarMensajes();
        } catch (error) {
            console.error('Error al eliminar mensaje:', error);
            alert('Error al eliminar mensaje');
        }
    };

    const defaultAvatar = (nombre) =>
        'https://ui-avatars.com/api/?name=' + encodeURIComponent(nombre || 'Usuario');

    if (loading) {
        return <div className="chat-loading">Cargando chat...</div>;
    }

    return (
        <div className="chat-grupo-container">
            <div className="chat-grupo-header">
                <h3>💬 Chat del Grupo</h3>
                <span className="chat-miembros-online">
                    {mensajes.length} mensaje(s)
                </span>
            </div>

            <div className="chat-grupo-mensajes">
                {mensajes.length > 0 ? (
                    mensajes.map((mensaje) => {
                        const esMio = mensaje.usuario.id === usuario.id;
                        return (
                            <div
                                key={mensaje.id}
                                className={`mensaje-grupo ${esMio ? 'mensaje-mio' : 'mensaje-otro'}`}
                            >
                                {!esMio && (
                                    <img
                                        src={mensaje.usuario.fotoUrl || defaultAvatar(mensaje.usuario.nombre)}
                                        alt={mensaje.usuario.nombre}
                                        className="mensaje-avatar"
                                        onClick={() => navigate(`/perfil/${mensaje.usuario.id}`)}
                                        style={{ cursor: 'pointer' }}
                                        onError={(e) => { e.target.src = defaultAvatar(mensaje.usuario.nombre); }}
                                    />
                                )}

                                <div className="mensaje-contenido-wrapper">
                                    {!esMio && (
                                        <span
                                            className="mensaje-autor"
                                            onClick={() => navigate(`/perfil/${mensaje.usuario.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {mensaje.usuario.nombre}
                                        </span>
                                    )}

                                    <div className="mensaje-bubble">
                                        <p>{mensaje.contenido}</p>

                                        <div className="mensaje-footer">
                                            <span className="mensaje-fecha">
                                                {formatearFechaRelativa(mensaje.fechaEnvio)}
                                            </span>

                                            {(esMio || esCreador) && (
                                                <button
                                                    className="btn-eliminar-mensaje"
                                                    onClick={() => handleEliminar(mensaje.id)}
                                                    title="Eliminar mensaje"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="sin-mensajes">
                        <p>No hay mensajes aún. ¡Sé el primero en escribir! 👋</p>
                    </div>
                )}
                <div ref={mensajesEndRef} />
            </div>

            <form className="chat-grupo-form" onSubmit={handleEnviar}>
                <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    disabled={enviando}
                    className="chat-input"
                />
                <button
                    type="submit"
                    disabled={enviando || !nuevoMensaje.trim()}
                    className="chat-btn-enviar"
                >
                    {enviando ? '...' : '➤'}
                </button>
            </form>
        </div>
    );
}

export default ChatGrupo;