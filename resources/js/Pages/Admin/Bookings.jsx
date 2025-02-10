import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    Search,
    Download,
    Filter,
    MoreVertical,
    X
} from 'lucide-react';

export default function AdminBookings({ auth, bookings, stats }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const itemsPerPage = 10;

    // Status color mapping
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-indigo-100 text-indigo-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };

    // Status update handler with error handling
    const handleStatusUpdate = (id, newStatus) => {
        try {
            router.put(`/admin/bookings/${id}`,
                { status: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        alert('Booking status updated successfully');
                    },
                    onError: (errors) => {
                        alert('Failed to update booking status');
                        console.error(errors);
                    }
                }
            );
        } catch (error) {
            alert('An unexpected error occurred');
            console.error(error);
        }
    };

    // Booking deletion handler
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this booking?')) {
            try {
                router.delete(`/admin/bookings/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        alert('Booking deleted successfully');
                    },
                    onError: (errors) => {
                        alert('Failed to delete booking');
                        console.error(errors);
                    }
                });
            } catch (error) {
                alert('An unexpected error occurred');
                console.error(error);
            }
        }
    };

    // Export bookings handler
    const exportBookings = () => {
        window.location.href = route('admin.bookings.export');
    };

    // Memoized filtered bookings with pagination
    const filteredBookings = useMemo(() => {
        const filtered = bookings?.filter(booking => {
            const matchesSearch =
                booking.service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.provider.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = filter === 'all' || booking.status === filter;

            const matchesDate =
                (!dateRange.start || booking.booking_date >= dateRange.start) &&
                (!dateRange.end || booking.booking_date <= dateRange.end);

            return matchesSearch && matchesFilter && matchesDate;
        }) || [];

        // Pagination logic
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            total: filtered.length,
            data: filtered.slice(startIndex, endIndex)
        };
    }, [bookings, searchTerm, filter, dateRange, currentPage]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm('');
        setFilter('all');
        setDateRange({ start: '', end: '' });
        setCurrentPage(1);
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredBookings.total / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Authenticated user={auth.user}>
            <Head title="Manage Bookings" />

            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
                        <p className="text-sm text-gray-500 mt-2">
                            Comprehensive overview and management of all bookings
                        </p>
                    </div>
                    <button
                        onClick={exportBookings}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Bookings
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    {[
                        { label: 'Total Bookings', value: stats?.total || 0 },
                        { label: 'Today\'s Bookings', value: stats?.today || 0 },
                        { label: 'Pending Approval', value: stats?.pending || 0 },
                        { label: 'Total Revenue', value: `$${(stats?.revenue || 0).toFixed(2)}` }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.label}</h3>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap gap-4 items-end">
                        <div className="flex-grow min-w-[250px]">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Search Bookings
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by service, client, or provider..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-end space-x-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={e => {
                                        setDateRange({ ...dateRange, start: e.target.value });
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={e => {
                                        setDateRange({ ...dateRange, end: e.target.value });
                                        setCurrentPage(1);
                                    }}
                                    className="border border-gray-300 rounded-lg px-3 py-2"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => {
                                    setFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 rounded-lg px-3 py-2"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>

                            <button
                                onClick={clearFilters}
                                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {filteredBookings.total > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            {[
                                                'Booking Details',
                                                'Client',
                                                'Provider',
                                                'Status',
                                                'Amount',
                                                'Actions'
                                            ].map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredBookings.data.map((booking) => (
                                            <tr
                                                key={booking.id}
                                                className="hover:bg-gray-50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-900">
                                                            {booking.service.title}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            #{booking.id}
                                                        </span>
                                                        <div className="flex items-center mt-1 text-sm text-gray-500">
                                                            <Calendar className="w-4 h-4 mr-2" />
                                                            {booking.booking_date}
                                                            <Clock className="w-4 h-4 ml-3 mr-2" />
                                                            {booking.booking_time}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">
                                                            {booking.client.name}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {booking.client.email}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {booking.phone}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-gray-900">
                                                        {booking.provider.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span
                                                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${statusColors[booking.status]}`}
                                                    >
                                                        {booking.status.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-900">
                                                        ${parseFloat(booking.total_amount).toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 relative">
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setIsDropdownOpen({
                                                                ...isDropdownOpen,
                                                                [booking.id]: !isDropdownOpen[booking.id]
                                                            })}
                                                            className="p-2 rounded-full hover:bg-gray-100"
                                                        >
                                                            <MoreVertical className="h-4 w-4" />
                                                        </button>
                                                        {isDropdownOpen[booking.id] && (
                                                            <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                <div className="py-1">
                                                                    {booking.status !== 'confirmed' && (
                                                                        <button
                                                                            onClick={() => {
                                                                                handleStatusUpdate(booking.id, 'confirmed');
                                                                                setIsDropdownOpen({...isDropdownOpen, [booking.id]: false});
                                                                            }}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                            Confirm Booking
                                                                        </button>
                                                                    )}
                                                                    {booking.status !== 'in_progress' && (
                                                                        <button
                                                                            onClick={() => {
                                                                                handleStatusUpdate(booking.id, 'in_progress');
                                                                                setIsDropdownOpen({...isDropdownOpen, [booking.id]: false});
                                                                            }}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                                            Mark In Progress
                                                                        </button>
                                                                    )}
                                                                    {booking.status !== 'completed' && (
                                                                        <button
                                                                            onClick={() => {
                                                                                handleStatusUpdate(booking.id, 'completed');
                                                                                setIsDropdownOpen({...isDropdownOpen, [booking.id]: false});
                                                                            }}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        >
                                                                            Mark Completed
                                                                        </button>
                                                                    )}
                                                                    {booking.status !== 'cancelled' && (
                                                                        <button
                                                                            onClick={() => {
                                                                                handleStatusUpdate(booking.id, 'cancelled');
                                                                                setIsDropdownOpen({...isDropdownOpen, [booking.id]: false});
                                                                            }}
                                                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                        >
                                                                            Cancel Booking
                                                                        </button>
                                                                    )}
                                                                    <button
                                                                        onClick={() => {
                                                                            handleDelete(booking.id);
                                                                            setIsDropdownOpen({...isDropdownOpen, [booking.id]: false});
                                                                        }}
                                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                                    >
                                                                        Delete Booking
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-between items-center p-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                                    {Math.min(currentPage * itemsPerPage, filteredBookings.total)} of{' '}
                                    {filteredBookings.total} bookings
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage >= Math.ceil(filteredBookings.total / itemsPerPage)}
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-500 mb-4">
                                No bookings found matching your criteria
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Authenticated>
    );
}
