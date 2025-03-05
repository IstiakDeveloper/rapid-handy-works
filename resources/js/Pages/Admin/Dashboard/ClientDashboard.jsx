import React, { useState } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function ClientDashboard({
  clientStats,
  myBookings,
  favoriteProviders,
  recentServices,
  upcomingBookings
}) {
  const [activeTab, setActiveTab] = useState('overview');

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(value);
  };

  // Default values for stats
  const stats = clientStats || {
    totalSpent: 0,
    totalBookings: 0,
    completedBookings: 0,
    upcomingBookings: 0,
    favoriteProviders: 0
  };

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
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'favorites'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Favorites
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === 'explore'
                ? 'text-amber-600 border-b-2 border-amber-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Explore Services
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Spent Card */}
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
              <h2 className="text-sm font-medium text-gray-500">Total Spent</h2>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            On {stats.totalBookings} service bookings
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
              <h2 className="text-sm font-medium text-gray-500">Bookings</h2>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-gray-500">Completed:</span>
                <span className="ml-1 font-medium text-gray-900">{stats.completedBookings}</span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-1 text-blue-500" />
                <span className="text-gray-500">Upcoming:</span>
                <span className="ml-1 font-medium text-gray-900">{stats.upcomingBookings}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Favorite Providers Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm"
        >
          <div className="flex items-center">
            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full">
              <StarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 ml-4">
              <h2 className="text-sm font-medium text-gray-500">Favorite Providers</h2>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stats.favoriteProviders}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <a href="/client/favorites" className="text-amber-600 hover:text-amber-500">
              Manage your favorites →
            </a>
          </div>
        </motion.div>

        {/* Quick Actions Card */}
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
              <h2 className="text-sm font-medium text-gray-500">Quick Actions</h2>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <a href="/services" className="block px-4 py-2 text-sm text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-md">
              Book a new service
            </a>
            <a href="/client/bookings" className="block px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md">
              View your bookings
            </a>
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
                        Service
                      </th>
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
                    {(upcomingBookings || []).slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.service.title}</div>
                          <div className="text-sm text-gray-500">{booking.service.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8">
                              <img
                                className="w-8 h-8 rounded-full"
                                src={booking.provider.avatar || `https://ui-avatars.com/api/?name=${booking.provider.name}&background=f59e0b&color=fff`}
                                alt={booking.provider.name}
                              />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{booking.provider.name}</div>
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <StarIcon
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= booking.provider.rating ? 'text-yellow-400' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
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
                          <a href={`/client/bookings/${booking.id}`} className="text-amber-600 hover:text-amber-900 mr-3">
                            View
                          </a>
                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <a href={`/client/bookings/${booking.id}/cancel`} className="text-red-600 hover:text-red-900">
                              Cancel
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
                    {(!upcomingBookings || upcomingBookings.length === 0) && (
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
                <a href="/client/bookings" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                  View all bookings →
                </a>
              </div>
            </motion.div>

            {/* Favorite Providers and Recent Services */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Favorite Providers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Favorite Providers</h2>
                  <p className="mt-1 text-sm text-gray-500">Your trusted service providers</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {(favoriteProviders || []).slice(0, 4).map((provider) => (
                    <div key={provider.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12">
                          <img
                            className="w-12 h-12 rounded-full"
                            src={provider.avatar || `https://ui-avatars.com/api/?name=${provider.name}&background=f59e0b&color=fff`}
                            alt={provider.name}
                          />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">{provider.name}</h3>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <StarIcon
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= provider.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-xs text-gray-500">({provider.reviews_count})</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">{provider.category}</p>
                        </div>
                        <div className="flex-1 flex justify-end">
                          <a href={`/providers/${provider.id}`} className="text-amber-600 hover:text-amber-900 flex items-center">
                            <span className="text-sm">View</span>
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!favoriteProviders || favoriteProviders.length === 0) && (
                    <div className="p-6 text-center text-sm text-gray-500">
                      You haven't added any favorite providers yet
                    </div>
                  )}
                </div>
                <div className="py-3 text-center border-t border-gray-200">
                  <a href="/client/favorites" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                    Manage favorites →
                  </a>
                </div>
              </motion.div>

              {/* Recent Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm"
              >
                <div className="px-6 py-5 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Recently Viewed Services</h2>
                  <p className="mt-1 text-sm text-gray-500">Services you've checked out recently</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {(recentServices || []).slice(0, 4).map((service) => (
                    <div key={service.id} className="p-6 hover:bg-gray-50">
                      <div className="flex">
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-md overflow-hidden">
                          <img
                            src={service.image || 'https://via.placeholder.com/150'}
                            alt={service.name}
                            className="w-16 h-16 object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{service.description}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">{formatCurrency(service.price)}</span>
                            </div>
                            <a href={`/services/${service.id}`} className="text-amber-600 hover:text-amber-900 flex items-center">
                              <span className="text-sm">View</span>
                              <ArrowRightIcon className="w-4 h-4 ml-1" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!recentServices || recentServices.length === 0) && (
                    <div className="p-6 text-center text-sm text-gray-500">
                      No recently viewed services
                    </div>
                  )}
                </div>
                <div className="py-3 text-center border-t border-gray-200">
                  <a href="/services" className="text-sm font-medium text-amber-600 hover:text-amber-500">
                    Explore services →
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">My Bookings</h2>
              <p className="mt-2 text-gray-600">View and manage all your service bookings</p>
              <div className="mt-4">
                <a href="/client/bookings" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700">
                  Go to My Bookings →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">My Favorites</h2>
              <p className="mt-2 text-gray-600">Manage your favorite service providers</p>
              <div className="mt-4">
                <a href="/client/favorites" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700">
                  Go to My Favorites →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Explore Services Tab */}
        {activeTab === 'explore' && (
          <div className="p-8 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="text-center">
              <h2 className="text-lg font-medium text-gray-900">Explore Services</h2>
              <p className="mt-2 text-gray-600">Find and book services from our top-rated providers</p>
              <div className="mt-4">
                <a href="/services" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700">
                  Browse All Services →
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
