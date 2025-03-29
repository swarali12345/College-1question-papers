import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { Search as SearchIcon, Home as HomeIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import Header from '../components/layout/Header';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Header />
      
      <Container maxWidth="md" sx={{ flexGrow: 1, py: 4, display: 'flex', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <Typography
            variant="h1"
            color="primary"
            sx={{ 
              fontWeight: 'bold', 
              fontSize: { xs: '5rem', sm: '8rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            404
          </Typography>
          
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              fontWeight: 'medium',
              mb: 2
            }}
          >
            Page Not Found
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            paragraph
            sx={{ maxWidth: 500, mx: 'auto', mb: 4 }}
          >
            Oops! The page you're looking for doesn't exist or has been moved.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate(ROUTES.HOME)}
              sx={{ minWidth: 150 }}
            >
              Go Home
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<SearchIcon />}
              onClick={() => navigate(ROUTES.SEARCH)}
              sx={{ minWidth: 150 }}
            >
              Search Papers
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound; 