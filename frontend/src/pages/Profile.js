import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  Typography, 
  Avatar, 
  Button, 
  Divider,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Email as EmailIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import profileStyles from '../styles/ProfileStyles';

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Use data from auth context instead of mock data
  const [userData, setUserData] = useState({
    name: user?.name || 'User',
    email: user?.email || 'user@example.com',
    profileImage: user?.profileImage || '/images/avatars/default-avatar.jpg',
  });
  
  const [formData, setFormData] = useState({...userData});
  
  // Update local state when user data changes in context
  useEffect(() => {
    if (user) {
      const newUserData = {
        name: user.name || 'User',
        email: user.email || 'user@example.com',
        profileImage: user.profileImage || '/images/avatars/default-avatar.jpg',
      };
      setUserData(newUserData);
      setFormData(newUserData);
    }
  }, [user]);
  
  const handleEditToggle = () => {
    if (editMode) {
      // Cancel editing
      setFormData({...userData});
    }
    setEditMode(!editMode);
    setSuccess(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email
      });
      
      setEditMode(false);
      setSuccess(true);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };
  
  return (
    <Container maxWidth="sm" sx={profileStyles.profileContainer}>
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Your profile has been updated successfully!
        </Alert>
      )}
      
      <Paper sx={profileStyles.paper}>
        <Box sx={profileStyles.avatarContainer}>
          <Avatar 
            src={userData.profileImage} 
            alt={userData.name}
            sx={profileStyles.avatar}
          />
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{userData.name}</Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={profileStyles.userEmail}
          >
            <EmailIcon fontSize="small" sx={profileStyles.emailIcon} />
            {userData.email}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Box component="form" onSubmit={handleSubmit}>
          {editMode ? (
            <>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                size="small"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                variant="outlined"
                size="small"
              />
              
              <Box sx={profileStyles.editButtonContainer}>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleEditToggle}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  type="submit"
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={profileStyles.buttonContainer}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={handleEditToggle}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 