import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  InputAdornment,
  Paper,
  useTheme,
  useMediaQuery,
  Divider,
  Stack,
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
  CloudDownload as DownloadIcon,
  MenuBook as MenuBookIcon,
  Psychology as PsychologyIcon,
  ArrowForward as ArrowForwardIcon,
  Filter as FilterIcon,
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { ROUTES, PAPER_CATEGORIES, APP_NAME } from '../constants';
import { paperService } from '../services/api';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPapers, setFeaturedPapers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchFeaturedPapers = async () => {
      try {
        setLoading(true);
        // In a real app, this would fetch from your API
        // For now, let's create some fake data
        const fakePapers = [
          {
            _id: '1',
            title: 'Data Structures and Algorithms',
            subject: 'Computer Science',
            department: 'Computer Science',
            examType: 'End-Semester',
            year: 'Second Year',
            downloads: 120,
            views: 230,
          },
          {
            _id: '2',
            title: 'Digital Electronics',
            subject: 'Electronics',
            department: 'Electronics',
            examType: 'Mid-Semester',
            year: 'First Year',
            downloads: 95,
            views: 180,
          },
          {
            _id: '3',
            title: 'Computer Networks',
            subject: 'Networks',
            department: 'Information Technology',
            examType: 'End-Semester',
            year: 'Third Year',
            downloads: 150,
            views: 320,
          },
          {
            _id: '4',
            title: 'Operating Systems',
            subject: 'OS',
            department: 'Computer Science',
            examType: 'End-Semester',
            year: 'Second Year',
            downloads: 110,
            views: 200,
          },
        ];
        
        setFeaturedPapers(fakePapers);
      } catch (err) {
        console.error('Error fetching featured papers:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedPapers();
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH}?query=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handlePaperClick = (paperId) => {
    navigate(`/papers/${paperId}`);
  };
  
  // Features to display in the "How It Works" section
  const features = [
    {
      icon: <SearchIcon color="primary" fontSize="large" />,
      title: 'Search Papers',
      description: 'Easily find papers by subject, course, year, or keywords.'
    },
    {
      icon: <MenuBookIcon color="primary" fontSize="large" />,
      title: 'View Online',
      description: 'Preview papers directly in your browser without downloading.'
    },
    {
      icon: <PsychologyIcon color="primary" fontSize="large" />,
      title: 'Prepare Better',
      description: 'Study previous year papers to understand exam patterns and prepare effectively.'
    }
  ];
  
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box 
        sx={{
          background: `linear-gradient(rgba(139, 0, 0, 0.85), rgba(139, 0, 0, 0.95))`,
          color: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  mb: 2
                }}
              >
                Your Ultimate College Question Paper Repository
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4, 
                  fontSize: { xs: '1rem', md: '1.25rem' },
                  opacity: 0.9
                }}
              >
                Access previous year question papers to ace your exams and boost your academic performance
              </Typography>
              
              <Paper 
                component="form" 
                onSubmit={handleSearch}
                elevation={3}
                sx={{ 
                  p: 0.5,
                  display: 'flex',
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }}
              >
                <TextField
                  fullWidth
                  placeholder="Search for papers by subject, code, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ 
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large"
                  sx={{ 
                    px: 4,
                    fontSize: '1rem',
                    height: '100%',
                    borderRadius: '8px'
                  }}
                >
                  Search
                </Button>
              </Paper>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, flexWrap: 'wrap', gap: 1 }}>
                <Typography variant="body2" sx={{ mr: 1, color: 'rgba(255,255,255,0.8)' }}>
                  Popular subjects:
                </Typography>
                {["Computer Science", "Electronics", "Mechanical"].map((subject) => (
                  <Chip
                    key={subject}
                    label={subject}
                    size="small"
                    clickable
                    onClick={() => navigate(`${ROUTES.SEARCH}?department=${encodeURIComponent(subject)}`)}
                    sx={{ 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' }
                    }}
                  />
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Paper 
                elevation={6}
                sx={{
                  p: 3, 
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  borderRadius: 4,
                  height: '100%',
                  minHeight: 300,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h5" fontWeight="bold" color="text.primary">
                    {APP_NAME}
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph color="text.secondary">
                  <b>Streamline your exam preparation</b> with our comprehensive collection of past papers from all departments.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                    Browse by department:
                  </Typography>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(ROUTES.SEARCH)}
                    sx={{ ml: 'auto' }}
                  >
                    View All
                  </Button>
                </Box>
                
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {PAPER_CATEGORIES.DEPARTMENTS.slice(0, 6).map((dept) => (
                    <Grid item xs={6} key={dept}>
                      <Chip
                        label={dept}
                        size="small"
                        variant="outlined"
                        clickable
                        onClick={() => navigate(`${ROUTES.SEARCH}?department=${encodeURIComponent(dept)}`)}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.paper', py: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">500+</Typography>
                <Typography variant="body1" color="text.secondary">Question Papers</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">8</Typography>
                <Typography variant="body1" color="text.secondary">Departments</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">4</Typography>
                <Typography variant="body1" color="text.secondary">Years Coverage</Typography>
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary" fontWeight="bold">1000+</Typography>
                <Typography variant="body1" color="text.secondary">Students Served</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Featured Papers Section */}
      <Box sx={{ py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" fontWeight="bold">
              Featured Papers
            </Typography>
            <Button 
              variant="outlined" 
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(ROUTES.SEARCH)}
            >
              View All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {featuredPapers.map((paper) => (
              <Grid item xs={12} sm={6} md={3} key={paper._id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardActionArea 
                    sx={{ flexGrow: 1 }}
                    onClick={() => handlePaperClick(paper._id)}
                  >
                    <CardContent>
                      <Typography 
                        variant="subtitle1" 
                        component="div" 
                        fontWeight="medium"
                        gutterBottom
                        noWrap
                      >
                        {paper.title}
                      </Typography>
                      
                      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                        <Chip 
                          label={paper.department} 
                          size="small" 
                          sx={{ fontSize: '0.7rem' }}
                        />
                        <Chip 
                          label={paper.examType} 
                          size="small" 
                          sx={{ fontSize: '0.7rem' }}
                        />
                      </Stack>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {paper.year}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DownloadIcon 
                            fontSize="small" 
                            sx={{ fontSize: '1rem', color: 'text.secondary', mr: 0.5 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {paper.downloads}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      
      {/* Browse Categories Section */}
      <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
            Browse by Categories
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Find question papers specifically tailored to your needs
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Departments
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {PAPER_CATEGORIES.DEPARTMENTS.map((dept) => (
                    <Grid item xs={6} key={dept}>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        sx={{ 
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 0.5
                        }}
                        onClick={() => navigate(`${ROUTES.SEARCH}?department=${encodeURIComponent(dept)}`)}
                      >
                        {dept}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Years
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {PAPER_CATEGORIES.YEARS.map((year) => (
                    <Grid item xs={6} key={year}>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        sx={{ 
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 0.5
                        }}
                        onClick={() => navigate(`${ROUTES.SEARCH}?year=${encodeURIComponent(year)}`)}
                      >
                        {year}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Exam Types
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {PAPER_CATEGORIES.EXAM_TYPES.map((type) => (
                    <Grid item xs={6} key={type}>
                      <Button
                        variant="text"
                        size="small"
                        fullWidth
                        sx={{ 
                          justifyContent: 'flex-start',
                          textTransform: 'none',
                          py: 0.5
                        }}
                        onClick={() => navigate(`${ROUTES.SEARCH}?examType=${encodeURIComponent(type)}`)}
                      >
                        {type}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h4" 
            component="h2" 
            align="center" 
            fontWeight="bold"
            gutterBottom
          >
            How It Works
          </Typography>
          <Typography 
            variant="subtitle1" 
            color="text.secondary" 
            align="center" 
            paragraph
            sx={{ mb: 6 }}
          >
            Simple steps to boost your exam preparation
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center' 
                }}>
                  <Box 
                    sx={{ 
                      mb: 2, 
                      p: 2, 
                      bgcolor: 'rgba(139, 0, 0, 0.08)', 
                      borderRadius: '50%', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center' 
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button 
              variant="contained" 
              size="large" 
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate(ROUTES.REGISTER)}
              sx={{ px: 4 }}
            >
              Get Started
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{
          py: 5, 
          bgcolor: 'primary.dark', 
          color: 'rgba(255,255,255,0.9)',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ mr: 1, fontSize: 28 }} />
                <Typography variant="h6" fontWeight="bold">
                  {APP_NAME}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                Your ultimate college question paper repository to help you succeed in exams.
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate(ROUTES.HOME)}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', opacity: 0.8 }}
                >
                  Home
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate(ROUTES.SEARCH)}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', opacity: 0.8 }}
                >
                  Search Papers
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate(ROUTES.REGISTER)}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', opacity: 0.8 }}
                >
                  Register
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate(ROUTES.LOGIN)}
                  sx={{ justifyContent: 'flex-start', textTransform: 'none', opacity: 0.8 }}
                >
                  Login
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                Have questions or need assistance?
              </Typography>
              <Button 
                variant="outlined" 
                color="inherit" 
                sx={{ mt: 1, borderColor: 'rgba(255,255,255,0.3)' }}
              >
                Contact Support
              </Button>
            </Grid>
          </Grid>
          <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.1)' }} />
          <Typography variant="body2" align="center" sx={{ opacity: 0.6 }}>
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 