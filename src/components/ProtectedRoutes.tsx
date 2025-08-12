// src/components/ProtectedRoutes.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoutes = () => {
  const { user, loading } = useAuth();

  // Show a loading state while authentication status is being determined
  if (loading) {
    console.log('ProtectedRoutes: loading auth state...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 font-inter antialiased">
        <div className="text-gray-700 text-xl">Loading authentication...</div>
      </div>
    );
  }

  // Redirect to the sign-in page if not logged in
  if (!user) {
    console.log('ProtectedRoutes: no user, redirecting to /signin');
    return <Navigate to="/signin" replace />;
  }

  // If a user is authenticated, render the child routes
  console.log('ProtectedRoutes: user present, rendering protected content');
  return <Outlet />;
};

export default ProtectedRoutes;