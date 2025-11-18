import { createContext, useState, useEffect } from 'react';
import { login as loginAPI, register as registerAPI } from '../api/auth';
import { saveUser, getUser, removeUser } from '../utils/storage';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Cargar usuario al iniciar la app
    useEffect(() => {
        const usuarioGuardado = getUser();
        console.log('🔍 [AuthContext] Usuario guardado en localStorage:', usuarioGuardado);
        if (usuarioGuardado) {
            setUsuario(usuarioGuardado);
            console.log('✅ [AuthContext] Usuario cargado desde localStorage');
        }
        setLoading(false);
    }, []);

    // Registro
    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);
            console.log('📝 [AuthContext] Iniciando registro...');
            const data = await registerAPI(userData);
            console.log('✅ [AuthContext] Datos recibidos del registro:', data);

            if (!data.id) {
                console.error('❌ [AuthContext] ERROR: Los datos NO tienen ID:', data);
                throw new Error('El servidor no devolvió el ID del usuario');
            }

            setUsuario(data);
            saveUser(data);
            console.log('✅ [AuthContext] Usuario guardado en estado y localStorage');
            return { success: true };
        } catch (err) {
            console.error('❌ [AuthContext] Error en registro:', err);
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);
            console.log('🔐 [AuthContext] Iniciando login con:', credentials.email);
            const data = await loginAPI(credentials);
            console.log('✅ [AuthContext] Datos recibidos del login:', data);

            // ✅ VERIFICAR QUE TENGA ID
            if (!data.id) {
                console.error('❌ [AuthContext] ERROR: Los datos NO tienen ID:', data);
                throw new Error('El servidor no devolvió el ID del usuario');
            }

            console.log('🔄 [AuthContext] Guardando usuario en estado...');
            setUsuario(data);

            console.log('💾 [AuthContext] Guardando usuario en localStorage...');
            saveUser(data);

            console.log('✅ [AuthContext] Login completado exitosamente');
            return { success: true };
        } catch (err) {
            console.error('❌ [AuthContext] Error en login:', err);
            setError(err);
            return { success: false, error: err };
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = () => {
        console.log('👋 [AuthContext] Cerrando sesión');
        setUsuario(null);
        removeUser();
    };

    // ✅ LOG del estado actual
    console.log('🔄 [AuthContext] Estado actual - usuario:', usuario, '| loading:', loading);

    return (
        <AuthContext.Provider
            value={{
                usuario,
                loading,
                error,
                register,
                login,
                logout,
                isAuthenticated: !!usuario,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}