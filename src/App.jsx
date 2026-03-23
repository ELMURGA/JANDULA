import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import WhatsAppButton from './components/WhatsAppButton';
import CookieConsent from './components/CookieConsent';
import DiscountModal from './components/DiscountModal';

// Pages
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import CategoryPage from './pages/CategoryPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AccessibilityPage from './pages/AccessibilityPage';
import ReturnPolicyPage from './pages/ReturnPolicyPage';
import FavoritesPage from './pages/FavoritesPage';
import AccountPage from './pages/AccountPage';
import OrderConfirmedPage from './pages/OrderConfirmedPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [toastTimer, setToastTimer] = useState(null);

  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <ScrollToTop />
          <a href="#main-content" className="skip-to-content">Ir al contenido principal</a>

          <Toast message={toastMessage} />
          <Navbar />

          {/* Spacer for fixed navbar */}
          <div style={{ height: '126px' }} aria-hidden="true" />

          <div id="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/contacto" element={<ContactPage />} />
              <Route path="/categoria/:slug" element={<CategoryPage />} />
              <Route path="/producto/:id" element={<ProductDetailPage />} />
              <Route path="/carrito" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/pedido-confirmado" element={<OrderConfirmedPage />} />
              <Route path="/favoritos" element={<FavoritesPage />} />
              <Route path="/mi-cuenta" element={<AccountPage />} />
              <Route path="/recuperar-contrasena" element={<ResetPasswordPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/politica-privacidad" element={<PrivacyPolicyPage />} />
              <Route path="/politica-cookies" element={<CookiePolicyPage />} />
              <Route path="/accesibilidad" element={<AccessibilityPage />} />
              <Route path="/devoluciones" element={<ReturnPolicyPage />} />
            </Routes>
          </div>

          <Footer />
          <WhatsAppButton />
          <CookieConsent />
          <DiscountModal />
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
