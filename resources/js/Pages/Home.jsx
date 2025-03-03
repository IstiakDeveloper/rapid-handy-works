import React, { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import { useCart } from "@/Contexts/CartContext";
import ServiceCard from "@/Components/ServiceCard";
import QuickBookModal from "@/Components/QuickBookModal";
import {
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    CreditCardIcon,
    MapPinIcon,
} from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";

export default function Home({ services, categories }) {
    const { addToCart } = useCart();
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [isQuickBookModalOpen, setIsQuickBookModalOpen] = useState(false);

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

    const openQuickBookModal = (service) => {
        setSelectedService(service);
        setIsQuickBookModalOpen(true);
    };

    const handleAddToCart = (service, quantity = 1) => {
        addToCart(
            {
                id: service.id,
                title: service.title,
                price: service.price,
                image: service.images?.length
                    ? `/storage/${service.images[0]}`
                    : null,
                category: service.category?.name || "Uncategorized",
            },
            quantity
        );

        // Show toast notification
        toast.success(`${service.title} added to cart`, {
            duration: 3000,
            position: "top-right",
            style: {
                background: "#10b981", // Emerald green
                color: "white",
                padding: "12px",
                borderRadius: "8px",
            },
            icon: "🛒",
        });

        setIsQuickBookModalOpen(false);
    };

    const handleBookNow = (service, quantity = 1) => {
        // Ensure the user is logged in before proceeding
        if (!auth.user) {
            // Redirect to login page if not authenticated
            router.visit(route("login"), {
                method: "get",
                data: {
                    redirect: route("checkout.index"),
                },
            });
            return;
        }

        // Add the service to cart first
        addToCart(
            {
                id: service.id,
                title: service.title,
                price: service.price,
                image: service.images?.length
                    ? `/storage/${service.images[0]}`
                    : null,
                category: service.category?.name || "Uncategorized",
                quantity: quantity,
            },
            quantity
        );

        // Navigate to checkout
        router.visit(route("checkout.index"), {
            method: "get",
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                console.log("Navigating to checkout");
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Rapid Handy Works - Professional Services" />

            {/* Hero Section with Enhanced Responsiveness */}
            <div className="relative py-16 mx-auto text-white max-w-7xl bg-gradient-to-r from-amber-600 to-orange-600 md:py-24">
                <div className="px-4 mx-auto text-center max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white md:text-5xl lg:text-6xl">
                        Expert Services at Your Fingertips
                    </h1>
                    <p className="max-w-xl mx-auto mb-8 text-base text-amber-100 md:text-lg">
                        Quality services from trusted professionals. Book,
                        track, and manage your home and personal services
                        seamlessly.
                    </p>

                    {/* Responsive Search and Filter */}
                    <div className="flex flex-col max-w-xl mx-auto space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                            <MagnifyingGlassIcon className="absolute w-5 h-5 text-gray-400 right-3 top-3" />
                        </div>
                        <select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            className="w-full px-4 py-3 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg appearance-none md:w-auto focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="" className="flex items-center">
                                All Categories
                            </option>
                            {categories.map((category) => (
                                <option
                                    key={category.id}
                                    value={category.id}
                                    className="flex items-center"
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Services Grid with Professional Design */}
            <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <h2 className="mb-8 text-2xl font-bold text-center text-gray-900 md:text-3xl">
                    Featured Services
                </h2>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onQuickView={openQuickBookModal}
                            onAddToCart={() => handleAddToCart(service)}
                            formatPrice={formatPrice}
                        />
                    ))}
                </div>
            </div>

            {/* Quick Book Modal */}
            {isQuickBookModalOpen && (
                <QuickBookModal
                    service={selectedService}
                    onClose={() => setIsQuickBookModalOpen(false)}
                    onAddToCart={handleAddToCart}
                    onBookNow={handleBookNow}
                    formatPrice={formatPrice}
                />
            )}

            {/* Why Choose Us Section */}
            <div className="py-16 bg-gray-50 md:py-24">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <h2 className="text-base font-semibold tracking-wide uppercase text-amber-600">
                            Why Choose Rapid Handy Works
                        </h2>
                        <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                            Convenient. Reliable. Professional.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
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
                                className="p-6 transition duration-300 transform bg-white shadow-lg rounded-xl hover:-translate-y-2 hover:shadow-xl"
                            >
                                <div
                                    className={`flex items-center justify-center h-16 w-16 rounded-full mb-4 ${feature.color}`}
                                >
                                    <feature.icon className="w-8 h-8" />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-gray-900">
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
            <div className="bg-gradient-to-r from-amber-600 to-orange-600">
                <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
                    <div className="lg:w-2/3">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            <span className="block">
                                Ready to Transform Your Service Experience?
                            </span>
                            <span className="block mt-2 text-amber-200">
                                Find the Perfect Solution Today
                            </span>
                        </h2>
                        <p className="mt-4 text-lg text-amber-100">
                            Discover a wide range of professional services
                            tailored to your needs. Save time, get quality work,
                            and enjoy peace of mind.
                        </p>
                    </div>
                    <div className="flex mt-8 space-x-4 lg:mt-0 lg:flex-shrink-0">
                        <Link
                            href={route("services.index")}
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium transition-colors bg-white border border-transparent rounded-md text-amber-600 hover:bg-amber-50"
                        >
                            Browse Services
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white transition-colors border border-transparent rounded-md bg-amber-700 hover:bg-amber-800"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </div>

            <Toaster />
        </GuestLayout>
    );
}
