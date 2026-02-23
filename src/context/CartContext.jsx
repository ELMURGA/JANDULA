import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState(() => {
        try {
            const localData = localStorage.getItem('jandula_cart');
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.error('Error reading cart from localStorage', error);
            return [];
        }
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem('jandula_cart', JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart to localStorage', error);
        }
    }, [cartItems]);

    // Derived state
    const cartCount = useMemo(() => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    }, [cartItems]);

    const cartTotal = useMemo(() => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    }, [cartItems]);

    // Actions
    const addToCart = (product, size = null, quantity = 1) => {
        setCartItems(prev => {
            const existingItemIndex = prev.findIndex(
                item => item.id === product.id && item.size === size
            );

            if (existingItemIndex >= 0) {
                // Update quantity of existing item
                const newItems = [...prev];
                newItems[existingItemIndex] = {
                    ...newItems[existingItemIndex],
                    quantity: newItems[existingItemIndex].quantity + quantity
                };
                return newItems;
            }

            // Add new item
            return [...prev, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                size: size,
                quantity: quantity
            }];
        });

        // Open cart drawer when adding item
        setIsCartOpen(true);
    };

    const removeFromCart = (productId, size = null) => {
        setCartItems(prev => prev.filter(
            item => !(item.id === productId && item.size === size)
        ));
    };

    const updateQuantity = (productId, size = null, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId, size);
            return;
        }

        setCartItems(prev => prev.map(item => {
            if (item.id === productId && item.size === size) {
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
