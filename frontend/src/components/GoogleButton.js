import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const GoogleButton = ({ onClick, disabled, loading, text = 'Sign in with Google' }) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
      onClick={onClick}
      disabled={disabled || loading}
      sx={{
        mt: 2,
        mb: 2,
        py: 1.2,
        bgcolor: 'white',
        color: '#757575',
        border: '1px solid green',
        '&:hover': {
          bgcolor: '#f8f9fa',
          borderColor: '#dadce0',
        },
        textTransform: 'none',
        fontSize: '0.9rem',
      }}
    >
      {loading ? 'Connecting...' : text}
    </Button>
  );
};

export default GoogleButton; 