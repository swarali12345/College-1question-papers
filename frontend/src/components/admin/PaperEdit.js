import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { PAPER_CATEGORIES } from '../../constants';
import { paperService } from '../../services/api';

const PaperEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    department: '',
    year: '',
    semester: '',
    examType: '',
    tags: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paperDetails, setPaperDetails] = useState(null);

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        setError('');
        
        const paper = await paperService.getPaper(id);
        setPaperDetails(paper);
        
        // Format tags from array to comma-separated string
        const tagsString = paper.tags ? paper.tags.join(', ') : '';
        
        setFormData({
          title: paper.title || '',
          subject: paper.subject || '',
          department: paper.department || '',
          year: paper.year || '',
          semester: paper.semester || '',
          examType: paper.examType || '',
          tags: tagsString
        });
      } catch (err) {
        console.error('Error fetching paper:', err);
        setError('Failed to load paper details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchPaper();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    setError('');
  };

  const validateForm = () => {
    // Required fields: title, subject, department, year, semester, examType
    if (!formData.title.trim()) {
      setError('Paper title is required');
      return false;
    }
    
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    
    if (!formData.department) {
      setError('Department is required');
      return false;
    }
    
    if (!formData.year) {
      setError('Year is required');
      return false;
    }
    
    if (!formData.semester) {
      setError('Semester is required');
      return false;
    }
    
    if (!formData.examType) {
      setError('Exam type is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSaving(true);
    setError('');
    setSuccess(false);
    
    // Prepare data for update
    const updateData = {
      title: formData.title,
      subject: formData.subject,
      department: formData.department,
      year: formData.year,
      semester: formData.semester,
      examType: formData.examType
    };
    
    // Process tags if present
    if (formData.tags.trim()) {
      // Convert comma-separated tags into array and trim whitespace
      updateData.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    } else {
      updateData.tags = [];
    }
    
    try {
      await paperService.updatePaper(id, updateData);
      setSuccess(true);
      
      // Redirect after successful update
      setTimeout(() => {
        navigate('/admin/papers');
      }, 1500);
    } catch (err) {
      console.error('Paper update error:', err);
      setError(err.response?.data?.error || 'Failed to update paper. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (!paperDetails && !loading) {
    return (
      <Alert severity="error">
        Paper not found or you don't have permission to edit it.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Edit Paper
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Update paper details below. File cannot be changed - delete this paper and upload a new one if you need to replace the file.
        </Typography>
        
        <Divider sx={{ mt: 2 }} />
        
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              File:
            </Typography>
            <Chip 
              label={paperDetails.fileUrl ? paperDetails.fileUrl.split('/').pop() : 'No file'} 
              variant="outlined"
              size="small"
            />
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Status:
            </Typography>
            <Chip 
              label={paperDetails.approved ? 'Approved' : 'Pending Approval'} 
              color={paperDetails.approved ? 'success' : 'warning'}
              size="small"
            />
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Stats:
            </Typography>
            <Chip 
              label={`Views: ${paperDetails.views || 0}`} 
              variant="outlined"
              size="small"
            />
            <Chip 
              label={`Downloads: ${paperDetails.downloads || 0}`} 
              variant="outlined"
              size="small"
            />
          </Stack>
        </Box>
      </Box>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Paper updated successfully! Redirecting...
        </Alert>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Paper Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              disabled={saving}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={saving}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Department</InputLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleChange}
                label="Department"
                disabled={saving}
              >
                <MenuItem value=""><em>Select Department</em></MenuItem>
                {PAPER_CATEGORIES.DEPARTMENTS.map((dept) => (
                  <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={formData.year}
                onChange={handleChange}
                label="Year"
                disabled={saving}
              >
                <MenuItem value=""><em>Select Year</em></MenuItem>
                {PAPER_CATEGORIES.YEARS.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Semester</InputLabel>
              <Select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                label="Semester"
                disabled={saving}
              >
                <MenuItem value=""><em>Select Semester</em></MenuItem>
                {PAPER_CATEGORIES.SEMESTERS.map((semester) => (
                  <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Exam Type</InputLabel>
              <Select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                label="Exam Type"
                disabled={saving}
              >
                <MenuItem value=""><em>Select Exam Type</em></MenuItem>
                {PAPER_CATEGORIES.EXAM_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              disabled={saving}
              helperText="Example: midterm, 2023, programming"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/papers')}
                disabled={saving}
              >
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PaperEdit; 