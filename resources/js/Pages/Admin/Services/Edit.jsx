import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    TagIcon,
    DocumentTextIcon,
    CurrencyPoundIcon,
    ClockIcon,
    CameraIcon,
} from "@heroicons/react/24/outline";

export default function Edit({ service, categories }) {
    const [previewImages, setPreviewImages] = useState(
        service.images ? service.images.map((img) => `/storage/${img}`) : []
    );

    const { data, setData, put, processing, errors } = useForm({
        title: service.title || "",
        description: service.description || "",
        category_id: service.category_id || "",
        price: service.price || "",
        duration: service.duration || "",
        images: [],
        is_active: service.is_active ?? true,
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

        // Add method spoofing for PUT request
        formData.append("_method", "PUT");

        put(route("admin.services.update", service.id), {
            data: formData,
            forceFormData: true,
            preserveScroll: true,
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
            <Head title="Edit Service" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Edit Service
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Similar form fields as Create component,
                                    but pre-filled with existing service data */}
                                {/* Title Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Service Title
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <TagIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                                            <DocumentTextIcon className="h-5 w-5 text-gray-400" />
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
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            placeholder="Enter service description"
                                        />
                                    </div>
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
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
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Price
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CurrencyPoundIcon className="h-5 w-5 text-gray-400" />
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
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                                            Duration (minutes)
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <ClockIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                value={data.duration}
                                                onChange={(e) =>
                                                    setData(
                                                        "duration",
                                                        e.target.value
                                                    )
                                                }
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                placeholder="Service duration"
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
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            <div className="flex text-sm text-gray-600">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
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
                                        <div className="mt-4 grid grid-cols-5 gap-4">
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
                                                            className="h-20 w-20 object-cover rounded-md"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeImage(
                                                                    index
                                                                )
                                                            }
                                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
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
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label className="ml-2 block text-sm text-gray-900">
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
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing
                                            ? "Updating..."
                                            : "Update Service"}
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
