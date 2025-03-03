import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import {
    Calendar, Clock, MapPin, Phone, Mail, User,
    CheckCircle, XCircle, AlertCircle, Search,
    ArrowUpRight, Filter, DollarSign, CreditCard,
    ChevronDown, ChevronUp, FileText, BadgeCheck
} from 'lucide-react';

// Custom Modal Component
const Modal = ({ children, isOpen, onClose, title = "Update Status" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

// Booking Details Modal
const BookingDetailsModal = ({ booking, isOpen, onClose }) => {
    if (!isOpen || !booking) return null;

    const formatCurrency = (amount) => `৳${parseFloat(amount).toFixed(2)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Booking Details</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Service Details */}
                    <div className="p-4 rounded-lg bg-gray-50">
                        <h4 className="mb-2 font-medium text-gray-700 text-md">Service Information</h4>
                        <p className="text-lg font-semibold text-gray-900">{booking.service.title}</p>
                        <p className="text-sm text-gray-500">Reference: {booking.reference_number || `#${booking.id}`}</p>
                    </div>

                    {/* Client Information */}
                    <div>
                        <h4 className="mb-2 font-medium text-gray-700 text-md">Client Information</h4>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex items-start">
                                <User className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Client Name</p>
                                    <p className="text-sm text-gray-600">{booking.client.name}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Phone className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Phone</p>
                                    <p className="text-sm text-gray-600">{booking.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Mail className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Email</p>
                                    <p className="text-sm text-gray-600">{booking.client.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <MapPin className="w-5 h-5 mr-2 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Address</p>
                                    <p className="text-sm text-gray-600">{booking.address}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking & Payment Details */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div>
                            <h4 className="mb-2 font-medium text-gray-700 text-md">Booking Details</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Date:</span>
                                    <span className="text-sm font-medium">{booking.booking_date}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Time:</span>
                                    <span className="text-sm font-medium">{booking.booking_time}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Status:</span>
                                    <span className="text-sm font-medium capitalize">{booking.status.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Created:</span>
                                    <span className="text-sm font-medium">{new Date(booking.created_at).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="mb-2 font-medium text-gray-700 text-md">Payment Details</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Booking Fee:</span>
                                    <div className="flex items-center">
                                        <span className="mr-2 text-sm font-medium">{formatCurrency(booking.booking_fee)}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            booking.booking_fee_status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : booking.booking_fee_status === 'refunded'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {booking.booking_fee_status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Remaining:</span>
                                    <span className="text-sm font-medium">{formatCurrency(booking.remaining_amount)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Payment Method:</span>
                                    <span className="text-sm font-medium capitalize">{booking.payment_method.replace('_', ' ')}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">Payment Status:</span>
                                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                                        booking.payment_status === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : booking.payment_status === 'refunded'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {booking.payment_status}
                                    </span>
                                </div>

                                <div className="flex justify-between pt-2 mt-2 border-t">
                                    <span className="text-sm font-medium text-gray-900">Total:</span>
                                    <span className="text-lg font-bold text-indigo-600">
                                        {formatCurrency(booking.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {booking.notes && (
                        <div className="p-4 rounded-lg bg-gray-50">
                            <h4 className="mb-2 font-medium text-gray-700 text-md">Notes</h4>
                            <p className="text-sm text-gray-600">{booking.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Custom Modal Component for Status Update
const StatusUpdateModal = ({ booking, isOpen, onClose, onUpdateStatus, loading }) => {
    if (!isOpen || !booking) return null;

    const formatCurrency = (amount) => `৳${parseFloat(amount).toFixed(2)}`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 mx-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Update Booking Status</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <XCircle className="w-5 h-5" />
                    </button>
                </div>

                <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Service</h4>
                    <p className="text-base">{booking.service.title}</p>
                </div>

                <div className="mb-4">
                    <h4 className="mb-2 text-sm font-medium text-gray-700">Client</h4>
                    <p className="text-base">{booking.client.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <h4 className="mb-1 text-sm font-medium text-gray-700">Current Status</h4>
                        <p className="text-base capitalize">{booking.status.replace('_', ' ')}</p>
                    </div>
                    <div>
                        <h4 className="mb-1 text-sm font-medium text-gray-700">Payment Status</h4>
                        <p className="text-base capitalize">{booking.payment_status}</p>
                    </div>
                </div>

                {booking.booking_fee > 0 && (
                    <div className="p-3 mb-4 rounded-lg bg-gray-50">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-700">Booking Fee:</span>
                            <div className="flex items-center">
                                <span className="mr-2 text-sm font-medium">
                                    {formatCurrency(booking.booking_fee)}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    booking.booking_fee_status === 'paid'
                                        ? 'bg-green-100 text-green-800'
                                        : booking.booking_fee_status === 'refunded'
                                        ? 'bg-purple-100 text-purple-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {booking.booking_fee_status}
                                </span>
                            </div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                            {booking.status === 'pending' && 'Will be marked as paid on confirmation.'}
                            {booking.status !== 'pending' && booking.status !== 'cancelled' && booking.booking_fee_status === 'paid' && 'Will be refunded if booking is cancelled.'}
                        </div>
                    </div>
                )}

                <div className="pt-4 border-t">
                    <h4 className="mb-3 text-sm font-medium text-gray-700">Available Actions</h4>

                    <div className="flex flex-col space-y-2">
                        {booking.status === 'pending' && (
                            <button
                                onClick={() => onUpdateStatus(booking.id, 'confirmed')}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-2 text-green-800 bg-green-100 rounded-lg hover:bg-green-200 disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Confirm Booking
                                {booking.booking_fee > 0 && booking.booking_fee_status === 'pending' &&
                                    <span className="ml-1 text-xs">(Will mark booking fee as paid)</span>
                                }
                            </button>
                        )}

                        {booking.status === 'confirmed' && (
                            <button
                                onClick={() => onUpdateStatus(booking.id, 'in_progress')}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-2 text-blue-800 bg-blue-100 rounded-lg hover:bg-blue-200 disabled:opacity-50"
                            >
                                <ArrowUpRight className="w-4 h-4 mr-2" />
                                Start Service
                            </button>
                        )}

                        {booking.status === 'in_progress' && (
                            <button
                                onClick={() => onUpdateStatus(booking.id, 'completed')}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-2 text-indigo-800 bg-indigo-100 rounded-lg hover:bg-indigo-200 disabled:opacity-50"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Complete Service
                                <span className="ml-1 text-xs">(Will mark payment as paid)</span>
                            </button>
                        )}

                        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                            <button
                                onClick={() => onUpdateStatus(booking.id, 'cancelled')}
                                disabled={loading}
                                className="flex items-center justify-center px-4 py-2 text-red-800 bg-red-100 rounded-lg hover:bg-red-200 disabled:opacity-50"
                            >
                                <XCircle className="w-4 h-4 mr-2" />
                                Cancel Booking
                                {booking.booking_fee > 0 && booking.booking_fee_status === 'paid' &&
                                    <span className="ml-1 text-xs">(Will refund booking fee)</span>
                                }
                            </button>
                        )}
                    </div>
                </div>
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
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
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

    const paymentStatusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        paid: 'bg-green-100 text-green-800',
        refunded: 'bg-purple-100 text-purple-800'
    };

    const formatCurrency = (amount) => `৳${parseFloat(amount).toFixed(2)}`;

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
        // Calculate earnings based on completed bookings only
        totalEarnings: bookings
            ?.filter(b => b.status === 'completed')
            .reduce((sum, b) => sum + parseFloat(b.total_amount), 0) || 0,
        // Calculate pending booking fees
        pendingFees: bookings
            ?.filter(b => b.booking_fee_status === 'paid' && b.status !== 'completed')
            .reduce((sum, b) => sum + parseFloat(b.booking_fee), 0) || 0
    };

    const BookingCard = ({ booking }) => {
        const StatusIcon = statusIcons[booking.status];
        const [isExpanded, setIsExpanded] = useState(false);

        return (
            <div className="transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
                <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                {booking.service.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {booking.reference_number || `Booking #${booking.id}`}
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
                            <span className="text-sm capitalize">{booking.status.replace('_', ' ')}</span>
                        </button>
                    </div>

                    <div className="mb-4 space-y-3">
                        <div className="flex items-center text-gray-600">
                            <User className="flex-shrink-0 w-4 h-4 mr-2" />
                            <span className="text-sm">{booking.client.name}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Phone className="flex-shrink-0 w-4 h-4 mr-2" />
                            <span className="text-sm">{booking.phone}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <MapPin className="flex-shrink-0 w-4 h-4 mr-2" />
                            <span className="text-sm truncate">{booking.address}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center text-gray-600">
                                <Calendar className="flex-shrink-0 w-4 h-4 mr-2" />
                                <span className="text-sm">{booking.booking_date}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                                <Clock className="flex-shrink-0 w-4 h-4 mr-2" />
                                <span className="text-sm">{booking.booking_time}</span>
                            </div>
                        </div>

                        {/* Toggle button for expanded view */}
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="flex items-center justify-center w-full py-1 mb-3 text-sm text-gray-500 rounded hover:bg-gray-50"
                        >
                            {isExpanded ? (
                                <>
                                    <ChevronUp className="w-4 h-4 mr-1" />
                                    <span>Show Less</span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-4 h-4 mr-1" />
                                    <span>Payment Details</span>
                                </>
                            )}
                        </button>

                        {/* Expanded Content - Payment Details */}
                        {isExpanded && (
                            <div className="p-3 mb-3 space-y-2 rounded-lg bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Booking Fee:</span>
                                    <div className="flex items-center">
                                        <span className="mr-2 text-sm font-medium">
                                            {formatCurrency(booking.booking_fee)}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                            booking.booking_fee_status === 'paid'
                                                ? 'bg-green-100 text-green-800'
                                                : booking.booking_fee_status === 'refunded'
                                                ? 'bg-purple-100 text-purple-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {booking.booking_fee_status}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Remaining Balance:</span>
                                    <span className="text-sm font-medium">{formatCurrency(booking.remaining_amount)}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Payment Method:</span>
                                    <span className="text-sm font-medium capitalize">{booking.payment_method.replace('_', ' ')}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-600">Payment Status:</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${paymentStatusColors[booking.payment_status]}`}>
                                        {booking.payment_status}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm font-medium text-gray-900">Total Amount</span>
                            <span className="text-lg font-bold text-indigo-600">
                                {formatCurrency(booking.total_amount)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t">
                        <button
                            onClick={() => {
                                setSelectedBooking(booking);
                                setIsDetailsModalOpen(true);
                            }}
                            className="flex items-center px-3 py-2 text-indigo-700 rounded-lg bg-indigo-50 hover:bg-indigo-100"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                        </button>

                        {(booking.status === 'confirmed' || booking.status === 'in_progress') && (
                            <button
                                onClick={() => {
                                    setSelectedBooking(booking);
                                    setIsModalOpen(true);
                                }}
                                className={`flex items-center px-3 py-2 rounded-lg ${
                                    booking.status === 'confirmed' ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' : 'bg-green-50 text-green-700 hover:bg-green-100'
                                }`}
                            >
                                {booking.status === 'confirmed' ? (
                                    <>
                                        <ArrowUpRight className="w-4 h-4 mr-2" />
                                        Start Service
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Complete
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Authenticated user={auth.user}>
            <Head title="Provider Bookings" />

            <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
                <div className="flex flex-col space-y-6">
                    {/* Header and Filters */}
                    <div className="p-6 bg-white rounded-lg shadow-sm">
                        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
                            <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
                            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search bookings..."
                                        className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg sm:w-auto focus:ring-indigo-500 focus:border-indigo-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg sm:w-auto"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                >
                                    <option value="all">All Dates</option>
                                    <option value="today">Today</option>
                                    <option value="upcoming">Upcoming</option>
                                    <option value="past">Past</option>
                                </select>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg sm:w-auto"
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {[
                            { label: "Today's Bookings", value: stats.today, icon: Calendar, color: "bg-blue-50 text-blue-700" },
                            { label: 'Pending', value: stats.pending, icon: AlertCircle, color: "bg-yellow-50 text-yellow-700" },
                            { label: 'In Progress', value: stats.inProgress, icon: Clock, color: "bg-indigo-50 text-indigo-700" },
                            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: "bg-green-50 text-green-700" },
                            {
                                label: 'Total Earnings',
                                value: formatCurrency(stats.totalEarnings),
                                icon: DollarSign,
                                secondaryValue: stats.pendingFees > 0 ? `${formatCurrency(stats.pendingFees)} pending` : null,
                                color: "bg-emerald-50 text-emerald-700"
                            },
                        ].map((stat, index) => (
                            <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                        <div className={`p-2 rounded-full ${stat.color}`}>
                                            <stat.icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                                    {stat.secondaryValue && (
                                        <p className="mt-1 text-xs text-gray-500">{stat.secondaryValue}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bookings Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredBookings.map((booking) => (
                            <BookingCard key={booking.id} booking={booking} />
                        ))}
                    </div>

                    {filteredBookings.length === 0 && (
                        <div className="py-12 text-center bg-white rounded-lg shadow-sm">
                            <Filter className="w-12 h-12 mx-auto text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                            <p className="mt-1 text-sm text-gray-500">No bookings match your current filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Update Modal */}
            <StatusUpdateModal
                booking={selectedBooking}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onUpdateStatus={handleStatusUpdate}
                loading={loading}
            />

            {/* Booking Details Modal */}
            <BookingDetailsModal
                booking={selectedBooking}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
            />
        </Authenticated>
    );
}
