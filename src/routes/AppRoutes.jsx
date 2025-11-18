import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import MensajesPage from '../pages/MensajesPage';
import PerfilPage from '../pages/PerfilPage';
import GruposPage from '../pages/GruposPage'; // ✅ NUEVO
import GrupoDetallePage from '../pages/GrupoDetallePage'; // ✅ NUEVO
import PrivateRoute from './PrivateRoute';

function AppRoutes() {
    const { isAuthenticated } = useAuth();

    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route
                    path="/login"
                    element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
                />
                <Route
                    path="/register"
                    element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
                />

                {/* Rutas protegidas */}
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <HomePage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/mensajes"
                    element={
                        <PrivateRoute>
                            <MensajesPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <PrivateRoute>
                            <PerfilPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/perfil/:id"
                    element={
                        <PrivateRoute>
                            <PerfilPage />
                        </PrivateRoute>
                    }
                />

                {/* ✅ NUEVAS RUTAS: Grupos */}
                <Route
                    path="/grupos"
                    element={
                        <PrivateRoute>
                            <GruposPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/grupos/:id"
                    element={
                        <PrivateRoute>
                            <GrupoDetallePage />
                        </PrivateRoute>
                    }
                />

                {/* Ruta por defecto */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;