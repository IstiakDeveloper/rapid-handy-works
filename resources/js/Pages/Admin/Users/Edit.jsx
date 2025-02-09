import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    KeyIcon,
    CameraIcon,
} from '@heroicons/react/24/outline';

export default function Edit({ user }) {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isPasswordChange, setIsPasswordChange] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        avatar: null,
        is_active: user.is_active,
        _method: 'PUT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.update', user.id), {
            preserveScroll: true,
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Edit User" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Edit User</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Avatar Upload */}
                                <div className="flex items-center space-x-6">
                                    <div className="relative">
                                        <img
                                            src={previewUrl ||
                                                (user.avatar ? `/storage/${user.avatar}` :
                                                `https://ui-avatars.com/api/?name=${user.name}&background=random`)}
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full object-cover"
                                        />
                                        <label
                                            htmlFor="avatar"
                                            className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700"
                                        >
                                            <CameraIcon className="h-4 w-4" />
                                            <input
                                                type="file"
                                                id="avatar"
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium">Profile Picture</h3>
                                        <p className="text-sm text-gray-500">
                                            JPG, GIF or PNG. Max size of 2MB
                                        </p>
                                    </div>
                                </div>

                                {/* Basic Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Full Name
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <UserIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email Address
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Role
                                        </label>
                                        <select
                                            value={data.role}
                                            onChange={e => setData('role', e.target.value)}
                                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="client">Client</option>
                                            <option value="provider">Provider</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                        {errors.role && (
                                            <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <PhoneIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                        )}
                                    </div>

                                    {/* Address */}
                                    <div className="col-span-1 md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <MapPinIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={data.address}
                                                onChange={e => setData('address', e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    <div className="col-span-1 md:col-span-2"><label className="block text-sm font-medium text-gray-700">
                                            Bio
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                value={data.bio}
                                                onChange={e => setData('bio', e.target.value)}
                                                rows={4}
                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                        {errors.bio && (
                                            <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                                        )}
                                    </div>

                                    {/* Password Change Section */}
                                    <div className="col-span-1 md:col-span-2">
                                        <div className="border-t pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setIsPasswordChange(!isPasswordChange)}
                                                className="text-indigo-600 hover:text-indigo-900"
                                            >
                                                {isPasswordChange ? 'Cancel Password Change' : 'Change Password'}
                                            </button>

                                            {isPasswordChange && (
                                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            New Password
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="password"
                                                                value={data.password}
                                                                onChange={e => setData('password', e.target.value)}
                                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            />
                                                        </div>
                                                        {errors.password && (
                                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700">
                                                            Confirm New Password
                                                        </label>
                                                        <div className="mt-1">
                                                            <input
                                                                type="password"
                                                                value={data.password_confirmation}
                                                                onChange={e => setData('password_confirmation', e.target.value)}
                                                                className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Active Status */}
                                    <div className="col-span-1 md:col-span-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={data.is_active}
                                                onChange={e => setData('is_active', e.target.checked)}
                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900">
                                                Active Account
                                            </label>
                                        </div>
                                        {errors.is_active && (
                                            <p className="mt-1 text-sm text-red-600">{errors.is_active}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex justify-end space-x-3 border-t pt-6">
                                    <a
                                        href={route('admin.users.index')}
                                        className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Cancel
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
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
