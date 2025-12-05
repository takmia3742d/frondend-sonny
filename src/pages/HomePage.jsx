import { useState, useEffect } from 'react';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import CrearPublicacion from '../components/publicaciones/CrearPublicacion';
import ListaPublicaciones from '../components/publicaciones/ListaPublicaciones';
import { obtenerPublicaciones } from '../api/publicaciones';
import '../styles/home.css';

function HomePage() {
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const cargarPublicaciones = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await obtenerPublicaciones();
            const publicacionesOrdenadas = data.sort((a, b) =>
                new Date(b.fechaCreacion) - new Date(a.fechaCreacion)
            );
            setPublicaciones(publicacionesOrdenadas);
        } catch (err) {
            setError('Error al cargar publicaciones');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarPublicaciones();
    }, []);

    const handlePublicacionCreada = () => {
        cargarPublicaciones();
    };

    return (
        <div className="home-page">
            <Navbar />

            {/* ✅ Sidebar FUERA del home-container */}
            <Sidebar />

            {/* ✅ Contenedor solo para el feed */}
            <div className="home-container">
                <div className="feed-container">
                    <CrearPublicacion onPublicacionCreada={handlePublicacionCreada} />

                    {error && <div className="error-message">{error}</div>}

                    <ListaPublicaciones
                        publicaciones={publicaciones}
                        loading={loading}
                        onActualizar={cargarPublicaciones}
                    />
                </div>
            </div>
        </div>
    );
}

export default HomePage;