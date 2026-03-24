import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../utils/productUtils';
import {
    LayoutDashboard, ShoppingBag, MapPin, UserCog, LogOut,
    ChevronRight, Eye, Package, Mail, Lock, User, Save, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import '../styles/account.css';

const TABS = [
    { id: 'dashboard', label: 'Panel de control', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
    { id: 'details', label: 'Detalles de la cuenta', icon: UserCog },
    { id: 'logout', label: 'Cerrar sesión', icon: LogOut },
];

export default function AccountPage() {
    const { user, loading, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersError, setOrdersError] = useState('');
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Address forms
    const [billingAddress, setBillingAddress] = useState({
        firstName: '',
        lastName: '',
        company: '',
        country: 'España',
        street: '',
        apartment: '',
        city: '',
        province: 'Sevilla',
        postalCode: '',
        phone: '',
    });

    const [shippingAddress, setShippingAddress] = useState({
        firstName: '',
        lastName: '',
        company: '',
        country: 'España',
        street: '',
        apartment: '',
        city: '',
        province: 'Sevilla',
        postalCode: '',
    });

    // Account details form
    const [accountForm, setAccountForm] = useState({
        firstName: '',
        lastName: '',
        displayName: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [addressSaved, setAddressSaved] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [detailsSaved, setDetailsSaved] = useState(false);
    const [detailsError, setDetailsError] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [editingBilling, setEditingBilling] = useState(false);
    const [editingShipping, setEditingShipping] = useState(false);

    // Cargar datos del perfil cuando el usuario esté disponible
    useEffect(() => {
        if (!user) return;
        const nameParts = (user.full_name || '').split(' ');
        setBillingAddress({
            firstName: user.billing_first_name || nameParts[0] || '',
            lastName: user.billing_last_name || nameParts.slice(1).join(' ') || '',
            company: user.billing_company || '',
            country: 'España',
            street: user.address_line || '',
            apartment: user.billing_apartment || '',
            city: user.city || '',
            province: user.province || 'Sevilla',
            postalCode: user.postal_code || '',
            phone: user.phone || '',
        });
        setShippingAddress({
            firstName: user.shipping_first_name || '',
            lastName: user.shipping_last_name || '',
            company: user.shipping_company || '',
            country: 'España',
            street: user.shipping_street || '',
            apartment: user.shipping_apartment || '',
            city: user.shipping_city || '',
            province: user.shipping_province || 'Sevilla',
            postalCode: user.shipping_postal || '',
        });
        setAccountForm({
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            displayName: user.full_name || '',
            email: user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
    }, [user?.id]);

    useEffect(() => {
        if (!user?.id) return;

        const fetchOrders = async () => {
            try {
                setOrdersLoading(true);
                setOrdersError('');

                const { data, error } = await supabase
                    .from('orders')
                    .select(`
                        id,
                        created_at,
                        status,
                        total,
                        subtotal,
                        shipping,
                        discount_amount,
                        discount_code,
                        order_items (
                            product_name,
                            quantity,
                            unit_price,
                            total_price,
                            size
                        )
                    `)
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (error) {
                console.error('Error cargando pedidos:', error);
                setOrdersError('No se pudieron cargar tus pedidos. Inténtalo de nuevo.');
            } finally {
                setOrdersLoading(false);
            }
        };

        fetchOrders();

        const channel = supabase
            .channel(`account-orders-${user.id}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` },
                () => {
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id]);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/');
        }
    }, [loading, user, navigate]);

    if (loading || !user) {
        return null;
    }

    const handleTabClick = (tabId) => {
        if (tabId === 'logout') {
            logout();
            navigate('/');
            return;
        }
        setActiveTab(tabId);
    };

    const handleAddressSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setAddressError('');
        try {
            await updateUser({
                billing_first_name: billingAddress.firstName,
                billing_last_name:  billingAddress.lastName,
                billing_company:    billingAddress.company,
                address_line:       billingAddress.street,
                billing_apartment:  billingAddress.apartment,
                city:               billingAddress.city,
                province:           billingAddress.province,
                postal_code:        billingAddress.postalCode,
                phone:              billingAddress.phone,
                shipping_first_name: shippingAddress.firstName,
                shipping_last_name:  shippingAddress.lastName,
                shipping_company:    shippingAddress.company,
                shipping_street:     shippingAddress.street,
                shipping_apartment:  shippingAddress.apartment,
                shipping_city:       shippingAddress.city,
                shipping_province:   shippingAddress.province,
                shipping_postal:     shippingAddress.postalCode,
            });
            setAddressSaved(true);
            setEditingBilling(false);
            setEditingShipping(false);
            setTimeout(() => setAddressSaved(false), 3000);
        } catch (err) {
            setAddressError('Error al guardar. Inténtalo de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDetailsSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setDetailsError('');

        if (accountForm.newPassword && accountForm.newPassword !== accountForm.confirmPassword) {
            setDetailsError('Las contraseñas nuevas no coinciden.');
            setIsSaving(false);
            return;
        }

        try {
            const fullName = accountForm.displayName ||
                `${accountForm.firstName} ${accountForm.lastName}`.trim();

            // Actualizar perfil en BD
            await updateUser({ full_name: fullName, email: accountForm.email });

            // Actualizar email o contraseña en Supabase Auth si han cambiado
            const authUpdates = {};
            if (accountForm.email !== user.email) authUpdates.email = accountForm.email;
            if (accountForm.newPassword) authUpdates.password = accountForm.newPassword;
            if (Object.keys(authUpdates).length > 0) {
                const { error } = await supabase.auth.updateUser(authUpdates);
                if (error) throw error;
            }

            setDetailsSaved(true);
            setAccountForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            setTimeout(() => setDetailsSaved(false), 3000);
        } catch (err) {
            setDetailsError(err.message || 'Error al guardar. Inténtalo de nuevo.');
        } finally {
            setIsSaving(false);
        }
    };

    const userName = user.full_name || user.email.split('@')[0];

    return (
        <div className="page-wrapper">
            <SEOHead title="Mi Cuenta" noindex />
            {/* Hero */}
            <div className="page-hero">
                <div className="container">
                    <div className="breadcrumb" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
                        <Link to="/">Inicio</Link>
                        <ChevronRight size={12} />
                        <span>Mi Cuenta</span>
                    </div>
                    <h1>Mi Cuenta</h1>
                    <p>Gestiona tus pedidos, direcciones y datos personales</p>
                </div>
            </div>

            {/* Account content */}
            <section className="account-section">
                <div className="container">
                    <div className="account-layout">
                        {/* Sidebar */}
                        <aside className="account-sidebar">
                            <div className="account-sidebar__avatar">
                                <div className="account-sidebar__avatar-circle">
                                    {userName.charAt(0).toUpperCase()}
                                </div>
                                <div className="account-sidebar__user-info">
                                    <strong>{userName}</strong>
                                    <span>{user.email}</span>
                                </div>
                            </div>
                            <nav className="account-sidebar__nav">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.id}
                                        className={`account-sidebar__tab ${activeTab === tab.id ? 'active' : ''} ${tab.id === 'logout' ? 'account-sidebar__tab--logout' : ''}`}
                                        onClick={() => handleTabClick(tab.id)}
                                    >
                                        <tab.icon size={18} />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </aside>

                        {/* Mobile tabs */}
                        <div className="account-tabs-mobile">
                            {TABS.map(tab => (
                                <button
                                    key={tab.id}
                                    className={`account-tab-mobile ${activeTab === tab.id ? 'active' : ''} ${tab.id === 'logout' ? 'account-tab-mobile--logout' : ''}`}
                                    onClick={() => handleTabClick(tab.id)}
                                >
                                    <tab.icon size={16} />
                                    <span>{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <main className="account-content">
                            {/* ===== DASHBOARD ===== */}
                            {activeTab === 'dashboard' && (
                                <div className="account-panel animate-fade-in-up">
                                    <div className="account-welcome">
                                        <h2>
                                            Hola <strong>{userName}</strong>{' '}
                                            <span className="account-welcome__not-you">
                                                (¿no eres {userName}?{' '}
                                                <button onClick={() => { logout(); navigate('/'); }}>
                                                    Cerrar sesión
                                                </button>
                                                )
                                            </span>
                                        </h2>
                                        <p>
                                            Desde el panel de control de tu cuenta puedes ver tus{' '}
                                            <button className="account-link" onClick={() => setActiveTab('orders')}>pedidos recientes</button>,
                                            gestionar tus{' '}
                                            <button className="account-link" onClick={() => setActiveTab('addresses')}>direcciones de envío y facturación</button>,
                                            y editar tu{' '}
                                            <button className="account-link" onClick={() => setActiveTab('details')}>contraseña y los detalles de tu cuenta</button>.
                                        </p>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="account-quick-actions">
                                        <button className="account-quick-card" onClick={() => setActiveTab('orders')}>
                                            <div className="account-quick-card__icon">
                                                <ShoppingBag size={24} />
                                            </div>
                                            <h3>Mis Pedidos</h3>
                                            <p>Consulta el estado de tus compras</p>
                                        </button>
                                        <button className="account-quick-card" onClick={() => setActiveTab('addresses')}>
                                            <div className="account-quick-card__icon">
                                                <MapPin size={24} />
                                            </div>
                                            <h3>Mis Direcciones</h3>
                                            <p>Gestiona envío y facturación</p>
                                        </button>
                                        <button className="account-quick-card" onClick={() => setActiveTab('details')}>
                                            <div className="account-quick-card__icon">
                                                <UserCog size={24} />
                                            </div>
                                            <h3>Mi Cuenta</h3>
                                            <p>Edita tus datos personales</p>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ===== PEDIDOS ===== */}
                            {activeTab === 'orders' && (
                                <div className="account-panel animate-fade-in-up">
                                    <h2 className="account-panel__title">
                                        <ShoppingBag size={22} /> Mis Pedidos
                                    </h2>

                                    {ordersLoading ? (
                                        <div className="account-empty">
                                            <Package size={48} />
                                            <p>Cargando pedidos...</p>
                                        </div>
                                    ) : ordersError ? (
                                        <div className="account-alert account-alert--error">{ordersError}</div>
                                    ) : orders.length === 0 ? (
                                        <div className="account-empty">
                                            <Package size={48} />
                                            <p>Aún no has realizado ningún pedido.</p>
                                            <Link to="/categoria/todos" className="account-empty__btn">
                                                Explorar Tienda
                                            </Link>
                                        </div>
                                    ) : (
                                        <div className="account-table-wrap">
                                            <table className="account-table">
                                                <thead>
                                                    <tr>
                                                        <th>Pedido</th>
                                                        <th>Fecha</th>
                                                        <th>Estado</th>
                                                        <th>Total</th>
                                                        <th>Acciones</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map(order => (
                                                        <React.Fragment key={order.id}>
                                                        <tr>
                                                            <td><strong>#{order.id}</strong></td>
                                                            <td>{new Date(order.created_at).toLocaleDateString('es-ES')}</td>
                                                            <td>
                                                                <span className={`account-status account-status--${(order.status || '').toLowerCase()}`}>
                                                                    {order.status || 'pendiente'}
                                                                </span>
                                                            </td>
                                                            <td>{formatPrice(order.total || 0)}</td>
                                                            <td>
                                                                <button
                                                                    className="account-view-btn"
                                                                    type="button"
                                                                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                                                                >
                                                                    <Eye size={14} /> {expandedOrderId === order.id ? 'Ocultar' : 'Ver'}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        {expandedOrderId === order.id && (
                                                            <tr key={`detail-${order.id}`}>
                                                                <td colSpan={5} style={{ background: '#faf9f7', padding: '1rem 1.25rem' }}>
                                                                    <div style={{ fontSize: '0.875rem', color: '#374151' }}>
                                                                        <strong style={{ display: 'block', marginBottom: '0.5rem' }}>Productos:</strong>
                                                                        {(order.order_items || []).map((item, i) => (
                                                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid #f3f4f6' }}>
                                                                                <span>{item.product_name}{item.size ? ` — Talla ${item.size}` : ''}{item.color ? ` — Color ${item.color}` : ''} × {item.quantity}</span>
                                                                                <span style={{ fontWeight: 600 }}>{formatPrice(item.total_price)}</span>
                                                                            </div>
                                                                        ))}
                                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.5rem', fontWeight: 600 }}>
                                                                            <span>Total</span>
                                                                            <span>{formatPrice(order.total)}</span>
                                                                        </div>
                                                                        {order.discount_code && (
                                                                            <div style={{ color: '#16a34a', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                                                                Descuento aplicado: {order.discount_code} (−{formatPrice(order.discount_amount)})
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                        </React.Fragment>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}



                            {/* ===== DIRECCIONES ===== */}
                            {activeTab === 'addresses' && (
                                <div className="account-panel animate-fade-in-up">
                                    <h2 className="account-panel__title">
                                        <MapPin size={22} /> Mis Direcciones
                                    </h2>
                                    <p className="account-panel__desc">
                                        Las siguientes direcciones se usarán de forma predeterminada en la página de pago.
                                    </p>

                                    {addressSaved && (
                                        <div className="account-alert account-alert--success">
                                            ✓ Direcciones guardadas correctamente.
                                        </div>
                                    )}
                                    {addressError && (
                                        <div className="account-alert account-alert--error">
                                            {addressError}
                                        </div>
                                    )}

                                    <form onSubmit={handleAddressSave}>
                                        <div className="account-addresses-grid">
                                            {/* Billing */}
                                            <div className="account-address-block">
                                                <div className="account-address-block__header">
                                                    <h3>Dirección de Facturación</h3>
                                                    <button type="button" className="account-edit-btn" onClick={() => setEditingBilling(!editingBilling)}>
                                                        <Edit3 size={14} /> {editingBilling ? 'Cancelar' : 'Editar'}
                                                    </button>
                                                </div>
                                                {editingBilling ? (
                                                    <div className="account-address-form">
                                                        <div className="account-form-row">
                                                            <div className="account-form-group">
                                                                <label>Nombre *</label>
                                                                <input type="text" value={billingAddress.firstName} onChange={e => setBillingAddress({ ...billingAddress, firstName: e.target.value })} required />
                                                            </div>
                                                            <div className="account-form-group">
                                                                <label>Apellidos *</label>
                                                                <input type="text" value={billingAddress.lastName} onChange={e => setBillingAddress({ ...billingAddress, lastName: e.target.value })} required />
                                                            </div>
                                                        </div>
                                                        <div className="account-form-group">
                                                            <label>Empresa (opcional)</label>
                                                            <input type="text" value={billingAddress.company} onChange={e => setBillingAddress({ ...billingAddress, company: e.target.value })} />
                                                        </div>
                                                        <div className="account-form-group">
                                                            <label>País *</label>
                                                            <select value={billingAddress.country} onChange={e => setBillingAddress({ ...billingAddress, country: e.target.value })}>
                                                                <option>España</option>
                                                            </select>
                                                        </div>
                                                        <div className="account-form-group">
                                                            <label>Dirección de la calle *</label>
                                                            <input type="text" placeholder="Nombre de la calle y número" value={billingAddress.street} onChange={e => setBillingAddress({ ...billingAddress, street: e.target.value })} required />
                                                            <input type="text" placeholder="Apartamento, piso, etc. (opcional)" value={billingAddress.apartment} onChange={e => setBillingAddress({ ...billingAddress, apartment: e.target.value })} style={{ marginTop: '0.5rem' }} />
                                                        </div>
                                                        <div className="account-form-row">
                                                            <div className="account-form-group">
                                                                <label>Localidad / Ciudad *</label>
                                                                <input type="text" value={billingAddress.city} onChange={e => setBillingAddress({ ...billingAddress, city: e.target.value })} required />
                                                            </div>
                                                            <div className="account-form-group">
                                                                <label>Provincia *</label>
                                                                <input type="text" value={billingAddress.province} onChange={e => setBillingAddress({ ...billingAddress, province: e.target.value })} required />
                                                            </div>
                                                        </div>
                                                        <div className="account-form-row">
                                                            <div className="account-form-group">
                                                                <label>Código Postal *</label>
                                                                <input type="text" value={billingAddress.postalCode} onChange={e => setBillingAddress({ ...billingAddress, postalCode: e.target.value })} required />
                                                            </div>
                                                            <div className="account-form-group">
                                                                <label>Teléfono</label>
                                                                <input type="tel" value={billingAddress.phone} onChange={e => setBillingAddress({ ...billingAddress, phone: e.target.value })} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="account-address-display">
                                                        {billingAddress.street ? (
                                                            <>
                                                                <p>{billingAddress.firstName} {billingAddress.lastName}</p>
                                                                {billingAddress.company && <p>{billingAddress.company}</p>}
                                                                <p>{billingAddress.street}</p>
                                                                {billingAddress.apartment && <p>{billingAddress.apartment}</p>}
                                                                <p>{billingAddress.city}, {billingAddress.province} {billingAddress.postalCode}</p>
                                                                <p>{billingAddress.country}</p>
                                                            </>
                                                        ) : (
                                                            <p className="account-address-empty">Aún no has configurado esta dirección.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Shipping */}
                                            <div className="account-address-block">
                                                <div className="account-address-block__header">
                                                    <h3>Dirección de Envío</h3>
                                                    <button type="button" className="account-edit-btn" onClick={() => setEditingShipping(!editingShipping)}>
                                                        <Edit3 size={14} /> {editingShipping ? 'Cancelar' : 'Editar'}
                                                    </button>
                                                </div>
                                                {editingShipping ? (
                                                    <div className="account-address-form">
                                                        <div className="account-form-row">
                                                            <div className="account-form-group">
                                                                <label>Nombre *</label>
                                                                <input type="text" value={shippingAddress.firstName} onChange={e => setShippingAddress({ ...shippingAddress, firstName: e.target.value })} required />
                                                            </div>
                                                            <div className="account-form-group">
                                                                <label>Apellidos *</label>
                                                                <input type="text" value={shippingAddress.lastName} onChange={e => setShippingAddress({ ...shippingAddress, lastName: e.target.value })} required />
                                                            </div>
                                                        </div>
                                                        <div className="account-form-group">
                                                            <label>Empresa (opcional)</label>
                                                            <input type="text" value={shippingAddress.company} onChange={e => setShippingAddress({ ...shippingAddress, company: e.target.value })} />
                                                        </div>
                                                        <div className="account-form-group">
                                                            <label>País *</label>
                                                            <select value={shippingAddress.country} onChange={e => setShippingAddress({ ...shippingAddress, country: e.target.value })}>
                                                                <option>España</option>
                                                            </select>
                                                        </div>
                                                        <div className="account-form-group">
                                                            <label>Dirección de la calle *</label>
                                                            <input type="text" placeholder="Nombre de la calle y número" value={shippingAddress.street} onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })} required />
                                                            <input type="text" placeholder="Apartamento, piso, etc. (opcional)" value={shippingAddress.apartment} onChange={e => setShippingAddress({ ...shippingAddress, apartment: e.target.value })} style={{ marginTop: '0.5rem' }} />
                                                        </div>
                                                        <div className="account-form-row">
                                                            <div className="account-form-group">
                                                                <label>Localidad / Ciudad *</label>
                                                                <input type="text" value={shippingAddress.city} onChange={e => setShippingAddress({ ...shippingAddress, city: e.target.value })} required />
                                                            </div>
                                                            <div className="account-form-group">
                                                                <label>Provincia *</label>
                                                                <input type="text" value={shippingAddress.province} onChange={e => setShippingAddress({ ...shippingAddress, province: e.target.value })} required />
                                                            </div>
                                                        </div>
                                                        <div className="account-form-group">
                                                            <label>Código Postal *</label>
                                                            <input type="text" value={shippingAddress.postalCode} onChange={e => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })} required />
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="account-address-display">
                                                        {shippingAddress.street ? (
                                                            <>
                                                                <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                                                                {shippingAddress.company && <p>{shippingAddress.company}</p>}
                                                                <p>{shippingAddress.street}</p>
                                                                {shippingAddress.apartment && <p>{shippingAddress.apartment}</p>}
                                                                <p>{shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}</p>
                                                                <p>{shippingAddress.country}</p>
                                                            </>
                                                        ) : (
                                                            <p className="account-address-empty">Aún no has configurado esta dirección.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {(editingBilling || editingShipping) && (
                                            <button type="submit" className="account-save-btn" disabled={isSaving}>
                                                <Save size={16} /> {isSaving ? 'Guardando…' : 'Guardar Direcciones'}
                                            </button>
                                        )}
                                    </form>
                                </div>
                            )}

                            {/* ===== DETALLES DE LA CUENTA ===== */}
                            {activeTab === 'details' && (
                                <div className="account-panel animate-fade-in-up">
                                    <h2 className="account-panel__title">
                                        <UserCog size={22} /> Detalles de la Cuenta
                                    </h2>

                                    {detailsSaved && (
                                        <div className="account-alert account-alert--success">
                                            ✓ Datos actualizados correctamente.
                                        </div>
                                    )}
                                    {detailsError && (
                                        <div className="account-alert account-alert--error">
                                            {detailsError}
                                        </div>
                                    )}

                                    <form className="account-details-form" onSubmit={handleDetailsSave}>
                                        <div className="account-form-row">
                                            <div className="account-form-group">
                                                <label><User size={14} /> Nombre *</label>
                                                <input
                                                    type="text"
                                                    value={accountForm.firstName}
                                                    onChange={e => setAccountForm({ ...accountForm, firstName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="account-form-group">
                                                <label><User size={14} /> Apellidos *</label>
                                                <input
                                                    type="text"
                                                    value={accountForm.lastName}
                                                    onChange={e => setAccountForm({ ...accountForm, lastName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="account-form-group">
                                            <label><User size={14} /> Nombre visible *</label>
                                            <input
                                                type="text"
                                                value={accountForm.displayName}
                                                onChange={e => setAccountForm({ ...accountForm, displayName: e.target.value })}
                                                required
                                            />
                                            <span className="account-form-hint">
                                                Así es como se mostrará tu nombre en la cuenta y en las reseñas.
                                            </span>
                                        </div>

                                        <div className="account-form-group">
                                            <label><Mail size={14} /> Dirección de correo electrónico *</label>
                                            <input
                                                type="email"
                                                value={accountForm.email}
                                                onChange={e => setAccountForm({ ...accountForm, email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        {/* Password section */}
                                        <div className="account-password-section">
                                            <h3>Cambiar la contraseña</h3>

                                            <div className="account-form-group">
                                                <label><Lock size={14} /> Contraseña actual (déjala en blanco para no cambiarla)</label>
                                                <input
                                                    type="password"
                                                    value={accountForm.currentPassword}
                                                    onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })}
                                                />
                                            </div>

                                            <div className="account-form-group">
                                                <label><Lock size={14} /> Nueva contraseña (déjala en blanco para no cambiarla)</label>
                                                <input
                                                    type="password"
                                                    value={accountForm.newPassword}
                                                    onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })}
                                                />
                                            </div>

                                            <div className="account-form-group">
                                                <label><Lock size={14} /> Confirmar nueva contraseña</label>
                                                <input
                                                    type="password"
                                                    value={accountForm.confirmPassword}
                                                    onChange={e => setAccountForm({ ...accountForm, confirmPassword: e.target.value })}
                                                />
                                            </div>
                                        </div>

                                        <button type="submit" className="account-save-btn" disabled={isSaving}>
                                            <Save size={16} /> {isSaving ? 'Guardando…' : 'Guardar Cambios'}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
}
