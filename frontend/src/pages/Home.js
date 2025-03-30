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
                  sx={homeStyles.tagChip}
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
            
            {/* Search Bar */}
            <Fade in={visible} timeout={2000} style={{ transitionDelay: '900ms' }}>
              <Paper elevation={0} sx={homeStyles.searchBar}>
                <TextField
                  fullWidth
                  placeholder="Search by Year and Semester"
                  variant="standard"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  color="primary" 
                  variant="contained"
                  sx={homeStyles.searchButton}
                  component={RouterLink}
                  to="/search"
                > 
                  Search
                </Button>
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
