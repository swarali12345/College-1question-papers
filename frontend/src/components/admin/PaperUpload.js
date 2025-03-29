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
  CircularProgress
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { paperService } from '../../services/adminService';

// Years array (1st, 2nd, 3rd, 4th year)
const YEARS = ['1st', '2nd', '3rd', '4th'];

// Semesters array (1-8)
const SEMESTERS = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

// Generate batch options (2020-2026, etc.) - current year to current+6
const generateBatchOptions = () => {
  const currentYear = new Date().getFullYear();
  const batchOptions = [];
  
  for (let i = 0; i < 10; i++) {
    const startYear = currentYear - 5 + i;
    const endYear = startYear + 6;
    batchOptions.push(`${startYear}-${endYear}`);
  }
  
  return batchOptions;
};

const BATCHES = generateBatchOptions();

const PaperUpload = () => {
  const [formData, setFormData] = useState({
    year: '',
    batch: '',
    semester: '',
    subject: '',
    comment: ''
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
    // Required fields: year, batch, semester, subject, file
    if (!formData.year) {
      setError('Year is required');
      return false;
    }
    
    if (!formData.batch) {
      setError('Batch is required');
      return false;
    }
    
    if (!formData.semester) {
      setError('Semester is required');
      return false;
    }
    
    if (!formData.subject.trim()) {
      setError('Subject is required');
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
    uploadData.append('title', `${formData.subject} - ${formData.year} Year - ${formData.semester}`); // Generate title from fields
    uploadData.append('subject', formData.subject);
    uploadData.append('year', formData.batch.split('-')[0]); // Use first year of batch
    uploadData.append('semester', formData.semester);
    
    // Add comment if provided
    if (formData.comment.trim()) {
      uploadData.append('comment', formData.comment);
    }
    
    try {
      console.log('Submitting paper upload...');
      const response = await paperService.uploadPaper(uploadData);
      
      console.log('Paper upload response:', response);
      setSuccess(true);
      
      // Reset form after successful upload
      setFormData({
        year: '',
        batch: '',
        semester: '',
        subject: '',
        comment: ''
      });
      setFile(null);
      setFileName('');
    } catch (err) {
      console.error('Paper upload error details:', err);
      
      // Display a more specific error message if available
      if (err.message === 'Admin access required for this route') {
        setError('You need admin privileges to upload papers. Please check your login status.');
      } else {
        setError(err.message || 'Failed to upload paper. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Upload Question Paper
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
          <Grid item xs={12}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 3, 
                border: '2px dashed',
                borderColor: fileError ? 'error.main' : 'primary.light',
                bgcolor: 'background.paper',
                textAlign: 'center',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50'
                },
                mb: 3
              }}
            >
              <input
                accept="application/pdf"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple={false}
                type="file"
                onChange={handleFileChange}
                disabled={loading}
              />
              <label htmlFor="raised-button-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={loading}
                  sx={{ mb: 2 }}
                >
                  Select PDF File
                </Button>
              </label>
              
              {fileName ? (
                <Typography color="primary">{fileName}</Typography>
              ) : (
                <Typography color="text.secondary">
                  Drag and drop a PDF file here, or click to select a file
                </Typography>
              )}
              
              {fileError && (
                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                  {fileError}
                </Typography>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={error && !formData.year}>
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={formData.year}
                onChange={handleChange}
                label="Year"
                disabled={loading}
              >
                <MenuItem value=""><em>Select Year</em></MenuItem>
                {YEARS.map((year) => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
              {error && !formData.year && (
                <Typography color="error" variant="caption">
                  Year is required
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={error && !formData.batch}>
              <InputLabel>Batch</InputLabel>
              <Select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                label="Batch"
                disabled={loading}
              >
                <MenuItem value=""><em>Select Batch</em></MenuItem>
                {BATCHES.map((batch) => (
                  <MenuItem key={batch} value={batch}>{batch}</MenuItem>
                ))}
              </Select>
              {error && !formData.batch && (
                <Typography color="error" variant="caption">
                  Batch is required
                </Typography>
              )}
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={error && !formData.semester}>
              <InputLabel>Semester</InputLabel>
              <Select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                label="Semester"
                disabled={loading}
              >
                <MenuItem value=""><em>Select Semester</em></MenuItem>
                {SEMESTERS.map((semester) => (
                  <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                ))}
              </Select>
              {error && !formData.semester && (
                <Typography color="error" variant="caption">
                  Semester is required
                </Typography>
              )}
            </FormControl>
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
              error={error && !formData.subject.trim()}
              helperText={error && !formData.subject.trim() ? "Subject is required" : ""}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comment (Optional)"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              disabled={loading}
              multiline
              rows={3}
              placeholder="Add any additional information about this paper"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={24} /> : <UploadIcon />}
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