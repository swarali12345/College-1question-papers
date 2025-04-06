import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Card,
  CardContent,
  IconButton,
  Container
} from '@mui/material';
import { Link } from 'react-router-dom';
import { subjectService } from '../../services';
import { MoreVert as MoreVertIcon, School as SchoolIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const GroupedSubjectList = () => {
  const [groupedSubjects, setGroupedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroupedSubjects();
  }, []);

  const fetchGroupedSubjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await subjectService.getGroupedSubjects();
      setGroupedSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching grouped subjects:', error);
      setError('Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
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
    <Box sx={{ mt: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" component="h1" gutterBottom>
          Subjects by Year and Semester
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {groupedSubjects.length > 0 ? (
              <Box>
                {groupedSubjects.map((yearGroup, yearIndex) => (
                  <Accordion key={yearIndex} defaultExpanded sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                        background: getRandomGradient(yearIndex),
                        color: 'white'
                      }}
                    >
                      <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
                        {yearGroup.year}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {yearGroup.semesters.map((semesterGroup, semIndex) => (
                        <Box key={semIndex} sx={{ mb: 3 }}>
                          <Typography variant="h6" sx={{ mb: 2, mt: 1, fontWeight: 500 }}>
                            {semesterGroup.semester}
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          
                          <Grid container spacing={3}>
                            {semesterGroup.subjects.map((subject, subIndex) => (
                              <Grid item xs={12} md={6} lg={4} key={subject._id}>
                                <Card 
                                  component={Link}
                                  to={`/papers/${encodeURIComponent(subject.year)}/${encodeURIComponent(subject.semester)}/${subject._id}`}
                                  sx={{ 
                                    textDecoration: 'none',
                                    height: '100%',
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                                    '&:hover': {
                                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                                    },
                                    display: 'flex',
                                    flexDirection: 'column'
                                  }}
                                >
                                  <Box 
                                    sx={{ 
                                      background: getRandomGradient(yearIndex + semIndex + subIndex),
                                      p: 3,
                                      position: 'relative',
                                      height: '120px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'space-between'
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'medium', width: '85%' }}>
                                        {subject.name}
                                      </Typography>
                                      <IconButton size="small" sx={{ color: 'white' }}>
                                        <MoreVertIcon />
                                      </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                      <SchoolIcon sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '1rem', mr: 1 }} />
                                      <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
                                        {subject.year} - {subject.semester}
                                      </Typography>
                                    </Box>
                                  </Box>
                                  <CardContent sx={{ bgcolor: 'background.paper', flexGrow: 1, p: 2 }}>
                                    <Typography variant="body2" color="text.secondary" align="right">
                                      Click to view papers
                                    </Typography>
                                  </CardContent>
                                </Card>
                              </Grid>
                            ))}
                          </Grid>
                        </Box>
                      ))}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                <Typography>
                  No subjects found. Please try again later.
                </Typography>
              </Paper>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default GroupedSubjectList; 