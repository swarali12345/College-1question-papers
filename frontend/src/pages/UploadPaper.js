import React from 'react';
import { Container, Typography, Box, Paper, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import PaperUpload from '../components/admin/PaperUpload';

const UploadPaper = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user is not an admin, show unauthorized message
  if (!isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Unauthorized Access
          </Alert>
          <Typography variant="h5" gutterBottom>
            Admin Access Required
          </Typography>
          <Typography variant="body1">
            You need administrator privileges to upload papers.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Upload Previous Year Papers
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Use this form to upload previous year question papers. Please make sure the information is accurate and the PDF is legible.
        </Typography>
      </Box>
      
      <PaperUpload />
    </Container>
  );
};

export default UploadPaper; 