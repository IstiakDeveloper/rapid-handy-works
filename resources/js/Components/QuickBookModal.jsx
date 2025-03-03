import React, { useState } from 'react';
import {
    StarIcon,
    XMarkIcon,
    ShoppingCartIcon,
    ClockIcon
} from "@heroicons/react/24/solid";
import toast, { Toaster } from 'react-hot-toast';

const QuickBookModal = ({
    service,
    onClose,
    onAddToCart,
    onBookNow,
    formatPrice
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);

    if (!service) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-black bg-opacity-50">
            <div className="relative w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-2xl rounded-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute z-10 p-2 text-gray-600 bg-white rounded-full shadow-md top-4 right-4 hover:text-gray-900"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>

                {/* Modal Content Grid */}
                <div className="grid gap-6 p-6 md:grid-cols-12 md:p-8">
                    {/* Image Gallery - Left Side */}
                    <div className="space-y-4 md:col-span-7">
                        {/* Main Image */}
                        <div className="bg-gray-100 rounded-2xl overflow-hidden h-[400px] flex items-center justify-center">
                            <img
                                src={
                                    service.images && service.images.length
                                        ? `/storage/${service.images[currentImageIndex]}`
                                        : "https://via.placeholder.com/600x400"
                                }
                                alt={`${service.title} - Image ${currentImageIndex + 1}`}
                                className="object-contain max-w-full max-h-full"
                            />
                        </div>

                        {/* Thumbnail Gallery */}
                        {service.images && service.images.length > 1 && (
                            <div className="flex pb-2 space-x-2 overflow-x-auto">
                                {service.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`
                                            w-20 h-20 rounded-lg overflow-hidden flex-shrink-0
                                            border-2 transition-all duration-300
                                            ${
                                                currentImageIndex === index
                                                    ? "border-amber-500 scale-105"
                                                    : "border-transparent opacity-60 hover:opacity-100"
                                            }
                                        `}
                                    >
                                        <img
                                            src={`/storage/${img}`}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="object-cover w-full h-full"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Service Details - Right Side */}
                    <div className="space-y-6 md:col-span-5">
                        {/* Service Header */}
                        <div>
                            <h2 className="mb-2 text-3xl font-bold text-gray-900">
                                {service.title}
                            </h2>
                            <div className="flex items-center mb-4 space-x-2">
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                        <StarIcon
                                            key={i}
                                            className={`h-5 w-5 ${
                                                i < Math.floor(service.rating || 0)
                                                    ? "text-yellow-500"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="ml-2 text-gray-600">
                                    {service.rating
                                        ? `${Number(service.rating).toFixed(1)} Rating`
                                        : "No ratings yet"}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="mb-2 text-lg font-semibold text-gray-800">
                                Description
                            </h3>
                            <p className="leading-relaxed text-gray-600">
                                {service.description}
                            </p>
                        </div>

                        {/* Service Metadata Grid */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                            {[
                                {
                                    label: "Price",
                                    value: `$${formatPrice(service.price)}`,
                                    className: "text-amber-600",
                                },
                                {
                                    label: "Duration",
                                    value: `${service.duration} mins`,
                                    className: "text-gray-900",
                                },
                                {
                                    label: "Category",
                                    value: service.category?.name || "N/A",
                                    className: "text-gray-700",
                                },
                                {
                                    label: "Provider",
                                    value: service.provider?.name || "N/A",
                                    className: "text-gray-700",
                                },
                            ].map((item, index) => (
                                <div key={index}>
                                    <p className="mb-1 text-xs tracking-wider text-gray-500 uppercase">
                                        {item.label}
                                    </p>
                                    <p
                                        className={`text-md font-semibold ${item.className}`}
                                    >
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Quantity
                                </label>
                                <div className="flex items-center overflow-hidden border rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-4 py-2 transition bg-gray-100 hover:bg-gray-200"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        readOnly
                                        className="w-16 text-center border-none focus:ring-0"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-4 py-2 transition bg-gray-100 hover:bg-gray-200"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => onAddToCart(service, quantity)}
                                    className="flex items-center justify-center w-full py-3 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                                >
                                    <ShoppingCartIcon className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </button>
                                <button
                                    onClick={() => onBookNow(service, quantity)}
                                    className="flex items-center justify-center w-full py-3 text-white transition-colors rounded-lg bg-amber-600 hover:bg-amber-700"
                                >
                                    <ClockIcon className="w-5 h-5 mr-2" />
                                    Book Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toaster />
        </div>
    );
};

export default QuickBookModal;
