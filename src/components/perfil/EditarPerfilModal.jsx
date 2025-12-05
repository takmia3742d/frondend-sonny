import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { actualizarPerfil } from '../../api/usuarios';
import { getAvatarUrl } from '../../utils/imageUtils';
import '../../styles/editar-perfil.css';

function EditarPerfilModal({ onCerrar, onActualizar }) {
    const { usuario, updateUser } = useAuth();

    if (!usuario) {
        return (
            <div className="modal-overlay" onClick={onCerrar}>
                <div className="modal-editar-perfil" onClick={(e) => e.stopPropagation()}>
                    <p>⚠️ Error: Usuario no identificado</p>
                    <button onClick={onCerrar}>Cerrar</button>
                </div>
            </div>
        );
    }

    const [formData, setFormData] = useState({
        nombre: usuario.nombre || '',
        email: usuario.email || '',
        bio: usuario.bio || '',
        foto: null
    });
    const [previewUrl, setPreviewUrl] = useState(getAvatarUrl(usuario.fotoUrl, usuario.nombre));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona una imagen válida');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError('La imagen no debe pesar más de 5MB');
                return;
            }

            setError('');
            setFormData(prev => ({
                ...prev,
                foto: file
            }));

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
        setSuccess('');

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
            console.log('📤 [EditarPerfilModal] Actualizando perfil:', {
                usuarioId: usuario.id,
                nombre: formData.nombre,
                email: formData.email,
                bio: formData.bio,
                tieneArchivo: !!formData.foto
            });

            const usuarioActualizado = await actualizarPerfil(usuario.id, formData);

            console.log('✅ [EditarPerfilModal] Perfil actualizado:', usuarioActualizado);
            console.log('📸 FotoUrl recibida:', usuarioActualizado.fotoUrl);

            // ✅ Actualizar contexto con usuario modificado
            updateUser(usuarioActualizado);

            setSuccess('✅ Perfil actualizado exitosamente');

            // ✅ Esperar a que se actualice y luego cerrar
            setTimeout(() => {
                console.log('🔄 [EditarPerfilModal] Llamando onActualizar para recargar perfil');
                if (onActualizar) onActualizar();
                onCerrar();
            }, 1000);

        } catch (err) {
            console.error('❌ [EditarPerfilModal] Error:', err);
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

                {error && <div className="error-message" style={{ color: '#ff4444' }}>❌ {error}</div>}
                {success && <div className="success-message" style={{ color: '#44ff44' }}>{success}</div>}

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
                                        e.target.src = getAvatarUrl(null, formData.nombre || 'Usuario');
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
                            {loading ? '⏳ Guardando...' : '✅ Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarPerfilModal;