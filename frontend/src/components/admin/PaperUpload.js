import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import { Upload as UploadIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { paperService } from '../../services/adminService';

const years = [
  'First Year',
  'Second Year',
  'Third Year',
  'Fourth Year'
];

const semesters = [
  'Semester 1',
  'Semester 2',
  'Semester 3',
  'Semester 4',
  'Semester 5',
  'Semester 6',
  'Semester 7',
  'Semester 8'
];

const examTypes = [
  'CA',
  'Mid-Semester',
  'End-Semester'
];

const PaperUpload = () => {
  const [formData, setFormData] = useState({
    subject: '',
    batch: '2021-2025', // Default batch
    year: '',
    semester: '',
    examType: '',
    comment: ''
  });
  
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      setFile(null);
      setFileError('');
      return;
    }
    
    // Validate file type (PDF only)
    if (selectedFile.type !== 'application/pdf') {
      setFile(null);
      setFileError('Only PDF files are allowed.');
      return;
    }
    
    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setFile(null);
      setFileError('File size exceeds 10MB limit.');
      return;
    }
    
    setFile(selectedFile);
    setFileError('');
  };

  const validateForm = () => {
    if (!formData.subject.trim()) return 'Subject is required';
    if (!formData.batch.trim()) return 'Batch is required';
    if (!formData.year) return 'Year is required';
    if (!formData.semester) return 'Semester is required';
    if (!formData.examType) return 'Exam type is required';
    if (!file) return 'Please upload a PDF file';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setUploading(true);
    setError('');
    setSuccess('');
    
    try {
      // Create form data to send to server
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('title', `${formData.subject} - ${formData.year} - ${formData.examType}`);
      uploadData.append('subject', formData.subject);
      uploadData.append('batch', formData.batch);
      uploadData.append('year', formData.year);
      uploadData.append('semester', formData.semester);
      uploadData.append('examType', formData.examType);
      
      if (formData.comment.trim()) {
        uploadData.append('tags', formData.comment);
      }
      
      // Upload paper
      const response = await paperService.uploadPaper(uploadData);
      
      // Show success message
      setSuccess('Paper uploaded successfully!');
      
      // Reset form
      setFormData({
        subject: '',
        batch: '2021-2025',
        year: '',
        semester: '',
        examType: '',
        comment: ''
      });
      setFile(null);
      
    } catch (err) {
      console.error('Error uploading paper:', err);
      setError(err.response?.data?.error || err.message || 'Failed to upload paper. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Upload New Paper
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              required
              helperText="Enter the subject name"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Batch"
              name="batch"
              value={formData.batch}
              onChange={handleInputChange}
              required
              helperText="Enter batch e.g. 2021-2025"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                label="Year"
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the year</FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Semester</InputLabel>
              <Select
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                label="Semester"
              >
                {semesters.map((semester) => (
                  <MenuItem key={semester} value={semester}>
                    {semester}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the semester</FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth required>
              <InputLabel>Exam Type</InputLabel>
              <Select
                name="examType"
                value={formData.examType}
                onChange={handleInputChange}
                label="Exam Type"
              >
                {examTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Select the exam type</FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comment (Optional)"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              multiline
              rows={2}
              helperText="Any additional information about this paper"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box
              sx={{
                border: '1px dashed',
                borderColor: 'grey.400',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                backgroundColor: 'background.default',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover'
                }
              }}
              component="label"
            >
              <input
                type="file"
                accept=".pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              {file ? (
                <Box display="flex" alignItems="center" justifyContent="center">
                  <PdfIcon color="primary" sx={{ mr: 1, fontSize: 40 }} />
                  <Box>
                    <Typography variant="body1">{file.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <UploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body1">
                    Drag and drop a PDF file here or click to browse
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Maximum file size: 10MB
                  </Typography>
                </Box>
              )}
            </Box>
            
            {fileError && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {fileError}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
              fullWidth
              sx={{ mt: 2 }}
            >
              {uploading ? 'Uploading...' : 'Upload Paper'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PaperUpload; 