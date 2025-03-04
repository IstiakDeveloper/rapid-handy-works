import React from 'react';
import { Link } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import {
    XMarkIcon,
    TrashIcon,
    ShoppingCartIcon,
    MinusIcon,
    PlusIcon
} from '@heroicons/react/24/outline';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

export default function SideCart({ isOpen, onClose }) {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

    // Safe price formatting function
    const formatPrice = (price) => {
        return Number(price || 0).toFixed(2);
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={onClose}
            >
                {/* Background Overlay */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
                </Transition.Child>

                {/* Side Cart Container */}
                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col bg-white shadow-2xl rounded-l-2xl">
                                        {/* Header */}
                                        <div className="bg-indigo-600 text-white p-6 flex items-center justify-between rounded-tl-2xl">
                                            <div className="flex items-center space-x-3">
                                                <ShoppingCartIcon className="h-7 w-7" />
                                                <h2 className="text-xl font-bold">Your Cart</h2>
                                            </div>
                                            <button
                                                onClick={onClose}
                                                className="hover:bg-indigo-500 p-2 rounded-full transition"
                                            >
                                                <XMarkIcon className="h-6 w-6" />
                                            </button>
                                        </div>

                                        {/* Cart Items */}
                                        <div className="flex-1 overflow-y-auto px-6 py-4">
                                            {cart.items.length === 0 ? (
                                                <div className="text-center py-10 text-gray-500">
                                                    <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                                                    <p className="text-lg">Your cart is empty</p>
                                                    <p className="text-sm text-gray-400 mt-2">
                                                        Looks like you haven't added any items yet
                                                    </p>
                                                </div>
                                            ) : (
                                                <ul className="space-y-4">
                                                    {cart.items.map((item) => (
                                                        <li
                                                            key={item.id}
                                                            className="flex items-center border-b pb-4 last:border-b-0"
                                                        >
                                                            {/* Product Image */}
                                                            {item.image && (
                                                                <div className="w-20 h-20 mr-4 flex-shrink-0">
                                                                    <img
                                                                        src={item.image}
                                                                        alt={item.title}
                                                                        className="w-full h-full object-cover rounded-lg"
                                                                    />
                                                                </div>
                                                            )}

                                                            {/* Product Details */}
                                                            <div className="flex-1">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <h3 className="font-semibold text-gray-800">
                                                                            {item.title}
                                                                        </h3>
                                                                        <p className="text-sm text-gray-500">
                                                                            {item.category}
                                                                        </p>
                                                                    </div>
                                                                    <p className="font-bold text-indigo-600">
                                                                        £{formatPrice(item.price)}
                                                                    </p>
                                                                </div>

                                                                {/* Quantity Control */}
                                                                <div className="mt-2 flex justify-between items-center">
                                                                    <div className="flex items-center space-x-2">
                                                                        <button
                                                                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                                            className="bg-gray-100 p-1 rounded-full hover:bg-gray-200"
                                                                        >
                                                                            <MinusIcon className="h-4 w-4 text-gray-600" />
                                                                        </button>
                                                                        <span className="px-2 bg-gray-100 rounded">
                                                                            {item.quantity}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                            className="bg-gray-100 p-1 rounded-full hover:bg-gray-200"
                                                                        >
                                                                            <PlusIcon className="h-4 w-4 text-gray-600" />
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => removeFromCart(item.id)}
                                                                        className="text-red-500 hover:text-red-700 flex items-center"
                                                                    >
                                                                        <TrashIcon className="h-5 w-5 mr-1" />
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>

                                        {/* Cart Summary & Actions */}
                                        {cart.items.length > 0 && (
                                            <div className="bg-gray-50 p-6 rounded-b-2xl">
                                                <div className="flex justify-between mb-4">
                                                    <span className="text-gray-600">Total Items</span>
                                                    <span className="font-bold">{cart.totalItems}</span>
                                                </div>
                                                <div className="flex justify-between mb-6">
                                                    <span className="text-lg font-bold">Subtotal</span>
                                                    <span className="text-lg font-bold text-indigo-600">
                                                        £{formatPrice(cart.totalPrice)}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        onClick={clearCart}
                                                        className="bg-red-100 text-red-600 py-3 rounded-lg hover:bg-red-200 transition"
                                                    >
                                                        Clear Cart
                                                    </button>
                                                    <Link
                                                        href="/admin/checkout"
                                                        className="bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition text-center"
                                                    >
                                                        Checkout
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
