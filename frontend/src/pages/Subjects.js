import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Breadcrumbs,
  Link,
  Fade,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  School as SchoolIcon,
  NavigateNext as NavigateNextIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import subjectsStyles from '../styles/SubjectsStyles';
import SubjectCard from '../components/common/SubjectCard';
import backgroundImage from '../assets/newCroppedBg.jpg';

// Mock data for subjects by year and semester
const mockSubjectsData = {
  '1': {
    '1': [
      { id: 1, code: 'PHY101', name: 'Physics I', papers: 24 },
      { id: 2, code: 'MATH101', name: 'Mathematics I', papers: 36 },
      { id: 3, code: 'CHEM101', name: 'Chemistry', papers: 18 },
      { id: 4, code: 'ENG101', name: 'English Communication', papers: 12 },
      { id: 5, code: 'CS101', name: 'Introduction to Computing', papers: 30 },
    ],
    '2': [
      { id: 6, code: 'PHY102', name: 'Physics II', papers: 22 },
      { id: 7, code: 'MATH102', name: 'Mathematics II', papers: 32 },
      { id: 8, code: 'CS102', name: 'Programming Fundamentals', papers: 28 },
      { id: 9, code: 'EE101', name: 'Basic Electrical Engineering', papers: 16 },
    ],
  },
  '2': {
    '1': [
      { id: 10, code: 'CS201', name: 'Data Structures', papers: 42 },
      { id: 11, code: 'CS203', name: 'Object Oriented Programming', papers: 38 },
      { id: 12, code: 'MATH201', name: 'Discrete Mathematics', papers: 24 },
      { id: 13, code: 'DLD201', name: 'Digital Logic Design', papers: 22 },
    ],
    '2': [
      { id: 14, code: 'CS202', name: 'Algorithms', papers: 34 },
      { id: 15, code: 'CS204', name: 'Database Systems', papers: 28 },
      { id: 16, code: 'SE201', name: 'Software Engineering', papers: 20 },
      { id: 17, code: 'CS206', name: 'Computer Architecture', papers: 18 },
    ],
  },
  '3': {
    '1': [
      { id: 18, code: 'CS301', name: 'Operating Systems', papers: 30 },
      { id: 19, code: 'CS303', name: 'Computer Networks', papers: 26 },
      { id: 20, code: 'AI301', name: 'Artificial Intelligence', papers: 32 },
      { id: 21, code: 'SE301', name: 'Software Design & Architecture', papers: 22 },
    ],
    '2': [
      { id: 22, code: 'CS302', name: 'Theory of Automata', papers: 24 },
      { id: 23, code: 'CS304', name: 'Web Engineering', papers: 28 },
      { id: 24, code: 'CS306', name: 'Information Security', papers: 18 },
      { id: 25, code: 'CS308', name: 'Mobile App Development', papers: 20 },
    ],
  },
  '4': {
    '1': [
      { id: 26, code: 'CS401', name: 'Cloud Computing', papers: 22 },
      { id: 27, code: 'CS403', name: 'Big Data Analytics', papers: 26 },
      { id: 28, code: 'CS405', name: 'Compiler Construction', papers: 18 },
      { id: 29, code: 'CS407', name: 'Machine Learning', papers: 30 },
    ],
    '2': [
      { id: 30, code: 'CS402', name: 'Data Mining', papers: 24 },
      { id: 31, code: 'CS404', name: 'Natural Language Processing', papers: 20 },
      { id: 32, code: 'CS406', name: 'Computer Vision', papers: 16 },
      { id: 33, code: 'CS408', name: 'Final Year Project', papers: 10 },
    ],
  },
};

const yearNames = {
  '1': '1st Year',
  '2': '2nd Year',
  '3': '3rd Year',
  '4': '4th Year',
};

const semesterNames = {
  '1': '1st Semester',
  '2': '2nd Semester',
};

// Update semester names to be dynamic based on year
const getSemesterName = (year, semester) => {
  if (!year || !semester) return '';
  const semesterNumber = (parseInt(year) - 1) * 2 + parseInt(semester);
  return `Semester ${semesterNumber}`;
};

const Subjects = () => {
  const { year, semester } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // Set background image to cover entire page
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.minHeight = '100vh';
    document.body.style.width = '100vw';
    document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${backgroundImage})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
    document.body.style.backgroundAttachment = 'fixed';
    document.body.style.overflowX = 'hidden';
    
    return () => {
      // Reset when component unmounts
      document.body.style.margin = '';
      document.body.style.padding = '';
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.minHeight = '';
      document.body.style.width = '';
      document.body.style.overflowX = '';
    };
  }, []);

  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      if (mockSubjectsData[year] && mockSubjectsData[year][semester]) {
        setSubjects(mockSubjectsData[year][semester]);
      } else {
        setSubjects([]);
      }
      setLoading(false);
    }, 800);
  }, [year, semester]);

  const handleBack = () => {
    navigate('/search');
  };

  if (!year || !semester) {
    navigate('/search');
    return null;
  }

  // Get the semester name for display
  const semesterName = getSemesterName(year, semester);

  return (
    <Box sx={{
      ...subjectsStyles.root,
      background: 'transparent', // Remove background from Box since it's on body
    }}>
      <Container maxWidth="lg">
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={subjectsStyles.breadcrumbs}
        >
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Link component={RouterLink} to="/search" color="inherit">
            Search
          </Link>
          <Typography color="textPrimary">
            {yearNames[year]} - {semesterName}
          </Typography>
        </Breadcrumbs>

        <Box sx={subjectsStyles.header}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={subjectsStyles.backButton}
          >
            Back to Search
          </Button>
          <Typography variant="h4" component="h1" sx={subjectsStyles.title}>
            {yearNames[year]} - {semesterName} Subjects
          </Typography>
          <Typography variant="body1" sx={subjectsStyles.subtitle}>
            Select a subject to view available papers
          </Typography>
        </Box>

        {loading ? (
          <Box sx={subjectsStyles.loaderContainer}>
            <CircularProgress color="primary" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading subjects...
            </Typography>
          </Box>
        ) : (
          <Fade in={!loading} timeout={1000}>
            <Grid container spacing={3}>
              {subjects.length > 0 ? (
                subjects.map((subject) => (
                  <Grid item xs={12} sm={6} md={4} key={subject.id}>
                    <SubjectCard subject={subject} year={year} semester={semester} />
                  </Grid>
                ))
              ) : (
                <Box sx={subjectsStyles.noSubjects}>
                  <SchoolIcon sx={{ fontSize: 60, mb: 2, opacity: 0.6 }} />
                  <Typography variant="h6" gutterBottom>
                    No subjects found
                  </Typography>
                  <Typography variant="body1">
                    There are no subjects available for this semester yet.
                  </Typography>
                </Box>
              )}
            </Grid>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default Subjects; 