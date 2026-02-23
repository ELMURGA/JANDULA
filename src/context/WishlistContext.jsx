import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user, isLoggedIn } = useAuth();

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('jandula_wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('jandula_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const isInWishlist = (productId) => wishlist.includes(productId);

    const toggleWishlist = (productId) => {
        if (!isLoggedIn) return false; // signal that auth is needed
        setWishlist(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
        return true; // success
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(id => id !== productId));
    };

    const clearWishlist = () => setWishlist([]);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            isInWishlist,
            toggleWishlist,
            removeFromWishlist,
            clearWishlist,
            wishlistCount: wishlist.length,
        }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    return useContext(WishlistContext);
}
