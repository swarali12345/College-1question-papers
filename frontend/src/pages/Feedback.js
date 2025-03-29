import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Rating,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Stack,
  Tab,
  Tabs
} from '@mui/material';
import {
  Feedback as FeedbackIcon,
  Send as SendIcon,
  Star as StarIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { useAuth } from '../contexts/AuthContext';
import { userFeedbackService } from '../services/user/feedbackService';

const Feedback = () => {
  // State for form fields
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  // Previous feedback
  const [previousFeedback, setPreviousFeedback] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  
  const { user, isAuthenticated } = useAuth();

  // Load previous feedback on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserFeedback();
    }
  }, [isAuthenticated]);

  const fetchUserFeedback = async () => {
    setFeedbackLoading(true);
    try {
      const response = await userFeedbackService.getUserFeedback();
      setPreviousFeedback(response);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load your previous feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!subject.trim()) {
      setError('Please enter a subject for your feedback.');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message with your feedback.');
      return;
    }
    
    // Submit feedback
    setSubmitting(true);
    setError('');
    
    try {
      const feedbackData = {
        subject,
        message,
        rating
      };
      
      const response = await userFeedbackService.submitFeedback(feedbackData);
      
      // Show success message
      setSuccess(response.message || 'Feedback submitted successfully!');
      
      // Reset form
      setSubject('');
      setMessage('');
      setRating(5);
      
      // Refresh previous feedback list
      fetchUserFeedback();
      
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setError(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'success';
      case 'in_progress':
        return 'primary';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'resolved':
        return 'Resolved';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <FeedbackIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
          <Typography variant="h4" component="h1">
            Feedback
          </Typography>
        </Box>
        
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ mb: 3 }}
        >
          <Tab icon={<SendIcon />} label="Submit Feedback" />
          <Tab icon={<HistoryIcon />} label="Your Previous Feedback" />
        </Tabs>
        
        {tabValue === 0 && (
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>
              We value your opinion
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Your feedback helps us improve our service. Please share your thoughts, suggestions, or report any issues you've encountered.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subject"
                  variant="outlined"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={submitting}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Message"
                  variant="outlined"
                  required
                  multiline
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={submitting}
                  placeholder="Please describe your feedback in detail. The more information you provide, the better we can address your concerns or implement your suggestions."
                />
              </Grid>
              
              <Grid item xs={12}>
                <Box display="flex" alignItems="center">
                  <Typography component="legend" mr={2}>
                    How would you rate your experience?
                  </Typography>
                  <Rating
                    name="rating"
                    value={rating}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    precision={1}
                    disabled={submitting}
                  />
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={20} /> : <SendIcon />}
                  size="large"
                >
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Previous Feedback
            </Typography>
            
            {feedbackLoading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : previousFeedback.length > 0 ? (
              <Stack spacing={3}>
                {previousFeedback.map(item => (
                  <Card key={item.id} variant="outlined">
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                        <Typography variant="h6">{item.subject}</Typography>
                        <Chip 
                          size="small" 
                          label={getStatusLabel(item.status)} 
                          color={getStatusChipColor(item.status)} 
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Submitted on {format(new Date(item.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="body2" mr={1}>
                          Your rating:
                        </Typography>
                        <Rating value={item.rating} readOnly size="small" />
                      </Box>
                      
                      <Typography variant="body1" paragraph>
                        {item.message}
                      </Typography>
                      
                      {item.response && (
                        <Box sx={{ 
                          bgcolor: 'background.default', 
                          p: 2, 
                          borderRadius: 1,
                          borderLeft: 3,
                          borderColor: 'primary.main',
                          mt: 2
                        }}>
                          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                            Response from admin:
                          </Typography>
                          <Typography variant="body2">
                            {item.response}
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography variant="body1" color="text.secondary">
                  You haven't submitted any feedback yet.
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => setTabValue(0)}
                >
                  Submit Your First Feedback
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>
      
      {/* Success message */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      </Snackbar>
      
      {/* Error message */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Feedback; 