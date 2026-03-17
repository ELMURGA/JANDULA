import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
    const { user, isLoggedIn } = useAuth();

    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('jandula_wishlist');
        try {
            const parsed = saved ? JSON.parse(saved) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('jandula_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const isInWishlist = (productId) => wishlist.some(item => (typeof item === 'object' ? item.id === productId : item === productId));

    const toggleWishlist = (productOrId) => {
        if (!isLoggedIn) return false; // signal that auth is needed
        const productId = typeof productOrId === 'object' ? productOrId.id : productOrId;
        
        setWishlist(prev =>
            prev.some(item => (typeof item === 'object' ? item.id === productId : item === productId))
                ? prev.filter(item => (typeof item === 'object' ? item.id !== productId : item !== productId))
                : [...prev, typeof productOrId === 'object' ? productOrId : {id: productOrId}]
        );
        return true; // success
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => (typeof item === 'object' ? item.id !== productId : item !== productId)));
    };

    const clearWishlist = () => setWishlist([]);

    return (
        <WishlistContext.Provider value={{
            wishlist,
            wishlistItems: wishlist, // An alias for compatibility
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
