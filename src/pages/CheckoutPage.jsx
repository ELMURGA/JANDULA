import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ArrowLeft, CreditCard, Lock, Tag, CheckCircle, XCircle, Truck, Store } from 'lucide-react';
import { formatPrice } from '../utils/productUtils';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/SEOHead';
import '../styles/pages.css';
import '../styles/checkout.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

export default function CheckoutPage() {
    const { user, isLoggedIn, updateUser } = useAuth();
    const { cartItems, cartTotal } = useCart();
    const navigate = useNavigate();

    const [deliveryMethod, setDeliveryMethod] = useState('shipping'); // 'shipping' | 'pickup'
    const shippingCost = deliveryMethod === 'pickup'
        ? 0
        : (cartTotal >= 100 || cartTotal === 0 ? 0 : 3.99);

    const [submitting, setSubmitting] = useState(false);
    const [error, setError]           = useState('');

    // Datos de envío
    const [shippingInfo, setShippingInfo] = useState({
        name:    '',
        address: '',
        city:    '',
        postal:  '',
        phone:   '',
        notes:   '',
    });

    // Descuento
    const [discountInput,   setDiscountInput]   = useState('');
    const [discountLoading, setDiscountLoading] = useState(false);
    const [appliedDiscount, setAppliedDiscount] = useState(null); // { code, type, value, savings, message }
    const [discountError,   setDiscountError]   = useState('');

    useEffect(() => {
        if (cartItems.length === 0 && !submitting) {
            navigate('/carrito');
        }
        if (!isLoggedIn) {
            navigate('/mi-cuenta');
        }

        if (user) {
            setShippingInfo(prev => ({
                ...prev,
                name:    user.full_name    || '',
                address: user.address_line || '',
                city:    user.city         || '',
                postal:  user.postal_code  || '',
                phone:   user.phone        || '',
            }));
        }
    }, [cartItems.length, isLoggedIn, navigate, user, submitting]);

    const handleInputChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    // ── Aplicar código de descuento ──────────────────────────────────────────
    const handleApplyDiscount = async (e) => {
        e.preventDefault();
        setDiscountError('');

        if (!discountInput.trim()) {
            setDiscountError('Escribe un código de descuento');
            return;
        }

        setDiscountLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) throw new Error('Sesión expirada');

            const res = await fetch(`${SUPABASE_URL}/functions/v1/apply-discount`, {
                method: 'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    code:      discountInput.trim(),
                    cartTotal: cartTotal,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.valid) {
                throw new Error(data.error || 'Código no válido');
            }

            setAppliedDiscount(data);
            setDiscountInput('');
        } catch (err) {
            setDiscountError(err.message || 'Error al validar el descuento');
            setAppliedDiscount(null);
        } finally {
            setDiscountLoading(false);
        }
    };

    const removeDiscount = () => {
        setAppliedDiscount(null);
        setDiscountInput('');
        setDiscountError('');
    };

    // ── Procesar checkout con Stripe  ────────────────────────────────────────
    const handleProcessOrder = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            // Validar campos de envío
            const required = deliveryMethod === 'pickup'
                ? { name: 'Nombre', phone: 'Teléfono' }
                : { name: 'Nombre', address: 'Dirección', city: 'Ciudad', postal: 'Código Postal', phone: 'Teléfono' };
            for (const [field, label] of Object.entries(required)) {
                if (!shippingInfo[field]?.trim()) {
                    throw new Error(`Por favor, rellena el campo: ${label}`);
                }
            }

            // Guardar dirección de envío en el perfil del usuario silenciosamente
            try {
                await updateUser({
                    full_name:    shippingInfo.name,
                    address_line: shippingInfo.address,
                    city:         shippingInfo.city,
                    postal_code:  shippingInfo.postal,
                    phone:        shippingInfo.phone,
                });
            } catch { /* no bloquear checkout si falla el guardado del perfil */ }

            // Obtener token de sesión Supabase
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) throw new Error('Sesión expirada. Por favor, vuelve a iniciar sesión.');

            // Llamar a la Edge Function create-checkout
            const res = await fetch(`${SUPABASE_URL}/functions/v1/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type':  'application/json',
                    'Authorization': `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    deliveryMethod,
                    cartItems:    cartItems.map(item => ({
                        id:       item.id,
                        quantity: item.quantity,
                        size:     item.size || null,
                        color:    item.color || null,
                        name:     item.name,
                    })),
                    shippingInfo: {
                        name:    shippingInfo.name,
                        address: shippingInfo.address,
                        city:    shippingInfo.city,
                        postal:  shippingInfo.postal,
                        phone:   shippingInfo.phone,
                        notes:   shippingInfo.notes,
                    },
                    discountCode: appliedDiscount?.code || null,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Error al crear la sesión de pago');
            }

            // Redirigir a Stripe Checkout (hosted page)
            window.location.href = data.sessionUrl;

        } catch (err) {
            console.error('Checkout error:', err);
            setError(err.message || 'Ocurrió un error. Por favor, inténtalo de nuevo.');
            setSubmitting(false);
        }
    };

    if (!isLoggedIn || cartItems.length === 0) return null;

    // Calcular totales con descuento
    const discountSavings = appliedDiscount?.savings ?? 0;
    const effectiveShipping = appliedDiscount?.type === 'free_shipping' ? 0 : shippingCost;
    const total = Math.max(0, cartTotal + effectiveShipping - (appliedDiscount?.type !== 'free_shipping' ? discountSavings : 0));

    return (
        <main className="page-wrapper checkout-page">
            <SEOHead title="Finalizar Compra" noindex />
            <div className="page-hero page-hero--cart" style={{ padding: '3rem 0' }}>
                <h1>Finalizar Compra</h1>
            </div>

            <section className="container">
                <div className="checkout-layout">

                    {/* ── Columna izquierda: Formulario ── */}
                    <div className="checkout-form-col">

                        {/* ── Método de entrega ── */}
                        <div className="checkout-block" style={{ marginBottom: '1.5rem' }}>
                            <h2 className="checkout-block__title">Método de Entrega</h2>
                            <div className="delivery-options">
                                <label className={`delivery-option${deliveryMethod === 'shipping' ? ' delivery-option--active' : ''}`}>
                                    <input type="radio" name="deliveryMethod" value="shipping"
                                           checked={deliveryMethod === 'shipping'}
                                           onChange={() => setDeliveryMethod('shipping')} />
                                    <div className="delivery-option__label">
                                        <span className="delivery-option__title"><Truck size={15} style={{verticalAlign:'middle',marginRight:4}}/> Envío a domicilio</span>
                                        <span className="delivery-option__sub">Entrega en 24-48h</span>
                                        <span className="delivery-option__price">
                                            {cartTotal >= 100 ? '¡Gratis!' : '3,99 €'}
                                        </span>
                                    </div>
                                </label>
                                <label className={`delivery-option${deliveryMethod === 'pickup' ? ' delivery-option--active' : ''}`}>
                                    <input type="radio" name="deliveryMethod" value="pickup"
                                           checked={deliveryMethod === 'pickup'}
                                           onChange={() => setDeliveryMethod('pickup')} />
                                    <div className="delivery-option__label">
                                        <span className="delivery-option__title"><Store size={15} style={{verticalAlign:'middle',marginRight:4}}/> Recogida en tienda</span>
                                        <span className="delivery-option__sub">Av. María Auxiliadora, 76<br/>Utrera, Sevilla</span>
                                        <span className="delivery-option__price">¡Gratis!</span>
                                    </div>
                                </label>
                            </div>
                            {deliveryMethod === 'pickup' && (
                                <div className="pickup-info-box">
                                    <strong>📍 Jándula Moda — Tienda física</strong>
                                    Av. María Auxiliadora, 76 · Utrera, Sevilla<br/>
                                    Lun–Vie: 10:00–14:00 / 17:30–21:00 · Sáb: 10:00–14:00<br/>
                                    Tel: <a href="tel:+34610505303" style={{color:'var(--color-brand-pink)'}}>610 505 303</a>
                                </div>
                            )}
                        </div>

                        {/* Datos de envío / recogida */}
                        <div className="checkout-block">
                            <h2 className="checkout-block__title">
                                {deliveryMethod === 'pickup' ? 'Datos de Contacto' : 'Datos de Envío'}
                            </h2>

                            {error && (
                                <div role="alert" style={{
                                    color: '#dc2626', marginBottom: '1rem', padding: '0.875rem 1rem',
                                    background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca',
                                    fontSize: '0.9rem'
                                }}>
                                    {error}
                                </div>
                            )}

                            <form id="checkout-form" onSubmit={handleProcessOrder}>
                                <div className="form-group">
                                    <label htmlFor="name">Nombre Completo *</label>
                                    <input type="text" id="name" name="name" required
                                           value={shippingInfo.name} onChange={handleInputChange} />
                                </div>
                                {deliveryMethod === 'shipping' && (
                                    <div className="form-group">
                                        <label htmlFor="address">Dirección *</label>
                                        <input type="text" id="address" name="address" required
                                               value={shippingInfo.address} onChange={handleInputChange} />
                                    </div>
                                )}
                                {deliveryMethod === 'shipping' && (
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="city">Ciudad *</label>
                                            <input type="text" id="city" name="city" required
                                                   value={shippingInfo.city} onChange={handleInputChange} />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="postal">Código Postal *</label>
                                            <input type="text" id="postal" name="postal" required
                                                   value={shippingInfo.postal} onChange={handleInputChange} />
                                        </div>
                                    </div>
                                )}
                                <div className="form-group">
                                    <label htmlFor="phone">Teléfono de Contacto *</label>
                                    <input type="tel" id="phone" name="phone" required
                                           value={shippingInfo.phone} onChange={handleInputChange} />
                                </div>
                                {deliveryMethod === 'shipping' && (
                                    <div className="form-group">
                                        <label htmlFor="notes">Notas para el mensajero (opcional)</label>
                                        <textarea id="notes" name="notes" rows="3"
                                                  value={shippingInfo.notes} onChange={handleInputChange} />
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Código de descuento */}
                        <div className="checkout-block" style={{ marginTop: '1.5rem' }}>
                            <h2 className="checkout-block__title">
                                <Tag size={18} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                                Código de Descuento
                            </h2>

                            {appliedDiscount ? (
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '0.875rem 1rem', background: '#f0fdf4',
                                    border: '1px solid #bbf7d0', borderRadius: '8px',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckCircle size={18} color="#16a34a" />
                                        <span style={{ color: '#15803d', fontWeight: 600 }}>
                                            {appliedDiscount.code}
                                        </span>
                                        <span style={{ color: '#16a34a', fontSize: '0.875rem' }}>
                                            — {appliedDiscount.message}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeDiscount}
                                        aria-label="Eliminar descuento"
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}
                                    >
                                        <XCircle size={20} color="#9ca3af" />
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleApplyDiscount} style={{ display: 'flex', gap: '0.75rem' }}>
                                    <input
                                        type="text"
                                        placeholder="Escribe tu código"
                                        value={discountInput}
                                        onChange={e => { setDiscountInput(e.target.value.toUpperCase()); setDiscountError(''); }}
                                        style={{
                                            flex: 1, padding: '0.75rem 1rem',
                                            border: discountError ? '1px solid #fca5a5' : '1px solid var(--color-stone-300)',
                                            borderRadius: '8px', fontSize: '0.95rem',
                                            letterSpacing: '1px', background: '#fff',
                                        }}
                                        disabled={discountLoading}
                                    />
                                    <button
                                        type="submit"
                                        className="btn-outline"
                                        disabled={discountLoading}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {discountLoading ? 'Verificando…' : 'Aplicar'}
                                    </button>
                                </form>
                            )}

                            {discountError && (
                                <p style={{ marginTop: '0.5rem', color: '#dc2626', fontSize: '0.875rem' }}>
                                    {discountError}
                                </p>
                            )}
                        </div>

                        {/* Pago seguro */}
                        <div className="checkout-block" style={{ marginTop: '1.5rem' }}>
                            <h2 className="checkout-block__title">Métodos de Pago</h2>
                            <div className="payment-simulation">
                                <Lock size={20} />
                                <p>
                                    Pago 100% seguro procesado por Stripe. Selecciona tu método
                                    preferido en la siguiente pantalla. Tus datos nunca pasan por
                                    nuestros servidores.
                                </p>
                            </div>
                            <div className="payment-methods-icons">
                                {[
                                    { label: '💳 Tarjeta', sub: 'Visa · Mastercard · Amex' },
                                    { label: '🍎 Apple Pay', sub: 'Safari/iPhone' },
                                    { label: 'G Google Pay', sub: 'Android/Chrome' },
                                ].map(({ label, sub }) => (
                                    <span key={label} className="payment-method-badge" title={sub}>
                                        {label}
                                    </span>
                                ))}
                            </div>
                            <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-stone-400)' }}>
                                Apple Pay y Google Pay aparecen automáticamente si usas Safari o Chrome con una tarjeta guardada.
                            </p>
                        </div>
                    </div>

                    {/* ── Columna derecha: Resumen ── */}
                    <div className="checkout-summary-col">
                        <div className="cart-summary checkout-summary">
                            <h2>Resumen del Pedido</h2>

                            <div className="checkout-items">
                                {cartItems.map(item => (
                                    <div key={`${item.id}-${item.size || 'nosize'}-${item.color || 'nocolor'}`} className="checkout-item-mini">
                                        <div className="img-wrap">
                                            <img src={item.image} alt={item.name} loading="lazy" />
                                            <span className="qty-badge">{item.quantity}</span>
                                        </div>
                                        <div className="info">
                                            <h4>{item.name}</h4>
                                            {item.size && <span className="size">Talla: {item.size}</span>}
                                            {item.color && <span className="size" style={{display: 'block'}}>Color: {item.color}</span>}
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

                            {discountSavings > 0 && appliedDiscount?.type !== 'free_shipping' && (
                                <div className="cart-summary__row" style={{ color: '#16a34a' }}>
                                    <span>Descuento ({appliedDiscount.code})</span>
                                    <span>−{formatPrice(discountSavings)}</span>
                                </div>
                            )}

                            <div className="cart-summary__row">
                                <span>Envío</span>
                                <span>
                                    {effectiveShipping === 0
                                        ? <em className="free-shipping">¡Gratis!</em>
                                        : formatPrice(effectiveShipping)
                                    }
                                </span>
                            </div>

                            <div className="cart-summary__total">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                className="btn-primary btn-lg btn-full checkout-submit-btn"
                                disabled={submitting}
                            >
                                {submitting
                                    ? 'Redirigiendo a pago seguro…'
                                    : <><CreditCard size={18} /> Ir a Pagar con Stripe</>
                                }
                            </button>

                            <button
                                type="button"
                                className="btn-outline btn-full"
                                style={{ marginTop: '1rem' }}
                                onClick={() => navigate('/carrito')}
                                disabled={submitting}
                            >
                                <ArrowLeft size={16} /> Volver al Carrito
                            </button>

                            <p style={{
                                marginTop: '1rem', textAlign: 'center',
                                fontSize: '0.75rem', color: 'var(--color-stone-400)',
                            }}>
                                🔒 Pago cifrado SSL · Datos protegidos por Stripe
                            </p>
                        </div>
                    </div>

                </div>
            </section>
        </main>
    );
}
