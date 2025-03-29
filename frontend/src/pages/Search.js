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
import { Search as SearchIcon, School as SchoolIcon } from '@mui/icons-material';
import searchStyles from '../styles/SearchStyles';

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
      navigate(`/subjects/${year}/${semester}`);
    }
  };

  // Get semester options based on selected year
  const getSemesterOptions = () => {
    if (!year) return [];
    
    const baseValue = (parseInt(year) - 1) * 2;
    return [
      { value: '1', label: `Semester ${baseValue + 1}` },
      { value: '2', label: `Semester ${baseValue + 2}` }
    ];
  };

  const semesterOptions = getSemesterOptions();

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
                    <MenuItem value="1">1st Year</MenuItem>
                    <MenuItem value="2">2nd Year</MenuItem>
                    <MenuItem value="3">3rd Year</MenuItem>
                    <MenuItem value="4">4th Year</MenuItem>
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
                    {semesterOptions.map(option => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
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