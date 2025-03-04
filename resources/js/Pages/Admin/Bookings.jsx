import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import {
    Calendar,
    Clock,
    Search,
    Download,
    Filter,
    MoreVertical,
    X,
} from "lucide-react";

export default function AdminBookings({ auth, bookings, stats }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState("all");
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const [isDropdownOpen, setIsDropdownOpen] = useState({});
    const itemsPerPage = 10;

    // Status color mapping
    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        in_progress: "bg-indigo-100 text-indigo-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    // Status update handler with error handling
    const handleStatusUpdate = (id, newStatus) => {
        try {
            router.put(
                `/admin/bookings/${id}`,
                { status: newStatus },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        alert("Booking status updated successfully");
                    },
                    onError: (errors) => {
                        alert("Failed to update booking status");
                        console.error(errors);
                    },
                }
            );
        } catch (error) {
            alert("An unexpected error occurred");
            console.error(error);
        }
    };

    // Booking deletion handler
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this booking?")) {
            try {
                router.delete(`/admin/bookings/${id}`, {
                    preserveScroll: true,
                    onSuccess: () => {
                        alert("Booking deleted successfully");
                    },
                    onError: (errors) => {
                        alert("Failed to delete booking");
                        console.error(errors);
                    },
                });
            } catch (error) {
                alert("An unexpected error occurred");
                console.error(error);
            }
        }
    };

    // Export bookings handler
    const exportBookings = () => {
        window.location.href = route("admin.bookings.export");
    };

    // Memoized filtered bookings with pagination
    const filteredBookings = useMemo(() => {
        const filtered =
            bookings?.filter((booking) => {
                const matchesSearch =
                    booking.service.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    booking.client.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    booking.provider.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase());

                const matchesFilter =
                    filter === "all" || booking.status === filter;

                const matchesDate =
                    (!dateRange.start ||
                        booking.booking_date >= dateRange.start) &&
                    (!dateRange.end || booking.booking_date <= dateRange.end);

                return matchesSearch && matchesFilter && matchesDate;
            }) || [];

        // Pagination logic
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return {
            total: filtered.length,
            data: filtered.slice(startIndex, endIndex),
        };
    }, [bookings, searchTerm, filter, dateRange, currentPage]);

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setFilter("all");
        setDateRange({ start: "", end: "" });
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

            <div className="container px-4 py-6 mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Bookings Management
                        </h1>
                        <p className="mt-2 text-sm text-gray-500">
                            Comprehensive overview and management of all
                            bookings
                        </p>
                    </div>
                    <button
                        onClick={exportBookings}
                        className="flex items-center px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export Bookings
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
                    {[
                        { label: "Total Bookings", value: stats?.total || 0 },
                        { label: "Today's Bookings", value: stats?.today || 0 },
                        {
                            label: "Pending Approval",
                            value: stats?.pending || 0,
                        },
                        {
                            label: "Total Revenue",
                            value: `£${(stats?.revenue || 0).toFixed(2)}`,
                        },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
                        >
                            <h3 className="mb-2 text-sm font-medium text-gray-500">
                                {stat.label}
                            </h3>
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
                    <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-grow min-w-[250px]">
                            <label className="block mb-1 text-sm font-medium text-gray-700">
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
                                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <Search className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                            </div>
                        </div>

                        <div className="flex items-end space-x-3">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => {
                                        setDateRange({
                                            ...dateRange,
                                            start: e.target.value,
                                        });
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => {
                                        setDateRange({
                                            ...dateRange,
                                            end: e.target.value,
                                        });
                                        setCurrentPage(1);
                                    }}
                                    className="px-3 py-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                            <select
                                value={filter}
                                onChange={(e) => {
                                    setFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 border border-gray-300 rounded-lg"
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
                                className="flex items-center px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:text-gray-900"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bookings Table */}
                <div className="overflow-hidden bg-white rounded-lg shadow-md">
                    {filteredBookings.total > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="border-b bg-gray-50">
                                        <tr>
                                            {[
                                                "Booking Details",
                                                "Client",
                                                "Provider",
                                                "Status",
                                                "Amount",
                                                "Actions",
                                            ].map((header) => (
                                                <th
                                                    key={header}
                                                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredBookings.data.map(
                                            (booking) => (
                                                <tr
                                                    key={booking.id}
                                                    className="transition-colors hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-semibold text-gray-900">
                                                                {
                                                                    booking
                                                                        .service
                                                                        .title
                                                                }
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                #{booking.id}
                                                            </span>
                                                            <div className="flex items-center mt-1 text-sm text-gray-500">
                                                                <Calendar className="w-4 h-4 mr-2" />
                                                                {
                                                                    booking.booking_date
                                                                }
                                                                <Clock className="w-4 h-4 ml-3 mr-2" />
                                                                {
                                                                    booking.booking_time
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-gray-900">
                                                                {
                                                                    booking
                                                                        .client
                                                                        .name
                                                                }
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {
                                                                    booking
                                                                        .client
                                                                        .email
                                                                }
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {booking.phone}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-medium text-gray-900">
                                                            {
                                                                booking.provider
                                                                    .name
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                                                        ${
                                                            statusColors[
                                                                booking.status
                                                            ]
                                                        }`}
                                                        >
                                                            {booking.status.replace(
                                                                "_",
                                                                " "
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-semibold text-gray-900">
                                                            £
                                                            {parseFloat(
                                                                booking.total_amount
                                                            ).toFixed(2)}
                                                        </span>
                                                    </td>
                                                    <td className="relative px-6 py-4">
                                                        <div className="relative">
                                                            <button
                                                                onClick={() =>
                                                                    setIsDropdownOpen(
                                                                        {
                                                                            ...isDropdownOpen,
                                                                            [booking.id]:
                                                                                !isDropdownOpen[
                                                                                    booking
                                                                                        .id
                                                                                ],
                                                                        }
                                                                    )
                                                                }
                                                                className="p-2 rounded-full hover:bg-gray-100"
                                                            >
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                            {isDropdownOpen[
                                                                booking.id
                                                            ] && (
                                                                <div className="absolute right-0 z-10 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                                    <div className="py-1">
                                                                        {/* Status Section */}
                                                                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                                                                            Status
                                                                            Actions
                                                                        </div>

                                                                        {booking.status !==
                                                                            "confirmed" &&
                                                                            booking.status !==
                                                                                "cancelled" &&
                                                                            booking.status !==
                                                                                "completed" && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleStatusUpdate(
                                                                                            booking.id,
                                                                                            "confirmed"
                                                                                        );
                                                                                        setIsDropdownOpen(
                                                                                            {
                                                                                                ...isDropdownOpen,
                                                                                                [booking.id]: false,
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                    className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                                                >
                                                                                    <span>
                                                                                        Confirm
                                                                                        Booking
                                                                                    </span>
                                                                                    {booking.booking_fee >
                                                                                        0 &&
                                                                                        booking.booking_fee_status ===
                                                                                            "pending" && (
                                                                                            <span className="ml-1 text-xs text-green-600">
                                                                                                (Marks
                                                                                                fee
                                                                                                as
                                                                                                paid)
                                                                                            </span>
                                                                                        )}
                                                                                </button>
                                                                            )}

                                                                        {booking.status ===
                                                                            "confirmed" && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleStatusUpdate(
                                                                                        booking.id,
                                                                                        "in_progress"
                                                                                    );
                                                                                    setIsDropdownOpen(
                                                                                        {
                                                                                            ...isDropdownOpen,
                                                                                            [booking.id]: false,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                                            >
                                                                                Mark
                                                                                In
                                                                                Progress
                                                                            </button>
                                                                        )}

                                                                        {(booking.status ===
                                                                            "confirmed" ||
                                                                            booking.status ===
                                                                                "in_progress") && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleStatusUpdate(
                                                                                        booking.id,
                                                                                        "completed"
                                                                                    );
                                                                                    setIsDropdownOpen(
                                                                                        {
                                                                                            ...isDropdownOpen,
                                                                                            [booking.id]: false,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                                className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                                                                            >
                                                                                <span>
                                                                                    Mark
                                                                                    Completed
                                                                                </span>
                                                                                <span className="ml-1 text-xs text-green-600">
                                                                                    (Marks
                                                                                    payment
                                                                                    as
                                                                                    paid)
                                                                                </span>
                                                                            </button>
                                                                        )}

                                                                        {booking.status !==
                                                                            "cancelled" &&
                                                                            booking.status !==
                                                                                "completed" && (
                                                                                <button
                                                                                    onClick={() => {
                                                                                        handleStatusUpdate(
                                                                                            booking.id,
                                                                                            "cancelled"
                                                                                        );
                                                                                        setIsDropdownOpen(
                                                                                            {
                                                                                                ...isDropdownOpen,
                                                                                                [booking.id]: false,
                                                                                            }
                                                                                        );
                                                                                    }}
                                                                                    className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                                                                                >
                                                                                    <span>
                                                                                        Cancel
                                                                                        Booking
                                                                                    </span>
                                                                                    {booking.booking_fee >
                                                                                        0 &&
                                                                                        booking.booking_fee_status ===
                                                                                            "paid" && (
                                                                                            <span className="ml-1 text-xs">
                                                                                                (Will
                                                                                                refund
                                                                                                fee)
                                                                                            </span>
                                                                                        )}
                                                                                </button>
                                                                            )}

                                                                        {/* Delete Action */}
                                                                        <div className="pt-1 mt-1 border-t">
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleDelete(
                                                                                        booking.id
                                                                                    );
                                                                                    setIsDropdownOpen(
                                                                                        {
                                                                                            ...isDropdownOpen,
                                                                                            [booking.id]: false,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                                className="block w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                                                                            >
                                                                                Delete
                                                                                Booking
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between p-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Showing{" "}
                                    {(currentPage - 1) * itemsPerPage + 1} to{" "}
                                    {Math.min(
                                        currentPage * itemsPerPage,
                                        filteredBookings.total
                                    )}{" "}
                                    of {filteredBookings.total} bookings
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
                                        disabled={
                                            currentPage >=
                                            Math.ceil(
                                                filteredBookings.total /
                                                    itemsPerPage
                                            )
                                        }
                                        className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="mb-4 text-xl text-gray-500">
                                No bookings found matching your criteria
                            </p>
                            <button
                                onClick={clearFilters}
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
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
