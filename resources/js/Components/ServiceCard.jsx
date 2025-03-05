import React from 'react';
import {
    StarIcon,
    ClockIcon,
    EyeIcon,
    ShoppingCartIcon,
    PhoneIcon // Import phone icon for calling charge
} from "@heroicons/react/24/solid";

const ServiceCard = ({
    service,
    onQuickView,
    onAddToCart,
    formatPrice
}) => {
    // Check if provider data and calling charge exist
    const hasProviderInfo = service.provider || service.provider_details;
    const callingCharge = service.provider?.calling_charge ||
                         service.provider_details?.calling_charge ||
                         0;

    return (
        <div className="relative overflow-hidden transition-all duration-300 transform bg-white shadow-lg group rounded-2xl hover:shadow-2xl hover:ring-2 hover:ring-amber-500/20 hover:-translate-y-2">
            {/* Image Container with Overlay */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 z-10 transition-opacity duration-300 opacity-0 bg-gradient-to-b from-transparent to-black/40 group-hover:opacity-100"></div>

                <img
                    src={
                        service.images?.length
                            ? `/storage/${service.images[0]}`
                            : "https://via.placeholder.com/400x300"
                    }
                    alt={service.title}
                    className="object-cover w-full h-56 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => onQuickView(service)}
                            className="flex items-center justify-center p-3 transition-all duration-300 rounded-full shadow-md bg-white/80 hover:bg-white hover:scale-110"
                            title="Quick View"
                        >
                            <EyeIcon className="w-6 h-6 text-gray-700 hover:text-amber-600" />
                        </button>
                        <button
                            onClick={() => onAddToCart(service)}
                            className="flex items-center justify-center p-3 transition-all duration-300 rounded-full shadow-md bg-white/80 hover:bg-white hover:scale-110"
                            title="Add to Cart"
                        >
                            <ShoppingCartIcon className="w-6 h-6 text-gray-700 hover:text-green-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Service Details */}
            <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-amber-600">
                            {service.title}
                        </h3>
                    </div>
                    <span className="ml-4 text-lg font-bold text-amber-600">
                    £{formatPrice(service.price)}
                    </span>
                </div>

                {/* Description */}
                <p className="mb-3 text-sm text-gray-600 line-clamp-2">
                    {service.description}
                </p>

                {/* Service Metadata */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    {/* Duration */}
                    <div className="flex items-center space-x-2">
                        <ClockIcon className="w-5 h-5 text-amber-500" />
                        <span>{service.duration} mins</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
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
                        <span className="ml-2 text-gray-600">
                            {service.rating
                                ? Number(service.rating).toFixed(1)
                                : "N/A"}
                        </span>
                    </div>
                </div>

                {/* Calling Charge - Only shown if it exists */}
                {callingCharge > 0 && (
                    <div className="flex items-center mt-2 text-sm">
                        <PhoneIcon className="w-4 h-4 mr-1 text-blue-500" />
                        <span className="text-blue-600 font-medium">
                            Calling Charge: £{formatPrice(callingCharge)}
                        </span>
                    </div>
                )}

                {/* Provider Name - If available */}
                {hasProviderInfo && (
                    <div className="text-sm text-gray-500 mt-1">
                        Provider: {service.provider?.name || 'Service Provider'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceCard;
