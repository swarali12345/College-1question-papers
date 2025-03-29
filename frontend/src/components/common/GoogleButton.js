import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import GoogleIcon from '../../assets/icons/GoogleIcon';

const GoogleButton = ({ onClick, loading, disabled }) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      sx={{
        py: { xs: 1, sm: 1.2 },
        borderColor: '#dddddd',
        color: 'text.primary',
        backgroundColor: 'background.paper',
        '&:hover': {
          backgroundColor: '#f5f5f5',
          borderColor: '#cccccc',
        },
        fontSize: { xs: '0.9rem', sm: '1rem' },
        textTransform: 'none',
      }}
      onClick={onClick}
      disabled={disabled || loading}
      startIcon={
        loading ? (
          <CircularProgress size={20} color="primary" />
        ) : (
          <GoogleIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
        )
      }
    >
      {loading ? 'Connecting' : 'Sign in with Google'}
    </Button>
  );
};

export default GoogleButton; 