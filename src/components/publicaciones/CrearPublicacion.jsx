import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { crearPublicacion } from '../../api/publicaciones';
import '../../styles/publicaciones.css';

function CrearPublicacion({ onPublicacionCreada }) {
    const { usuario } = useAuth();
    const [contenido, setContenido] = useState('');
    const [imagen, setImagen] = useState(null);
    const [video, setVideo] = useState(null);
    const [previsualizacion, setPrevisualizacion] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImagenChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagen(file);
            setVideo(null);
            setPrevisualizacion(URL.createObjectURL(file));
        }
    };

    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setVideo(file);
            setImagen(null);
            setPrevisualizacion(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!contenido.trim()) {
            setError('Escribe algo para publicar');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('contenido', contenido);
            if (imagen) formData.append('imagen', imagen);
            if (video) formData.append('video', video);

            // ✅ Crear publicación
            await crearPublicacion(usuario.id, formData);

            // ✅ Limpiar formulario
            setContenido('');
            setImagen(null);
            setVideo(null);
            setPrevisualizacion(null);

            // ✅ Notificar al padre para actualizar la lista
            if (onPublicacionCreada) onPublicacionCreada();
        } catch (err) {
            setError(err.message || 'Error al crear publicación');
        } finally {
            setLoading(false);
        }
    };

    const defaultAvatar =
        'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(usuario?.nombre || 'Usuario');

    return (
        <div className="crear-publicacion">
            <div className="crear-publicacion-header">
                <img
                    src={usuario?.fotoUrl || defaultAvatar}
                    alt={usuario?.nombre}
                    className="avatar"
                    onError={(e) => {
                        e.target.src = defaultAvatar;
                    }}
                />
                <h3>Crear publicación</h3>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
        <textarea
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            placeholder={`¿Qué estás pensando, ${usuario?.nombre}?`}
            rows="4"
            disabled={loading}
        />

                {previsualizacion && (
                    <div className="previsualizacion">
                        {imagen && <img src={previsualizacion} alt="Preview" />}
                        {video && <video src={previsualizacion} controls />}
                        <button
                            type="button"
                            onClick={() => {
                                setImagen(null);
                                setVideo(null);
                                setPrevisualizacion(null);
                            }}
                            className="btn-eliminar-preview"
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="crear-publicacion-actions">
                    <div className="file-inputs">
                        <label className="btn-file">
                            📷 Foto
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImagenChange}
                                hidden
                                disabled={loading}
                            />
                        </label>
                        <label className="btn-file">
                            🎥 Video
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                hidden
                                disabled={loading}
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="btn-publicar"
                        disabled={loading || !contenido.trim()}
                    >
                        {loading ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CrearPublicacion;
