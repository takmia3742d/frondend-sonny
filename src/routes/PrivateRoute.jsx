import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Cargando...</div>; // O un componente Loading
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default PrivateRoute;