import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Alert,
  Tooltip,
  Rating,
  Card,
  CardContent,
  CardActions,
  Grid,
  Divider,
  Avatar,
  Stack
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  CheckCircle as ResolvedIcon,
  Reply as ReplyIcon,
  Flag as FlagIcon,
  FilterList as FilterIcon,
  Mail as EmailIcon,
  MoreVert as MoreIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { feedbackService } from '../../services/adminService';

// Mock API service - replace with actual API calls
const mockFeedback = [
  {
    id: 'f1',
    user: {
      id: 'u1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      department: 'Computer Science'
    },
    subject: 'Website Navigation Issue',
    message: 'I found it difficult to navigate between the paper repository and my profile. The menu structure is confusing.',
    rating: 3,
    createdAt: new Date('2023-04-15'),
    status: 'pending',
    priority: 'medium',
    response: null
  },
  {
    id: 'f2',
    user: {
      id: 'u2',
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      department: 'Information Technology'
    },
    subject: 'Search Functionality Improvement',
    message: 'The search feature works well, but it would be nice to have more advanced filters for searching papers by specific criteria like exam type or semester.',
    rating: 4,
    createdAt: new Date('2023-04-10'),
    status: 'resolved',
    priority: 'low',
    response: 'Thank you for your feedback! We are planning to add advanced search filters in our next update.'
  },
  {
    id: 'f3',
    user: {
      id: 'u3',
      name: 'Michael Johnson',
      email: 'michael.j@example.com',
      department: 'Computer Science'
    },
    subject: 'Error When Uploading PDFs',
    message: 'I encountered an error when trying to upload a PDF file larger than 10MB. The system crashed and I had to refresh the page.',
    rating: 2,
    createdAt: new Date('2023-04-05'),
    status: 'in_progress',
    priority: 'high',
    response: 'We are investigating this issue. As a temporary solution, please try splitting larger PDFs into smaller files.'
  },
  {
    id: 'f4',
    user: {
      id: 'u4',
      name: 'Emily Williams',
      email: 'emily.w@example.com',
      department: 'Electrical Engineering'
    },
    subject: 'Great Platform Overall',
    message: 'I just wanted to say this platform has been incredibly helpful for my studies. Having access to past papers has improved my exam preparation significantly.',
    rating: 5,
    createdAt: new Date('2023-04-01'),
    status: 'resolved',
    priority: 'low',
    response: 'Thank you for your kind words! We are happy to hear that our platform is helping with your studies.'
  },
  {
    id: 'f5',
    user: {
      id: 'u5',
      name: 'David Brown',
      email: 'david.b@example.com',
      department: 'Information Technology'
    },
    subject: 'Mobile App Request',
    message: 'Have you considered developing a mobile app version of this platform? It would be really convenient to access papers on my phone during commutes.',
    rating: 4,
    createdAt: new Date('2023-03-25'),
    status: 'pending',
    priority: 'medium',
    response: null
  }
];

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [responseDialogOpen, setResponseDialogOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [viewType, setViewType] = useState('card'); // 'card' or 'table'

  useEffect(() => {
    // Fetch feedback from API
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      // Call the feedbackService from adminService
      const response = await feedbackService.getAllFeedback();
      setFeedback(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback. Please try again.');
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  const handlePriorityFilterChange = (priority) => {
    setPriorityFilter(priority);
    setPage(0);
  };

  const handleDeleteClick = (item) => {
    setSelectedFeedback(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedFeedback) return;
    
    try {
      // Call the deleteFeedback method from feedbackService
      await feedbackService.deleteFeedback(selectedFeedback.id);
      
      // Update local state
      setFeedback(feedback.filter(f => f.id !== selectedFeedback.id));
      setDeleteDialogOpen(false);
      setSelectedFeedback(null);
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Failed to delete feedback. Please try again.');
    }
  };

  const handleResponseClick = (item) => {
    setSelectedFeedback(item);
    setResponseText(item.response || '');
    setResponseDialogOpen(true);
  };

  const handleResponseSubmit = async () => {
    if (!selectedFeedback) return;
    
    try {
      // Call the respondToFeedback method from feedbackService
      await feedbackService.respondToFeedback(selectedFeedback.id, responseText);
      
      // Update local state
      setFeedback(feedback.map(f => 
        f.id === selectedFeedback.id 
          ? { ...f, response: responseText, status: 'resolved' } 
          : f
      ));
      setResponseDialogOpen(false);
      setSelectedFeedback(null);
      setResponseText('');
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error responding to feedback:', err);
      setError('Failed to submit response. Please try again.');
    }
  };

  const handleMarkResolved = async (item) => {
    try {
      // Call the updateFeedbackStatus method from feedbackService
      await feedbackService.updateFeedbackStatus(item.id, 'resolved');
      
      // Update local state
      setFeedback(feedback.map(f => 
        f.id === item.id 
          ? { ...f, status: 'resolved' } 
          : f
      ));
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error resolving feedback:', err);
      setError('Failed to mark feedback as resolved. Please try again.');
    }
  };

  const handleMarkInProgress = async (item) => {
    try {
      // Call the updateFeedbackStatus method from feedbackService
      await feedbackService.updateFeedbackStatus(item.id, 'in_progress');
      
      // Update local state
      setFeedback(feedback.map(f => 
        f.id === item.id 
          ? { ...f, status: 'in_progress' } 
          : f
      ));
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error updating feedback status:', err);
      setError('Failed to update feedback status. Please try again.');
    }
  };

  const handleToggleViewType = () => {
    setViewType(viewType === 'card' ? 'table' : 'card');
  };

  // Filter feedback based on search query, status filter, and priority filter
  const filteredFeedback = feedback.filter(item => {
    // Apply status filter
    if (statusFilter !== 'all' && item.status !== statusFilter) {
      return false;
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all' && item.priority !== priorityFilter) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    const searchLower = searchQuery.toLowerCase();
    return (
      item.subject.toLowerCase().includes(searchLower) ||
      item.message.toLowerCase().includes(searchLower) ||
      item.user.name.toLowerCase().includes(searchLower) ||
      item.user.email.toLowerCase().includes(searchLower)
    );
  });

  // Sort by date (newest first)
  const sortedFeedback = [...filteredFeedback].sort((a, b) => 
    new Date(b.createdAt || Date.now()).getTime() - new Date(a.createdAt || Date.now()).getTime()
  );

  // Paginate filtered feedback
  const paginatedFeedback = sortedFeedback.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  const getPriorityChipColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  // Function to get initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Function to get color based on name
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  const renderCardView = () => (
    <Grid container spacing={3}>
      {paginatedFeedback.length > 0 ? (
        paginatedFeedback.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card 
              elevation={3}
              sx={{
                borderLeft: 6,
                borderColor: `${getPriorityChipColor(item.priority)}.main`,
                position: 'relative'
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={9}>
                    <Box display="flex" alignItems="center" mb={1} gap={1}>
                      <Avatar 
                        sx={{ 
                          bgcolor: stringToColor(item.user.name),
                          width: 32, 
                          height: 32
                        }}
                      >
                        {getInitials(item.user.name)}
                      </Avatar>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.subject}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={getStatusLabel(item.status)} 
                        color={getStatusChipColor(item.status)}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      From {item.user.name} ({item.user.email}) - {format(new Date(item.createdAt || Date.now()), 'dd MMM yyyy')}
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {item.message}
                    </Typography>
                    
                    {item.response && (
                      <Box sx={{ 
                        bgcolor: 'background.default', 
                        p: 2, 
                        borderRadius: 1,
                        borderLeft: 3,
                        borderColor: 'primary.main'
                      }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          Response:
                        </Typography>
                        <Typography variant="body2">
                          {item.response}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Box display="flex" flexDirection="column" alignItems="flex-start">
                      <Box display="flex" alignItems="center" mb={2}>
                        <Typography variant="body2" mr={1}>
                          Rating:
                        </Typography>
                        <Rating 
                          value={item.rating} 
                          readOnly 
                          size="small"
                          icon={<StarIcon fontSize="inherit" />}
                        />
                      </Box>
                      
                      <Stack spacing={1} width="100%">
                        {item.status !== 'resolved' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            startIcon={<ResolvedIcon />}
                            onClick={() => handleMarkResolved(item)}
                          >
                            Mark Resolved
                          </Button>
                        )}
                        
                        {item.status === 'pending' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleMarkInProgress(item)}
                          >
                            Mark In Progress
                          </Button>
                        )}
                        
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<ReplyIcon />}
                          onClick={() => handleResponseClick(item)}
                        >
                          {item.response ? 'Edit Response' : 'Respond'}
                        </Button>
                        
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(item)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'No feedback matches your search criteria.' 
                : 'No feedback available.'}
            </Typography>
          </Paper>
        </Grid>
      )}
    </Grid>
  );

  const renderTableView = () => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'action.hover' }}>
            <TableCell>Subject</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedFeedback.length > 0 ? (
            paginatedFeedback.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {item.subject}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    {item.message.length > 60 
                      ? `${item.message.substring(0, 60)}...` 
                      : item.message
                    }
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar 
                      sx={{ 
                        bgcolor: stringToColor(item.user.name),
                        width: 24, 
                        height: 24,
                        mr: 1
                      }}
                    >
                      {getInitials(item.user.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2">
                        {item.user.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  {format(new Date(item.createdAt || Date.now()), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={getStatusLabel(item.status)} 
                    size="small" 
                    color={getStatusChipColor(item.status)}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} 
                    size="small" 
                    color={getPriorityChipColor(item.priority)}
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Rating 
                      value={item.rating} 
                      readOnly 
                      size="small"
                      icon={<StarIcon fontSize="inherit" />}
                    />
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box>
                    <Tooltip title="Respond">
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleResponseClick(item)}
                      >
                        <ReplyIcon />
                      </IconButton>
                    </Tooltip>
                    {item.status !== 'resolved' && (
                      <Tooltip title="Mark as Resolved">
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleMarkResolved(item)}
                        >
                          <ResolvedIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteClick(item)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center">
                <Typography variant="body1" py={3}>
                  {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'No feedback matches your search criteria.' 
                    : 'No feedback available.'}
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2">
          User Feedback
        </Typography>
        <Button
          variant="outlined"
          onClick={handleToggleViewType}
        >
          Switch to {viewType === 'card' ? 'Table' : 'Card'} View
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <TextField
            placeholder="Search feedback..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          
          <Box display="flex" gap={2}>
            {/* Status Filters */}
            <Box>
              <Typography variant="caption" display="block" gutterBottom>
                Status
              </Typography>
              <Box display="flex" gap={1}>
                <Chip 
                  label="All" 
                  onClick={() => handleStatusFilterChange('all')}
                  color={statusFilter === 'all' ? 'primary' : 'default'}
                  variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="Pending" 
                  onClick={() => handleStatusFilterChange('pending')}
                  color={statusFilter === 'pending' ? 'warning' : 'default'}
                  variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="In Progress" 
                  onClick={() => handleStatusFilterChange('in_progress')}
                  color={statusFilter === 'in_progress' ? 'primary' : 'default'}
                  variant={statusFilter === 'in_progress' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="Resolved" 
                  onClick={() => handleStatusFilterChange('resolved')}
                  color={statusFilter === 'resolved' ? 'success' : 'default'}
                  variant={statusFilter === 'resolved' ? 'filled' : 'outlined'}
                  size="small"
                />
              </Box>
            </Box>
            
            {/* Priority Filters */}
            <Box>
              <Typography variant="caption" display="block" gutterBottom>
                Priority
              </Typography>
              <Box display="flex" gap={1}>
                <Chip 
                  label="All" 
                  onClick={() => handlePriorityFilterChange('all')}
                  color={priorityFilter === 'all' ? 'primary' : 'default'}
                  variant={priorityFilter === 'all' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="High" 
                  onClick={() => handlePriorityFilterChange('high')}
                  color={priorityFilter === 'high' ? 'error' : 'default'}
                  variant={priorityFilter === 'high' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="Medium" 
                  onClick={() => handlePriorityFilterChange('medium')}
                  color={priorityFilter === 'medium' ? 'warning' : 'default'}
                  variant={priorityFilter === 'medium' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="Low" 
                  onClick={() => handlePriorityFilterChange('low')}
                  color={priorityFilter === 'low' ? 'success' : 'default'}
                  variant={priorityFilter === 'low' ? 'filled' : 'outlined'}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {viewType === 'card' ? renderCardView() : renderTableView()}

      <Box mt={3}>
        <TablePagination
          component="div"
          count={filteredFeedback.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this feedback? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Response Dialog */}
      <Dialog
        open={responseDialogOpen}
        onClose={() => setResponseDialogOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{selectedFeedback?.response ? 'Edit Response' : 'Respond to Feedback'}</DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <>
              <Box mb={3} p={2} bgcolor="background.default" borderRadius={1}>
                <Typography variant="subtitle2" gutterBottom>
                  Original Feedback:
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  {selectedFeedback.subject}
                </Typography>
                <Typography variant="body2" paragraph>
                  {selectedFeedback.message}
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">
                    Rating:
                  </Typography>
                  <Rating value={selectedFeedback.rating} readOnly size="small" />
                </Box>
              </Box>
              
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Your Response"
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                placeholder="Type your response to this feedback..."
                variant="outlined"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleResponseSubmit} 
            variant="contained" 
            color="primary"
            disabled={!responseText.trim()}
          >
            {selectedFeedback?.response ? 'Update Response' : 'Send Response'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackList; 