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
  Divider,
  Link
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { paperService } from '../../services/adminService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const PaperEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    batch: '',
    year: '',
    semester: '',
    examType: '',
    comment: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paperDetails, setPaperDetails] = useState(null);
  const [file, setFile] = useState(null);

  // Define options for dropdown menus
  const yearOptions = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const semesterOptions = ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'];
  const examTypeOptions = ['CA', 'Mid-Semester', 'End-Semester'];

  useEffect(() => {
    const fetchPaper = async () => {
      try {
        setLoading(true);
        setError('');
        
        const paper = await paperService.getPaperById(id);
        setPaperDetails(paper);
        
        setFormData({
          title: paper.title || '',
          subject: paper.subject || '',
          batch: paper.batch || '',
          year: paper.year || '',
          semester: paper.semester || '',
          examType: paper.examType || '',
          comment: paper.comment || ''
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

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    // Required fields: title, subject, year, semester, examType, batch
    if (!formData.title.trim()) {
      setError('Paper title is required');
      return false;
    }
    
    if (!formData.subject.trim()) {
      setError('Subject is required');
      return false;
    }
    
    if (!formData.batch.trim()) {
      setError('Batch is required');
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
    
    // Prepare form data for multipart/form-data
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('batch', formData.batch);
    formDataToSend.append('year', formData.year);
    formDataToSend.append('semester', formData.semester);
    formDataToSend.append('examType', formData.examType);
    
    if (formData.comment) {
      formDataToSend.append('comment', formData.comment);
    }
    
    // Only append file if a new one is selected
    if (file) {
      formDataToSend.append('file', file);
    }
    
    try {
      await paperService.updatePaper(id, formDataToSend);
      setSuccess(true);
      
      // Show success message and redirect
      setTimeout(() => {
        navigate('/admin/papers');
      }, 1500);
    } catch (err) {
      console.error('Paper update error:', err);
      setError(err.response?.data?.message || 'Failed to update paper. Please try again.');
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
          Update paper details below. Upload a new file only if you need to replace the existing one.
        </Typography>
        
        <Divider sx={{ mt: 2 }} />
        
        {/* Current File Information */}
        <Box sx={{ mt: 2, mb: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Current File:
            </Typography>
            <Chip 
              label={paperDetails.fileUrl ? paperDetails.fileUrl.split('/').pop() : 'No file'} 
              variant="outlined"
              size="small"
            />
            {paperDetails.fileUrl && (
              <Link 
                href={paperDetails.fileUrl} 
                target="_blank" 
                rel="noopener"
                underline="none"
              >
                <Button 
                  startIcon={<FileDownloadIcon />} 
                  size="small" 
                  color="primary"
                >
                  Download
                </Button>
              </Link>
            )}
          </Stack>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Paper updated successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              required
              placeholder="e.g., 2021-2025"
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Year</InputLabel>
              <Select
                name="year"
                value={formData.year}
                onChange={handleChange}
                label="Year"
              >
                {yearOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Semester</InputLabel>
              <Select
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                label="Semester"
              >
                {semesterOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth required>
              <InputLabel>Exam Type</InputLabel>
              <Select
                name="examType"
                value={formData.examType}
                onChange={handleChange}
                label="Exam Type"
              >
                {examTypeOptions.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comments"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Optional comments about this paper"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ mb: 2 }}
            >
              Upload New File
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
            </Button>
            {file && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2, display: 'inline' }}>
                New file selected: {file.name}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button 
                variant="outlined" 
                color="secondary" 
                onClick={() => navigate('/admin/papers')}
                sx={{ mr: 2 }}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default PaperEdit; 