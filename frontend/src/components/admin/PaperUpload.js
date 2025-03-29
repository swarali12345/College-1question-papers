import React, { useState } from 'react';
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
  Input
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { PAPER_CATEGORIES } from '../../constants';
import { paperService } from '../../services/api';

const PaperUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    department: '',
    year: '',
    semester: '',
    examType: '',
    tags: ''
  });

  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    setError('');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFileError('');
    
    if (!selectedFile) {
      setFile(null);
      setFileName('');
      return;
    }
    
    // Check if file is PDF
    if (selectedFile.type !== 'application/pdf') {
      setFileError('Only PDF files are allowed');
      setFile(null);
      setFileName('');
      return;
    }
    
    // Check file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFileError('File size exceeds 10MB limit');
      setFile(null);
      setFileName('');
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const validateForm = () => {
    // Required fields: title, subject, department, year, semester, examType, file
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
    
    if (!file) {
      setFileError('Please upload a PDF file');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess(false);
    
    // Create form data for file upload
    const uploadData = new FormData();
    uploadData.append('file', file);
    uploadData.append('title', formData.title);
    uploadData.append('subject', formData.subject);
    uploadData.append('department', formData.department);
    uploadData.append('year', formData.year);
    uploadData.append('semester', formData.semester);
    uploadData.append('examType', formData.examType);
    
    if (formData.tags.trim()) {
      uploadData.append('tags', formData.tags);
    }
    
    try {
      const response = await paperService.uploadPaper(uploadData);
      
      setSuccess(true);
      
      // Reset form after successful upload
      setFormData({
        title: '',
        subject: '',
        department: '',
        year: '',
        semester: '',
        examType: '',
        tags: ''
      });
      setFile(null);
      setFileName('');
      
      console.log('Paper uploaded successfully:', response);
    } catch (err) {
      setError(err.message || 'Failed to upload paper. Please try again.');
      console.error('Paper upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Upload New Paper
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Upload previous year question papers in PDF format. All papers uploaded by admins are automatically approved.
      </Typography>
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Paper uploaded successfully!
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
              disabled={loading}
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
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
              disabled={loading}
              helperText="Example: midterm, 2023, programming"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ border: '1px dashed', borderColor: 'divider', p: 3, borderRadius: 1, textAlign: 'center' }}>
              <Input
                type="file"
                id="pdf-upload"
                inputProps={{ accept: 'application/pdf' }}
                sx={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="pdf-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  disabled={loading}
                >
                  Choose PDF File
                </Button>
              </label>
              
              <Box sx={{ mt: 2 }}>
                {fileName ? (
                  <Chip
                    label={fileName}
                    onDelete={() => {
                      setFile(null);
                      setFileName('');
                    }}
                    color="primary"
                    variant="outlined"
                  />
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No file selected
                  </Typography>
                )}
              </Box>
              
              {fileError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {fileError}
                </Typography>
              )}
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <UploadIcon />}
              sx={{ mt: 2 }}
            >
              {loading ? 'Uploading...' : 'Upload Paper'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PaperUpload; 