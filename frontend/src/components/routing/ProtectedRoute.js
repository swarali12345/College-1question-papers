import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You could render a loading spinner here
    return <div>Loading...</div>;
  }

  // Check if user is logged in
  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" />;
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute; 