import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import '../styles/pages.css';

/**
 * OrderConfirmedPage
 *
 * Página que se muestra después de que Stripe redirige al usuario.
 * - Limpia el carrito
 * - Muestra un mensaje de confirmación
 * - Proporciona CTA para ver los pedidos
 *
 * El pago se procesó en Stripe (decisión final de Stripe),
 * se envió el webhook, y se creó el pedido en la base de datos.
 * El email de confirmación se envió automáticamente.
 */

export default function OrderConfirmedPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { clearCart } = useCart();
    const [status, setStatus] = useState('processing');
    const [message, setMessage] = useState('Estamos validando tu pedido y registrandolo en la tienda.');
    const didRun = useRef(false);

    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        window.scrollTo(0, 0);

        async function confirmOrder() {
            if (!sessionId) {
                setStatus('error');
                setMessage('Falta el identificador de la sesion de pago.');
                return;
            }

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session?.access_token) {
                    throw new Error('Tu sesion ha expirado. Inicia sesion de nuevo para validar el pedido.');
                }

                const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/confirm-order`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ sessionId }),
                });

                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.error || 'No se pudo confirmar el pedido.');
                }

                clearCart();
                setStatus('success');
                setMessage(data.alreadyProcessed
                    ? 'Tu pedido ya estaba registrado correctamente.'
                    : 'Tu pedido ha sido confirmado y registrado correctamente.');
            } catch (error) {
                setStatus('error');
                setMessage(error instanceof Error ? error.message : 'No se pudo confirmar el pedido.');
            }
        }

        confirmOrder();
    }, [sessionId]);

    return (
        <main className="page-wrapper" style={{ background: '#faf9f7', minHeight: '80vh' }}>
            <section className="container" style={{ maxWidth: '600px', margin: '0 auto', padding: '5rem 2rem 3rem' }}>

                {/* Success icon */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        background: status === 'error'
                            ? 'linear-gradient(135deg, #fca5a5, #ef4444)'
                            : 'linear-gradient(135deg, #f9a8d4, #e879a4)',
                        borderRadius: '50%',
                        marginBottom: '1.5rem',
                        boxShadow: status === 'error'
                            ? '0 8px 24px rgba(239, 68, 68, 0.25)'
                            : '0 8px 24px rgba(232, 121, 164, 0.3)',
                    }}>
                        {status === 'error'
                            ? <AlertCircle size={40} color="#fff" strokeWidth={1.5} />
                            : <CheckCircle size={40} color="#fff" strokeWidth={1.5} />
                        }
                    </div>
                </div>

                {/* Main message */}
                <h1 style={{
                    textAlign: 'center',
                    fontSize: '2rem',
                    marginBottom: '0.5rem',
                    color: '#111827',
                    fontFamily: 'Georgia, serif',
                }}>
                    {status === 'error' ? 'No hemos podido registrar el pedido' : '¡Pedido Confirmado! 🎉'}
                </h1>

                <p style={{
                    textAlign: 'center',
                    fontSize: '1rem',
                    color: '#6b7280',
                    marginBottom: '2rem',
                    lineHeight: '1.6',
                }}>
                    {status === 'processing'
                        ? 'Estamos terminando de validar tu compra. Esto tarda unos segundos.'
                        : message}
                </p>

                {/* Key info boxes */}
                <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e5e7eb' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.875rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>
                            ID de Sesión de Pago
                        </p>
                        <p style={{
                            fontSize: '0.875rem',
                            fontFamily: 'monospace',
                            color: '#374151',
                            wordBreak: 'break-all',
                        }}>
                            {sessionId ? sessionId.substring(0, 20) + '...' : '(No disponible)'}
                        </p>
                    </div>
                    <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #f3f4f6' }} />
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', lineHeight: '1.6' }}>
                        <strong>¿Qué sucede ahora?</strong><br />
                        {status === 'error'
                            ? 'El pago puede haberse realizado, pero el pedido no se ha guardado aun. No repitas la compra hasta revisarlo.'
                            : 'Recibiras un email de confirmacion con los detalles de tu pedido. Podras rastrear tu envio desde tu cuenta.'}
                    </p>
                </div>

                {/* CTA buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button
                        onClick={() => navigate('/mi-cuenta')}
                        style={{
                            padding: '0.875rem 1.5rem',
                            background: 'linear-gradient(135deg, #f9a8d4, #e879a4)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 8px 16px rgba(232, 121, 164, 0.4)';
                        }}
                        onMouseLeave={e => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        {status === 'error' ? 'Ir a Mi Cuenta' : 'Ver Mis Pedidos'} <ArrowRight size={18} />
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        style={{
                            padding: '0.875rem 1.5rem',
                            background: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #e5e7eb',
                            borderRadius: '50px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'background 0.2s, border-color 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.target.style.background = '#e5e7eb';
                            e.target.style.borderColor = '#d1d5db';
                        }}
                        onMouseLeave={e => {
                            e.target.style.background = '#f3f4f6';
                            e.target.style.borderColor = '#e5e7eb';
                        }}
                    >
                        Continuar Comprando
                    </button>
                </div>

                {/* Info note */}
                <div style={{
                    marginTop: '2rem',
                    padding: '1rem',
                    background: status === 'error' ? '#fef2f2' : '#f0fdf4',
                    border: status === 'error' ? '1px solid #fecaca' : '1px solid #bbf7d0',
                    borderRadius: '8px',
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'flex-start',
                }}>
                    <AlertCircle size={20} color={status === 'error' ? '#dc2626' : '#16a34a'} style={{ flexShrink: 0, marginTop: '0.125rem' }} />
                    <p style={{ fontSize: '0.875rem', color: status === 'error' ? '#b91c1c' : '#15803d', margin: 0 }}>
                        {status === 'error'
                            ? 'Si en unos minutos no ves el pedido en tu cuenta, revisa Stripe y la base de datos antes de cobrar de nuevo.'
                            : 'Hemos enviado un email de confirmacion a tu direccion de correo registrada. Revisa tu bandeja de entrada y spam.'}
                    </p>
                </div>

                {/* Support */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                        ¿Alguna duda sobre tu pedido?
                    </p>
                    <a href="mailto:jandulamodautrera@gmail.com" style={{
                        color: '#e879a4',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}>
                        jandulamodautrera@gmail.com
                    </a>
                </div>

            </section>
        </main>
    );
}
