import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useCart } from "@/Contexts/CartContext";
import {
    MagnifyingGlassIcon,
    StarIcon,
    ShieldCheckIcon,
    ClockIcon,
    MapPinIcon,
    CreditCardIcon,
    XMarkIcon,
    ShoppingCartIcon,
    EyeIcon
} from "@heroicons/react/24/solid";

export default function Home({ services, categories }) {
    const { addToCart } = useCart();
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const formatPrice = (price) => Number(price || 0).toFixed(2);

    const filteredServices = services.filter(
        (service) =>
            (selectedCategory
                ? service.category_id === selectedCategory
                : true) &&
            (searchQuery
                ? service.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                : true)
    );

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedService, setSelectedService] = useState(null);
    const [isQuickBookModalOpen, setIsQuickBookModalOpen] = useState(false);

    const openQuickBookModal = (service) => {
        setSelectedService(service);
        setCurrentImageIndex(0);
        setQuantity(1);
        setIsQuickBookModalOpen(true);
    };

    const handleAddToCart = () => {
        if (selectedService) {
            addToCart(
                {
                    id: selectedService.id,
                    title: selectedService.title,
                    price: selectedService.price,
                    image: selectedService.images?.length
                        ? `/storage/${selectedService.images[0]}`
                        : null,
                    category: selectedService.category?.name || "Uncategorized",
                },
                quantity
            );
            setIsQuickBookModalOpen(false);
        }
    };
    const handleBookNow = () => {
        if (selectedService) {
            // Implement direct booking logic
            console.log(`Booking ${quantity} of ${selectedService.title}`);
            setIsQuickBookModalOpen(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Rapid Handy Works - Professional Services" />

            {/* Hero Section with Enhanced Responsiveness */}
            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4">
                        Expert Services at Your Fingertips
                    </h1>
                    <p className="max-w-xl mx-auto text-base md:text-lg text-indigo-100 mb-8">
                        Quality services from trusted professionals. Book,
                        track, and manage your home and personal services
                        seamlessly.
                    </p>

                    {/* Responsive Search and Filter */}
                    <div className="max-w-xl mx-auto flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <MagnifyingGlassIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full md:w-auto px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Services Grid with Professional Design */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-8">
                    Featured Services
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredServices.map((service) => (
                        <div
                            key={service.id}
                            className="group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-300
        hover:shadow-2xl hover:ring-2 hover:ring-indigo-500/20 transform hover:-translate-y-2"
                        >
                            {/* Image Container with Overlay */}
                            <div className="relative overflow-hidden">
                                <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <img
                                    src={
                                        service.images?.length
                                            ? `/storage/${service.images[0]}`
                                            : "https://via.placeholder.com/400x300"
                                    }
                                    alt={service.title}
                                    className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Quick Actions Overlay */}
                                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() =>
                                                openQuickBookModal(service)
                                            }
                                            className="bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition-all duration-300
                        hover:scale-110 flex items-center justify-center"
                                            title="Quick View"
                                        >
                                            <EyeIcon className="h-6 w-6 text-gray-700 hover:text-indigo-600" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                addToCart(
                                                    {
                                                        id: service.id,
                                                        title: service.title,
                                                        price: service.price,
                                                        image: service.images
                                                            ?.length
                                                            ? `/storage/${service.images[0]}`
                                                            : null,
                                                        category:
                                                            service.category
                                                                ?.name ||
                                                            "Uncategorized",
                                                    },
                                                    1
                                                )
                                            }
                                            className="bg-white/80 hover:bg-white p-3 rounded-full shadow-md transition-all duration-300
                        hover:scale-110 flex items-center justify-center"
                                            title="Add to Cart"
                                        >
                                            <ShoppingCartIcon className="h-6 w-6 text-gray-700 hover:text-green-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Service Details */}
                            <div className="p-5 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                            {service.title}
                                        </h3>
                                    </div>
                                    <span className="text-indigo-600 font-bold text-lg ml-4">
                                        ${formatPrice(service.price)}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                    {service.description}
                                </p>

                                {/* Service Metadata */}
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    {/* Duration */}
                                    <div className="flex items-center space-x-2">
                                        <ClockIcon className="h-5 w-5 text-indigo-500" />
                                        <span>{service.duration} mins</span>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                className={`h-5 w-5 ${
                                                    i <
                                                    Math.floor(
                                                        service.rating || 0
                                                    )
                                                        ? "text-yellow-500"
                                                        : "text-gray-300"
                                                }`}
                                            />
                                        ))}
                                        <span className="ml-2 text-gray-600">
                                            {service.rating
                                                ? Number(
                                                      service.rating
                                                  ).toFixed(1)
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Quick Book Modal */}
            {isQuickBookModalOpen && selectedService && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
                        {/* Close Button */}
                        <button
                            onClick={() => setIsQuickBookModalOpen(false)}
                            className="absolute top-4 right-4 z-10 text-gray-600 hover:text-gray-900 bg-white rounded-full p-2 shadow-md"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>

                        {/* Modal Content Grid */}
                        <div className="grid md:grid-cols-12 gap-6 p-6 md:p-8">
                            {/* Image Gallery - Left Side */}
                            <div className="md:col-span-7 space-y-4">
                                {/* Main Image */}
                                <div className="bg-gray-100 rounded-2xl overflow-hidden h-[400px] flex items-center justify-center">
                                    <img
                                        src={
                                            selectedService.images &&
                                            selectedService.images.length
                                                ? `/storage/${selectedService.images[currentImageIndex]}`
                                                : "https://via.placeholder.com/600x400"
                                        }
                                        alt={`${
                                            selectedService.title
                                        } - Image ${currentImageIndex + 1}`}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>

                                {/* Thumbnail Gallery */}
                                {selectedService.images &&
                                    selectedService.images.length > 1 && (
                                        <div className="flex space-x-2 overflow-x-auto pb-2">
                                            {selectedService.images.map(
                                                (img, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() =>
                                                            setCurrentImageIndex(
                                                                index
                                                            )
                                                        }
                                                        className={`
                                        w-20 h-20 rounded-lg overflow-hidden flex-shrink-0
                                        border-2 transition-all duration-300
                                        ${
                                            currentImageIndex === index
                                                ? "border-indigo-500 scale-105"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                        }
                                    `}
                                                    >
                                                        <img
                                                            src={`/storage/${img}`}
                                                            alt={`Thumbnail ${
                                                                index + 1
                                                            }`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>

                            {/* Service Details - Right Side */}
                            <div className="md:col-span-5 space-y-6">
                                {/* Service Header */}
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                        {selectedService.title}
                                    </h2>
                                    <div className="flex items-center space-x-2 mb-4">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <StarIcon
                                                    key={i}
                                                    className={`h-5 w-5 ${
                                                        i <
                                                        Math.floor(
                                                            selectedService.rating ||
                                                                0
                                                        )
                                                            ? "text-yellow-500"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-gray-600 ml-2">
                                            {selectedService.rating
                                                ? `${Number(
                                                      selectedService.rating
                                                  ).toFixed(1)} Rating`
                                                : "No ratings yet"}
                                        </span>
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                        Description
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {selectedService.description}
                                    </p>
                                </div>

                                {/* Service Metadata Grid */}
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                                    {[
                                        {
                                            label: "Price",
                                            value: `$${formatPrice(
                                                selectedService.price
                                            )}`,
                                            className: "text-indigo-600",
                                        },
                                        {
                                            label: "Duration",
                                            value: `${selectedService.duration} mins`,
                                            className: "text-gray-900",
                                        },
                                        {
                                            label: "Category",
                                            value:
                                                selectedService.category
                                                    ?.name || "N/A",
                                            className: "text-gray-700",
                                        },
                                        {
                                            label: "Provider",
                                            value:
                                                selectedService.provider
                                                    ?.name || "N/A",
                                            className: "text-gray-700",
                                        },
                                    ].map((item, index) => (
                                        <div key={index}>
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <div className="flex items-center border rounded-lg overflow-hidden">
                                            <button
                                                onClick={() =>
                                                    setQuantity(
                                                        Math.max(
                                                            1,
                                                            quantity - 1
                                                        )
                                                    )
                                                }
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
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
                                                onClick={() =>
                                                    setQuantity(quantity + 1)
                                                }
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                                        >
                                            <ShoppingCartIcon className="h-5 w-5 mr-2" />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={handleBookNow}
                                            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                                        >
                                            <ClockIcon className="h-5 w-5 mr-2" />
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Why Choose Us Section */}
            <div className="bg-gray-50 py-16 md:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
                            Why Choose Rapid Handy Works
                        </h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Convenient. Reliable. Professional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Trusted Professionals",
                                description:
                                    "Carefully vetted and verified service providers with proven track records.",
                                icon: ShieldCheckIcon,
                                color: "bg-green-100 text-green-600",
                            },
                            {
                                name: "Transparent Pricing",
                                description:
                                    "Clear, upfront pricing with no hidden charges or unexpected fees.",
                                icon: CreditCardIcon,
                                color: "bg-blue-100 text-blue-600",
                            },
                            {
                                name: "Easy Booking",
                                description:
                                    "Simple, quick booking process with instant confirmation and support.",
                                icon: MapPinIcon,
                                color: "bg-purple-100 text-purple-600",
                            },
                        ].map((feature) => (
                            <div
                                key={feature.name}
                                className="bg-white rounded-xl shadow-lg p-6 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div
                                    className={`flex items-center justify-center h-16 w-16 rounded-full mb-4 ${feature.color}`}
                                >
                                    <feature.icon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.name}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <div className="lg:w-2/3">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            <span className="block">
                                Ready to Transform Your Service Experience?
                            </span>
                            <span className="block text-indigo-200 mt-2">
                                Find the Perfect Solution Today
                            </span>
                        </h2>
                        <p className="mt-4 text-lg text-indigo-100">
                            Discover a wide range of professional services
                            tailored to your needs. Save time, get quality work,
                            and enjoy peace of mind.
                        </p>
                    </div>
                    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
                        <Link
                            href={route("services.index")}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors"
                        >
                            Browse Services
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-700 hover:bg-indigo-800 transition-colors"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
