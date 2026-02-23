import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../data/products';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import '../styles/pages.css';

export default function CartPage() {
    const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    const subtotal = cartTotal;
    const shipping = subtotal >= 50 || subtotal === 0 ? 0 : 3.99;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <main className="page-wrapper">
                <div className="container cart-empty">
                    <ShoppingBag size={64} strokeWidth={1} />
                    <h1>Tu carrito está vacío</h1>
                    <p>Parece que aún no has encontrado tu look perfecto. ¡Exploremos juntas!</p>
                    <Link to="/categoria/todos" className="btn-primary">
                        <ArrowLeft size={16} /> Explorar Productos
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page-wrapper">
            <div className="page-hero page-hero--cart">
                <h1>Tu Carrito</h1>
                <p>{cartCount} artículo{cartCount !== 1 && 's'}</p>
            </div>

            <section className="cart-section container">
                <div className="cart-layout">
                    {/* Cart Items */}
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={`${item.id}-${item.size || 'nosize'}`} className="cart-item">
                                <Link to={`/producto/${item.id}`} className="cart-item__img">
                                    <img src={item.image} alt={item.name} />
                                </Link>
                                <div className="cart-item__info">
                                    <div className="cart-item__top">
                                        <div>
                                            <p className="cart-item__category">{item.category}</p>
                                            <Link to={`/producto/${item.id}`}>
                                                <h3 className="cart-item__name">
                                                    {item.name}
                                                    {item.size && <span className="cart-item__size"> (Talla: {item.size})</span>}
                                                </h3>
                                            </Link>
                                        </div>
                                        <button className="cart-item__remove" onClick={() => removeFromCart(item.id, item.size)} aria-label="Eliminar">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    <div className="cart-item__bottom">
                                        <div className="quantity-control">
                                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}><Minus size={14} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}><Plus size={14} /></button>
                                        </div>
                                        <p className="cart-item__price">{formatPrice(item.price * item.quantity)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="cart-summary">
                        <h2>Resumen del Pedido</h2>
                        <div className="cart-summary__row">
                            <span>Subtotal</span>
                            <span>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="cart-summary__row">
                            <span>Envío</span>
                            <span>{shipping === 0 ? <em className="free-shipping">¡Gratis!</em> : formatPrice(shipping)}</span>
                        </div>
                        {subtotal < 50 && (
                            <p className="cart-summary__hint">
                                ¡Añade {formatPrice(50 - subtotal)} más para envío gratis!
                            </p>
                        )}
                        <div className="cart-summary__total">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>
                        <button className="btn-primary btn-lg btn-full" onClick={handleCheckout}>
                            <CreditCard size={18} /> Proceder al Pago
                        </button>
                        <Link to="/categoria/todos" className="cart-continue">
                            <ArrowLeft size={14} /> Seguir comprando
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
