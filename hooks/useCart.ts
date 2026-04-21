'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function useCart() {
    const [isHydrated, setIsHydrated] = useState(false);

    const items = useCartStore((state) => state.items);
    const addToCart = useCartStore((state) => state.addToCart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const clearCart = useCartStore((state) => state.clearCart);
    const setCart = useCartStore((state) => state.setCart);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    return {
        isHydrated,
        items,
        addToCart,
        removeFromCart,
        clearCart,
        setCart,
        totalItems: items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: items.reduce((total, item) => total + (item.price * item.quantity), 0)
    };
}