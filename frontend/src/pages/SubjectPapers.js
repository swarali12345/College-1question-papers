import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  ArrowBack as ArrowBackIcon,
  NavigateNext as NavigateNextIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { paperService, subjectService } from '../services';
import { ROUTES } from '../constants';

const SubjectPapers = () => {
  const { year, semester, subjectId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState(null);
  const [papers, setPapers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjectAndPapers = async () => {
      setLoading(true);
      setError('');
      
      try {
        // First, get the subject details
        const subjectResponse = await subjectService.getSubjectById(subjectId);
        setSubject(subjectResponse.data);
        
        // Then, fetch papers for this subject
        const papersResponse = await paperService.getPapersBySubject(
          subjectResponse.data.name,
          year,
          semester,
          1,
          100
        );
        
        console.log('Papers response:', papersResponse);
        // API returns { success: true, count: n, data: [...papers] }
        if (papersResponse && papersResponse.success && papersResponse.data) {
          setPapers(papersResponse.data);
        } else {
          setPapers([]);
        }
      } catch (error) {
        console.error('Error fetching subject papers:', error);
        setError('Failed to load papers for this subject. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (subjectId && year && semester) {
      fetchSubjectAndPapers();
    }
  }, [subjectId, year, semester]);

  const handleBack = () => {
    navigate(ROUTES.SUBJECTS_WITH_PARAMS(year, semester));
  };

  const handleViewPaper = (paperId) => {
    navigate(ROUTES.PAPER_VIEW(paperId));
  };

  // Function to get random gradient background
  const getRandomGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #1a237e 0%, #3949ab 100%)', // Blue
      'linear-gradient(135deg, #004d40 0%, #00796b 100%)', // Teal
      'linear-gradient(135deg, #b71c1c 0%, #e53935 100%)', // Red
      'linear-gradient(135deg, #311b92 0%, #5e35b1 100%)', // Deep Purple
      'linear-gradient(135deg, #0d47a1 0%, #2196f3 100%)', // Light Blue
      'linear-gradient(135deg, #263238 0%, #607d8b 100%)', // Blue Gray
    ];
    return gradients[index % gradients.length];
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Breadcrumbs 
        separator={<NavigateNextIcon fontSize="small" />} 
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          Home
        </Link>
        <Link to="/search" style={{ textDecoration: 'none', color: 'inherit' }}>
          Search
        </Link>
        <Link 
          to={ROUTES.SUBJECTS_WITH_PARAMS(year, semester)}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          {year} - {semester}
        </Link>
        <Typography color="text.primary">
          {subject?.name || 'Subject Papers'}
        </Typography>
      </Breadcrumbs>

      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Back to Subjects
      </Button>

      {loading ? (
        <Box display="flex" justifyContent="center" my={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Paper sx={{ p: 3, mb: 4, bgcolor: 'background.default', borderRadius: 2 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {subject?.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {year} - {semester}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">
              {papers.length === 0
                ? 'No papers found for this subject.'
                : `${papers.length} paper${papers.length === 1 ? '' : 's'} available.`}
            </Typography>
          </Paper>

          {papers.length > 0 && (
            <Grid container spacing={3}>
              {papers.map((paper, index) => (
                <Grid item xs={12} md={6} lg={4} key={paper._id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: 2,
                      overflow: 'hidden',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                      '&:hover': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        background: getRandomGradient(index), 
                        p: 3, 
                        position: 'relative',
                        height: '120px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="h6" component="h2" noWrap sx={{ color: 'white', fontWeight: 'medium', width: '85%' }}>
                          {paper.title}
                        </Typography>
                        <IconButton size="small" sx={{ color: 'white' }}>
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', mt: 1 }}>
                        {paper.examType}
                      </Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                      {paper.comment && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                          {paper.comment.length > 100 
                            ? `${paper.comment.slice(0, 100)}...` 
                            : paper.comment}
                        </Typography>
                      )}
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', p: 1.5, borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                      <Button 
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleViewPaper(paper._id)}
                        sx={{ 
                          textTransform: 'none', 
                          borderRadius: 8,
                          px: 2
                        }}
                      >
                        View
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default SubjectPapers; 