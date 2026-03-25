import { useEffect, useState, useRef } from 'react';
import { X, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import '../styles/discount-modal.css';

const STORAGE_KEY = 'jandula_discount_modal_seen';

function getDelay() {
    const key = 'jandula_discount_delay';
    if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, Math.floor(Math.random() * 5_000) + 10_000);
    }
    return Number(sessionStorage.getItem(key));
}

export default function DiscountModal() {
    const { pathname } = useLocation();
    const [visible,  setVisible]  = useState(false);
    const [email,    setEmail]    = useState('');
    const [step,     setStep]     = useState('form'); // 'form' | 'sending' | 'sent'
    const [errorMsg, setErrorMsg] = useState('');
    const timerRef = useRef(null);

    useEffect(() => {
        if (localStorage.getItem(STORAGE_KEY)) return;

        timerRef.current = setTimeout(() => {
            setVisible(true);
        }, getDelay());

        return () => clearTimeout(timerRef.current);
    }, []);

    // Nunca mostrar en la página de admin
    if (!visible || pathname.startsWith('/admin')) return null;

    const handleClose = () => {
        setVisible(false);
        localStorage.setItem(STORAGE_KEY, '1');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        const trimmed = email.trim().toLowerCase();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setErrorMsg('Introduce un email válido.');
            return;
        }

        setStep('sending');
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-discount-preview`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                    },
                    body: JSON.stringify({ email: trimmed }),
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error al enviar');
            setStep('sent');
            localStorage.setItem(STORAGE_KEY, '1');
        } catch (err) {
            setStep('form');
            setErrorMsg('No pudimos enviar el email. Inténtalo de nuevo.');
        }
    };

    return (
        <>
            <div className="dm-overlay" onClick={handleClose} aria-hidden="true" />

            <div className="dm-modal" role="dialog" aria-modal="true" aria-labelledby="dm-title">
                <button className="dm-close" onClick={handleClose} aria-label="Cerrar">
                    <X size={18} />
                </button>

                {/* Header */}
                <div className="dm-header">
                    <div className="dm-badge">✨ Oferta exclusiva</div>
                    <h2 id="dm-title" className="dm-title">
                        10% de descuento<br />en tu primera compra
                    </h2>
                </div>

                {/* Cuerpo */}
                <div className="dm-body">
                    {step === 'sent' ? (
                        <div className="dm-success">
                            <CheckCircle size={48} className="dm-success__icon" />
                            <h3 className="dm-success__title">¡Revisa tu correo!</h3>
                            <p className="dm-success__text">
                                Te hemos enviado tu código de descuento exclusivo.<br />
                                Comprueba también la carpeta de spam.
                            </p>
                            <button className="dm-cta" onClick={handleClose}>
                                Ir a la tienda <ArrowRight size={16} />
                            </button>
                        </div>
                    ) : (
                        <form className="dm-form" onSubmit={handleSubmit} noValidate>
                            <p className="dm-form__desc">
                                Déjanos tu email y te enviamos un código exclusivo de
                                bienvenida para que estrenes tu primera compra con ventaja.
                            </p>
                            <label htmlFor="dm-email" className="dm-form__label">
                                Tu email
                            </label>
                            <div className="dm-form__row">
                                <div className="dm-form__input-wrap">
                                    <Mail size={16} className="dm-form__icon" />
                                    <input
                                        id="dm-email"
                                        type="email"
                                        className="dm-form__input"
                                        placeholder="hola@ejemplo.com"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        disabled={step === 'sending'}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>
                            {errorMsg && <p className="dm-form__error">{errorMsg}</p>}
                            <button
                                type="submit"
                                className="dm-cta"
                                disabled={step === 'sending'}
                            >
                                {step === 'sending' ? 'Enviando…' : 'Recibir mi descuento'}
                                {step !== 'sending' && <ArrowRight size={16} />}
                            </button>
                            <p className="dm-fine">
                                Sin spam · Un solo uso · Válido para clientes nuevos
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}

