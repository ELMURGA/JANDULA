import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { jsPDF } from 'jspdf';
import { formatPrice } from '../utils/productUtils';
import { useAdminAuth, AdminAuthProvider } from '../context/AdminAuthContext';
import {
    Package, Search, LogOut, Eye, X, TrendingUp,
    ShoppingBag, Clock, Truck, CheckCircle, XCircle, Lock
} from 'lucide-react';
import WhatsAppIcon from '../components/WhatsAppIcon';
import '../styles/admin.css';

function generateShippingLabelPdf(order) {
    const doc = new jsPDF({ unit: 'mm', format: 'a6' });

    doc.setDrawColor(232, 121, 164);
    doc.setLineWidth(0.6);
    doc.rect(5, 5, 95, 138);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('JANDULA MODA', 8, 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Etiqueta pedido #${order.id}`, 8, 19);

    doc.setLineWidth(0.2);
    doc.line(8, 22, 95, 22);

    doc.setFont('helvetica', 'bold');
    doc.text('DESTINATARIA', 8, 30);

    doc.setFont('helvetica', 'normal');
    const name = order.shipping_name || '—';
    const address = order.shipping_address || '—';
    const city = order.shipping_city || '—';
    const postal = order.shipping_postal || '—';

    const lines = [
        name,
        address,
        `${postal} ${city}`.trim(),
        order.shipping_country || 'España',
    ];

    let y = 38;
    lines.forEach((line) => {
        const split = doc.splitTextToSize(String(line), 84);
        doc.text(split, 8, y);
        y += split.length * 5;
    });

    // Teléfono
    if (order.shipping_phone) {
        y += 3;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('TEL:', 8, y);
        doc.setFont('helvetica', 'normal');
        doc.text(order.shipping_phone, 20, y);
        y += 5;
    }

    // Email del cliente
    const clientEmail = order.profiles?.email || '';
    if (clientEmail) {
        doc.setFontSize(8);
        doc.text(`Email: ${clientEmail}`, 8, y);
        y += 5;
    }

    // Notas para el mensajero
    if (order.notes) {
        y += 2;
        doc.setLineWidth(0.2);
        doc.line(8, y, 95, y);
        y += 5;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('NOTAS ENVÍO:', 8, y);
        y += 4;
        doc.setFont('helvetica', 'normal');
        const noteLines = doc.splitTextToSize(String(order.notes), 84);
        doc.text(noteLines, 8, y);
    }

    doc.setFontSize(8);
    doc.setTextColor(90, 90, 90);
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 8, 136);

    doc.save(`etiqueta-pedido-${order.id}.pdf`);
}

/* ─────────────────────────────────────────────
   PANTALLA DE LOGIN DEL ADMIN
───────────────────────────────────────────── */
function AdminLogin() {
    const { adminLogin } = useAdminAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const result = await adminLogin(email, password);
            if (!result.success) {
                setError(result.error);
            }
        } catch {
            setError('No se pudo iniciar sesión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="admin-login-wrapper">
            <div className="admin-login-card">
                <div className="admin-login-logo">
                    <Package size={32} />
                </div>
                <h1 className="admin-login-title">Panel de Administración</h1>
                <p className="admin-login-subtitle">Jándula Moda — Gestión de Pedidos</p>

                <form className="admin-login-form" onSubmit={handleSubmit}>
                    <div className="admin-form-group">
                        <label htmlFor="admin-email">Usuario</label>
                        <input
                            id="admin-email"
                            type="email"
                            placeholder="admin@jandula.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="username"
                        />
                    </div>
                    <div className="admin-form-group">
                        <label htmlFor="admin-password">Contraseña</label>
                        <input
                            id="admin-password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />
                    </div>
                    {error && <p className="admin-login-error">{error}</p>}
                    <button type="submit" className="admin-login-btn" disabled={loading}>
                        <Lock size={16} />
                        {loading ? 'Accediendo...' : 'Acceder al Panel'}
                    </button>
                </form>

                <p className="admin-login-footer">
                    Acceso exclusivo para administradoras de Jándula Moda
                </p>
            </div>
        </main>
    );
}

/* ─────────────────────────────────────────────
   MODAL DE DETALLE DE PEDIDO
───────────────────────────────────────────── */
function OrderDetailModal({ order, onClose, onStatusChange, statusColors }) {
    if (!order) return null;

    const waMsg = encodeURIComponent(
        `Hola ${order.shipping_name}, te escribimos desde Jándula Moda sobre tu pedido #${order.id}. `
    );

    return (
        <div className="order-modal-overlay" onClick={onClose}>
            <div className="order-modal" onClick={e => e.stopPropagation()}>
                <div className="order-modal__header">
                    <h2>Pedido #{order.id}</h2>
                    <button className="order-modal__close" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="order-modal__body">
                    <div className="order-modal__section">
                        <h3>Cliente</h3>
                        <p><strong>{order.shipping_name}</strong></p>
                        <p>{order.profiles?.email || order.shipping_email || '—'}</p>
                        {order.shipping_phone && <p>📞 {order.shipping_phone}</p>}
                    </div>

                    <div className="order-modal__section">
                        <h3>Dirección de envío</h3>
                        <p>{order.shipping_address}</p>
                        <p>{order.shipping_city} {order.shipping_postal}</p>
                        <p>{order.shipping_country || 'España'}</p>
                        <button
                            className="order-detail-btn"
                            style={{ marginTop: '0.75rem', width: '100%' }}
                            onClick={() => generateShippingLabelPdf(order)}
                        >
                            Descargar etiqueta PDF
                        </button>
                    </div>

                    {order.items && order.items.length > 0 && (
                        <div className="order-modal__section">
                            <h3>Productos</h3>
                            <ul className="order-modal__items">
                                {order.items.map((item, i) => (
                                    <li key={i}>
                                        <span className="item-name">{item.product_name || `Producto #${item.product_id}`}</span>
                                        {item.size && <span className="item-size">Talla: {item.size}</span>}
                                        {item.color && <span className="item-size">Color: {item.color}</span>}
                                        <span className="item-qty">x{item.quantity}</span>
                                        <span className="item-price">{formatPrice((item.total_price ?? ((item.unit_price ?? 0) * (item.quantity ?? 0))))}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="order-modal__section order-modal__total">
                        <strong>Total: {formatPrice(order.total)}</strong>
                    </div>

                    <div className="order-modal__section">
                        <h3>Cambiar estado</h3>
                        <select
                            className="status-selector"
                            value={order.status}
                            onChange={e => { onStatusChange(order.id, e.target.value); onClose(); }}
                        >
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>

                    <div className="order-modal__section">
                        <h3>Contactar al cliente</h3>
                        <a
                            href={`https://wa.me/34${order.shipping_phone?.replace(/\D/g, '')}?text=${waMsg}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="order-wa-btn"
                        >
                            <WhatsAppIcon size={18} color="#fff" />
                            Escribir por WhatsApp
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────
   PANEL PRINCIPAL DE PEDIDOS
───────────────────────────────────────────── */
function AdminPanel() {
    const { adminLogout } = useAdminAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        document.body.style.overflow = selectedOrder ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [selectedOrder]);

    useEffect(() => {
        fetchOrders();

        // Suscripción en tiempo real a cambios de pedidos
        const channel = supabase
            .channel('orders-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .subscribe();

        const intervalId = setInterval(() => {
            fetchOrders();
        }, 15000);

        return () => {
            clearInterval(intervalId);
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    profiles:user_id(full_name, email),
                    items:order_items(*)
                `)
                .order('created_at', { ascending: false });

            if (error) {
                const fallback = await supabase
                    .from('orders')
                    .select(`
                        *,
                        items:order_items(*)
                    `)
                    .order('created_at', { ascending: false });

                if (fallback.error) throw fallback.error;
                setOrders(fallback.data || []);
            } else {
                setOrders(data || []);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(`No se pudieron cargar los pedidos: ${err?.message || 'error desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus })
                .eq('id', orderId);

            if (error) throw error;
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Error al actualizar el estado: ' + err.message);
        }
    };

    const statusColors = {
        'pendiente': '#78716c',
        'confirmado': '#3b82f6',
        'enviado': '#f59e0b',
        'entregado': '#10b981',
        'cancelado': '#ef4444',
    };

    const statusIcons = {
        'pendiente': <Clock size={14} />,
        'confirmado': <CheckCircle size={14} />,
        'enviado': <Truck size={14} />,
        'entregado': <CheckCircle size={14} />,
        'cancelado': <XCircle size={14} />,
    };

    const filteredOrders = orders.filter(order => {
        if (filterStatus !== 'all' && order.status !== filterStatus) return false;
        if (searchTerm) {
            const s = searchTerm.toLowerCase();
            return (
                order.id.toString().includes(s) ||
                order.shipping_name?.toLowerCase().includes(s) ||
                order.profiles?.email?.toLowerCase().includes(s)
            );
        }
        return true;
    });

    // Estadísticas rápidas
    const stats = {
        total: orders.length,
        pendientes: orders.filter(o => o.status === 'pendiente').length,
        enviados: orders.filter(o => o.status === 'enviado').length,
        importe: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    };

    return (
        <main className="admin-dash">
            <div className="admin-container">
                {/* Header */}
                <header className="admin-header">
                    <div className="admin-header__title">
                        <div className="admin-logo-mark">
                            <Package size={22} />
                        </div>
                        <div>
                            <h1>Gestión de Pedidos</h1>
                            <p className="admin-header__sub">Jándula Moda · Panel de Control</p>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={adminLogout}>
                        <LogOut size={16} />
                        Cerrar sesión
                    </button>
                </header>

                {/* Stats */}
                <div className="admin-stats">
                    <div className="stat-card">
                        <ShoppingBag size={20} className="stat-icon" />
                        <div>
                            <p className="stat-label">Total Pedidos</p>
                            <p className="stat-value">{stats.total}</p>
                        </div>
                    </div>
                    <div className="stat-card stat-card--warning">
                        <Clock size={20} className="stat-icon" />
                        <div>
                            <p className="stat-label">Pendientes</p>
                            <p className="stat-value">{stats.pendientes}</p>
                        </div>
                    </div>
                    <div className="stat-card stat-card--info">
                        <Truck size={20} className="stat-icon" />
                        <div>
                            <p className="stat-label">Enviados</p>
                            <p className="stat-value">{stats.enviados}</p>
                        </div>
                    </div>
                    <div className="stat-card stat-card--success">
                        <TrendingUp size={20} className="stat-icon" />
                        <div>
                            <p className="stat-label">Facturación</p>
                            <p className="stat-value">{formatPrice(stats.importe)}</p>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="admin-controls">
                    <div className="admin-search">
                        <Search size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por ID, nombre o email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="admin-filter">
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                            <option value="all">Todos los estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>

                {/* Content */}
                {loading && orders.length === 0 ? (
                    <div className="admin-loading">
                        <div className="spinner"></div>
                        Cargando pedidos...
                    </div>
                ) : error ? (
                    <div className="admin-error">
                        <XCircle size={24} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="orders-table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Cambiar estado</th>
                                    <th>Detalle</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="orders-empty">No se encontraron pedidos.</td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="order-id">#{order.id}</td>
                                            <td>{new Date(order.created_at).toLocaleDateString('es-ES')}</td>
                                            <td>
                                                <div className="order-customer">
                                                    <strong>{order.shipping_name}</strong>
                                                    <span>{order.profiles?.email || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="order-total">{formatPrice(order.total)}</td>
                                            <td>
                                                <span
                                                    className="order-status-badge"
                                                    style={{
                                                        backgroundColor: `${statusColors[order.status]}18`,
                                                        color: statusColors[order.status],
                                                        borderColor: `${statusColors[order.status]}40`,
                                                    }}
                                                >
                                                    {statusIcons[order.status]}
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="status-selector"
                                                    value={order.status}
                                                    onChange={e => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="confirmado">Confirmado</option>
                                                    <option value="enviado">Enviado</option>
                                                    <option value="entregado">Entregado</option>
                                                    <option value="cancelado">Cancelado</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button
                                                    className="order-detail-btn"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {selectedOrder && (
                <OrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusChange={handleStatusChange}
                    statusColors={statusColors}
                />
            )}
        </main>
    );
}

/* ─────────────────────────────────────────────
   EXPORT PRINCIPAL (envuelve con AdminAuthProvider)
───────────────────────────────────────────── */
export default function AdminDashboard() {
    return (
        <AdminAuthProvider>
            <AdminDashboardInner />
        </AdminAuthProvider>
    );
}

function AdminDashboardInner() {
    const { adminLoggedIn, adminLoading } = useAdminAuth();

    if (adminLoading) {
        return <div className="admin-loading"><div className="spinner"></div></div>;
    }

    return adminLoggedIn ? <AdminPanel /> : <AdminLogin />;
}
