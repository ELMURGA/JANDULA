import { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import logoImg from '../assets/logo-jandula-header.png';
import '../styles/auth-modal.css';

export default function AuthModal({ isOpen, onClose }) {
    const { login, register } = useAuth();
    // mode: 'login' | 'register' | 'forgot'
    const [mode, setMode] = useState('login');
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'forgot') {
                const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-password-recovery`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                    },
                    body: JSON.stringify({
                        email: form.email,
                        siteUrl: window.location.origin,
                    }),
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || 'No se pudo enviar el email de recuperación');
                }

                setSubmitted(true);
                return;
            }
            if (mode === 'login') {
                await login(form.email, form.password);
            } else {
                await register(form.name, form.email, form.password);
            }

            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                onClose();
                setForm({ name: '', email: '', password: '' });
                setMode('login');
            }, 1500);
        } catch (err) {
            console.error('Auth error:', err);
            setError(err.message === 'Invalid login credentials'
                ? 'Email o contraseña incorrectos'
                : err.message || 'Ocurrió un error');
        } finally {
            setLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setForm({ name: '', email: '', password: '' });
        setSubmitted(false);
        setError('');
    };

    return (
        <>
            <div className="auth-overlay" onClick={onClose} />
            <div className="auth-modal">
                <button className="auth-modal__close" onClick={onClose} aria-label="Cerrar">
                    <X size={20} />
                </button>

                <div className="auth-modal__logo-wrap">
                    <img src={logoImg} alt="Jándula Moda" className="auth-modal__logo" />
                </div>

                <div className="auth-modal__header">
                    <h2>
                        {mode === 'login' ? 'Iniciar Sesión'
                            : mode === 'register' ? 'Crear Cuenta'
                            : 'Recuperar Contraseña'}
                    </h2>
                    <p>
                        {mode === 'login'
                            ? 'Accede a tu cuenta para gestionar tus pedidos y favoritos'
                            : mode === 'register'
                            ? 'Regístrate para guardar tus favoritos y disfrutar de ofertas exclusivas'
                            : 'Recibirás un email con el enlace para restablecer tu contraseña'
                        }
                    </p>
                </div>

                {submitted ? (
                    <div className="auth-modal__success">
                        <div className="auth-modal__success-icon">✓</div>
                        <p>
                            {mode === 'login'
                                ? '¡Bienvenida de nuevo!'
                                : mode === 'forgot'
                                ? 'Email enviado. Revisa tu bandeja de entrada.'
                                : '¡Cuenta creada con éxito!'
                            }
                        </p>
                    </div>
                ) : (
                    <form className="auth-modal__form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="auth-modal__error" style={{ color: '#e11d48', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#ffe4e6', borderRadius: '4px' }}>
                                {error}
                            </div>
                        )}
                        {mode === 'register' && (
                            <div className="auth-modal__field">
                                <label htmlFor="auth-name">
                                    <User size={16} />
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    id="auth-name"
                                    name="name"
                                    placeholder="Tu nombre"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}

                        <div className="auth-modal__field">
                            <label htmlFor="auth-email">
                                <Mail size={16} />
                                Email
                            </label>
                            <input
                                type="email"
                                id="auth-email"
                                name="email"
                                placeholder="tu@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {mode !== 'forgot' && (
                            <div className="auth-modal__field">
                                <label htmlFor="auth-password">
                                    <Lock size={16} />
                                    Contraseña
                                </label>
                                <div className="auth-modal__password-wrap">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="auth-password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="auth-modal__toggle-pw"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {mode === 'login' && (
                            <button
                                type="button"
                                className="auth-modal__forgot"
                                onClick={() => { setMode('forgot'); setError(''); setForm(f => ({ ...f, password: '' })); }}
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        )}

                        <button type="submit" className="auth-modal__submit" disabled={loading}>
                            {loading ? 'Cargando...'
                                : mode === 'login' ? 'Iniciar Sesión'
                                : mode === 'register' ? 'Crear Mi Cuenta'
                                : 'Enviar enlace de recuperación'}
                        </button>
                    </form>
                )}

                {mode !== 'forgot' ? (
                    <div className="auth-modal__switch">
                        <span>
                            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        </span>
                        <button onClick={switchMode}>
                            {mode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </div>
                ) : (
                    <div className="auth-modal__switch">
                        <button onClick={() => { setMode('login'); setSubmitted(false); setError(''); }}>
                            ← Volver al inicio de sesión
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
