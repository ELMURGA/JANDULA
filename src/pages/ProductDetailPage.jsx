import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct, getProducts } from '../lib/sanity';
import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, ChevronRight, Truck, ShieldCheck, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { normalizeProduct, formatPrice } from '../utils/productUtils';
import WhatsAppIcon from '../components/WhatsAppIcon';
import '../styles/pages.css';

function slugifyCategory(category) {
    return String(category || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '-');
}

export default function ProductDetailPage() {
    const { id: slug } = useParams(); // Ahora es slug, no ID numérico
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const { wishlistItems, toggleWishlist } = useWishlist();

    useEffect(() => {
        async function loadProduct() {
            try {
                setLoading(true);
                // Cargar producto por slug desde Sanity
                const productData = await getProduct(slug);
                
                if (!productData) {
                    setProduct(null);
                    return;
                }

                const normalizedProduct = normalizeProduct(productData);
                setProduct(normalizedProduct);

                // Cargar productos relacionados
                const allProducts = await getProducts();
                const related = allProducts
                    .filter(p => p.category === productData.category && p._id !== productData._id)
                    .slice(0, 5);

                setRelatedProducts(related.map(normalizeProduct));
            } catch (error) {
                console.error('Error cargando producto:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [slug]);

    if (loading) {
        return (
            <main className="page-wrapper">
                <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
                    <p style={{ color: 'var(--color-stone-500)' }}>Cargando producto...</p>
                </div>
            </main>
        );
    }

    if (!product) {
        return (
            <main className="page-wrapper">
                <div className="container" style={{ textAlign: 'center', padding: '6rem 0' }}>
                    <h1>Producto no encontrado</h1>
                    <p style={{ marginTop: '1rem', color: 'var(--color-stone-500)' }}>
                        Lo sentimos, el producto que buscas no existe.
                    </p>
                    <Link to="/categoria/todos" className="btn-primary" style={{ marginTop: '2rem', display: 'inline-block' }}>
                        Ver Todos los Productos
                    </Link>
                </div>
            </main>
        );
    }

    const wishlisted = wishlistItems?.some(item => item.id === product.id) || false;

    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;

    const handleAddToCart = () => {
        if (product.sizes?.length > 0 && !selectedSize) {
            alert('Por favor, selecciona una talla antes de añadir al carrito.');
            return;
        }
        if (product.colors?.length > 0 && !selectedColor) {
            alert('Por favor, selecciona un color antes de añadir al carrito.');
            return;
        }
        addToCart(product, selectedSize, quantity, selectedColor);
    };

    const handleBuyWhatsApp = () => {
        const sizeText = selectedSize ? ` (Talla: ${selectedSize})` : '';
        const colorText = selectedColor ? ` (Color: ${selectedColor})` : '';
        const text = `Hola, me interesa el producto: ${product.name}${sizeText}${colorText} — ${formatPrice(product.price)} x ${quantity} unidad(es)`;
        window.open(`https://wa.me/34610505303?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <main className="page-wrapper">
            <div className="container">
                <div className="breadcrumb" style={{ padding: '1.5rem 0' }}>
                    <Link to="/">Inicio</Link>
                    <ChevronRight size={14} />
                    <Link to={`/categoria/${slugifyCategory(product.category)}`}>{product.category}</Link>
                    <ChevronRight size={14} />
                    <span>{product.name}</span>
                </div>

                <div className="product-detail">
                    {/* Image — usa imageHD (1200px, calidad 95%) */}
                    <div className="product-detail__gallery">
                        <div className={`product-detail__main-img${product.imageRotation ? ` product-detail__main-img--rot-${product.imageRotation}` : ''}`}>
                            {discount && <span className="product-detail__discount">-{discount}%</span>}
                            <img src={product.imageHD || product.image} alt={product.name} />
                        </div>
                        {/* Galería adicional si existe */}
                        {product.gallery?.length > 0 && (
                            <div className="product-detail__thumbs">
                                {product.gallery.map((img, i) => (
                                    <img key={i} src={img} alt={`${product.name} ${i + 1}`} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="product-detail__info">
                        <p className="product-detail__category">{product.category}</p>
                        <h1 className="product-detail__title">{product.name}</h1>

                        <div className="product-detail__prices">
                            <span className="product-detail__price">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                                <span className="product-detail__original">{formatPrice(product.originalPrice)}</span>
                            )}
                            {discount && <span className="product-detail__save">Ahorras {formatPrice(product.originalPrice - product.price)}</span>}
                        </div>

                        <p className="product-detail__desc">{product.description}</p>

                        {/* Colors */}
                        {product.colors && product.colors.length > 0 && (
                            <div className="product-detail__sizes">
                                <p className="product-detail__label">Color</p>
                                <div className="size-options">
                                    {product.colors.map(color => (
                                        <button
                                            key={color}
                                            className={`size-btn ${selectedColor === color ? 'active' : ''}`}
                                            onClick={() => setSelectedColor(color)}
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sizes */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div className="product-detail__sizes">
                                <p className="product-detail__label">Talla</p>
                                <div className="size-options">
                                    {product.sizes.map(size => (
                                        <button
                                            key={size}
                                            className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                            onClick={() => setSelectedSize(size)}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity */}
                        <div className="product-detail__quantity">
                            <p className="product-detail__label">Cantidad</p>
                            <div className="quantity-control">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="product-detail__actions">
                            <button className="btn-primary btn-lg" onClick={handleAddToCart}>
                                <ShoppingBag size={18} /> Añadir al Carrito
                            </button>
                            <button className="btn-whatsapp btn-lg" onClick={handleBuyWhatsApp}>
                                <WhatsAppIcon size={20} color="#fff" /> Comprar por WhatsApp
                            </button>
                            <button
                                className={`btn-wishlist ${wishlisted ? 'active' : ''}`}
                                onClick={() => toggleWishlist(product)}
                            >
                                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Guarantees */}
                        <div className="product-detail__guarantees">
                            <div><Truck size={18} /> <span>Envío 24-48h a toda España</span></div>
                            <div><ShieldCheck size={18} /> <span>Pago 100% seguro</span></div>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <h2>También te puede gustar</h2>
                        <div className="related-grid">
                            {relatedProducts.map(p => (
                                <Link key={p.id} to={`/producto/${p.slug}`} className="related-card">
                                    <img src={p.image} alt={p.name} loading="lazy" />
                                    <div className="related-card__info">
                                        <h3>{p.name}</h3>
                                        <span>{formatPrice(p.price)}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
