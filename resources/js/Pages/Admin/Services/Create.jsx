import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    TagIcon,
    DocumentTextIcon,
    CurrencyPoundIcon,
    ClockIcon,
    CameraIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

// City Search Select Component
const CitySearchSelect = ({ cities, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Filter cities based on search term
    const filteredCities = searchTerm
        ? cities.filter((city) =>
              city.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : cities;

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Handle city selection
    const selectCity = (city) => {
        onChange(city);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <MapPinIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    <div>{value || "Select a city"}</div>
                    <ChevronUpDownIcon className="w-5 h-5 text-gray-400" />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    <div className="sticky top-0 z-10 px-2 py-2 bg-white">
                        <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full py-1 pl-8 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Search cities..."
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>

                    {filteredCities.length > 0 ? (
                        <ul className="overflow-y-auto max-h-40">
                            {filteredCities.map((city) => (
                                <li
                                    key={city}
                                    onClick={() => selectCity(city)}
                                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                                        value === city
                                            ? "bg-indigo-100 text-indigo-900"
                                            : "text-gray-900"
                                    }`}
                                >
                                    {city}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="px-3 py-2 text-center text-gray-500">
                            No cities found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function Create({ auth, categories, providers = [], cities }) {
    const [previewImages, setPreviewImages] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        description: "",
        category_id: "",
        price: "",
        duration: "",
        city: "",
        images: [],
        is_active: true,
        provider_id: auth.user.role === "provider" ? auth.user.id : "", // Default for providers
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append all form data
        Object.keys(data).forEach((key) => {
            if (key !== "images") {
                formData.append(key, data[key]);
            }
        });

        // Append images
        if (data.images) {
            data.images.forEach((file, index) => {
                formData.append(`images[${index}]`, file);
            });
        }

        post(route("admin.services.store"), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setPreviewImages([]);
            },
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setData("images", files);

        // Create preview URLs
        const previews = files.map((file) => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const removeImage = (indexToRemove) => {
        const newFiles = data.images.filter(
            (_, index) => index !== indexToRemove
        );
        const newPreviews = previewImages.filter(
            (_, index) => index !== indexToRemove
        );

        setData("images", newFiles);
        setPreviewImages(newPreviews);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Create Service" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Create New Service
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {auth.user.role === "admin" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Select Service Provider
                                        </label>
                                        <select
                                            value={data.provider_id}
                                            onChange={(e) =>
                                                setData(
                                                    "provider_id",
                                                    e.target.value
                                                )
                                            }
                                            className="block w-full py-2 pl-3 pr-10 mt-1 border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">
                                                Select a provider
                                            </option>
                                            {providers.map((provider) => (
                                                <option
                                                    key={provider.id}
                                                    value={provider.id}
                                                >
                                                    {provider.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.provider_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.provider_id}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* For providers, auto-select their own ID */}
                                {auth.user.role === "provider" && (
                                    <input
                                        type="hidden"
                                        value={auth.user.id}
                                        onChange={(e) =>
                                            setData(
                                                "provider_id",
                                                e.target.value
                                            )
                                        }
                                    />
                                )}
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Service Title
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <TagIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter service title"
                                        />
                                    </div>
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Description
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 flex items-start pt-3 pl-3 pointer-events-none">
                                            <DocumentTextIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            rows={4}
                                            className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter service description"
                                        />
                                    </div>
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Service City
                                    </label>
                                    <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <MapPinIcon className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <select
                                            value={data.city}
                                            onChange={(e) =>
                                                setData("city", e.target.value)
                                            }
                                            className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">
                                                Select a city
                                            </option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.city}
                                        </p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Service Category
                                    </label>
                                    <select
                                        value={data.category_id}
                                        onChange={(e) =>
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {categories.map((category) => (
                                            <option
                                                key={category.id}
                                                value={category.id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Price */}
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Price
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <CurrencyPoundIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={data.price}
                                                onChange={(e) =>
                                                    setData(
                                                        "price",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.price}
                                            </p>
                                        )}
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Duration (hours)
                                        </label>
                                        <div className="relative mt-1 rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <ClockIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0.5"
                                                value={data.duration}
                                                onChange={(e) =>
                                                    setData(
                                                        "duration",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Service duration in hours"
                                            />
                                        </div>
                                        {errors.duration && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.duration}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Service Images (Max 5)
                                    </label>
                                    <div className="flex justify-center px-6 pt-5 pb-6 mt-1 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative font-medium text-indigo-600 bg-white rounded-md cursor-pointer hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                >
                                                    <span>Upload files</span>
                                                    <input
                                                        id="file-upload"
                                                        name="file-upload"
                                                        type="file"
                                                        className="sr-only"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={
                                                            handleImageChange
                                                        }
                                                    />
                                                </label>
                                                <p className="pl-1">
                                                    or drag and drop
                                                </p>
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 2MB
                                            </p>
                                        </div>
                                    </div>

                                    {/* Image Previews */}
                                    {previewImages.length > 0 && (
                                        <div className="grid grid-cols-5 gap-4 mt-4">
                                            {previewImages.map(
                                                (preview, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={preview}
                                                            alt={`Preview ${
                                                                index + 1
                                                            }`}
                                                            className="object-cover w-20 h-20 rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute top-0 right-0 p-1 text-xs text-white bg-red-500 rounded-full"
                                                        >
                                                            X
                                                        </button>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}
                                    {errors.images && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.images}
                                        </p>
                                    )}
                                </div>

                                {/* Active Status */}
                                <div>
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) =>
                                                setData(
                                                    "is_active",
                                                    e.target.checked
                                                )
                                            }
                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <label className="block ml-2 text-sm text-gray-900">
                                            Active Service
                                        </label>
                                    </div>
                                    {errors.is_active && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.is_active}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3">
                                    <Link
                                        href={route("admin.services.index")}
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Creating..."
                                            : "Create Service"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
