import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    CreditCardIcon,
    UsersIcon,
    CalendarDaysIcon,
    StarIcon
} from 'lucide-react';

export default function Dashboard({ auth }) {
    // Sample stats data
    const stats = [
        {
            name: 'Total Bookings',
            value: '142',
            change: '+12.3%',
            changeType: 'positive',
            icon: CalendarDaysIcon,
        },
        {
            name: 'Total Revenue',
            value: '৳24,500',
            change: '+15.1%',
            changeType: 'positive',
            icon: CreditCardIcon,
        },
        {
            name: 'Active Users',
            value: '573',
            change: '+8.2%',
            changeType: 'positive',
            icon: UsersIcon,
        },
        {
            name: 'Average Rating',
            value: '4.8',
            change: '+2.3%',
            changeType: 'positive',
            icon: StarIcon,
        },
    ];

    // Sample recent bookings data
    const recentBookings = [
        {
            id: 1,
            service: 'Plumbing Repair',
            customer: 'John Doe',
            date: '2024-02-09',
            status: 'completed',
            amount: '৳1,200',
        },
        {
            id: 2,
            service: 'Electrical Work',
            customer: 'Jane Smith',
            date: '2024-02-09',
            status: 'in_progress',
            amount: '৳2,500',
        },
        {
            id: 3,
            service: 'AC Repair',
            customer: 'Mike Johnson',
            date: '2024-02-08',
            status: 'pending',
            amount: '৳3,000',
        },
        {
            id: 4,
            service: 'Painting',
            customer: 'Sarah Williams',
            date: '2024-02-08',
            status: 'completed',
            amount: '৳4,500',
        },
    ];

    const getStatusColor = (status) => {
        const colors = {
            completed: 'bg-green-100 text-green-800',
            in_progress: 'bg-blue-100 text-blue-800',
            pending: 'bg-yellow-100 text-yellow-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

                    {/* Stats Grid */}
                    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((item) => (
                            <div
                                key={item.name}
                                className="relative bg-white p-5 rounded-lg shadow"
                            >
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 truncate">
                                            {item.name}
                                        </p>
                                        <p className="mt-1 text-xl font-semibold text-gray-900">
                                            {item.value}
                                        </p>
                                    </div>
                                    <div className="bg-indigo-50 rounded-lg p-2">
                                        <item.icon className="h-6 w-6 text-indigo-600" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <span className={`text-sm ${
                                        item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {item.change}
                                    </span>
                                    <span className="text-sm text-gray-500"> vs last month</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Recent Bookings */}
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
                        <div className="mt-4 bg-white shadow rounded-lg">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Service
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Amount
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {recentBookings.map((booking) => (
                                            <tr key={booking.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {booking.service}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {booking.customer}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {booking.date}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                        {booking.status.replace('_', ' ').toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {booking.amount}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
