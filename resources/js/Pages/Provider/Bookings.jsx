import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import {
    Calendar, Clock, MapPin, Phone, Mail, User,
    CheckCircle, XCircle, AlertCircle, Search,
    ArrowUpRight, Filter
} from 'lucide-react';

// Custom Modal Component
const Modal = ({ children, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Update Status</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default function ProviderBookings({ auth, bookings }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const handleStatusUpdate = async (id, newStatus) => {
        setLoading(true);
        try {
            await router.put(`/provider/bookings/${id}`, {
                status: newStatus
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error updating status:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDateFilteredBookings = (bookings) => {
        const today = new Date().toISOString().split('T')[0];
        switch (dateFilter) {
            case 'today':
                return bookings.filter(b => b.booking_date === today);
            case 'upcoming':
                return bookings.filter(b => b.booking_date > today);
            case 'past':
                return bookings.filter(b => b.booking_date < today);
            default:
                return bookings;
        }
    };

    const filteredBookings = getDateFilteredBookings(bookings || []).filter(booking => {
        const matchesSearch = booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || booking.status === filter;
        return matchesSearch && matchesFilter;
    });

    // Stats calculation
    const stats = {
        today: bookings?.filter(b => b.booking_date === new Date().toISOString().split('T')[0]).length || 0,
        pending: bookings?.filter(b => b.status === 'pending').length || 0,
        inProgress: bookings?.filter(b => b.status === 'in_progress').length || 0,
        completed: bookings?.filter(b => b.status === 'completed').length || 0,
        totalEarnings: bookings?.reduce((sum, b) => sum + parseFloat(b.total_amount), 0) || 0
    };

    const BookingCard = ({ booking }) => {
        const StatusIcon = statusIcons[booking.status];

        return (
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {booking.service.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Booking #{booking.id}
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedBooking(booking);
                                setIsModalOpen(true);
                            }}
                            className={`px-3 py-1 rounded-full flex items-center ${statusColors[booking.status]}`}
                        >
                            <StatusIcon className="w-4 h-4 mr-1" />
                            <span className="text-sm capitalize">{booking.status}</span>
                        </button>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="flex items-center text-gray-600">
                            <User className="w-4 h-4 mr-2" />
                            <span className="text-sm">{booking.client.name}</span>
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
                </div>
            </div>
        );
    };

    return (
        <Authenticated user={auth.user}>
            <Head title="Provider Bookings" />

            <div className="container mx-auto py-6">
                <div className="flex flex-col space-y-6">
                    {/* Header and Filters */}
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
                            <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
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
                                    className="border border-gray-300 rounded-lg px-4 py-2"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                >
                                    <option value="all">All Dates</option>
                                    <option value="today">Today</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="past">Past</option>
                                </select>
                                <select
                                    className="border border-gray-300 rounded-lg px-4 py-2"
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
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[
                            { label: "Today's Bookings", value: stats.today, icon: Calendar },
                            { label: 'Pending', value: stats.pending, icon: AlertCircle },
                            { label: 'In Progress', value: stats.inProgress, icon: Clock },
                            { label: 'Completed', value: stats.completed, icon: CheckCircle },
                            { label: 'Total Earnings', value: `$${stats.totalEarnings.toFixed(2)}`, icon: ArrowUpRight },
                        ].map((stat, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                    <stat.icon className="w-8 h-8 text-gray-400" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bookings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>

                    {filteredBookings.length === 0 && (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <Filter className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                            <p className="mt-1 text-sm text-gray-500">No bookings match your current filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Modal for Status Update */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {selectedBooking && (
                    <div className="space-y-4">
                        {selectedBooking.status !== 'completed' && selectedBooking.status !== 'cancelled' && (
                            <div className="flex flex-col space-y-2">
                                {selectedBooking.status === 'pending' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                                        disabled={loading}
                                        className="flex items-center justify-center px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Confirm Booking
                                    </button>
                                )}
                                {selectedBooking.status === 'confirmed' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'in_progress')}
                                        disabled={loading}
                                        className="flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                                    >
                                        <ArrowUpRight className="w-4 h-4 mr-2" />
                                        Start Service
                                    </button>
                                )}
                                {selectedBooking.status === 'in_progress' && (
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                                        disabled={loading}
                                        className="flex items-center justify-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 disabled:opacity-50"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Complete Service
                                    </button>
                                )}
                                <button
                                    onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                                    disabled={loading}
                                    className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50"
                                >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Cancel Booking
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </Authenticated>
    );
}
