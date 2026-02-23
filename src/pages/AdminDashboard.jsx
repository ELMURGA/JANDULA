import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../data/products';
import { Package, Search, ChevronDown, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';
import '../styles/admin.css';

export default function AdminDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    profiles:user_id(full_name, email),
                    items:order_items(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Error al cargar los pedidos.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { error } = await supabase.rpc('update_order_status', {
                p_order_id: orderId,
                p_new_status: newStatus
            });

            if (error) throw error;

            // Optimistic update
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            console.error('Status update failed:', err);
            alert('Error al actualizar el estado: ' + err.message);
        }
    };

    const statusColors = {
        'pendiente': 'var(--color-stone-500)',
        'confirmado': '#3b82f6', // blue
        'enviado': '#f59e0b', // amber
        'entregado': '#10b981', // green
        'cancelado': '#ef4444'  // red
    };

    const filteredOrders = orders.filter(order => {
        // filter status
        if (filterStatus !== 'all' && order.status !== filterStatus) return false;
        // filter search (id, name, email)
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const idMatch = order.id.toString().includes(searchLower);
            const nameMatch = order.shipping_name?.toLowerCase().includes(searchLower);
            const emailMatch = order.profiles?.email?.toLowerCase().includes(searchLower);
            return idMatch || nameMatch || emailMatch;
        }
        return true;
    });

    if (loading && orders.length === 0) {
        return <div className="admin-loading"><div className="spinner"></div>Cargando Panel de Control...</div>;
    }

    return (
        <main className="admin-dash bg-stone-50">
            <div className="admin-container">
                <header className="admin-header">
                    <div className="admin-header__title">
                        <Package size={24} />
                        <h1>Gestión de Pedidos</h1>
                    </div>
                </header>

                <div className="admin-controls">
                    <div className="admin-search">
                        <Search size={18} />
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

                {error ? (
                    <div className="admin-error">{error}</div>
                ) : (
                    <div className="orders-table-wrapper">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID Pedido</th>
                                    <th>Fecha</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-8">No se encontraron pedidos.</td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="font-medium">#{order.id}</td>
                                            <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td>
                                                <div className="order-customer">
                                                    <strong>{order.shipping_name}</strong>
                                                    <span>{order.profiles?.email || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="font-semibold">{formatPrice(order.total)}</td>
                                            <td>
                                                <span className="order-status-badge" style={{ backgroundColor: `${statusColors[order.status]}15`, color: statusColors[order.status] }}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <select
                                                    className="status-selector"
                                                    value={order.status}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                >
                                                    <option value="pendiente">Marcar Pendiente</option>
                                                    <option value="confirmado">Marcar Confirmado</option>
                                                    <option value="enviado">Marcar Enviado</option>
                                                    <option value="entregado">Marcar Entregado</option>
                                                    <option value="cancelado">Cancelar Pedido</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
