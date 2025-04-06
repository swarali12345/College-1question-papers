import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Container
} from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { subjectService } from '../../services';
import { ACADEMIC_OPTIONS, ROUTES } from '../../constants';
import { MoreVert as MoreVertIcon, School as SchoolIcon } from '@mui/icons-material';

const SubjectList = () => {
  const { year, semester } = useParams();
  const navigate = useNavigate();
  
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedYear, setSelectedYear] = useState(year || '');
  const [selectedSemester, setSelectedSemester] = useState(semester || '');

  useEffect(() => {
    if (year && semester) {
      fetchSubjects(year, semester);
      setSelectedYear(year);
      setSelectedSemester(semester);
    }
  }, [year, semester]);

  const fetchSubjects = async (year, semester) => {
    setLoading(true);
    setError('');
    try {
      const response = await subjectService.getSubjectsByYearAndSemester(year, semester);
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleSearch = () => {
    if (selectedYear && selectedSemester) {
      navigate(ROUTES.SUBJECTS_WITH_PARAMS(selectedYear, selectedSemester));
    } else {
      setError('Please select both year and semester');
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
          Subject List
        </Typography>

        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" gutterBottom>
            Filter Subjects
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel id="year-select-label">Year</InputLabel>
                <Select
                  labelId="year-select-label"
                  id="year-select"
                  value={selectedYear}
                  label="Year"
                  onChange={handleYearChange}
                >
                  {ACADEMIC_OPTIONS.YEARS.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel id="semester-select-label">Semester</InputLabel>
                <Select
                  labelId="semester-select-label"
                  id="semester-select"
                  value={selectedSemester}
                  label="Semester"
                  onChange={handleSemesterChange}
                >
                  {ACADEMIC_OPTIONS.SEMESTERS.map((semester) => (
                    <MenuItem key={semester} value={semester}>
                      {semester}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button 
                variant="contained" 
                fullWidth 
                onClick={handleSearch}
                sx={{ height: '56px', borderRadius: 2 }}
              >
                Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {year && semester && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 500 }}>
                  Subjects for {year} - {semester}
                </Typography>
                <Divider sx={{ mt: 1 }} />
              </Box>
            )}
            
            {subjects.length > 0 ? (
              <Grid container spacing={3}>
                {subjects.map((subject, index) => (
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
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
                {year && semester ? (
                  <Typography>
                    No subjects found for {year} - {semester}. Please try a different selection.
                  </Typography>
                ) : (
                  <Typography>
                    Please select a year and semester to view subjects.
                  </Typography>
                )}
              </Paper>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default SubjectList; 