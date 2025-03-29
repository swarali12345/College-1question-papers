import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a loading spinner when authentication state is being checked
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is logged in and is an admin
  if (!user || !user.isAdmin) {
    // Redirect to login if not authenticated or not admin
    return <Navigate to="/login" />;
  }

  // Render the protected component
  return children;
};

export default AdminRoute; 