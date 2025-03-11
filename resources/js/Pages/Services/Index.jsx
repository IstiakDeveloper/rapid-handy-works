import React, { useState, useEffect } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useCart } from "@/Contexts/CartContext";
import toast, { Toaster } from "react-hot-toast";
import GuestLayout from "@/Layouts/GuestLayout";
import ServiceCard from "@/Components/ServiceCard";
import QuickBookModal from "@/Components/QuickBookModal";
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    ChevronDownIcon,
    MapPinIcon,
} from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

export default function ServicesIndex({ services, cities, categories, filters }) {
    const { addToCart } = useCart();
    const { auth } = usePage().props;
    const [searchQuery, setSearchQuery] = useState(filters.search || "");
    const [selectedCity, setSelectedCity] = useState(filters.city || "");
    const [sortOption, setSortOption] = useState(filters.sort || "");
    const [selectedService, setSelectedService] = useState(null);
    const [isQuickBookModalOpen, setIsQuickBookModalOpen] = useState(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    const formatPrice = (price) => Number(price || 0).toFixed(2);

    // Auto-filter function
    const applyFilters = () => {
        router.get(
            "/services",
            {
                search: searchQuery,
                city: selectedCity,
                sort: sortOption,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    // Debounce function to prevent too many requests while typing
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    };

    const debouncedApplyFilters = debounce(applyFilters, 300);

    // Effect to apply filters when any filter value changes
    useEffect(() => {
        if (
            filters.search !== searchQuery ||
            filters.city !== selectedCity ||
            filters.sort !== sortOption
        ) {
            debouncedApplyFilters();
        }
    }, [searchQuery, selectedCity, sortOption]);

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
                city: service.city,
                duration_hours: service.duration_hours,
                provider_info: {
                    id: service.provider?.id,
                    name: service.provider?.name,
                    calling_charge: service.provider?.calling_charge || service.provider_details?.calling_charge || 0,
                    commission_percentage: service.provider?.commission_percentage || service.provider_details?.commission_percentage || 10
                },
                provider_calling_charge: service.provider?.calling_charge || service.provider_details?.calling_charge || 0,
                provider_commission_percentage: service.provider?.commission_percentage || service.provider_details?.commission_percentage || 10
            },
            quantity
        );

        toast.success(`${service.title} added to cart`, {
            duration: 3000,
            position: "top-right",
            style: {
                background: "#10b981",
                color: "white",
                padding: "12px",
                borderRadius: "8px",
            },
            icon: "🛒",
        });
    };

    const openQuickBookModal = (service) => {
        setSelectedService(service);
        setIsQuickBookModalOpen(true);
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
                city: service.city,
                duration_hours: service.duration_hours,
                quantity: quantity,
                provider_info: {
                    id: service.provider?.id,
                    name: service.provider?.name,
                    calling_charge: service.provider?.calling_charge || service.provider_details?.calling_charge || 0,
                    commission_percentage: service.provider?.commission_percentage || service.provider_details?.commission_percentage || 10
                },
                provider_calling_charge: service.provider?.calling_charge || service.provider_details?.calling_charge || 0,
                provider_commission_percentage: service.provider?.commission_percentage || service.provider_details?.commission_percentage || 10
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
            <Head title="Our Services" />
            <Toaster />

            {/* Services Section with enhanced design */}
            <div className="py-12 bg-gradient-to-b from-white to-amber-50">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Compact Header */}
                    <div className="flex flex-col mb-6 md:flex-row md:items-center md:justify-between">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-2xl font-bold text-gray-900 md:text-3xl"
                        >
                            Explore Our Services
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-2 text-gray-600 md:mt-0 md:text-right"
                        >
                            Find the perfect service for your needs
                        </motion.p>
                    </div>

                    {/* Enhanced Filters Section */}
                    <div className="mb-10">
                        <div className="p-6 bg-white shadow-sm rounded-xl">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                {/* City Filter - Replacing Category Filter */}
                                <div>
                                    <label
                                        htmlFor="city"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        City
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <MapPinIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <select
                                            id="city"
                                            value={selectedCity}
                                            onChange={(e) =>
                                                setSelectedCity(e.target.value)
                                            }
                                            className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                        >
                                            <option value="">All Cities</option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Search Input */}
                                <div className="relative">
                                    <label
                                        htmlFor="search"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Search
                                    </label>
                                    <div className="relative rounded-md shadow-sm">
                                        <input
                                            id="search"
                                            type="text"
                                            placeholder="Search services..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Sort Options */}
                                <div>
                                    <label
                                        htmlFor="sort"
                                        className="block mb-2 text-sm font-medium text-gray-700"
                                    >
                                        Sort By
                                    </label>
                                    <select
                                        id="sort"
                                        value={sortOption}
                                        onChange={(e) =>
                                            setSortOption(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500"
                                    >
                                        <option value="">Sort By</option>
                                        <option value="price_asc">
                                            Price: Low to High
                                        </option>
                                        <option value="price_desc">
                                            Price: High to Low
                                        </option>
                                        <option value="rating">
                                            Highest Rated
                                        </option>
                                        <option value="newest">Newest</option>
                                    </select>
                                </div>
                            </div>

                            {/* Clear Filters Button - Only shown when filters are active */}
                            {(searchQuery ||
                                selectedCity ||
                                sortOption) && (
                                <div className="flex justify-end mt-6">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setSelectedCity("");
                                            setSortOption("");
                                            router.get(
                                                "/services",
                                                {},
                                                {
                                                    preserveState: true,
                                                    replace: true,
                                                }
                                            );
                                        }}
                                        className="px-6 py-3 text-sm font-medium text-gray-700 transition duration-150 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Filter Pills and Results Summary */}
                    <div className="flex flex-wrap items-center justify-between mb-6">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-xl font-bold text-gray-900">
                                {searchQuery
                                    ? `Results for "${searchQuery}"`
                                    : selectedCity
                                    ? `Services in ${selectedCity}`
                                    : "All Services"}
                            </h2>
                            <p className="mt-1 text-sm text-gray-600">
                                {services.total} services available
                            </p>
                        </div>

                        {/* Active Filter Pills */}
                        <div className="flex flex-wrap gap-2">
                            {searchQuery && (
                                <div className="flex items-center px-3 py-1 text-sm rounded-full bg-amber-100">
                                    <span className="mr-1 font-medium text-amber-800">
                                        Search:
                                    </span>
                                    <span className="text-amber-700">
                                        {searchQuery}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            applyFilters();
                                        }}
                                        className="ml-2 text-amber-700 hover:text-amber-900"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}

                            {selectedCity && (
                                <div className="flex items-center px-3 py-1 text-sm rounded-full bg-amber-100">
                                    <span className="mr-1 font-medium text-amber-800">
                                        City:
                                    </span>
                                    <span className="text-amber-700">
                                        {selectedCity}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSelectedCity("");
                                            applyFilters();
                                        }}
                                        className="ml-2 text-amber-700 hover:text-amber-900"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}

                            {sortOption && (
                                <div className="flex items-center px-3 py-1 text-sm rounded-full bg-amber-100">
                                    <span className="mr-1 font-medium text-amber-800">
                                        Sort:
                                    </span>
                                    <span className="text-amber-700">
                                        {sortOption === "price_asc" &&
                                            "Price: Low to High"}
                                        {sortOption === "price_desc" &&
                                            "Price: High to Low"}
                                        {sortOption === "rating" &&
                                            "Highest Rated"}
                                        {sortOption === "newest" && "Newest"}
                                    </span>
                                    <button
                                        onClick={() => {
                                            setSortOption("");
                                            applyFilters();
                                        }}
                                        className="ml-2 text-amber-700 hover:text-amber-900"
                                    >
                                        &times;
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Services Grid */}
                    {services.data.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-10 text-center bg-white rounded-lg shadow-md"
                        >
                            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-amber-100">
                                <MagnifyingGlassIcon className="w-8 h-8 text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                No services found
                            </h3>
                            <p className="mt-3 text-gray-600">
                                We couldn't find any services matching your
                                criteria
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCity("");
                                    setSortOption("");
                                    router.get(
                                        "/services",
                                        {},
                                        {
                                            preserveState: true,
                                            replace: true,
                                        }
                                    );
                                }}
                                className="px-6 py-3 mt-6 text-sm font-medium text-white transition-colors rounded-md bg-amber-500 hover:bg-amber-600"
                            >
                                Clear All Filters
                            </button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {services.data.map((service, index) => (
                                <motion.div
                                    key={service.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            duration: 0.4,
                                            delay: index * 0.1,
                                        },
                                    }}
                                >
                                    <ServiceCard
                                        service={service}
                                        onQuickView={openQuickBookModal}
                                        onAddToCart={() =>
                                            handleAddToCart(service)
                                        }
                                        formatPrice={formatPrice}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {/* Enhanced Pagination */}
                    {services.links && services.links.length > 3 && (
                        <div className="flex justify-center mt-12">
                            <nav
                                className="inline-flex items-center justify-center rounded-md shadow-sm"
                                aria-label="Pagination"
                            >
                                {services.links.map((link, index) => {
                                    // Skip rendering "previous" and "next" text labels
                                    if (
                                        (index === 0 ||
                                            index ===
                                                services.links.length - 1) &&
                                        !link.url
                                    ) {
                                        return null;
                                    }

                                    // Render Previous arrow
                                    if (index === 0) {
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                className={`${
                                                    !link.url
                                                        ? "pointer-events-none text-gray-300 cursor-not-allowed"
                                                        : "text-gray-500 hover:bg-gray-50"
                                                } relative inline-flex items-center px-2 py-2 text-sm font-medium bg-white border border-gray-300 rounded-l-md`}
                                            >
                                                <span className="sr-only">
                                                    Previous
                                                </span>
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </Link>
                                        );
                                    }

                                    // Render Next arrow
                                    if (index === services.links.length - 1) {
                                        return (
                                            <Link
                                                key={index}
                                                href={link.url || "#"}
                                                className={`${
                                                    !link.url
                                                        ? "pointer-events-none text-gray-300 cursor-not-allowed"
                                                        : "text-gray-500 hover:bg-gray-50"
                                                } relative inline-flex items-center px-2 py-2 text-sm font-medium bg-white border border-gray-300 rounded-r-md`}
                                            >
                                                <span className="sr-only">
                                                    Next
                                                </span>
                                                <svg
                                                    className="w-5 h-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    aria-hidden="true"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </Link>
                                        );
                                    }

                                    // Render page numbers
                                    return (
                                        <Link
                                            key={index}
                                            href={link.url || "#"}
                                            aria-current={
                                                link.active ? "page" : undefined
                                            }
                                            className={`
                                                relative inline-flex items-center px-4 py-2 text-sm font-medium border
                                                ${
                                                    link.active
                                                        ? "z-10 bg-amber-500 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 border-amber-500"
                                                        : "text-gray-900 bg-white hover:bg-gray-50 border-gray-300"
                                                }
                                                ${
                                                    !link.url
                                                        ? "pointer-events-none"
                                                        : ""
                                                }
                                            `}
                                            disabled={!link.url}
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Book Modal */}
            <AnimatePresence>
                {isQuickBookModalOpen && (
                    <QuickBookModal
                        service={selectedService}
                        onClose={() => setIsQuickBookModalOpen(false)}
                        onAddToCart={handleAddToCart}
                        onBookNow={handleBookNow}
                        formatPrice={formatPrice}
                    />
                )}
            </AnimatePresence>
        </GuestLayout>
    );
}
