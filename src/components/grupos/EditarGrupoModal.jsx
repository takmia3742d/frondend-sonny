// src/components/grupos/EditarGrupoModal.jsx

import { useState } from 'react';
import { editarGrupo } from '../../api/grupos';
import { API_URL } from '../../utils/constants';
import '../../styles/grupos.css';

function EditarGrupoModal({ grupo, usuarioId, onCerrar, onActualizar }) {
    const [formData, setFormData] = useState({
        nombre: grupo.nombre || '',
        descripcion: grupo.descripcion || ''
    });
    const [fotoFile, setFotoFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(
        grupo.imagenUrl ? `${API_URL}${grupo.imagenUrl}` : ''
    );
    const [editando, setEditando] = useState(false);
    const [error, setError] = useState('');

    const handleFotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona una imagen válida');
                return;
            }

            setFotoFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            setError('');
        }
    };

    /**
     * ✅ CORREGIDO: Pasar parámetros separados (no FormData)
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.nombre.trim()) {
            setError('El nombre del grupo es obligatorio');
            return;
        }

        setEditando(true);
        try {
            console.log('📤 Editando grupo:', {
                grupoId: grupo.id,
                usuarioId: usuarioId,
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                tieneArchivo: fotoFile !== null
            });

            // ✅ CORRECCIÓN: Pasar parámetros separados
            // NO pasar FormData directamente
            const resultado = await editarGrupo(
                grupo.id,           // grupoId
                usuarioId,          // usuarioId
                formData.nombre,    // nombre
                formData.descripcion, // descripcion
                fotoFile            // foto (puede ser null)
            );

            console.log('✅ Respuesta del servidor:', resultado);
            console.log('🖼️ Nueva imagenUrl:', resultado.imagenUrl);
            console.log('🖼️ Anterior imagenUrl:', grupo.imagenUrl);
            console.log('🔍 ¿Cambió la imagen?:', resultado.imagenUrl !== grupo.imagenUrl);

            // Esperar un momento antes de recargar
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Cerrar modal primero
            onCerrar();

            // Luego actualizar
            await onActualizar();

            alert('✅ Grupo actualizado exitosamente');

        } catch (err) {
            console.error('❌ Error al editar grupo:', err);
            setError(err.message || 'Error al editar grupo');
        } finally {
            setEditando(false);
        }
    };

    const defaultGrupoImg = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(formData.nombre || 'Grupo') + '&background=667eea&color=fff';

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-editar-grupo" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Editar Grupo</h2>
                    <button className="btn-cerrar-x" onClick={onCerrar}>✕</button>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="form-editar-grupo">
                    {/* Preview de foto */}
                    <div className="form-group foto-grupo-container">
                        <div className="preview-foto-grupo">
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    onError={(e) => { e.target.src = defaultGrupoImg; }}
                                />
                            ) : (
                                <div className="grupo-placeholder">
                                    {formData.nombre.charAt(0).toUpperCase() || '👥'}
                                </div>
                            )}
                        </div>

                        <label htmlFor="foto-editar" className="btn-cambiar-foto-grupo">
                            📷 Cambiar foto del grupo
                        </label>
                        <input
                            type="file"
                            id="foto-editar"
                            accept="image/*"
                            onChange={handleFotoChange}
                            disabled={editando}
                            style={{ display: 'none' }}
                        />
                        <small style={{ color: '#a8a8a8', fontSize: '12px', textAlign: 'center', display: 'block', marginTop: '8px' }}>
                            Formatos: JPG, PNG, GIF
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="nombre">Nombre del grupo *</label>
                        <input
                            type="text"
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                            placeholder="Nombre del grupo"
                            required
                            disabled={editando}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                            placeholder="Describe el grupo..."
                            rows="4"
                            disabled={editando}
                        />
                    </div>

                    <div className="modal-acciones">
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={onCerrar}
                            disabled={editando}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn-guardar"
                            disabled={editando}
                        >
                            {editando ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditarGrupoModal;