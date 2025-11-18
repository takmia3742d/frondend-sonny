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
        <div className="lista-publicaciones">
            {publicaciones.map((publicacion) => (
                <PublicacionCard
                    key={publicacion.id}
                    publicacion={publicacion}
                    onActualizar={onActualizar}  // ✅ PASAR onActualizar
                />
            ))}
        </div>
    );
}

export default ListaPublicaciones;