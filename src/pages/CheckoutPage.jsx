import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { formatPrice } from '../data/products';
import { supabase } from '../lib/supabase';
import '../styles/pages.css';
import '../styles/checkout.css';

export default function CheckoutPage() {
    const { user, isLoggedIn } = useAuth();
    const { cartItems, cartTotal, shippingCost = cartTotal >= 50 || cartTotal === 0 ? 0 : 3.99, clearCart } = useCart();
    const navigate = useNavigate();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        city: '',
        postal: '',
        phone: '',
        notes: ''
    });

    useEffect(() => {
        // Redirect if empty cart or not logged in
        if (cartItems.length === 0 && !success) {
            navigate('/carrito');
        }
        if (!isLoggedIn) {
            navigate('/mi-cuenta'); // Will trigger auth
        }

        // Pre-fill from user profile
        if (user) {
            setShippingInfo(prev => ({
                ...prev,
                name: user.full_name || '',
                address: user.address_line || '',
                city: user.city || '',
                postal: user.postal_code || '',
                phone: user.phone || ''
            }));
        }
    }, [cartItems, isLoggedIn, navigate, user, success]);

    const handleInputChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleProcessOrder = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            // Validate required fields
            const required = ['name', 'address', 'city', 'postal', 'phone'];
            for (const field of required) {
                if (!shippingInfo[field]) {
                    throw new Error(`Por favor, rellena el campo: ${field}`);
                }
            }

            // Prep items for DB function
            const items = cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                size: item.size || null
            }));

            // Call Supabase RPC
            const { data, error: rpcError } = await supabase.rpc('process_order', {
                p_items: items,
                p_shipping_info: shippingInfo
            });

            if (rpcError) throw rpcError;

            // Success!
            clearCart();
            setSuccess(true);

        } catch (err) {
            console.error('Order error:', err);
            setError(err.message || 'Ocurrió un error al procesar el pedido.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <main className="page-wrapper checkout-page">
                <div className="container" style={{ textAlign: 'center', padding: '10vh 0' }}>
                    <CheckCircle size={80} color="var(--color-brand-pink)" style={{ margin: '0 auto 2rem' }} strokeWidth={1} />
                    <h1 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)' }}>¡Pedido Confirmado!</h1>
                    <p style={{ color: 'var(--color-stone-600)', marginBottom: '3rem', maxWidth: '500px', margin: '0 auto 3rem' }}>
                        Muchas gracias por tu compra. Te hemos enviado un email con los detalles de tu pedido.
                    </p>
                    <button className="btn-primary" onClick={() => navigate('/mi-cuenta')}>
                        Ver mis pedidos
                    </button>
                </div>
            </main>
        );
    }

    if (!isLoggedIn || cartItems.length === 0) return null; // Prevent flash while redirecting

    const total = cartTotal + shippingCost;

    return (
        <main className="page-wrapper checkout-page">
            <div className="page-hero page-hero--cart" style={{ padding: '3rem 0' }}>
                <h1>Finalizar Compra</h1>
            </div>

            <section className="container">
                <div className="checkout-layout">

                    {/* Left Col: Form */}
                    <div className="checkout-form-col">
                        <div className="checkout-block">
                            <h2 className="checkout-block__title">Datos de Envío</h2>

                            {error && (
                                <div className="cart-error" style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: '#fee2e2', borderRadius: '4px' }}>
                                    {error}
                                </div>
                            )}

                            <form id="checkout-form" onSubmit={handleProcessOrder}>
                                <div className="form-group">
                                    <label htmlFor="name">Nombre Completo *</label>
                                    <input type="text" id="name" name="name" required value={shippingInfo.name} onChange={handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address">Dirección *</label>
                                    <input type="text" id="address" name="address" required value={shippingInfo.address} onChange={handleInputChange} />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="city">Ciudad *</label>
                                        <input type="text" id="city" name="city" required value={shippingInfo.city} onChange={handleInputChange} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="postal">Código Postal *</label>
                                        <input type="text" id="postal" name="postal" required value={shippingInfo.postal} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone">Teléfono de Contacto *</label>
                                    <input type="tel" id="phone" name="phone" required value={shippingInfo.phone} onChange={handleInputChange} />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="notes">Notas para el mensajero (opcional)</label>
                                    <textarea id="notes" name="notes" rows="3" value={shippingInfo.notes} onChange={handleInputChange}></textarea>
                                </div>
                            </form>
                        </div>

                        <div className="checkout-block" style={{ marginTop: '2rem' }}>
                            <h2 className="checkout-block__title">Pago Seguro</h2>
                            <div className="payment-simulation">
                                <Lock size={20} />
                                <p>Pago Contra Reembolso / Simulación Segura. Al hacer clic en el botón de confirmar, el pedido se procesará directamente en la base de datos de Jándula Moda (Modo Demo).</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Summary */}
                    <div className="checkout-summary-col">
                        <div className="cart-summary checkout-summary">
                            <h2>Resumen del Pedido</h2>

                            <div className="checkout-items">
                                {cartItems.map(item => (
                                    <div key={`${item.id}-${item.size || 'nosize'}`} className="checkout-item-mini">
                                        <div className="img-wrap">
                                            <img src={item.image} alt={item.name} />
                                            <span className="qty-badge">{item.quantity}</span>
                                        </div>
                                        <div className="info">
                                            <h4>{item.name}</h4>
                                            {item.size && <span className="size">Talla: {item.size}</span>}
                                        </div>
                                        <div className="price">{formatPrice(item.price * item.quantity)}</div>
                                    </div>
                                ))}
                            </div>

                            <hr style={{ margin: '1.5rem 0', borderColor: 'var(--color-stone-200)' }} />

                            <div className="cart-summary__row">
                                <span>Subtotal</span>
                                <span>{formatPrice(cartTotal)}</span>
                            </div>
                            <div className="cart-summary__row">
                                <span>Envío</span>
                                <span>{shippingCost === 0 ? <em className="free-shipping">¡Gratis!</em> : formatPrice(shippingCost)}</span>
                            </div>

                            <div className="cart-summary__total">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <button type="submit" form="checkout-form" className="btn-primary btn-lg btn-full checkout-submit-btn" disabled={submitting}>
                                {submitting ? 'Procesando...' : (
                                    <><CreditCard size={18} /> Confirmar Pedido y Pagar</>
                                )}
                            </button>

                            <button type="button" className="btn-outline btn-full" style={{ marginTop: '1rem' }} onClick={() => navigate('/carrito')}>
                                <ArrowLeft size={16} /> Volver al Carrito
                            </button>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
