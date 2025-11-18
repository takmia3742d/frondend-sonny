import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { actualizarPerfil } from '../../api/usuarios';
import '../../styles/editar-perfil.css';

function EditarPerfilModal({ onCerrar, onActualizar }) {
    const { usuario, login } = useAuth();
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || '',
        email: usuario?.email || '',
        bio: usuario?.bio || '',
        foto: null // ✅ Ahora es un archivo, no URL
    });
    const [previewUrl, setPreviewUrl] = useState(usuario?.fotoUrl || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // ✅ MANEJAR SELECCIÓN DE ARCHIVO
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar que sea imagen
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona una imagen válida');
                return;
            }

            // Validar tamaño (máximo 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe pesar más de 5MB');
                return;
            }

            setFormData({
                ...formData,
                foto: file
            });

            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.nombre.trim()) {
            setError('El nombre es obligatorio');
            return;
        }

        if (!formData.email.trim()) {
            setError('El email es obligatorio');
            return;
        }

        setLoading(true);
        try {
            console.log('📤 Actualizando perfil:', formData);

            const usuarioActualizado = await actualizarPerfil(usuario.id, formData);

            console.log('✅ Perfil actualizado:', usuarioActualizado);

            // Actualizar el contexto de autenticación
            await login({ email: formData.email, password: 'dummy' }, true, usuarioActualizado);

            // Guardar en localStorage manualmente
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));

            if (onActualizar) onActualizar();
            onCerrar();

            alert('Perfil actualizado exitosamente');
        } catch (err) {
            console.error('❌ Error al actualizar perfil:', err);
            setError(err.message || 'Error al actualizar perfil');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-editar-perfil" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Editar Perfil</h2>
                    <button className="btn-cerrar-x" onClick={onCerrar}>✕</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="form-editar-perfil">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo *</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Biografía</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder="Cuéntanos sobre ti..."
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    {/* ✅ NUEVO: SELECTOR DE ARCHIVO */}
                    <div className="form-group">
                        <label htmlFor="foto">Foto de perfil</label>
                        <input
                            type="file"
                            id="foto"
                            name="foto"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                        <small style={{ color: '#666', fontSize: '12px' }}>
                            Formatos: JPG, PNG, GIF. Máximo 5MB
                        </small>

                        {previewUrl && (
                            <div className="preview-foto">
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    onError={(e) => {
                                        e.target.src = 'https://ui-avatars.com/api/?name=' +
                                            encodeURIComponent(formData.nombre || 'Usuario');
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="modal-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={onCerrar}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarPerfilModal;