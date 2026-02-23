import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
    const { user, isLoggedIn, loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    if (requireAdmin && user?.role !== 'admin') {
        return <Navigate to="/mi-cuenta" replace />;
    }

    return children;
}
