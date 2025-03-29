import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Chip,
  IconButton,
  Button,
  Rating,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Link
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as ApproveIcon,
  Block as RejectIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { feedbackService } from '../../services/api';
import { format } from 'date-fns';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
      });
      
      if (statusFilter !== 'all') {
        queryParams.append('status', statusFilter);
      }
      
      const response = await feedbackService.getFeedbacks(queryParams);
      setFeedbacks(response.data);
      setTotalCount(response.total);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [page, rowsPerPage, statusFilter]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (feedback) => {
    setFeedbackToDelete(feedback);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!feedbackToDelete) return;
    
    try {
      await feedbackService.deleteFeedback(feedbackToDelete._id);
      // Remove from local state to avoid refetching
      setFeedbacks(feedbacks.filter(f => f._id !== feedbackToDelete._id));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      setError('Failed to delete feedback. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setFeedbackToDelete(null);
    }
  };

  const handleUpdateStatus = async (feedbackId, newStatus) => {
    try {
      const updatedFeedback = await feedbackService.updateFeedbackStatus(feedbackId, {
        status: newStatus
      });
      
      // Update the feedback in the local state
      setFeedbacks(feedbacks.map(f => 
        f._id === feedbackId ? { ...f, status: updatedFeedback.status } : f
      ));
    } catch (err) {
      console.error('Error updating feedback status:', err);
      setError('Failed to update feedback status. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  const truncateText = (text, maxLength = 100) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Manage User Feedback
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2} 
          sx={{ mb: 3 }}
          alignItems="center"
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0); // Reset to first page when filter changes
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          
          <Box flexGrow={1} />
          
          <Typography variant="body2" color="text.secondary">
            Total: {totalCount} feedbacks
          </Typography>
        </Stack>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Paper</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Comment</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading feedbacks...</TableCell>
                </TableRow>
              ) : feedbacks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No feedbacks found</TableCell>
                </TableRow>
              ) : (
                feedbacks.map((feedback) => (
                  <TableRow key={feedback._id}>
                    <TableCell>
                      <Link 
                        component={RouterLink} 
                        to={`/papers/${feedback.paper?._id}`} 
                        underline="hover"
                      >
                        {feedback.paper?.title || 'Unknown Paper'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {feedback.user?.name || 'Unknown User'}
                    </TableCell>
                    <TableCell>
                      <Rating value={feedback.rating} readOnly precision={0.5} size="small" />
                    </TableCell>
                    <TableCell>
                      {truncateText(feedback.comment)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)} 
                        color={getStatusColor(feedback.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {feedback.createdAt ? format(new Date(feedback.createdAt), 'MMM dd, yyyy') : ''}
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleUpdateStatus(feedback._id, 'approved')}
                          title="Approve Feedback"
                          color="success"
                          disabled={feedback.status === 'approved'}
                        >
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleUpdateStatus(feedback._id, 'rejected')}
                          title="Reject Feedback"
                          color="error"
                          disabled={feedback.status === 'rejected'}
                        >
                          <RejectIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(feedback)}
                          title="Delete Feedback"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
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
    </Box>
  );
};

export default FeedbackList; 