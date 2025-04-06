import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Button,
  TextField,
  InputAdornment,
  Paper,
  Stack,
  useTheme,
  Grid,
  Fade,
  Zoom,
  Divider,
  Avatar,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  LocalLibrary as LocalLibraryIcon,
  EmojiObjects as EmojiObjectsIcon,
  Speed as SpeedIcon,
  Feedback as FeedbackIcon,
} from '@mui/icons-material';
import homeStyles from '../styles/HomeStyles';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const theme = useTheme();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    setVisible(true);
    
    // Remove any body margin/padding to ensure full coverage
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Reset when component unmounts
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <Box>
      {/* Hero Section with Background */}
      <Box sx={homeStyles.hero}>
        <Container maxWidth="lg">
          <Box sx={homeStyles.heroContent}>
            <Fade in={visible} timeout={1000}>
              <Box sx={{ mb: 4 }}>
                <Avatar 
                  sx={homeStyles.logoAvatar}
                >
                  <SchoolIcon sx={{ fontSize: 40 }} />
                </Avatar>
              </Box>
            </Fade>

            

            <Zoom in={visible} style={{ transitionDelay: '300ms' }}>
              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontWeight: 900,
                  letterSpacing: '1px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.4)',
                  mb: 3,
                  backgroundImage: 'linear-gradient(45deg, #fff, #f5f5f5)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                Previous Year Question Papers of SIT Nagpur
              </Typography>
            </Zoom>
            
            <Fade in={visible} timeout={1500} style={{ transitionDelay: '600ms' }}>
              <Box sx={homeStyles.taglineContainer}>
                <Chip 
                  label="Exam season can be tough, so here's something to make it a little easier." 
                  sx={{
                    ...homeStyles.tagChip,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    padding: { xs: '8px 12px', sm: '10px 16px' },
                    fontWeight: 500,
                    '& .MuiChip-label': {
                      px: { xs: 1, sm: 2 }
                    }
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'medium',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    maxWidth: '800px',
                    lineHeight: 1.6,
                    mt: 2,
                  }}
                >
                  
                </Typography>
              </Box>
            </Fade>
            
            {/* Search Secret Button */}
            <Fade in={visible} timeout={2000} style={{ transitionDelay: '900ms' }}>
              <Paper 
                elevation={0} 
                sx={{
                  ...homeStyles.searchBar,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)'
                  },
                  transition: 'all 0.3s ease'
                }}
                component={RouterLink}
                to="/search"
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%', 
                  px: 2,
                  py: 1 
                }}>
                  <SearchIcon color="primary" sx={{ mr: 1 }} />
                  <Typography 
                    color="text.secondary" 
                    sx={{ 
                      flexGrow: 1, 
                      opacity: 0.8 
                    }}
                  >
                    Search by Year and Semester
                  </Typography>
                </Box>
              </Paper>
            </Fade>
            
            <Divider sx={homeStyles.divider} />
            
            {/* Login/Register Buttons */}
            <Fade in={visible} timeout={3000} style={{ transitionDelay: '1500ms' }}>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }}
                spacing={3} 
                sx={homeStyles.actionButtons}
                justifyContent="center"
                alignItems="center"
              >
                {!isAuthenticated ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={homeStyles.loginButton}
                      component={RouterLink}
                      to="/login"
          
                    >
                      Login
                    </Button>
                    <Button
                      variant="outlined"
                      sx={homeStyles.signupButton}
                      component={RouterLink}
                      to="/register"
                    >
                      Sign Up
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={homeStyles.loginButton}
                      component={RouterLink}
                      to="/search"
                      startIcon={<SearchIcon />}
                    >
                      Browse Papers
                    </Button>
                    <Button
                      variant="outlined"
                      sx={homeStyles.signupButton}
                      component={RouterLink}
                      to="/feedback"
                      startIcon={<FeedbackIcon />}
                    >
                      Give Feedback
                    </Button>
                  </>
                )}
              </Stack>
            </Fade>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
