import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AdminDashboard from './Dashboard/AdminDashboard';
import ProviderDashboard from './Dashboard/ProviderDashboard';
import ClientDashboard from './Dashboard/ClientDashboard';

export default function Dashboard(props) {
  const { auth } = props;
  const userRole = auth.user.role; // assuming role is stored in auth.user.role

  // Rendering dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'admin':
        return <AdminDashboard {...props} />;
      case 'provider':
        return <ProviderDashboard {...props} />;
      case 'client':
        return <ClientDashboard {...props} />;
      default:
        return <ClientDashboard {...props} />;
    }
  }

  return (
    <AuthenticatedLayout>
      <Head title={`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard`} />
      <div className="py-6">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Dashboard
          </h1>
        </div>
        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
          {renderDashboard()}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
