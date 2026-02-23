import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Mail } from 'lucide-react';
import logoImg from '../assets/logo-jandula.png';
import '../styles/sections.css';

/* SVG Payment Icons */
const VisaIcon = () => (
    <svg viewBox="0 0 780 500" className="footer__payment-svg" aria-label="Visa">
        <rect width="780" height="500" rx="40" fill="#1A1F71" />
        <path d="M293.2 348.7l33.4-195.8h53.3l-33.4 195.8zM540.7 157.2c-10.5-4-27.1-8.3-47.7-8.3-52.6 0-89.7 26.4-89.9 64.3-.3 28 26.5 43.6 46.7 52.9 20.8 9.5 27.8 15.7 27.7 24.2-.1 13.1-16.6 19-32 19-21.3 0-32.7-3-50.2-10.3l-7-3.2-7.5 44c12.5 5.4 35.5 10.1 59.4 10.4 56 0 92.3-26.1 92.7-66.7.2-22.2-14-39.1-44.8-53-18.7-9-30.1-15-30-24.2 0-8.1 9.7-16.8 30.6-16.8 17.4-.3 30.1 3.5 39.9 7.5l4.8 2.3 7.3-42.8zM641.7 152.9h-41.2c-12.8 0-22.3 3.5-27.9 16.2L490 348.7h56s9.1-24 11.2-29.3h68.4c1.6 6.9 6.5 29.3 6.5 29.3h49.5l-40-195.8zm-65.8 126.1c4.4-11.2 21.3-54.4 21.3-54.4-.3.5 4.4-11.3 7.1-18.6l3.6 16.8s10.2 46.6 12.4 56.2h-44.4zM239.7 152.9L187.5 284l-5.6-27c-9.7-31.2-39.9-65-73.6-81.9l47.8 172.3h56.4l83.9-194.5h-56.7z" fill="#fff" />
        <path d="M131.9 152.9H46.5l-.7 4c66.9 16.2 111.2 55.2 129.5 102.1L157 173.3c-3.2-12.4-12.7-16.1-25.1-16.4z" fill="#F9A533" />
    </svg>
);

const MastercardIcon = () => (
    <svg viewBox="0 0 780 500" className="footer__payment-svg" aria-label="Mastercard">
        <rect width="780" height="500" rx="40" fill="#16366F" />
        <circle cx="330" cy="250" r="150" fill="#D9222A" />
        <circle cx="450" cy="250" r="150" fill="#EE9F2D" />
        <path d="M390 130.7c-35.4 28-58 71.6-58 120.3s22.6 92.3 58 120.3c35.4-28 58-71.6 58-120.3s-22.6-92.3-58-120.3z" fill="#EB6F2E" />
    </svg>
);

const BizumIcon = () => (
    <svg viewBox="0 0 780 500" className="footer__payment-svg" aria-label="Bizum">
        <rect width="780" height="500" rx="40" fill="#05C3DD" />
        <text x="390" y="280" textAnchor="middle" fill="#fff" fontSize="160" fontWeight="700" fontFamily="Arial, sans-serif">bizum</text>
    </svg>
);

const ContraReembolsoIcon = () => (
    <svg viewBox="0 0 780 500" className="footer__payment-svg" aria-label="Contra Reembolso">
        <rect width="780" height="500" rx="40" fill="#4CAF50" />
        <text x="390" y="240" textAnchor="middle" fill="#fff" fontSize="80" fontWeight="700" fontFamily="Arial, sans-serif">CONTRA</text>
        <text x="390" y="330" textAnchor="middle" fill="#fff" fontSize="80" fontWeight="700" fontFamily="Arial, sans-serif">REEMBOLSO</text>
    </svg>
);

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="footer" id="contacto">
            <div className="container">
                <div className="footer__grid">
                    {/* Brand */}
                    <div>
                        <img src={logoImg} alt="Jándula Moda" className="footer__logo" />
                        <p className="footer__brand-desc">
                            Tu destino de moda femenina en Utrera. Desde vestidos de fiesta hasta estilismos
                            casuales, te ayudamos a encontrar tu look perfecto con prendas cuidadosamente seleccionadas.
                        </p>
                        <div className="footer__socials">
                            <a href="https://www.instagram.com/jandulamodautrera/?hl=es" target="_blank" rel="noopener noreferrer" className="footer__social-btn" aria-label="Instagram">
                                <Instagram size={18} />
                            </a>
                            <a href="https://www.tiktok.com/@jandula_utrera?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" className="footer__social-btn" aria-label="TikTok">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                </svg>
                            </a>
                            <a href="https://wa.me/34610505303" target="_blank" rel="noopener noreferrer" className="footer__social-btn footer__social-btn--whatsapp" aria-label="WhatsApp">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.003 0h-.006C5.382 0 0 5.382 0 12.003c0 2.625.849 5.054 2.289 7.032L.792 23.385l4.497-1.473A11.945 11.945 0 0012.003 24C18.621 24 24 18.618 24 12.003 24 5.382 18.621 0 12.003 0zm6.99 16.956c-.291.822-1.71 1.572-2.355 1.626-.588.048-1.311.069-2.115-.132a19.278 19.278 0 01-1.917-.711c-3.375-1.455-5.574-4.866-5.745-5.091-.168-.225-1.377-1.83-1.377-3.492 0-1.662.873-2.481 1.182-2.82.309-.339.675-.423.9-.423s.45.003.648.012c.207.009.486-.078.759.579.291.702.975 2.388 1.062 2.559.087.171.144.372.03.597-.114.225-.171.366-.342.564-.171.198-.36.441-.513.591-.171.171-.348.357-.15.699.198.342.879 1.452 1.89 2.355 1.296 1.158 2.388 1.518 2.727 1.689.339.171.537.144.735-.087.198-.231.846-.987 1.071-1.326.225-.339.45-.282.759-.171.309.111 1.965.927 2.301 1.095.339.171.561.255.648.393.087.138.087.81-.204 1.632z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <p className="footer__col-title">Contacto</p>
                        <ul className="footer__contact-list">
                            <li className="footer__contact-item">
                                <MapPin size={17} className="footer__contact-icon" />
                                <span>Av. María Auxiliadora, 76<br />41710 Utrera, Sevilla (España)</span>
                            </li>
                            <li className="footer__contact-item">
                                <Phone size={17} className="footer__contact-icon" />
                                <a href="tel:+34610505303">610 505 303</a>
                            </li>
                            <li className="footer__contact-item">
                                <Mail size={17} className="footer__contact-icon" />
                                <a href="mailto:jandulamodautrera@gmail.com">jandulamodautrera@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <p className="footer__col-title">Tienda</p>
                        <ul className="footer__link-list">
                            <li><Link to="/categoria/todos">Ver Todos los Productos</Link></li>
                            <li><Link to="/categoria/nueva-coleccion">Nueva Colección</Link></li>
                            <li><Link to="/categoria/fiesta">Vestidos de Fiesta</Link></li>
                            <li><Link to="/categoria/special-price">Ofertas y Promociones</Link></li>
                            <li><Link to="/contacto">Contacto</Link></li>
                        </ul>
                    </div>

                    {/* Info Links */}
                    <div>
                        <p className="footer__col-title">Información</p>
                        <ul className="footer__link-list">
                            <li><Link to="/devoluciones">Envíos y Devoluciones</Link></li>
                            <li><Link to="/politica-privacidad">Política de Privacidad</Link></li>
                            <li><Link to="/politica-cookies">Política de Cookies</Link></li>
                            <li><Link to="/accesibilidad">Accesibilidad</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="footer__bottom">
                    <p>© {year} Jándula Moda Utrera. Todos los derechos reservados.</p>
                    <div className="footer__payments">
                        <VisaIcon />
                        <MastercardIcon />
                        <BizumIcon />
                        <ContraReembolsoIcon />
                    </div>
                </div>
            </div>
        </footer>
    );
}
