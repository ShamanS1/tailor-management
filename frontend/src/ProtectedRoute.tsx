// src/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useUserContext } from './UserContext';

interface ProtectedRouteProps {
  role?: 'customer' | 'tailor' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role }) => {
  const { user } = useUserContext();

  if (!user) {
    // Redirect unauthenticated users to login
    return <Navigate to="/login" />;
  }

  // Check if the user has the required role
  if (role && user.role !== role) {
    // Redirect to a page based on user type (e.g., their home or dashboard page)
    return <Navigate to={`/${user.role}home`} />;
  }

  // Allow access if authenticated and has the right role
  return <Outlet />;
};

export default ProtectedRoute;
