import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { products, formatPrice } from '../data/products';
import '../styles/pages.css';

export default function FavoritesPage() {
    const { wishlist, removeFromWishlist } = useWishlist();
    const { isLoggedIn, setAuthModalOpen } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // If not logged in, prompt to log in
    if (!isLoggedIn) {
        return (
            <main className="page-wrapper">
                <div className="page-hero page-hero--category">
                    <h1>Mis Favoritos</h1>
                    <p>Guarda tus productos preferidos para comprarlos cuando quieras</p>
                </div>
                <section className="favorites-page container">
                    <div className="favorites-empty">
                        <Heart size={48} strokeWidth={1.5} />
                        <h2>Inicia sesión para ver tus favoritos</h2>
                        <p>Guarda los productos que más te gusten y encuéntralos siempre aquí.</p>
                        <button className="favorites-empty__login-btn" onClick={() => setAuthModalOpen(true)}>
                            Iniciar Sesión
                        </button>
                    </div>
                </section>
            </main>
        );
    }

    const favoriteProducts = products.filter(p => wishlist.includes(p.id));

    return (
        <main className="page-wrapper">
            <div className="page-hero page-hero--category">
                <h1>Mis Favoritos</h1>
                <p>{favoriteProducts.length} producto{favoriteProducts.length !== 1 && 's'} guardado{favoriteProducts.length !== 1 && 's'}</p>
            </div>

            <section className="favorites-page container">
                {favoriteProducts.length > 0 ? (
                    <>
                        <div className="category-grid">
                            {favoriteProducts.map(product => (
                                <article key={product.id} className="product-card">
                                    <Link to={`/producto/${product.id}`} className="product-card__image-wrap">
                                        <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" />
                                        {product.tags && product.tags[0] && (
                                            <span className="product-card__tag">{product.tags[0]}</span>
                                        )}
                                        <button
                                            className="product-card__wishlist product-card__wishlist--active"
                                            aria-label="Quitar de favoritos"
                                            onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id); }}
                                        >
                                            <Heart size={18} fill="var(--color-brand-pink)" />
                                        </button>
                                        <div className="product-card__add">
                                            <button
                                                className="product-card__add-btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    if (product.sizes?.length > 0) {
                                                        navigate(`/producto/${product.id}`);
                                                    } else {
                                                        addToCart(product);
                                                    }
                                                }}
                                            >
                                                <ShoppingBag size={14} />
                                                {product.sizes?.length > 0 ? 'Ver Opciones' : 'Añadir al carrito'}
                                            </button>
                                        </div>
                                    </Link>
                                    <div className="product-card__info">
                                        <p className="product-card__category">{product.category}</p>
                                        <Link to={`/producto/${product.id}`}>
                                            <h3 className="product-card__name">{product.name}</h3>
                                        </Link>
                                        <div className="product-card__prices">
                                            <span className="product-card__price">{formatPrice(product.price)}</span>
                                            {product.originalPrice && (
                                                <span className="product-card__original-price">{formatPrice(product.originalPrice)}</span>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <div className="favorites-actions">
                            <Link to="/categoria/todos" className="favorites-actions__continue">
                                <ArrowLeft size={16} />
                                Seguir Comprando
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="favorites-empty">
                        <Heart size={48} strokeWidth={1.5} />
                        <h2>Aún no tienes favoritos</h2>
                        <p>Explora nuestra colección y guarda los productos que más te gusten haciendo clic en el corazón.</p>
                        <Link to="/categoria/todos" className="favorites-empty__browse-btn">
                            Explorar Productos
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}
