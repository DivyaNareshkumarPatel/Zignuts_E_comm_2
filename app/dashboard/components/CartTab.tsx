"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { useAddToCart, usePlaceOrder, useCart as useApiCart } from "@/app/admin/api/cart";
import { useToast } from "@/contexts/ToastProvider";
import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/store/cartStore";

interface CartTabProps {
    userId: string;
    onOrderPlaced: () => void;
}

export default function CartTab({ userId, onOrderPlaced }: CartTabProps) {
    const toast = useToast();
    const apiAddToCart = useAddToCart();
    const placeOrder = usePlaceOrder();
    const { data: dbCartItems, isLoading: isDbCartLoading } = useApiCart(userId);
    const {
        isHydrated,
        items: localCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        setCart,
        totalPrice: cartTotal
    } = useCart();
    useEffect(() => {
        if (dbCartItems) {
            setCart(dbCartItems);
        }
    }, [dbCartItems, setCart]);

    const updateQuantity = async (item: CartItem, delta: number) => {
        const newQty = item.quantity + delta;
        let updatedItems: CartItem[];

        if (newQty <= 0) {
            removeFromCart(item.id);
            updatedItems = localCartItems.filter((i) => i.id !== item.id);
        } else {
            addToCart({ ...item, quantity: delta });
            updatedItems = localCartItems.map((i) =>
                i.id === item.id ? { ...i, quantity: newQty } : i
            );
        }
        try {
            await apiAddToCart.mutateAsync({ userId, items: updatedItems });
        } catch (error) {
            toast.showError("Failed to update cart on server.");
        }
    };

    const handlePlaceOrder = async () => {
        if (!localCartItems || localCartItems.length === 0) return;

        try {
            await placeOrder.mutateAsync({ userId, items: localCartItems, total: cartTotal });
            clearCart();
            toast.showSuccess("Order placed successfully! 🎉");
            onOrderPlaced();
        } catch {
            toast.showError("Failed to place order. Please try again.");
        }
    };

    if (!isHydrated || isDbCartLoading) {
        return (
            <div className="rounded-[1.5rem] bg-white border border-slate-200 p-10 text-center text-sm text-slate-500 animate-pulse">
                Loading your cart...
            </div>
        );
    }

    if (!localCartItems || localCartItems.length === 0) {
        return (
            <div className="rounded-[1.5rem] bg-white border border-slate-200 p-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                    <svg className="h-7 w-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-lg font-semibold text-slate-800">Your cart is empty</h2>
                <p className="mt-2 text-sm text-slate-500">Browse the store and add items to get started.</p>
                <Link
                    href="/products"
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Shop Now
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="rounded-[1.5rem] bg-white border border-slate-200 overflow-hidden shadow-sm">
                <div className="divide-y divide-slate-100">
                    {localCartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-5 p-5">
                            <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 overflow-hidden">
                                {item.imageUrl ? (
                                    <Image
                                        src={item.imageUrl}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                ) : (
                                    <svg className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-slate-900 truncate">{item.name}</p>
                                <p className="mt-0.5 text-sm text-slate-500">₹{item.price.toFixed(2)} each</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => updateQuantity(item, -1)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                                >
                                    −
                                </button>
                                <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item, 1)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                                >
                                    +
                                </button>
                            </div>

                            <p className="w-20 text-right font-semibold text-slate-900">
                                ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="rounded-[1.5rem] bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm text-slate-600">
                    <span>Delivery</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-base font-semibold text-slate-950">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                </div>

                <button
                    onClick={handlePlaceOrder}
                    disabled={placeOrder.isPending}
                    className="mt-6 w-full rounded-full bg-slate-950 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {placeOrder.isPending ? "Placing Order..." : "Place Order →"}
                </button>
            </div>
        </div>
    );
}