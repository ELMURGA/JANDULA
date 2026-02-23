import { products, formatPrice } from '../data/products';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import '../styles/products.css';

export default function SaleGrid() {
    const { addToCart } = useCart();
    const { isLoggedIn, setAuthModalOpen } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const saleProducts = products.filter(p => p.originalPrice !== null);
    const navigate = useNavigate();

    if (saleProducts.length === 0) return null;

    return (
        <section className="products-section sale-section" id="ofertas">
            <div className="container">
                <div className="section-header">
                    <span className="section-eyebrow">SPECIAL PRICE</span>
                    <h2>Ofertas Irresistibles</h2>
                    <p>Prendas de temporada con descuentos exclusivos. ¡No dejes escapar estas oportunidades!</p>
                </div>

                <div className="products-grid">
                    {saleProducts.map((product) => {
                        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                        const isWishlisted = isInWishlist(product.id);
                        return (
                            <article key={product.id} className="product-card product-card--sale">
                                <Link to={`/producto/${product.id}`} className="product-card__image-wrap">
                                    <img src={product.image} alt={product.name} className="product-card__image" loading="lazy" />
                                    <span className="product-card__sale-tag">-{discount}%</span>
                                    <button
                                        className={`product-card__wishlist ${isWishlisted ? 'product-card__wishlist--active' : ''}`}
                                        aria-label={isWishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            if (!isLoggedIn) {
                                                setAuthModalOpen(true);
                                                return;
                                            }
                                            toggleWishlist(product.id);
                                        }}
                                    >
                                        <Heart size={18} fill={isWishlisted ? 'var(--color-brand-pink)' : 'none'} />
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
                                            <ShoppingBag size={14} /> {product.sizes?.length > 0 ? 'Ver Opciones' : 'Añadir al carrito'}
                                        </button>
                                    </div>
                                </Link>
                                <div className="product-card__info">
                                    <p className="product-card__category">{product.category}</p>
                                    <Link to={`/producto/${product.id}`}>
                                        <h3 className="product-card__name">{product.name}</h3>
                                    </Link>
                                    <div className="product-card__prices">
                                        <span className="product-card__price product-card__price--sale">{formatPrice(product.price)}</span>
                                        <span className="product-card__original-price">{formatPrice(product.originalPrice)}</span>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="load-more-wrap">
                    <Link to="/categoria/special-price" className="btn-outline">Ver Todas las Ofertas</Link>
                </div>
            </div>
        </section>
    );
}
