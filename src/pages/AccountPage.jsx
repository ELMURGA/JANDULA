import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ShoppingBag, Download, MapPin, UserCog, LogOut,
    ChevronRight, Eye, Package, Mail, Lock, User, Save, Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/account.css';

const TABS = [
    { id: 'dashboard', label: 'Panel de control', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag },
    { id: 'downloads', label: 'Descargas', icon: Download },
    { id: 'addresses', label: 'Direcciones', icon: MapPin },
    { id: 'details', label: 'Detalles de la cuenta', icon: UserCog },
    { id: 'logout', label: 'Cerrar sesión', icon: LogOut },
];

// Mock orders data (empty by default, simulating a new account)
const MOCK_ORDERS = [];

export default function AccountPage() {
    const { user, logout, updateUser } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');

    // Address forms
    const [billingAddress, setBillingAddress] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
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
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        displayName: user?.name || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [addressSaved, setAddressSaved] = useState(false);
    const [detailsSaved, setDetailsSaved] = useState(false);
    const [editingBilling, setEditingBilling] = useState(false);
    const [editingShipping, setEditingShipping] = useState(false);

    if (!user) {
        navigate('/');
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

    const handleAddressSave = (e) => {
        e.preventDefault();
        setAddressSaved(true);
        setEditingBilling(false);
        setEditingShipping(false);
        setTimeout(() => setAddressSaved(false), 3000);
    };

    const handleDetailsSave = (e) => {
        e.preventDefault();
        updateUser({
            name: accountForm.displayName || `${accountForm.firstName} ${accountForm.lastName}`.trim(),
            email: accountForm.email,
        });
        setDetailsSaved(true);
        setAccountForm(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
        setTimeout(() => setDetailsSaved(false), 3000);
    };

    const userName = user.name || user.email.split('@')[0];

    return (
        <div className="page-wrapper">
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

                                    {MOCK_ORDERS.length === 0 ? (
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
                                                    {MOCK_ORDERS.map(order => (
                                                        <tr key={order.id}>
                                                            <td><strong>#{order.id}</strong></td>
                                                            <td>{order.date}</td>
                                                            <td>
                                                                <span className={`account-status account-status--${order.status.toLowerCase()}`}>
                                                                    {order.status}
                                                                </span>
                                                            </td>
                                                            <td>{order.total}</td>
                                                            <td>
                                                                <button className="account-view-btn">
                                                                    <Eye size={14} /> Ver
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ===== DESCARGAS ===== */}
                            {activeTab === 'downloads' && (
                                <div className="account-panel animate-fade-in-up">
                                    <h2 className="account-panel__title">
                                        <Download size={22} /> Descargas
                                    </h2>
                                    <div className="account-empty">
                                        <Download size={48} />
                                        <p>Aún no has hecho ninguna descarga.</p>
                                    </div>
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
                                            <button type="submit" className="account-save-btn">
                                                <Save size={16} /> Guardar Direcciones
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

                                        <button type="submit" className="account-save-btn">
                                            <Save size={16} /> Guardar Cambios
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
