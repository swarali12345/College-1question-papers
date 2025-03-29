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
  Grid
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants';
import FormField from '../components/common/FormField';
import GoogleButton from '../components/common/GoogleButton';
import { styles } from '../styles/RegisterStyles';
import Header from '../components/layout/Header';

const Register = () => {
  const navigate = useNavigate();
  const { register, googleLogin, loading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Remove background styling that hides the header
  useEffect(() => {
    // Clear errors when component unmounts
    return () => {
      clearError && clearError();
    };
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user types
    setFormError('');
    clearError && clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Registration error:', err);
      setFormError(err.message || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // For now, just show this is not implemented
      // In a real implementation, you would use a Google OAuth library
      setFormError('Google signup is not yet implemented in this demo');
      setTimeout(() => setGoogleLoading(false), 1000);
      
      // Actual implementation would be something like:
      // const response = await googleLogin(googleTokenId);
    } catch (err) {
      console.error('Google signup error:', err);
    } finally {
      setGoogleLoading(false);
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
              <SchoolIcon sx={styles.registerIcon} />
              <Typography component="h1" variant="h4" sx={styles.title}>
                Register
              </Typography>

              {/* Show either API error or form validation error */}
              {(error || formError) && (
                <Alert severity="error" sx={styles.errorMessage}>
                  {error || formError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={styles.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormField
                      name="name"
                      label="Full Name"
                      value={formData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      autoFocus
                      icon={PersonIcon}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormField
                      name="email"
                      label="Email"
                      value={formData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      icon={EmailIcon}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="password"
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      icon={LockIcon}
                      showPassword={showPassword}
                      onTogglePassword={() => setShowPassword(!showPassword)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormField
                      name="confirmPassword"
                      label="Confirm"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                      icon={LockIcon}
                      showPassword={showConfirmPassword}
                      onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </Grid>
                </Grid>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={styles.submitButton}
                  startIcon={loading ? <CircularProgress size={20} /> : <PersonAddIcon />}
                >
                  {loading ? 'Please wait...' : 'Register'}
                </Button>
                
                <Divider sx={styles.divider}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
                
                <GoogleButton 
                  onClick={handleGoogleLogin}
                  loading={googleLoading}
                  disabled={loading}
                />
                
                <Box sx={styles.loginBox}>
                  <Typography variant="body2" sx={styles.secondaryText}>
                    Existing user?{' '}
                    <Button
                      onClick={() => navigate(ROUTES.LOGIN)}
                      sx={styles.loginButton}
                    >
                      Login
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

export default Register; 