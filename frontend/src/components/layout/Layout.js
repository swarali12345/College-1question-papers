import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout component that wraps the application content
 * Provides consistent structure with header, main content area, and footer
 */
const Layout = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <Container component="main" sx={{ 
        flexGrow: 1, 
        py: 4,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </Container>
      
      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Layout; 