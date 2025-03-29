import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { USER_ROLES } from '../../constants';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You could render a loading spinner here
    return <div>Loading...</div>;
  }

  // Check if user is logged in and is an admin
  if (!user || user.role !== USER_ROLES.ADMIN) {
    // Redirect to login if not authenticated or not admin
    return <Navigate to="/login" />;
  }

  // Render the protected component
  return children;
};

export default AdminRoute; 