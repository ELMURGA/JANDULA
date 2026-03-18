import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown, ChevronRight, Search, User, Heart } from 'lucide-react';
import logoImg from '../assets/logo-jandula-header.png';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { getCategories } from '../lib/sanity';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import '../styles/navbar.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [expandedMobile, setExpandedMobile] = useState(null);
    const [menuStructure, setMenuStructure] = useState([]);

    useEffect(() => {
        getCategories().then(cats => setMenuStructure(cats));
    }, []);
    const dropdownRef = useRef(null);
    const dropdownTimeout = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [searchOpen, setSearchOpen] = useState(false);
    const { authModalOpen, setAuthModalOpen, isLoggedIn } = useAuth();
    const { wishlistCount } = useWishlist();
    const { cartCount } = useCart();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setDropdownOpen(false);
        setExpandedMobile(null);
    }, [location]);

    const handleDropdownEnter = () => {
        if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
        setDropdownOpen(true);
    };

    const handleDropdownLeave = () => {
        if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
        setDropdownOpen(false);
    };

    return (
        <>
            {/* Top Banner */}
            <div className="top-banner">
                ¡Envíos de 24 a 48 horas!&nbsp;|&nbsp;Envío gratis en pedidos +50€
            </div>

            {/* Main Nav */}
            <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
                <div className="container navbar__inner">
                    {/* Hamburger */}
                    <button className="navbar__hamburger navbar__icon-btn" onClick={() => setMobileOpen(true)} aria-label="Abrir menú">
                        <Menu size={24} />
                    </button>

                    {/* Logo */}
                    <Link to="/" className="navbar__logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src={logoImg} alt="Jándula Moda" className="navbar__logo-img" />
                    </Link>

                    {/* Desktop Links */}
                    <ul className="navbar__links">
                        <li><Link to="/">Inicio</Link></li>
                        <li
                            className="navbar__dropdown"
                            ref={dropdownRef}
                            onMouseEnter={handleDropdownEnter}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button className="navbar__dropdown-trigger">
                                Tienda <ChevronDown size={14} />
                            </button>
                            {dropdownOpen && (
                                <div className="navbar__dropdown-menu">
                                    <Link to="/categoria/todos" className="navbar__dropdown-item navbar__dropdown-item--all">
                                        Ver Todo
                                    </Link>
                                    {menuStructure.map(cat => (
                                        <div key={cat.slug} className="navbar__dropdown-group">
                                            <Link to={`/categoria/${cat.slug}`} className="navbar__dropdown-item">
                                                {cat.name}
                                                {cat.subcategories?.length > 0 && <ChevronRight size={12} className="navbar__dropdown-arrow" />}
                                            </Link>
                                            {cat.subcategories?.length > 0 && (
                                                <div className="navbar__dropdown-sub">
                                                    {cat.subcategories.map(sub => (
                                                        <Link key={sub.slug} to={`/categoria/${sub.slug}`} className="navbar__dropdown-sub-item">
                                                            {sub.name}
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </li>
                        <li><Link to="/categoria/special-price">Ofertas</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                    </ul>

                    {/* Action Icons */}
                    <div className="navbar__icons">
                        <button className="navbar__icon-btn" onClick={() => setSearchOpen(true)} aria-label="Buscar">
                            <Search size={20} />
                        </button>
                        <button className="navbar__icon-btn" onClick={() => isLoggedIn ? navigate('/mi-cuenta') : setAuthModalOpen(true)} aria-label="Mi cuenta">
                            <User size={20} />
                        </button>
                        <Link to="/favoritos" className="navbar__icon-btn navbar__cart-wrapper" aria-label="Favoritos">
                            <Heart size={20} />
                            {wishlistCount > 0 && (
                                <span className="navbar__cart-badge navbar__cart-badge--pink">{wishlistCount}</span>
                            )}
                        </Link>
                        <Link to="/carrito" className="navbar__icon-btn navbar__cart-wrapper" aria-label="Carrito">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="navbar__cart-badge">{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {mobileOpen && (
                <>
                    <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
                    <div className="mobile-menu animate-slide-in-left">
                        <div className="mobile-menu__header">
                            <Link to="/" onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                <img src={logoImg} alt="Jándula Moda" className="mobile-menu__logo" />
                            </Link>
                            <button className="mobile-menu__close" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
                                <X size={22} />
                            </button>
                        </div>
                        <ul className="mobile-menu__links">
                            <li><Link to="/" onClick={() => setMobileOpen(false)}>Inicio</Link></li>
                            <li><Link to="/categoria/todos" onClick={() => setMobileOpen(false)}>Ver Todo</Link></li>
                            <li className="mobile-menu__divider">Categorías</li>
                            {menuStructure.map(cat => (
                                <li key={cat.slug}>
                                    <div className="mobile-menu__cat-row">
                                        <Link to={`/categoria/${cat.slug}`} onClick={() => setMobileOpen(false)}>
                                            {cat.name}
                                        </Link>
                                        {cat.subcategories?.length > 0 && (
                                            <button
                                                className="mobile-menu__expand"
                                                onClick={() => setExpandedMobile(expandedMobile === cat.slug ? null : cat.slug)}
                                                aria-label={`Expandir ${cat.name}`}
                                            >
                                                <ChevronDown size={16} className={expandedMobile === cat.slug ? 'rotated' : ''} />
                                            </button>
                                        )}
                                    </div>
                                    {cat.subcategories?.length > 0 && expandedMobile === cat.slug && (
                                        <ul className="mobile-menu__subcats">
                                            {cat.subcategories.map(sub => (
                                                <li key={sub.slug}>
                                                    <Link to={`/categoria/${sub.slug}`} onClick={() => setMobileOpen(false)}>
                                                        {sub.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                            <li className="mobile-menu__divider">Más</li>
                            <li><Link to="/categoria/special-price" onClick={() => setMobileOpen(false)}>Ofertas</Link></li>
                            <li><Link to="/contacto" onClick={() => setMobileOpen(false)}>Contacto</Link></li>
                            <li><Link to="/carrito" onClick={() => setMobileOpen(false)}>Mi Carrito</Link></li>
                        </ul>
                    </div>
                </>
            )}

            {/* Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Auth Modal */}
            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </>
    );
}
