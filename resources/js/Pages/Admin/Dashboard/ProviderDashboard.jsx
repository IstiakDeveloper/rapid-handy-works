import React, { useState } from 'react';
import {
  CurrencyDollarIcon,
  CalendarIcon,
  StarIcon,
  BriefcaseIcon,
  UserIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import {
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

export default function ProviderDashboard({
  providerStats,
  myServices,
  myBookings,
  earningsByMonth,
  bookingStatusDistribution,
  clientReviews
}) {
  const [activeTab, setActiveTab] = useState('overview');

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  };

  // Chart colors
  const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'];
  const STATUS_COLORS = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    in_progress: '#8b5cf6',
    completed: '#10b981',
    cancelled: '#ef4444',
  };

  // Get provider stats with defaults
  const stats = providerStats || {
    totalEarnings: 0,
    monthlyEarnings: 0,
    earningsGrowth: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completionRate: 0,
    averageRating: 0,
    totalServices: 0,
    activeServices: 0
  };

  // Mock data if none provided
  const bookingStatus = bookingStatusDistribution || {
    pending: 0,
    confirmed: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  };

  const prepareBookingStatusData = () => {
    return Object.entries(bookingStatus).map(([status, count], index) => ({
      name: status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1),
      value: count || 0,
      color: STATUS_COLORS[status] || COLORS[index % COLORS.length],
    }));
  };

  const bookingStatusData = prepareBookingStatusData();

  return (
    <div>
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
            My Bookings
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'services'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Services
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('earnings')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'earnings'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Earnings
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Earnings Card */}
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
              <h2 className="text-sm font-medium text-gray-500">Total Earnings</h2>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalEarnings)}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">Monthly:</span>
              <span className="font-medium text-gray-900">{formatCurrency(stats.monthlyEarnings)}</span>
              {stats.earningsGrowth > 0 ? (
                <span className="flex items-center text-sm text-green-600">
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                  {stats.earningsGrowth}%
                </span>
              ) : (
                <span className="flex items-center text-sm text-red-600">
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                  {Math.abs(stats.earningsGrowth)}%
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Bookings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full">
              <CalendarIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 ml-4">
              <h2 className="text-sm font-medium text-gray-500">Total Bookings</h2>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1 text-yellow-500" />
                <span className="text-gray-500">Pending:</span>
                <span className="ml-1 font-medium text-gray-900">{stats.pendingBookings}</span>
              </div>
              <div className="flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-gray-500">Completion:</span>
                <span className="ml-1 font-medium text-gray-900">{stats.completionRate}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Rating Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full">
              <StarIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1 ml-4">
              <h2 className="text-sm font-medium text-gray-500">Rating</h2>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.averageRating.toFixed(1)}</p>
                <p className="ml-1 text-sm text-gray-500">/5</p>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(stats.averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-500">
                Based on {stats.totalReviews || 0} reviews
              </span>
            </div>
          </div>
        </motion.div>

        {/* Services Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
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
              <span className="font-medium text-gray-900">{stats.activeServices}</span>
              <span className="text-gray-500 ml-3">Inactive:</span>
              <span className="font-medium text-gray-900">{stats.totalServices - stats.activeServices}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Areas */}
      <div className="mt-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Upcoming Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Bookings</h2>
                <p className="mt-1 text-sm text-gray-500">Your next scheduled appointments</p>
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
                      <th
                        scope="col"
                        className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(myBookings || []).slice(0, 5).map((booking) => (
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
                              <div className="text-sm text-gray-500">{booking.client.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.service.title}</div>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <a href={`/provider/bookings/${booking.id}`} className="text-amber-600 hover:text-amber-900 mr-3">
                            View
                          </a>
                          {booking.status === 'pending' && (
                            <a href={`/provider/bookings/${booking.id}/confirm`} className="text-green-600 hover:text-green-900">
                              Confirm
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!myBookings || myBookings.length === 0) && (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          No upcoming bookings
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="py-3 text-center border-t border-gray-200">
                <a href="/provider/bookings" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                  View all bookings →
                </a>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Booking Status Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <h2 className="text-lg font-medium text-gray-900">Booking Status</h2>
                <div className="mt-4" style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bookingStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {bookingStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value, name) => [`${value} bookings`, name]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Recent Reviews */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <h2 className="text-lg font-medium text-gray-900">Recent Reviews</h2>
                <div className="mt-4 space-y-4">
                  {(clientReviews || []).slice(0, 3).map((review) => (
                    <div key={review.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8">
                          <img
                            className="w-8 h-8 rounded-full"
                            src={review.client.avatar || `https://ui-avatars.com/api/?name=${review.client.name}&background=f59e0b&color=fff`}
                            alt={review.client.name}
                          />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{review.client.name}</div>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-xs text-gray-500">{review.created_at}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                  {(!clientReviews || clientReviews.length === 0) && (
                    <div className="text-center text-sm text-gray-500 py-4">
                      No reviews yet
                    </div>
                  )}
                </div>
                <div className="pt-4 text-center">
                  <a href="/provider/reviews" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                    View all reviews →
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Other tabs */}
        {activeTab === 'bookings' && (
          <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Bookings Management</h2>
              <p className="mt-2 text-gray-600">View and manage all your bookings</p>
              <div className="mt-4">
                <a href="/provider/bookings" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700">
                  Go to Bookings →
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Services Management</h2>
              <p className="mt-2 text-gray-600">Manage your service offerings</p>
              <div className="mt-4">
                <a href="/provider/services" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700">
                  Go to Services →
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Reviews</h2>
              <p className="mt-2 text-gray-600">View all your customer reviews</p>
              <div className="mt-4">
                <a href="/provider/reviews" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700">
                  View Reviews →
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'earnings' && (
          <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Earnings</h2>
              <p className="mt-2 text-gray-600">Track your earnings and payouts</p>
              <div className="mt-4">
                <a href="/provider/earnings" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700">
                  View Earnings →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
