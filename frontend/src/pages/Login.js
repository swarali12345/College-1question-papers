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
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES, APP_NAME } from '../constants';
import FormField from '../components/common/FormField';
import GoogleButton from '../components/common/GoogleButton';
import { Email as EmailIcon, Lock as LockIcon, Login as LoginIcon } from '@mui/icons-material';
import { styles } from '../styles/LoginStyles';
import Header from '../components/layout/Header';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isAuthenticated, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');
  
  // Remove the background styling effect that hides overflow
  useEffect(() => {
    // Clear errors when component unmounts
    return () => {
      clearError();
    };
  }, [clearError]);
  
  // Handle OAuth token from URL if present
  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    const errorMsg = searchParams.get('error');
    
    if (errorMsg) {
      setFormError(decodeURIComponent(errorMsg));
      return;
    }
    
    if (token && userId) {
      // Store the token and user data
      localStorage.setItem('token', token);
      
      // Fetch user data and redirect
      const fetchUserData = async () => {
        try {
          // Use the correct API endpoint with full URL path
          const response = await fetch(`http://localhost:5000/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            console.error('Server error:', errorData);
            throw new Error(errorData.message || 'Failed to get user data');
          }
          
          const userData = await response.json();
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify(userData.data));
          localStorage.setItem('userRole', userData.data.isAdmin ? 'admin' : 'user');
          
          // Navigate to search page
          navigate(ROUTES.SEARCH, { replace: true });
          window.location.reload(); // Force reload to update auth state
        } catch (error) {
          console.error('Error fetching user data:', error);
          setFormError('Authentication successful but failed to get user data: ' + error.message);
        }
      };
      
      fetchUserData();
    }
  }, [searchParams, navigate]);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

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
      console.log('Submitting login form:', { 
        email: formData.email, 
        passwordLength: formData.password?.length || 0 
      });
      
      const result = await login(formData);
      console.log('Login successful, redirecting user');
      
      // If we reach here, login was successful - the auth context will handle redirection
    } catch (err) {
      // Error is already set in the auth context
      console.error('Login component error handler:', err);
      
      // Display a more user-friendly message based on the error
      if (err.message && err.message.includes('internet connection')) {
        setFormError('Unable to connect to the server. Please check your internet connection.');
      } else if (err.message && err.message.includes('Invalid credentials')) {
        setFormError('The email or password you entered is incorrect. Please try again.');
      } else if (err.message) {
        setFormError(err.message);
      } else {
        setFormError('Login failed. Please try again later.');
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Header at the top of the page */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <Header />
      </Box>
      
      {/* Main content with background and form */}
      <Box 
        sx={{
          ...styles.root,
          flexGrow: 1
        }}
      >
        <Box sx={styles.mainContent}>
          <Container maxWidth="xs">
            <Paper elevation={3} sx={{
              ...styles.paper,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}>
              <SchoolIcon sx={styles.loginIcon} />
              <Typography component="h1" variant="h4" fontWeight="bold" sx={styles.title}>
                Login
              </Typography>

              {/* Show either API error or form validation error */}
              {(error || formError) && (
                <Alert severity="error" sx={styles.errorMessage}>
                  {error || formError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
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
                  sx={styles.submitButton}
                  startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                >
                  {loading ? 'Please wait...' : 'Login'}
                </Button>
                
                <Divider sx={styles.divider}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
                
                <GoogleButton 
                  disabled={loading}
                  variant="outlined"
                />

                <Box sx={styles.registerBox}>
                  <Typography variant="body2" sx={styles.secondaryText}>
                    New user?{' '}
                    <Button
                      onClick={() => navigate(ROUTES.REGISTER)}
                      sx={styles.registerButton}
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
    </Box>
  );
};

export default Login; 