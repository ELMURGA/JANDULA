import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import '../styles/pages.css';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [validSession, setValidSession] = useState(false);

    useEffect(() => {
        // Supabase procesa el hash automáticamente y dispara PASSWORD_RECOVERY
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                setValidSession(true);
            }
        });

        // Comprobación inmediata por si el evento ya se disparo antes de montar
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setValidSession(true);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { setError('Las contraseñas no coinciden'); return; }
        if (password.length < 6) { setError('Mínimo 6 caracteres'); return; }

        setLoading(true);
        setError('');
        try {
            const { error } = await supabase.auth.updateUser({ password });
            if (error) throw error;
            setSuccess(true);
            setTimeout(() => navigate('/mi-cuenta'), 2500);
        } catch (err) {
            setError(err.message || 'Error al actualizar la contraseña');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="page-wrapper" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ maxWidth: '420px', width: '100%', background: '#fff', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
                <h1 style={{ fontSize: '1.5rem', color: '#111827', marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'Georgia, serif' }}>
                    Nueva Contraseña
                </h1>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', textAlign: 'center', marginBottom: '2rem' }}>
                    Escribe tu nueva contraseña para acceder a tu cuenta.
                </p>

                {success ? (
                    <div style={{ textAlign: 'center', color: '#16a34a', padding: '1rem', background: '#f0fdf4', borderRadius: '8px' }}>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>✓ Contraseña actualizada</p>
                        <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Redirigiendo a tu cuenta...</p>
                    </div>
                ) : !validSession ? (
                    <div style={{ textAlign: 'center', color: '#6b7280', padding: '1rem' }}>
                        <p>Procesando enlace...</p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                            Si esto no cambia, el enlace puede haber expirado.{' '}
                            <button
                                onClick={() => navigate('/')}
                                style={{ color: '#e879a4', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                Volver al inicio
                            </button>
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div style={{ color: '#dc2626', background: '#fef2f2', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
                                {error}
                            </div>
                        )}
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                minLength={6}
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>
                                Repetir contraseña
                            </label>
                            <input
                                type="password"
                                value={confirm}
                                onChange={e => setConfirm(e.target.value)}
                                minLength={6}
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '0.875rem',
                                background: 'linear-gradient(135deg, #e879a4, #c2185b)',
                                color: '#fff', border: 'none', borderRadius: '8px',
                                fontSize: '1rem', fontWeight: 600,
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? 'Guardando...' : 'Guardar Contraseña'}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
