import React from 'react';
import { Button } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../../contexts/AuthContext';

const GoogleButton = ({ onSuccess, onError, disabled, variant = "contained" }) => {
  const { googleLogin } = useAuth();
  
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // The accessToken from Google OAuth
        const { access_token } = tokenResponse;
        
        // Call the googleLogin function from AuthContext
        await googleLogin(access_token);
        
        // Call the external onSuccess if provided
        if (onSuccess) {
          onSuccess(tokenResponse);
        }
      } catch (error) {
        console.error('Google login error:', error);
        if (onError) {
          onError(error);
        }
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error);
      if (onError) {
        onError(error);
      }
    },
  });

  return (
    <Button
      variant={variant}
      color="primary"
      onClick={() => login()}
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