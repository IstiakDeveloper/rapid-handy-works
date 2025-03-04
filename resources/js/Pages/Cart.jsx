import React from 'react';
import { Head } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import GuestLayout from '@/Layouts/GuestLayout';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity } = useCart();

    // Safe price formatting function
    const formatPrice = (price) => {
        return Number(price || 0).toFixed(2);
    };

    return (
        <GuestLayout>
            <Head title="Your Cart" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

                {cart.items.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <div>
                        <div className="grid gap-4">
                            {cart.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between border-b pb-4"
                                >
                                    <div className="flex items-center">
                                        {item.image && (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-16 h-16 object-cover mr-4"
                                            />
                                        )}
                                        <div>
                                            <h2 className="text-xl font-semibold">{item.title}</h2>
                                            <p className="text-gray-600">£{formatPrice(item.price)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <button
                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                            className="px-2 py-1 bg-gray-200"
                                        >
                                            -
                                        </button>
                                        <span className="mx-4">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="px-2 py-1 bg-gray-200"
                                        >
                                            +
                                        </button>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="ml-4 text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6">
                            <p className="text-xl font-bold">
                                Total Items: {cart.totalItems}
                            </p>
                            <p className="text-xl font-bold">
                                Total Price: £{formatPrice(cart.totalPrice)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}
