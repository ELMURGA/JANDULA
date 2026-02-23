import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown, ChevronRight, Search, User, Heart } from 'lucide-react';
import logoImg from '../assets/logo-jandula-header.png';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import '../styles/navbar.css';

const menuStructure = [
    {
        name: 'Nueva Colección',
        slug: 'nueva-coleccion',
    },
    {
        name: 'Invitada Talla Grande',
        slug: 'invitada-talla-grande',
    },
    {
        name: 'Casual',
        slug: 'casual',
        subcategories: [
            { name: 'Camisas y Chalecos', slug: 'casual-camisas-chalecos' },
            { name: 'Camisetas y Tops', slug: 'casual-camisetas-tops' },
            { name: 'Chaquetas', slug: 'casual-chaquetas' },
            { name: 'Faldas y Shorts', slug: 'casual-faldas-shorts' },
            { name: 'Pantalones y Monos', slug: 'casual-pantalones-monos' },
            { name: 'Total Casual Look', slug: 'casual-total-look' },
            { name: 'Vestidos', slug: 'casual-vestidos' },
        ],
    },
    {
        name: 'Fiesta',
        slug: 'fiesta',
        subcategories: [
            { name: 'Conjunto Dos Piezas', slug: 'fiesta-conjunto-dos-piezas' },
            { name: 'Vestidos Fiesta', slug: 'fiesta-vestidos' },
            { name: 'Vestidos Largos Fiesta', slug: 'fiesta-vestidos-largos' },
        ],
    },
    {
        name: 'Complementos',
        slug: 'complementos',
        subcategories: [
            { name: 'Anillos', slug: 'complementos-anillos' },
            { name: 'Cinturones', slug: 'complementos-cinturones' },
            { name: 'Collares', slug: 'complementos-collares' },
            { name: 'Pendientes', slug: 'complementos-pendientes' },
            { name: 'Pulseras', slug: 'complementos-pulseras' },
            { name: 'Tocados', slug: 'complementos-tocados' },
        ],
    },
    {
        name: 'Bolsos',
        slug: 'bolsos',
    },
    {
        name: 'Special Price',
        slug: 'special-price',
    },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [expandedMobile, setExpandedMobile] = useState(null);
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
                                                {cat.subcategories && <ChevronRight size={12} className="navbar__dropdown-arrow" />}
                                            </Link>
                                            {cat.subcategories && (
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
                                        {cat.subcategories && (
                                            <button
                                                className="mobile-menu__expand"
                                                onClick={() => setExpandedMobile(expandedMobile === cat.slug ? null : cat.slug)}
                                                aria-label={`Expandir ${cat.name}`}
                                            >
                                                <ChevronDown size={16} className={expandedMobile === cat.slug ? 'rotated' : ''} />
                                            </button>
                                        )}
                                    </div>
                                    {cat.subcategories && expandedMobile === cat.slug && (
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
