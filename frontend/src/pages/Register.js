import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  useTheme,
  useMediaQuery,
  InputAdornment,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Menu as MenuIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { styles } from '../styles/RegisterStyles';

const Register = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/users/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userRole', response.data.user.role);
        navigate('/user-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box sx={styles.root}>
      {/* Header */}
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar>
          <SchoolIcon sx={styles.schoolIcon} />
          <Typography variant="h6" component="div" sx={styles.toolbarTitle}>
            SIT PYQ Papers
          </Typography>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                edge="end"
              >
                <MenuIcon />
              </IconButton>
              {mobileMenuOpen && (
                <Box sx={styles.mobileMenu}>
                  <Button fullWidth color="inherit" href="/" sx={styles.mobileMenuButton}>Home</Button>
                  <Button fullWidth color="inherit" href="/admin" sx={styles.mobileMenuButton}>Admin Panel</Button>
                  <Button fullWidth color="inherit" href="/login" sx={styles.mobileMenuButton}>Login</Button>
                </Box>
              )}
            </>
          ) : (
            <Box>
              <Button color="inherit" href="/">Home</Button>
              <Button color="inherit" href="/admin">Admin Panel</Button>
              <Button color="inherit" href="/login">Login</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={styles.mainContent}>
        <Container maxWidth="xs">
          <Paper elevation={3} sx={styles.paper}>
            <SchoolIcon sx={styles.registerIcon} />
            <Typography
              component="h1"
              variant="h4"
              sx={styles.title}
            >
              Register
            </Typography>

            {error && (
              <Typography 
                color="error" 
                sx={styles.errorMessage}
              >
                {error}
              </Typography>
            )}

            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={styles.form}
            >
              <TextField
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={styles.iconColor} />
                    </InputAdornment>
                  ),
                }}
                sx={styles.textField}
              />
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={styles.iconColor} />
                    </InputAdornment>
                  ),
                }}
                sx={styles.textField}
              />
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={styles.iconColor} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon sx={styles.iconColor} />
                        ) : (
                          <VisibilityIcon sx={styles.iconColor} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={styles.textField}
              />
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={styles.iconColor} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleConfirmPasswordVisibility}
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOffIcon sx={styles.iconColor} />
                        ) : (
                          <VisibilityIcon sx={styles.iconColor} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={styles.textField}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={styles.submitButton}
              >
                Register
              </Button>

              <Box sx={styles.loginBox}>
                <Typography variant="body2" sx={styles.secondaryText}>
                  Already have an account?{' '}
                  <Button
                    onClick={() => navigate('/login')}
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
  );
};

export default Register; 