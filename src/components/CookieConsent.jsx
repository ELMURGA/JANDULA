import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CookieConsent() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('jandula_cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('jandula_cookie_consent', 'accepted');
        setVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('jandula_cookie_consent', 'rejected');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div className="cookie-banner">
            <div className="cookie-banner__content">
                <p>
                    Utilizamos cookies para mejorar tu experiencia de compra. Al continuar navegando, aceptas su uso.{' '}
                    <Link to="/politica-cookies">Más información</Link>
                </p>
                <div className="cookie-banner__actions">
                    <button className="cookie-btn cookie-btn--accept" onClick={handleAccept}>
                        Aceptar
                    </button>
                    <button className="cookie-btn cookie-btn--reject" onClick={handleReject}>
                        Rechazar
                    </button>
                </div>
            </div>
        </div>
    );
}
