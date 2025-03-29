import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as PaperIcon,
  People as UsersIcon,
  Feedback as FeedbackIcon,
  CloudUpload as UploadIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../constants';

// Import admin components
import DashboardOverview from '../components/admin/DashboardOverview';
import PapersList from '../components/admin/PapersList';
import PaperUpload from '../components/admin/PaperUpload';
import UsersList from '../components/admin/UsersList';
import FeedbackList from '../components/admin/FeedbackList';

// TabPanel component for handling tab content
const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is admin, if not redirect
  useEffect(() => {
    setLoading(true);
    
    // Redirect non-admin users
    if (user && user.role !== USER_ROLES.ADMIN) {
      navigate('/');
      return;
    }
    
    // If authentication is complete and user is admin, proceed
    if (user && user.role === USER_ROLES.ADMIN) {
      setLoading(false);
    }
    
    // If still authenticating, wait
    if (!user) {
      const timer = setTimeout(() => {
        setError('Authentication timeout. Please try logging in again.');
        navigate('/login');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [user, navigate]);

  // Check URL parameters for tab selection
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam !== null) {
      const tabIndex = parseInt(tabParam, 10);
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex <= 4) {
        setTabValue(tabIndex);
      }
    }
  }, [location]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Update URL with tab parameter without causing a navigation
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', newValue);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, borderTop: `4px solid ${theme.palette.primary.main}` }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back, {user?.name}! Manage your application content and users from this dashboard.
        </Typography>
      </Paper>
      
      <Paper sx={{ width: '100%', bgcolor: 'background.paper', mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="admin dashboard tabs"
        >
          <Tab icon={<DashboardIcon />} label="Overview" iconPosition="start" />
          <Tab icon={<PaperIcon />} label="Papers" iconPosition="start" />
          <Tab icon={<UploadIcon />} label="Upload" iconPosition="start" />
          <Tab icon={<UsersIcon />} label="Users" iconPosition="start" />
          <Tab icon={<FeedbackIcon />} label="Feedback" iconPosition="start" />
        </Tabs>
      </Paper>

      <TabPanel value={tabValue} index={0}>
        <DashboardOverview />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <PapersList />
      </TabPanel>
      
      <TabPanel value={tabValue} index={2}>
        <PaperUpload />
      </TabPanel>
      
      <TabPanel value={tabValue} index={3}>
        <UsersList />
      </TabPanel>
      
      <TabPanel value={tabValue} index={4}>
        <FeedbackList />
      </TabPanel>
    </Container>
  );
};

export default AdminDashboard; 