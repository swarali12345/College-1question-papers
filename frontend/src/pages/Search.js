import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Fade,
  Grid,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import searchStyles from '../styles/SearchStyles';
import { ACADEMIC_OPTIONS } from '../constants';

const Search = () => {
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
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

  // Reset semester when year changes
  useEffect(() => {
    setSemester('');
  }, [year]);

  const handleYearChange = (event) => {
    setYear(event.target.value);
  };

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleSearch = () => {
    if (year && semester) {
      // Use encodeURIComponent to handle spaces and special characters in the URL
      const encodedYear = encodeURIComponent(year);
      const encodedSemester = encodeURIComponent(semester);
      navigate(`/subjects/${encodedYear}/${encodedSemester}`);
    }
  };

  // Get available semesters based on selected year
  const getAvailableSemesters = () => {
    if (!year) return [];
    
    // Map year to its semesters
    const yearIndex = ACADEMIC_OPTIONS.YEARS.indexOf(year);
    if (yearIndex === -1) return [];
    
    // Each year has 2 semesters, so return the appropriate ones
    const startIndex = yearIndex * 2;
    return ACADEMIC_OPTIONS.SEMESTERS.slice(startIndex, startIndex + 2);
  };

  const availableSemesters = getAvailableSemesters();

  return (
    <Box sx={searchStyles.root}>
      <Container maxWidth="md">
        <Fade in={true} timeout={1000}>
          <Paper elevation={3} sx={searchStyles.paper}>
            <Avatar sx={searchStyles.avatar}>
              <SchoolIcon fontSize="large" />
            </Avatar>
            
            <Typography variant="h4" component="h1" sx={searchStyles.title}>
              Find Your Papers
            </Typography>
            
            <Typography variant="body1" sx={searchStyles.subtitle}>
              Select your year and semester to find relevant papers
            </Typography>
            
            <Grid container spacing={3} sx={searchStyles.formContainer}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" sx={searchStyles.formControl}>
                  <InputLabel id="year-select-label">Year</InputLabel>
                  <Select
                    labelId="year-select-label"
                    id="year-select"
                    value={year}
                    onChange={handleYearChange}
                    label="Year"
                  >
                    {ACADEMIC_OPTIONS.YEARS.map((yearOption) => (
                      <MenuItem key={yearOption} value={yearOption}>
                        {yearOption}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth variant="outlined" sx={searchStyles.formControl} disabled={!year}>
                  <InputLabel id="semester-select-label">Semester</InputLabel>
                  <Select
                    labelId="semester-select-label"
                    id="semester-select"
                    value={semester}
                    onChange={handleSemesterChange}
                    label="Semester"
                    disabled={!year}
                  >
                    {availableSemesters.map(semesterOption => (
                      <MenuItem key={semesterOption} value={semesterOption}>
                        {semesterOption}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Button
              variant="contained"
              color="primary"
              size="large"
              startIcon={<SchoolIcon />}
              onClick={handleSearch}
              disabled={!year || !semester}
              sx={searchStyles.searchButton}
            >
              Find Papers
            </Button>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Search; 