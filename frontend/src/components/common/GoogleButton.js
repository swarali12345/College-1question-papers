import React from 'react';
import { Button } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';

const GoogleButton = ({ disabled, variant = "contained" }) => {
  const handleGoogleLogin = () => {
    // Redirect to backend's Google OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Button
      variant={variant}
      color="primary"
      onClick={handleGoogleLogin}
      disabled={disabled}
      fullWidth
      startIcon={<GoogleIcon />}
      sx={{
        backgroundColor: variant === 'contained' ? '#ffffff' : 'transparent',
        color: variant === 'contained' ? '#757575' : 'inherit',
        borderColor: variant === 'outlined' ? '#4285F4' : 'transparent',
        '&:hover': {
          backgroundColor: variant === 'contained' ? '#f5f5f5' : 'rgba(66, 133, 244, 0.04)',
        },
        textTransform: 'none',
        fontWeight: 500,
        py: 1,
      }}
    >
      Sign in with Google
    </Button>
  );
};

export default GoogleButton; 