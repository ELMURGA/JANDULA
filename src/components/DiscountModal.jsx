import { useEffect, useState, useRef } from 'react';
import { X, Tag, Copy, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/discount-modal.css';

const STORAGE_KEY   = 'jandula_discount_modal_seen';
const DISCOUNT_CODE = 'BIENVENIDA10';

function getDelay() {
    // Calculado una sola vez por sesión
    const key = 'jandula_discount_delay';
    if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, Math.floor(Math.random() * 10_000) + 30_000);
    }
    return Number(sessionStorage.getItem(key));
}

export default function DiscountModal() {
    const { isLoggedIn, setAuthModalOpen } = useAuth();
    const navigate       = useNavigate();
    const [visible, setVisible] = useState(false);
    const [copied,  setCopied]  = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        // No mostrar si ya se ha visto antes
        if (localStorage.getItem(STORAGE_KEY)) return;

        timerRef.current = setTimeout(() => {
            setVisible(true);
        }, getDelay());

        return () => clearTimeout(timerRef.current);
    }, []);

    const handleClose = () => {
        setVisible(false);
        localStorage.setItem(STORAGE_KEY, '1');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(DISCOUNT_CODE).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    };

    const handleCta = () => {
        handleClose();
        if (isLoggedIn) {
            navigate('/categoria/todos');
        } else {
            setAuthModalOpen(true);
        }
    };

    if (!visible) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="dm-overlay"
                onClick={handleClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                className="dm-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dm-title"
            >
                {/* Close */}
                <button className="dm-close" onClick={handleClose} aria-label="Cerrar">
                    <X size={18} />
                </button>

                {/* Header con gradiente de marca */}
                <div className="dm-header">
                    <div className="dm-badge">
                        <Tag size={16} />
                        Oferta exclusiva
                    </div>
                    <h2 id="dm-title" className="dm-title">
                        10% de descuento<br />en tu primera compra
                    </h2>
                    <p className="dm-subtitle">
                        Regístrate y usa este código al finalizar tu pedido
                    </p>
                </div>

                {/* Código */}
                <div className="dm-code-wrap">
                    <span className="dm-code-label">Tu código de bienvenida</span>
                    <div className="dm-code-box">
                        <span className="dm-code">{DISCOUNT_CODE}</span>
                        <button
                            className={`dm-copy-btn ${copied ? 'dm-copy-btn--done' : ''}`}
                            onClick={handleCopy}
                            aria-label="Copiar código"
                        >
                            {copied ? <Check size={16} /> : <Copy size={16} />}
                            {copied ? 'Copiado' : 'Copiar'}
                        </button>
                    </div>
                </div>

                {/* CTA */}
                <button className="dm-cta" onClick={handleCta}>
                    {isLoggedIn ? 'Ir a la tienda' : 'Crear mi cuenta gratis'}
                    <ArrowRight size={16} />
                </button>

                {/* Fine print */}
                <p className="dm-fine">
                    Válido para clientes nuevos · Un solo uso por cuenta
                </p>
            </div>
        </>
    );
}
