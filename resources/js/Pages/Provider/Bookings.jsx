import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    MapPin,
    Phone,
    Mail,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    MoreHorizontal,
    Search,
    ArrowUpRight
} from 'lucide-react';

export default function ProviderBookings({ auth, bookings }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-indigo-100 text-indigo-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    const statusIcons = {
        pending: AlertCircle,
        confirmed: CheckCircle,
        in_progress: Clock,
        completed: CheckCircle,
        cancelled: XCircle
    };

    const handleStatusUpdate = (id, newStatus) => {
        router.put(`/provider/bookings/${id}`, {
            status: newStatus
        });
    };

    const filteredBookings = bookings?.filter(booking => {
        const matchesSearch = booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || booking.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <Authenticated user={auth.user}>
            <Head title="My Bookings" />

            <div className="container mx-auto py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                {/* Bookings Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Today\'s Bookings', value: filteredBookings?.filter(b => b.booking_date === new Date().toISOString().split('T')[0]).length },
                        { label: 'Pending', value: filteredBookings?.filter(b => b.status === 'pending').length },
                        { label: 'In Progress', value: filteredBookings?.filter(b => b.status === 'in_progress').length },
                        { label: 'Completed', value: filteredBookings?.filter(b => b.status === 'completed').length }
                    ].map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
                            <p className="text-2xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Bookings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBookings?.map((booking) => {
                        const StatusIcon = statusIcons[booking.status];
                        return (
                            <div key={booking.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {booking.service.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Booking #{booking.id}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full flex items-center ${statusColors[booking.status]}`}>
                                            <StatusIcon className="w-4 h-4 mr-1" />
                                            <span className="text-sm capitalize">{booking.status}</span>
                                        </div>
                                    </div>

                                    {/* Client Info */}
                                    <div className="space-y-3 mb-4">
                                        <div className="flex items-center text-gray-600">
                                            <User className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{booking.client.name}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Mail className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{booking.client.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Phone className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{booking.phone}</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            <span className="text-sm">{booking.address}</span>
                                        </div>
                                    </div>

                                    {/* Booking Details */}
                                    <div className="border-t pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center text-gray-600">
                                                <Calendar className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{booking.booking_date}</span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span className="text-sm">{booking.booking_time}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-gray-900">Amount</span>
                                            <span className="text-lg font-bold text-indigo-600">
                                                ${parseFloat(booking.total_amount).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
                                                    className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Confirm
                                                </button>
                                            )}
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'in_progress')}
                                                    className="flex items-center px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200"
                                                >
                                                    <ArrowUpRight className="w-4 h-4 mr-2" />
                                                    Start Service
                                                </button>
                                            )}
                                            {booking.status === 'in_progress' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'completed')}
                                                    className="flex items-center px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200"
                                                >
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Complete
                                                </button>
                                            )}
                                            {booking.status !== 'cancelled' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(booking.id, 'cancelled')}
                                                    className="flex items-center px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                                                >
                                                    <XCircle className="w-4 h-4 mr-2" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredBookings?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No bookings found matching your criteria.</p>
                    </div>
                )}
            </div>
        </Authenticated>
    );
}
