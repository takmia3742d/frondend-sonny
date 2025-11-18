import { useState, useEffect, useRef } from 'react';
import { obtenerConversacion, enviarMensaje } from '../../api/mensajes';
import { useAuth } from '../../hooks/useAuth';
import { formatearFechaRelativa } from '../../utils/formatters';
import '../../styles/mensajes.css';

function ChatWindow({ usuarioSeleccionado }) {
    const { usuario: usuarioActual } = useAuth();
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState('');
    const [loading, setLoading] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const mensajesEndRef = useRef(null);

    const scrollToBottom = () => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (usuarioSeleccionado) {
            cargarMensajes();

            // ✅ NUEVO: Recargar mensajes cada 3 segundos
            const interval = setInterval(() => {
                cargarMensajes(true); // true = silencioso (sin loading)
            }, 3000);

            return () => clearInterval(interval); // Limpiar al desmontar
        }
    }, [usuarioSeleccionado]);

    useEffect(() => {
        scrollToBottom();
    }, [mensajes]);

    const cargarMensajes = async (silencioso = false) => {
        try {
            if (!silencioso) setLoading(true);
            const data = await obtenerConversacion(usuarioActual.id, usuarioSeleccionado.id);
            setMensajes(data);
        } catch (error) {
            console.error('Error al cargar mensajes:', error);
        } finally {
            if (!silencioso) setLoading(false);
        }
    };

    const handleEnviar = async (e) => {
        e.preventDefault();

        if (!nuevoMensaje.trim()) return;

        setEnviando(true);
        try {
            const mensajeEnviado = await enviarMensaje(
                usuarioActual.id,
                usuarioSeleccionado.id,
                nuevoMensaje
            );

            setMensajes([...mensajes, mensajeEnviado]);
            setNuevoMensaje('');
            scrollToBottom();
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            alert('Error al enviar mensaje');
        } finally {
            setEnviando(false);
        }
    };

    const defaultAvatar = (nombre) =>
        'https://ui-avatars.com/api/?name=' + encodeURIComponent(nombre || 'Usuario');

    if (!usuarioSeleccionado) {
        return (
            <div className="chat-window-vacio">
                <div className="chat-vacio-contenido">
                    <span className="chat-vacio-icon">💬</span>
                    <h3>Tus mensajes</h3>
                    <p>Selecciona un usuario para comenzar a chatear</p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-window">
            {/* Header del chat */}
            <div className="chat-header">
                <img
                    src={usuarioSeleccionado.fotoUrl || defaultAvatar(usuarioSeleccionado.nombre)}
                    alt={usuarioSeleccionado.nombre}
                    className="chat-header-avatar"
                    onError={(e) => { e.target.src = defaultAvatar(usuarioSeleccionado.nombre); }}
                />
                <div className="chat-header-info">
                    <h3>{usuarioSeleccionado.nombre}</h3>
                    <span className="chat-header-status">🟢 En línea</span>
                </div>
            </div>

            {/* Mensajes */}
            <div className="chat-mensajes">
                {loading ? (
                    <div className="chat-loading">Cargando mensajes...</div>
                ) : mensajes.length > 0 ? (
                    mensajes.map((mensaje) => {
                        const esMio = mensaje.emisor.id === usuarioActual.id;
                        return (
                            <div
                                key={mensaje.id}
                                className={`mensaje ${esMio ? 'mensaje-mio' : 'mensaje-otro'}`}
                            >
                                {!esMio && (
                                    <img
                                        src={mensaje.emisor.fotoUrl || defaultAvatar(mensaje.emisor.nombre)}
                                        alt={mensaje.emisor.nombre}
                                        className="mensaje-avatar"
                                        onError={(e) => { e.target.src = defaultAvatar(mensaje.emisor.nombre); }}
                                    />
                                )}
                                <div className="mensaje-contenido">
                                    <p>{mensaje.contenido}</p>
                                    <span className="mensaje-fecha">
                                        {formatearFechaRelativa(mensaje.fechaEnvio)}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="sin-mensajes">
                        <p>No hay mensajes aún. ¡Envía el primero! 👋</p>
                    </div>
                )}
                <div ref={mensajesEndRef} />
            </div>

            {/* Formulario de envío */}
            <form className="chat-form" onSubmit={handleEnviar}>
                <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder={`Escribe un mensaje a ${usuarioSeleccionado.nombre}...`}
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

export default ChatWindow;