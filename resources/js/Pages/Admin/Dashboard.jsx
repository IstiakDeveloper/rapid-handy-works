import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
  CurrencyDollarIcon,
  UsersIcon,
  BriefcaseIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function Dashboard({
  stats,
  recentBookings,
  topServices,
  topProviders,
  revenueTrends,
  bookingStatuses,
  categoryDistribution,
  serviceStatusDistribution,
  issueCount,
}) {
  const [activeTab, setActiveTab] = useState('overview');

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  };


  // Colors for charts
  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#ec4899'];
  const STATUS_COLORS = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    in_progress: '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444',
  };

  // Prepare data for pie charts
  const prepareBookingStatusData = () => {
    return Object.entries(bookingStatuses).map(([status, count], index) => ({
      name: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
      value: count,
      color: STATUS_COLORS[status] || COLORS[index % COLORS.length],
    }));
  };

  const prepareCategoryData = () => {
    return Object.entries(categoryDistribution).map(([category, count], index) => ({
      name: category,
      value: count,
      color: COLORS[index % COLORS.length],
    }));
  };

  const prepareServiceStatusData = () => {
    return Object.entries(serviceStatusDistribution).map(([status, count], index) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: status === 'active' ? '#10b981' : '#ef4444',
    }));
  };

  return (
    <AuthenticatedLayout>
      <Head title="Admin Dashboard" />

      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>

        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          {/* Dashboard Tabs */}
          <div className="mt-4 sm:flex sm:items-center sm:justify-between">
            <div className="flex space-x-1 overflow-x-auto border-b border-gray-200">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'bookings'
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'services'
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => setActiveTab('providers')}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'providers'
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Providers
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'text-amber-600 border-b-2 border-amber-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Revenue Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-full bg-amber-100">
                  <CurrencyDollarIcon className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Total Revenue</h2>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Monthly:</span>
                  <span className="font-medium text-gray-900">{formatCurrency(stats.monthlyRevenue)}</span>
                  {stats.revenueGrowth > 0 ? (
                    <span className="flex items-center text-sm text-green-600">
                      <ArrowUpIcon className="w-4 h-4 mr-1" />
                      {stats.revenueGrowth}%
                    </span>
                  ) : (
                    <span className="flex items-center text-sm text-red-600">
                      <ArrowDownIcon className="w-4 h-4 mr-1" />
                      {Math.abs(stats.revenueGrowth)}%
                    </span>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Users Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full">
                  <UsersIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Total Users</h2>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <UserGroupIcon className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-gray-500">Clients:</span>
                    <span className="ml-1 font-medium text-gray-900">{stats.totalClients}</span>
                  </div>
                  <div className="flex items-center">
                    <BriefcaseIcon className="w-4 h-4 mr-1 text-gray-500" />
                    <span className="text-gray-500">Providers:</span>
                    <span className="ml-1 font-medium text-gray-900">{stats.totalProviders}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Services Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-green-100 rounded-full">
                  <BriefcaseIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Services</h2>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalServices}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">Active:</span>
                  <span className="font-medium text-gray-900">{serviceStatusDistribution.active}</span>
                  <span className="text-gray-500 ml-3">Inactive:</span>
                  <span className="font-medium text-gray-900">{serviceStatusDistribution.inactive}</span>
                </div>
              </div>
            </motion.div>

            {/* Bookings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full">
                  <ClipboardDocumentCheckIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Bookings</h2>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {bookingStatuses.pending +
                        bookingStatuses.confirmed +
                        bookingStatuses.in_progress +
                        bookingStatuses.completed +
                        bookingStatuses.cancelled ||
                        0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <span className="text-gray-500">Completed:</span>
                    <span className="ml-1 font-medium text-gray-900">{stats.totalCompletedBookings}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500">Pending:</span>
                    <span className="ml-1 font-medium text-gray-900">{stats.pendingBookings}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Issues Warning */}
          {(issueCount.pending_payments > 0 || issueCount.no_show_bookings > 0 || issueCount.low_rated_services > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="p-4 mt-6 bg-yellow-50 border border-yellow-200 rounded-lg"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="w-5 h-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <ul className="pl-5 space-y-1 list-disc">
                      {issueCount.pending_payments > 0 && (
                        <li>
                          {issueCount.pending_payments} booking(s) with pending payments past their scheduled date
                        </li>
                      )}
                      {issueCount.no_show_bookings > 0 && (
                        <li>{issueCount.no_show_bookings} possible no-show booking(s) that need follow-up</li>
                      )}
                      {issueCount.low_rated_services > 0 && (
                        <li>{issueCount.low_rated_services} service(s) with ratings below 3.0 stars</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Main Content Areas */}
          <div className="mt-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Revenue Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <h2 className="text-lg font-medium text-gray-900">Revenue Trends</h2>
                  <p className="mt-1 text-sm text-gray-500">Monthly revenue for the last 6 months</p>
                  <div className="mt-4" style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={revenueTrends}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis
                          tickFormatter={(value) => {
                            return new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: 'USD',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(value);
                          }}
                        />
                        <Tooltip
                          formatter={(value) => {
                            return [
                              new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                              }).format(value),
                              'Revenue',
                            ];
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Summary Charts - Grid of 3 */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {/* Booking Status Distribution */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <h2 className="text-base font-medium text-gray-900">Booking Status</h2>
                    <p className="mt-1 text-sm text-gray-500">Distribution of booking statuses</p>
                    <div className="flex justify-center mt-4" style={{ height: 200 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={prepareBookingStatusData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {prepareServiceStatusData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => {
                              return [value, name];
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Bookings Table */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm"
                >
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
                    <p className="mt-1 text-sm text-gray-500">The latest 5 bookings across the platform</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Client
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Service
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Date & Time
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                          >
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-8 h-8">
                                  <img
                                    className="w-8 h-8 rounded-full"
                                    src={booking.client.avatar || `https://ui-avatars.com/api/?name=${booking.client.name}&background=f59e0b&color=fff`}
                                    alt={booking.client.name}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{booking.client.name}</div>
                                  <div className="text-sm text-gray-500">{booking.client.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{booking.service.title}</div>
                              <div className="text-sm text-gray-500">by {booking.provider.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{booking.booking_date}</div>
                              <div className="text-sm text-gray-500">{booking.booking_time}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{formatCurrency(booking.total_amount)}</div>
                              <div className="text-sm text-gray-500">
                                {booking.payment_status === 'paid' ? 'Paid' : booking.payment_status === 'pending' ? 'Pending' : 'Refunded'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                                ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                                ${booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : ''}
                                ${booking.status === 'in_progress' ? 'bg-purple-100 text-purple-800' : ''}
                                ${booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                              `}
                              >
                                {booking.status.replace('_', ' ').charAt(0).toUpperCase() + booking.status.replace('_', ' ').slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="py-3 text-center border-t border-gray-200">
                    <a href="/admin/bookings" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                      View all bookings →
                    </a>
                  </div>
                </motion.div>

                {/* Top Services and Providers - 2 Column Grid */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* Top Services Table */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Top Services</h2>
                      <p className="mt-1 text-sm text-gray-500">Services with the most bookings</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              Service
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              Category
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              Bookings
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {topServices.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{service.title}</div>
                                <div className="text-sm text-gray-500">by {service.provider.name}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{service.category}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{formatCurrency(service.price)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{service.bookings_count}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="py-3 text-center border-t border-gray-200">
                      <a href="/admin/services" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                        View all services →
                      </a>
                    </div>
                  </motion.div>

                  {/* Top Providers Table */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm"
                  >
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h2 className="text-lg font-medium text-gray-900">Top Providers</h2>
                      <p className="mt-1 text-sm text-gray-500">Service providers with the most bookings</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              Provider
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              Bookings
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              Completed
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                            >
                              Revenue
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {topProviders.map((provider) => (
                            <tr key={provider.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 w-8 h-8">
                                    <img
                                      className="w-8 h-8 rounded-full"
                                      src={provider.avatar || `https://ui-avatars.com/api/?name=${provider.name}&background=f59e0b&color=fff`}
                                      alt={provider.name}
                                    />
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                                    <div className="text-sm text-gray-500">{provider.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{provider.bookings_count}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{provider.completed_bookings}</div>
                                <div className="text-sm text-gray-500">
                                  {provider.bookings_count > 0
                                    ? `${Math.round((provider.completed_bookings / provider.bookings_count) * 100)}%`
                                    : '0%'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatCurrency(provider.total_amount)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="py-3 text-center border-t border-gray-200">
                      <a href="/admin/providers" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                        View all providers →
                      </a>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900">Bookings Analysis</h2>
                  <p className="mt-2 text-gray-600">Detailed view of the bookings dashboard is under construction.</p>
                  <p className="mt-4">
                    <a href="/admin/bookings" className="text-amber-600 hover:text-amber-500">
                      Go to Bookings Management →
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900">Services Analysis</h2>
                  <p className="mt-2 text-gray-600">Detailed view of the services dashboard is under construction.</p>
                  <p className="mt-4">
                    <a href="/admin/services" className="text-amber-600 hover:text-amber-500">
                      Go to Services Management →
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Providers Tab */}
            {activeTab === 'providers' && (
              <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900">Providers Analysis</h2>
                  <p className="mt-2 text-gray-600">Detailed view of the providers dashboard is under construction.</p>
                  <p className="mt-4">
                    <a href="/admin/providers" className="text-amber-600 hover:text-amber-500">
                      Go to Providers Management →
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900">Advanced Analytics</h2>
                  <p className="mt-2 text-gray-600">Detailed analytics dashboard is under construction.</p>
                  <p className="mt-4">
                    <a href="/admin/reports" className="text-amber-600 hover:text-amber-500">
                      View Reports →
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
