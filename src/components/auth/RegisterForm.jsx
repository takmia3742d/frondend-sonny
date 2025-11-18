import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import '../../styles/auth.css';

function RegisterForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        confirmPassword: '',
        fotoUrl: '',
    });
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.nombre || !formData.email || !formData.password) {
            setError('Por favor completa todos los campos obligatorios');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const { confirmPassword, ...dataToSend } = formData;
        const result = await register(dataToSend);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Error al registrarse');
        }
    };

    return (
        <div className="auth-container">
            {/* Video de fondo */}
            <video
                className="auth-video-bg"
                autoPlay
                loop
                muted
                playsInline
            >
                <source src="/videos/beach-background.mp4" type="video/mp4" />
                Tu navegador no soporta videos HTML5.
            </video>

            <div className="auth-card">
                <h2>Crear Cuenta</h2>
                <p className="auth-subtitle">Únete a SociaNet hoy</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre completo *</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Juan Pérez"
                            required
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
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña *</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar contraseña *</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Repite tu contraseña"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="fotoUrl">URL de foto de perfil (opcional)</label>
                        <input
                            type="url"
                            id="fotoUrl"
                            name="fotoUrl"
                            value={formData.fotoUrl}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/foto.jpg"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Creando cuenta...' : 'Registrarse'}
                    </button>
                </form>

                <p className="auth-footer">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="auth-link">
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default RegisterForm;