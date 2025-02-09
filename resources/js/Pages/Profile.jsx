// resources/js/Pages/Profile.jsx
import { useState, useRef } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    UserIcon,
    CameraIcon,
    PhoneIcon,
    MapPinIcon,
    MailIcon,
    KeyIcon,
    SaveIcon,
    AlertCircleIcon,
    Trash2Icon
} from 'lucide-react';

export default function Profile({ auth, status }) {
    const [isPasswordChange, setIsPasswordChange] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, delete: destroy } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        phone: auth.user.phone || '',
        address: auth.user.address || '',
        avatar: null,
        current_password: '',
        password: '',
        password_confirmation: '',
        bio: auth.user.bio || ''
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (data[key] !== null) {
                formData.append(key, data[key]);
            }
        });

        post(route('profile.update'), {
            data: formData,
            preserveScroll: true,
            preserveState: true,
            forceFormData: true,
            onSuccess: () => {
                reset('password', 'password_confirmation');
                setIsPasswordChange(false);
            },
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeAvatar = () => {
        destroy(route('profile.avatar.delete'), {
            preserveScroll: true,
            onSuccess: () => {
                setPreviewUrl(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="py-12 bg-gray-50">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Success Message */}
                    {status && (
                        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-md">
                            <div className="flex">
                                <AlertCircleIcon className="h-5 w-5 text-green-400" />
                                <p className="ml-3 text-sm text-green-700">{status}</p>
                            </div>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="bg-white shadow rounded-xl overflow-hidden">
                        <form onSubmit={handleProfileUpdate} encType="multipart/form-data">
                            {/* Profile Header with Avatar */}
                            <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
                                <div className="absolute -bottom-12 left-8">
                                    <div className="relative">
                                        <img
                                            src={previewUrl ||
                                                (auth.user.avatar
                                                    ? `/storage/${auth.user.avatar}`
                                                    : `https://ui-avatars.com/api/?name=${auth.user.name}&background=random`)
                                            }
                                            alt="Profile"
                                            className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                                        />
                                        <label
                                            htmlFor="avatar"
                                            className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white cursor-pointer hover:bg-indigo-700 transition-colors group"
                                        >
                                            <CameraIcon className="h-4 w-4" />
                                            <span className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                Change photo
                                            </span>
                                            <input
                                                type="file"
                                                id="avatar"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleAvatarChange}
                                                accept="image/*"
                                            />
                                        </label>
                                        {(auth.user.avatar || previewUrl) && (
                                            <button
                                                type="button"
                                                onClick={removeAvatar}
                                                className="absolute -right-8 bottom-0 p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Form Content */}
                            <div className="p-8 pt-16 space-y-8">
                                {/* Personal Information Section */}
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                                        <p className="mt-1 text-sm text-gray-600">Update your personal details</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Full Name
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <UserIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.name}
                                                    onChange={e => setData('name', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                            )}
                                        </div>

                                        {/* Email Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email Address
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MailIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="email"
                                                    value={data.email}
                                                    onChange={e => setData('email', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="your@email.com"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>

                                        {/* Phone Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phone Number
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="tel"
                                                    value={data.phone}
                                                    onChange={e => setData('phone', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="+880 1XXX-XXXXXX"
                                                />
                                            </div>
                                            {errors.phone && (
                                                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                                            )}
                                        </div>

                                        {/* Address Field */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Address
                                            </label>
                                            <div className="relative rounded-md shadow-sm">
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={data.address}
                                                    onChange={e => setData('address', e.target.value)}
                                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                    placeholder="Your full address"
                                                />
                                            </div>
                                            {errors.address && (
                                                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Bio Field */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bio
                                        </label>
                                        <div className="mt-1">
                                            <textarea
                                                rows={4}
                                                value={data.bio}
                                                onChange={e => setData('bio', e.target.value)}
                                                className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                placeholder="Write a short bio about yourself..."
                                            />
                                        </div>
                                        {errors.bio && (
                                            <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Section */}
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsPasswordChange(!isPasswordChange)}
                                            className="flex items-center text-indigo-600 hover:text-indigo-500 transition-colors"
                                        >
                                            <KeyIcon className="h-5 w-5 mr-2" />
                                            <span className="text-lg font-medium">
                                                {isPasswordChange ? 'Cancel Password Change' : 'Change Password'}
                                            </span>
                                        </button>
                                    </div>

                                    {isPasswordChange && (
                                        <div className="space-y-4">
                                            {/* Current Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Current Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={data.current_password}
                                                    onChange={e => setData('current_password', e.target.value)}
                                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                />
                                                {errors.current_password && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                                                )}
                                            </div>

                                            {/* New Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={data.password}
                                                    onChange={e => setData('password', e.target.value)}
                                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                />
                                                {errors.password && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                                )}
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Must be at least 8 characters long
                                                </p>
                                            </div>

                                            {/* Confirm New Password */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={e => setData('password_confirmation', e.target.value)}
                                                    className="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end pt-6 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center px-6 py-3 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
                                    >
                                        <SaveIcon className="h-5 w-5 mr-2" />
                                        {processing ? 'Saving Changes...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
