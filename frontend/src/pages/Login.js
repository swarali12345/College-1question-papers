import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Button,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES, APP_NAME } from '../constants';
import Header from '../components/Header';
import FormField from '../components/FormField';
import GoogleButton from '../components/GoogleButton';
import { Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, isAuthenticated, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);
  
  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user types
    setFormError('');
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validation
    if (!formData.email || !formData.password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      await login(formData);
    } catch (err) {
      // Error is already set in the auth context
      console.error('Login error:', err);
    }
  };
  
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // For now, just show this is not implemented
      // In a real implementation, you would use a Google OAuth library
      setFormError('Google login is not yet implemented in this demo');
      setTimeout(() => setGoogleLoading(false), 1000);
      
      // Actual implementation would be something like:
      // const response = await googleLogin(googleTokenId);
    } catch (err) {
      console.error('Google login error:', err);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.default' 
    }}>
      <Header />

      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        p: 2
      }}>
        <Container maxWidth="xs">
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}
          >
            <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography component="h1" variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
              Login to {APP_NAME}
            </Typography>

            {/* Show either API error or form validation error */}
            {(error || formError) && (
              <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
                {error || formError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              <FormField
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                autoFocus
                icon={EmailIcon}
              />
              <FormField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                icon={LockIcon}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
              
              <GoogleButton 
                onClick={handleGoogleLogin}
                loading={googleLoading}
                disabled={loading}
              />

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button
                    onClick={() => navigate(ROUTES.REGISTER)}
                    sx={{ p: 0, textTransform: 'none', fontWeight: 600 }}
                  >
                    Register
                  </Button>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Login; 