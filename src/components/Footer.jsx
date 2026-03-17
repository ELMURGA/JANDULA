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

const PayPalIcon = () => (
    <svg viewBox="0 0 24 24" className="footer__payment-svg" aria-label="PayPal" fill="#003087" style={{backgroundColor: '#fff', borderRadius: '4px', padding: '2px'}}>
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C4.996.536 5.33.256 5.706.256h8.868c3.961 0 6.642 1.488 7.376 5.867.755 4.544-1.391 8.232-5.748 8.232h-4.32a.64.64 0 0 0-.632.531l-1.464 9.176a.64.64 0 0 1-.633.535H7.076z" />
    </svg>
);

const ApplePayIcon = () => (
    <svg viewBox="0 0 24 24" className="footer__payment-svg" aria-label="Apple Pay" fill="#fff" style={{backgroundColor: '#000', borderRadius: '4px', padding: '2px'}}>
        <path d="M2.15 4.318a42.16 42.16 0 0 0-.454.003c-.15.005-.303.013-.452.04a1.44 1.44 0 0 0-1.06.772c-.07.138-.114.278-.14.43-.028.148-.037.3-.04.45A10.2 10.2 0 0 0 0 6.222v11.557c0 .07.002.138.003.207.004.15.013.303.04.452.027.15.072.291.142.429a1.436 1.436 0 0 0 .63.63c.138.07.278.115.43.142.148.027.3.036.45.04l.208.003h20.194l.207-.003c.15-.004.303-.013.452-.04.15-.027.291-.071.428-.141a1.432 1.432 0 0 0 .631-.631c.07-.138.115-.278.141-.43.027-.148.036-.3.04-.45.002-.07.003-.138.003-.208l.001-.246V6.221c0-.07-.002-.138-.004-.207a2.995 2.995 0 0 0-.04-.452 1.446 1.446 0 0 0-1.2-1.201 3.022 3.022 0 0 0-.452-.04 10.448 10.448 0 0 0-.453-.003zm0 .512h19.942c.066 0 .131.002.197.003.115.004.25.01.375.032.109.02.2.05.287.094a.927.927 0 0 1 .407.407.997.997 0 0 1 .094.288c.022.123.028.258.031.374.002.065.003.13.003.197v11.552c0 .065 0 .13-.003.196-.003.115-.009.25-.032.375a.927.927 0 0 1-.5.693 1.002 1.002 0 0 1-.286.094 2.598 2.598 0 0 1-.373.032l-.2.003H1.906c-.066 0-.133-.002-.196-.003a2.61 2.61 0 0 1-.375-.032c-.109-.02-.2-.05-.288-.094a.918.918 0 0 1-.406-.407 1.006 1.006 0 0 1-.094-.288 2.531 2.531 0 0 1-.032-.373 9.588 9.588 0 0 1-.002-.197V6.224c0-.065 0-.131.002-.197.004-.114.01-.248.032-.375.02-.108.05-.199.094-.287a.925.925 0 0 1 .407-.406 1.03 1.03 0 0 1 .287-.094c.125-.022.26-.029.375-.032.065-.002.131-.002.196-.003zm4.71 3.7c-.3.016-.668.199-.88.456-.191.22-.36.58-.316.918.338.03.675-.169.888-.418.205-.258.345-.603.308-.955zm2.207.42v5.493h.852v-1.877h1.18c1.078 0 1.835-.739 1.835-1.812 0-1.07-.742-1.805-1.808-1.805zm.852.719h.982c.739 0 1.161.396 1.161 1.089 0 .692-.422 1.092-1.164 1.092h-.979zm-3.154.3c-.45.01-.83.28-1.05.28-.235 0-.593-.264-.981-.257a1.446 1.446 0 0 0-1.23.747c-.527.908-.139 2.255.374 2.995.249.366.549.769.944.754.373-.014.52-.242.973-.242.454 0 .586.242.98.235.41-.007.667-.366.915-.733.286-.417.403-.82.41-.841-.007-.008-.79-.308-.797-1.209-.008-.754.615-1.113.644-1.135-.352-.52-.9-.578-1.09-.593a1.123 1.123 0 0 0-.092-.002zm8.204.397c-.99 0-1.606.533-1.652 1.256h.777c.072-.358.369-.586.845-.586.502 0 .803.266.803.711v.309l-1.097.064c-.951.054-1.488.484-1.488 1.184 0 .72.548 1.207 1.332 1.207.526 0 1.032-.281 1.264-.727h.019v.659h.788v-2.76c0-.803-.62-1.317-1.591-1.317zm1.94.072l1.446 4.009c0 .003-.073.24-.073.247-.125.41-.33.571-.711.571-.069 0-.206 0-.267-.015v.666c.06.011.267.019.335.019.83 0 1.226-.312 1.568-1.283l1.5-4.214h-.868l-1.012 3.259h-.015l-1.013-3.26zm-1.167 2.189v.316c0 .521-.45.917-1.024.917-.442 0-.731-.228-.731-.579 0-.342.278-.56.769-.593z" />
    </svg>
);

const GooglePayIcon = () => (
    <svg viewBox="0 0 24 24" className="footer__payment-svg" aria-label="Google Pay" fill="#5F6368" style={{backgroundColor: '#fff', borderRadius: '4px', padding: '2px', border: '1px solid #dedede'}}>
        <path d="M3.963 7.235A3.963 3.963 0 00.422 9.419a3.963 3.963 0 000 3.559 3.963 3.963 0 003.541 2.184c1.07 0 1.97-.352 2.627-.957.748-.69 1.18-1.71 1.18-2.916a4.722 4.722 0 00-.07-.806H3.964v1.526h2.14a1.835 1.835 0 01-.79 1.205c-.356.241-.814.379-1.35.379-1.034 0-1.911-.697-2.225-1.636a2.375 2.375 0 010-1.517c.314-.94 1.191-1.636 2.225-1.636a2.152 2.152 0 011.52.594l1.132-1.13a3.808 3.808 0 00-2.652-1.033zm6.501.55v6.9h.886V11.89h1.465c.603 0 1.11-.196 1.522-.588a1.911 1.911 0 00.635-1.464 1.92 1.92 0 00-.635-1.456 2.125 2.125 0 00-1.522-.598zm2.427.85a1.156 1.156 0 01.823.365 1.176 1.176 0 010 1.686 1.171 1.171 0 01-.877.357H11.35V8.635h1.487a1.156 1.156 0 01.054 0zm4.124 1.175c-.842 0-1.477.308-1.907.925l.781.491c.288-.417.68-.626 1.175-.626a1.255 1.255 0 01.856.323 1.009 1.009 0 01.366.785v.202c-.34-.193-.774-.289-1.3-.289-.617 0-1.11.145-1.479.434-.37.288-.554.677-.554 1.165a1.476 1.476 0 00.525 1.156c.35.308.785.463 1.305.463.61 0 1.098-.27 1.465-.81h.038v.655h.848v-2.909c0-.61-.19-1.09-.568-1.44-.38-.35-.896-.525-1.551-.525zm2.263.154l1.946 4.422-1.098 2.38h.915L24 9.963h-.965l-1.368 3.391h-.02l-1.406-3.39zm-2.146 2.368c.494 0 .88.11 1.156.33 0 .372-.147.696-.44.973a1.413 1.413 0 01-.997.414 1.081 1.081 0 01-.69-.232.708.708 0 01-.293-.578c0-.257.12-.47.363-.647.24-.173.54-.26.9-.26Z" />
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
                        <PayPalIcon />
                        <ApplePayIcon />
                        <GooglePayIcon />
                    </div>
                </div>
            </div>
        </footer>
    );
}
