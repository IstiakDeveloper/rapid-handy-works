import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    MapPin,
    Phone,
    User,
    CheckCircle,
    XCircle,
    AlertCircle,
    Search,
    Star,
    CreditCard,
    DollarSign,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    FileText
} from 'lucide-react';

export default function ClientBookings({ auth, bookings }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [expandedBooking, setExpandedBooking] = useState(null);

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
        pending: 'bg-orange-100 text-orange-800',
        paid: 'bg-green-100 text-green-800',
        refunded: 'bg-purple-100 text-purple-800'
    };

    const bookingFeeStatusColors = {
        pending: 'bg-orange-100 text-orange-800',
        paid: 'bg-green-100 text-green-800',
        refunded: 'bg-purple-100 text-purple-800'
    };

    const handleCancel = (id) => {
        if (confirm('Are you sure you want to cancel this booking?')) {
            router.put(`/bookings/${id}/cancel`);
        }
    };

    const filteredBookings = bookings?.filter(booking => {
        const matchesSearch = booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.provider.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' || booking.status === filter;
        return matchesSearch && matchesFilter;
    });

    const canCancel = (booking) => ['pending', 'confirmed'].includes(booking.status);

    const canPayBookingFee = (booking) =>
        booking.booking_fee_status === 'pending' &&
        ['pending', 'confirmed'].includes(booking.status);

    const toggleExpand = (id) => {
        if (expandedBooking === id) {
            setExpandedBooking(null);
        } else {
            setExpandedBooking(id);
        }
    };

    const formatCurrency = (amount) => {
        return `৳${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <Authenticated user={auth.user}>
            <Head title="My Bookings" />

            <div className="container px-4 py-6 mx-auto sm:px-6 lg:px-8">
                <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
                    <h1 className="text-2xl font-semibold text-gray-900">My Bookings</h1>
                    <div className="flex flex-col items-center w-full gap-4 sm:flex-row md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search bookings..."
                                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg sm:w-auto focus:ring-indigo-500 focus:border-indigo-500"
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

                {/* Bookings Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBookings?.map((booking) => {
                        const StatusIcon = statusIcons[booking.status];
                        const isExpanded = expandedBooking === booking.id;
                        return (
                            <div key={booking.id} className="transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
                                <div className="p-6">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {booking.service.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                {booking.reference_number || `Booking #${booking.id}`}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full flex items-center ${statusColors[booking.status]}`}>
                                            <StatusIcon className="w-4 h-4 mr-1" />
                                            <span className="text-sm capitalize">{booking.status.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    {/* Provider Info */}
                                    <div className="mb-4 space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <User className="flex-shrink-0 w-4 h-4 mr-2" />
                                            <span className="text-sm">Provider: {booking.provider.name}</span>
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

                                    {/* Booking Details */}
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

                                        {/* Payment Information */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Booking Fee:</span>
                                                <div className="flex items-center">
                                                    <span className="mr-2 text-sm font-medium">
                                                        {formatCurrency(booking.booking_fee)}
                                                    </span>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${bookingFeeStatusColors[booking.booking_fee_status]}`}>
                                                        {booking.booking_fee_status}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600">Remaining:</span>
                                                <span className="text-sm font-medium">
                                                    {formatCurrency(booking.remaining_amount)}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between pt-2 mt-2 border-t">
                                                <span className="text-sm font-medium text-gray-900">Total:</span>
                                                <span className="text-lg font-bold text-indigo-600">
                                                    {formatCurrency(booking.total_amount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toggle Button */}
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(booking.id)}
                                        className="flex items-center justify-center w-full py-1 mt-4 text-sm text-gray-500 rounded hover:bg-gray-50"
                                    >
                                        {isExpanded ? (
                                            <>
                                                <ChevronUp className="w-4 h-4 mr-1" />
                                                <span>Show Less</span>
                                            </>
                                        ) : (
                                            <>
                                                <ChevronDown className="w-4 h-4 mr-1" />
                                                <span>Show More</span>
                                            </>
                                        )}
                                    </button>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="pt-4 mt-4 space-y-4 border-t">
                                            {booking.notes && (
                                                <div className="p-3 rounded-lg bg-gray-50">
                                                    <div className="flex items-start">
                                                        <FileText className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <h4 className="text-sm font-medium text-gray-700">Notes:</h4>
                                                            <p className="mt-1 text-sm text-gray-600">{booking.notes}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Payment Method Info */}
                                            <div className="p-3 rounded-lg bg-gray-50">
                                                <div className="flex items-center">
                                                    <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                                                    <h4 className="text-sm font-medium text-gray-700">
                                                        Payment Method: <span className="capitalize">{booking.payment_method.replace('_', ' ')}</span>
                                                    </h4>
                                                </div>
                                            </div>

                                            {/* Status Timeline */}
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-medium text-gray-700">Booking Timeline:</h4>
                                                <div className="relative pl-6 space-y-3 border-l-2 border-gray-200">
                                                    <div className="relative">
                                                        <div className="absolute -left-[25px] p-1 bg-blue-500 rounded-full">
                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                        </div>
                                                        <p className="text-xs text-gray-600">
                                                            Created on {new Date(booking.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>

                                                    {booking.booking_fee_status === 'paid' && (
                                                        <div className="relative">
                                                            <div className="absolute -left-[25px] p-1 bg-green-500 rounded-full">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                            <p className="text-xs text-gray-600">
                                                                Booking fee paid
                                                            </p>
                                                        </div>
                                                    )}

                                                    {booking.status === 'completed' && booking.completed_at && (
                                                        <div className="relative">
                                                            <div className="absolute -left-[25px] p-1 bg-green-500 rounded-full">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                            <p className="text-xs text-gray-600">
                                                                Completed on {new Date(booking.completed_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {booking.status === 'cancelled' && booking.cancelled_at && (
                                                        <div className="relative">
                                                            <div className="absolute -left-[25px] p-1 bg-red-500 rounded-full">
                                                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                                            </div>
                                                            <p className="text-xs text-gray-600">
                                                                Cancelled on {new Date(booking.cancelled_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-4 mt-4 border-t">
                                        {booking.status === 'completed' && !booking.review && (
                                            <Link
                                                href={route('reviews.create', { booking: booking.id })}
                                                className="flex items-center px-3 py-2 text-indigo-800 bg-indigo-100 rounded-lg hover:bg-indigo-200"
                                            >
                                                <Star className="w-4 h-4 mr-2" />
                                                Leave Review
                                            </Link>
                                        )}

                                        {canPayBookingFee(booking) && booking.payment_method === 'bank_transfer' && (
                                            <Link
                                                href={route('payment.bank-transfer', { reference: booking.reference_number })}
                                                className="flex items-center px-3 py-2 text-green-800 bg-green-100 rounded-lg hover:bg-green-200"
                                            >
                                                <DollarSign className="w-4 h-4 mr-2" />
                                                Pay Fee
                                            </Link>
                                        )}

                                        {canCancel(booking) && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                className="flex items-center px-3 py-2 text-red-800 bg-red-100 rounded-lg hover:bg-red-200"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Cancel Booking
                                            </button>
                                        )}

                                        {/* If no specific action is available, show view details button */}
                                        {!canCancel(booking) &&
                                         !canPayBookingFee(booking) &&
                                         !(booking.status === 'completed' && !booking.review) && (
                                            <Link
                                                href={route('bookings.show', booking.id)}
                                                className="flex items-center px-3 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                            >
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                View Details
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredBookings?.length === 0 && (
                    <div className="py-12 text-center bg-white rounded-lg shadow">
                        <div className="flex flex-col items-center">
                            <Calendar className="w-12 h-12 mb-3 text-gray-300" />
                            <h3 className="mb-1 text-lg font-medium text-gray-900">No bookings found</h3>
                            <p className="mb-4 text-gray-500">No bookings match your current search or filter criteria.</p>
                            <Link
                                href={route('services')}
                                className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Book a Service
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </Authenticated>
    );
}
