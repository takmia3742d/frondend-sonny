import { TOKEN_KEY } from './constants';

// Guardar usuario en localStorage
export const saveUser = (userData) => {
    console.log('💾 [storage] Guardando en localStorage:', userData);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(userData));
    console.log('✅ [storage] Guardado exitosamente');
};

// Obtener usuario de localStorage
export const getUser = () => {
    const userData = localStorage.getItem(TOKEN_KEY);
    console.log('📖 [storage] Leyendo de localStorage:', userData);
    return userData ? JSON.parse(userData) : null;
};

// Eliminar usuario de localStorage
export const removeUser = () => {
    console.log('🗑️ [storage] Eliminando usuario de localStorage');
    localStorage.removeItem(TOKEN_KEY);
};

// Verificar si hay usuario logueado
export const isAuthenticated = () => {
    return getUser() !== null;
};