import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProduct, getProducts } from '../lib/sanity';
import { useState, useEffect } from 'react';
import { Heart, ShoppingBag, ChevronRight, Truck, ShieldCheck, Minus, Plus } from 'lucide-react';
import { useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { normalizeProduct, formatPrice } from '../utils/productUtils';
import WhatsAppIcon from '../components/WhatsAppIcon';
import SEOHead from '../components/SEOHead';
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
    const [activeImg, setActiveImg] = useState(0);
    const [notifyName, setNotifyName] = useState('');
    const [notifyEmail, setNotifyEmail] = useState('');
    const [notifySent, setNotifySent] = useState(false);
    const [notifySending, setNotifySending] = useState(false);
    const scrollRef = useRef(null);
    const { addToCart } = useCart();
    const { wishlistItems, toggleWishlist } = useWishlist();
    const { isLoggedIn, setAuthModalOpen } = useAuth();

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
                setActiveImg(0);

                // Cargar productos relacionados
                const allProducts = await getProducts();
                const related = allProducts
                    .filter(p => {
                        const pCats = Array.isArray(p.category) ? p.category : (p.category ? [p.category] : []);
                        const prodCats = Array.isArray(productData.category) ? productData.category : (productData.category ? [productData.category] : []);
                        return pCats.some(c => prodCats.includes(c)) && p._id !== productData._id;
                    })
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

    const allImages = [product.imageHD || product.image, ...(product.gallery || [])];

    // Scroll programático al hacer clic en miniaturas o dots
    // (No usar useCallback — estos se declaran después de los returns condicionales)
    const scrollTo = (index) => {
        setActiveImg(index);
        if (scrollRef.current) {
            const slideWidth = scrollRef.current.offsetWidth;
            const behavior = window.innerWidth >= 768 ? 'instant' : 'smooth';
            scrollRef.current.scrollTo({ left: slideWidth * index, behavior });
        }
    };

    const handleScroll = () => {
        if (!scrollRef.current) return;
        const slideWidth = scrollRef.current.offsetWidth;
        const index = Math.round(scrollRef.current.scrollLeft / slideWidth);
        setActiveImg(index);
    };

    // Variantes por color: si el producto tiene variants, las tallas dependen del color seleccionado
    const hasVariants = product.variants && product.variants.length > 0;
    // Colores disponibles: de variants (objetos) o del campo colors (strings)
    const colorOptions = hasVariants
        ? product.variants   // array de { color, colorHex?, sizes }
        : (product.colors || []);  // array de strings
    // Nombre del color seleccionado (normaliza si viene de variants u objeto)
    const selectedColorName = selectedColor;
    // Tallas disponibles: si hay variants, las del color seleccionado; si no, las globales
    const sizeOptions = hasVariants
        ? (product.variants.find(v => v.color === selectedColor)?.sizes || [])
        : (product.sizes || []);

    const handleNotifySubmit = async (e) => {
        e.preventDefault();
        if (!notifyName.trim() || !notifyEmail.trim()) return;
        setNotifySending(true);
        try {
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            await fetch(`${supabaseUrl}/functions/v1/notify-stock`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: notifyName.trim(),
                    email: notifyEmail.trim(),
                    productName: product.name,
                    productSlug: product.slug,
                    selectedColor: selectedColor || '',
                }),
            });
            setNotifySent(true);
        } catch {
            setNotifySent(true); // mostramos confirmación igualmente
        } finally {
            setNotifySending(false);
        }
    };

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            setAuthModalOpen(true);
            return;
        }
        if (sizeOptions.length > 0 && !selectedSize) {
            alert('Por favor, selecciona una talla antes de añadir al carrito.');
            return;
        }
        if (colorOptions.length > 0 && !selectedColor) {
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
            <SEOHead
                title={product.name}
                description={product.description
                    ? `${product.description.slice(0, 140)}…`
                    : `Compra ${product.name} en Jándula Moda, Utrera. ${formatPrice(product.price)}. Envío a toda España.`
                }
                canonical={`/producto/${product.slug || product.id}`}
                image={product.imageHD || product.image}
                type="product"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    name: product.name,
                    description: product.description || '',
                    image: product.imageHD || product.image,
                    sku: String(product.id || product.slug),
                    brand: { '@type': 'Brand', name: 'Jándula Moda' },
                    offers: {
                        '@type': 'Offer',
                        priceCurrency: 'EUR',
                        price: product.price,
                        availability: 'https://schema.org/InStock',
                        url: `https://jandulamodautrera.es/producto/${product.slug || product.id}`,
                        seller: { '@type': 'Organization', name: 'Jándula Moda' },
                    },
                    ...(product.originalPrice && {
                        aggregateRating: undefined,
                    }),
                }}
            />
            <div className="container">
                <div className="breadcrumb" style={{ padding: '1.5rem 0' }}>
                    <Link to="/">Inicio</Link>
                    <ChevronRight size={14} />
                    <Link to={`/categoria/${slugifyCategory((product.category || [])[0])}`}>{(product.category || []).join(' / ')}</Link>
                    <ChevronRight size={14} />
                    <span>{product.name}</span>
                </div>

                <div className="product-detail">
                    {/* Galería estilo Zalando */}
                    <div className="product-detail__gallery">
                        {/* Strip de miniaturas — solo desktop */}
                        {allImages.length > 1 && (
                            <div className="product-detail__thumbstrip">
                                {allImages.map((img, i) => (
                                    <button
                                        key={i}
                                        className={`thumb-btn${activeImg === i ? ' active' : ''}`}
                                        onClick={() => scrollTo(i)}
                                        aria-label={`Ver imagen ${i + 1}`}
                                    >
                                        <img src={img} alt={`${product.name} ${i + 1}`} loading="lazy" />
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="product-detail__main-area">
                            {/* Carrusel scroll-snap (funciona en móvil y desktop) */}
                            <div
                                className="product-detail__snap-track"
                                ref={scrollRef}
                                onScroll={handleScroll}
                            >
                                {allImages.map((img, i) => (
                                    <div key={i} className="product-detail__snap-slide">
                                        {i === 0 && discount && (
                                            <span className="product-detail__discount">-{discount}%</span>
                                        )}
                                        <img
                                            src={img}
                                            alt={i === 0 ? product.name : `${product.name} — foto ${i + 1}`}
                                            draggable={false}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Dots — solo móvil */}
                            {allImages.length > 1 && (
                                <div className="product-detail__dots">
                                    {allImages.map((_, i) => (
                                        <button
                                            key={i}
                                            className={`dot${activeImg === i ? ' active' : ''}`}
                                            onClick={() => scrollTo(i)}
                                            aria-label={`Imagen ${i + 1}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="product-detail__info">
                        <p className="product-detail__category">{(product.category || []).join(', ')}</p>
                        <h1 className="product-detail__title">{product.name}</h1>

                        {/* Badge agotado */}
                        {product.outOfStock && (
                            <div className="product-detail__out-of-stock-badge">
                                 Producto agotado
                            </div>
                        )}

                        <div className="product-detail__prices">
                            <span className="product-detail__price">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                                <span className="product-detail__original">{formatPrice(product.originalPrice)}</span>
                            )}
                            {discount && <span className="product-detail__save">Ahorras {formatPrice(product.originalPrice - product.price)}</span>}
                        </div>

                        <p className="product-detail__desc">{product.description}</p>

                        {/* Colores (simples o de variantes) */}
                        {colorOptions.length > 0 && (
                            <div className="product-detail__sizes">
                                <p className="product-detail__label">Color</p>
                                <div className="size-options size-options--colors">
                                    {colorOptions.map(colorOpt => {
                                        // colorOpt puede ser string (colors simple) u objeto {color, colorHex}
                                        const colorName = typeof colorOpt === 'object' ? colorOpt.color : colorOpt;
                                        const colorHex  = typeof colorOpt === 'object' ? colorOpt.colorHex : null;
                                        return (
                                            <button
                                                key={colorName}
                                                className={`size-btn size-btn--color ${selectedColor === colorName ? 'active' : ''}`}
                                                onClick={() => { setSelectedColor(colorName); setSelectedSize(''); }}
                                                title={colorName}
                                            >
                                                {colorHex && (
                                                    <span
                                                        className="color-swatch"
                                                        style={{ background: colorHex }}
                                                    />
                                                )}
                                                {colorName}
                                            </button>
                                        );
                                    })}
                                </div>
                                {hasVariants && !selectedColor && (
                                    <p className="product-detail__hint">Selecciona un color para ver las tallas disponibles</p>
                                )}
                            </div>
                        )}

                        {/* Tallas (globales o del color seleccionado) */}
                        {sizeOptions.length > 0 && (
                            <div className="product-detail__sizes">
                                <p className="product-detail__label">Talla</p>
                                <div className="size-options">
                                    {sizeOptions.map(size => (
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

                        {/* Quantity + actions — solo si NO está agotado */}
                        {!product.outOfStock ? (
                            <>
                                <div className="product-detail__quantity">
                                    <p className="product-detail__label">Cantidad</p>
                                    <div className="quantity-control">
                                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={16} /></button>
                                        <span>{quantity}</span>
                                        <button onClick={() => setQuantity(quantity + 1)}><Plus size={16} /></button>
                                    </div>
                                </div>

                                <div className="product-detail__actions">
                                    <button className="btn-primary btn-lg" onClick={handleAddToCart}>
                                        <ShoppingBag size={18} /> Añadir al Carrito
                                    </button>
                                    <button className="btn-whatsapp btn-lg" onClick={handleBuyWhatsApp}>
                                        <WhatsAppIcon size={20} color="#fff" /> Preguntar por WhatsApp
                                    </button>
                                    <button
                                        className={`btn-wishlist ${wishlisted ? 'active' : ''}`}
                                        onClick={() => toggleWishlist(product)}
                                    >
                                        <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            /* ── Formulario "Avísame cuando esté disponible" ── */
                            <div className="notify-stock">
                                {notifySent ? (
                                    <div className="notify-stock__success">
                                        <span>✅</span>
                                        <p>¡Listo! Te avisaremos por email en cuanto vuelva a estar disponible.</p>
                                    </div>
                                ) : (
                                    <form className="notify-stock__form" onSubmit={handleNotifySubmit} noValidate>
                                        <p className="notify-stock__title">
                                             Avísame cuando esté disponible
                                        </p>
                                        <p className="notify-stock__desc">
                                            Deja tu nombre y correo y te avisamos en cuanto vuelva a estar en stock.
                                        </p>
                                        <input
                                            type="text"
                                            placeholder="Tu nombre"
                                            value={notifyName}
                                            onChange={e => setNotifyName(e.target.value)}
                                            required
                                            autoComplete="given-name"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Tu email"
                                            value={notifyEmail}
                                            onChange={e => setNotifyEmail(e.target.value)}
                                            required
                                            autoComplete="email"
                                        />
                                        <button type="submit" disabled={notifySending}>
                                            {notifySending ? 'Enviando…' : 'Avisarme'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

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
