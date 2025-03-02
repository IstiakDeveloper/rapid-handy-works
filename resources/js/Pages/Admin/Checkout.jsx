import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { CalendarIcon, ClockIcon, MapPinIcon, PhoneIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function Checkout({ auth }) {
    const { cart, clearCart } = useCart();
    const cartItems = cart.items;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { data, setData } = useForm({
        items: [],
        booking_date: '',
        booking_time: '',
        address: '',
        phone: '',
        notes: ''
    });

    useEffect(() => {
        console.log('Cart Items:', cartItems);
        setData('items', cartItems);
    }, [cartItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', data);
        console.log('Cart Items:', cartItems);
        if (cartItems.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/admin/checkout', {
                ...data,
                items: cart.items.map(item => ({
                    id: item.id,
                    quantity: item.quantity
                }))
            });

            clearCart();
            window.location.href = '/bookings';
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.errors || err.message;
            setError(errorMessage);
            if (err.response?.data?.error_details) {
                console.error('Error Details:', err.response.data.error_details);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Checkout" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Cart Summary */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                                {cartItems.length === 0 ? (
                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                        <p className="text-gray-600">Your cart is empty</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center border-b pb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold">{item.title}</h3>
                                                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                                                    {item.category && (
                                                        <p className="text-sm text-gray-500">{item.category}</p>
                                                    )}
                                                </div>
                                                <div className="text-right ml-4">
                                                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                                    <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                                                </div>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center pt-4 border-t">
                                            <span className="font-bold text-lg">Total</span>
                                            <span className="font-bold text-xl text-indigo-600">
                                                ${cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Booking Form */}
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Booking Details</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <CalendarIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                Booking Date
                                            </div>
                                        </label>
                                        <input
                                            type="date"
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.booking_date}
                                            onChange={e => setData('booking_date', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <ClockIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                Booking Time
                                            </div>
                                        </label>
                                        <input
                                            type="time"
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.booking_time}
                                            onChange={e => setData('booking_time', e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <MapPinIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                Service Address
                                            </div>
                                        </label>
                                        <textarea
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="3"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            placeholder="Enter your complete service address"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <PhoneIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                Contact Phone
                                            </div>
                                        </label>
                                        <input
                                            type="tel"
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <div className="flex items-center">
                                                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
                                                Additional Notes
                                            </div>
                                        </label>
                                        <textarea
                                            className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                            rows="2"
                                            value={data.notes}
                                            onChange={e => setData('notes', e.target.value)}
                                            placeholder="Any special instructions or requirements (optional)"
                                        />
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                                            <div className="flex">
                                                <div className="ml-3">
                                                    <p className="text-sm text-red-700">
                                                        {typeof error === 'object' ? Object.values(error).flat().join(', ') : error}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || cartItems.length === 0}
                                        className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {loading ? 'Processing...' : 'Place Order'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
