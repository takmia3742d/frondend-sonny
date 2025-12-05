import PublicacionCard from './PublicacionCard';
import '../../styles/publicaciones.css';

function ListaPublicaciones({ publicaciones, loading, onActualizar }) {  // ✅ AGREGAR onActualizar
    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando publicaciones...</p>
            </div>
        );
    }

    if (!publicaciones || publicaciones.length === 0) {
        return (
            <div className="empty-state">
                <h3>😔 No hay publicaciones aún</h3>
                <p>Sé el primero en publicar algo</p>
            </div>
        );
    }

    return (
        <div className="publicaciones-list">
            {publicaciones.map((publicacion) => (
                <div key={publicacion.id} className="publicacion-card-container">
                    <PublicacionCard
                        publicacion={publicacion}
                        onActualizar={onActualizar}
                    />
                </div>
            ))}
        </div>
    );
}

export default ListaPublicaciones;