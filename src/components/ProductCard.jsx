import { Heart, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { OptimizedImage } from '../utils/imageOptimization';
import '../styles/products.css';

export default function ProductCard({ product }) {
    const { isLoggedIn, setAuthModalOpen } = useAuth();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();
    const wishlisted = isInWishlist(product.id);
    const navigate = useNavigate();

    const handleAddClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.sizes?.length > 0) {
            navigate(`/producto/${product.id}`);
        } else {
            addToCart(product);
        }
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isLoggedIn) {
            setAuthModalOpen(true);
            return;
        }
        toggleWishlist(product.id);
    };

    return (
        <article className="product-card">
            <Link to={`/producto/${product.id}`} className="product-card__image-wrap">
                <OptimizedImage
                    src={product.image}
                    alt={product.name}
                    className="product-card__image"
                    width={300}
                    height={300}
                />

                {product.tags && product.tags[0] && (
                    <span className="product-card__tag">{product.tags[0]}</span>
                )}

                {product.originalPrice && (
                    <span className="product-card__sale-tag">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                )}

                <button
                    className={`product-card__wishlist ${wishlisted ? 'product-card__wishlist--active' : ''}`}
                    aria-label={wishlisted ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    onClick={handleWishlist}
                >
                    <Heart size={18} fill={wishlisted ? 'var(--color-brand-pink)' : 'none'} />
                </button>

                <div className="product-card__add">
                    <button
                        className="product-card__add-btn"
                        onClick={handleAddClick}
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
    );
}
