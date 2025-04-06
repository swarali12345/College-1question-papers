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
  Stack
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Search as SearchIcon,
  CloudUpload as UploadIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ROUTES } from '../../constants';
import { paperService } from '../../services/adminService';

// Mock API service - replace with actual API calls
const mockPapers = [
  {
    id: 'p1',
    title: 'Data Structures Mid-Term Exam 2023',
    subject: 'Data Structures',
    department: 'Computer Science',
    year: '2023',
    semester: '3',
    examType: 'Mid-Term',
    uploadDate: new Date('2023-10-15'),
    status: 'approved',
    uploader: 'admin@example.com',
    downloadCount: 42
  },
  {
    id: 'p2',
    title: 'Advanced Algorithms Final Exam 2023',
    subject: 'Algorithms',
    department: 'Computer Science',
    year: '2023',
    semester: '4',
    examType: 'Final',
    uploadDate: new Date('2023-12-02'),
    status: 'pending',
    uploader: 'professor@example.com',
    downloadCount: 28
  },
  {
    id: 'p3',
    title: 'Database Systems Quiz 1',
    subject: 'Database Systems',
    department: 'Information Technology',
    year: '2023',
    semester: '5',
    examType: 'Quiz',
    uploadDate: new Date('2023-09-10'),
    status: 'approved',
    uploader: 'admin@example.com',
    downloadCount: 56
  },
  {
    id: 'p4',
    title: 'Computer Networks Assignment 3',
    subject: 'Computer Networks',
    department: 'Computer Science',
    year: '2023',
    semester: '6',
    examType: 'Assignment',
    uploadDate: new Date('2023-11-05'),
    status: 'pending',
    uploader: 'contributor@example.com',
    downloadCount: 19
  },
  {
    id: 'p5',
    title: 'Operating Systems Final Exam 2022',
    subject: 'Operating Systems',
    department: 'Computer Science',
    year: '2022',
    semester: '5',
    examType: 'Final',
    uploadDate: new Date('2022-12-15'),
    status: 'approved',
    uploader: 'admin@example.com',
    downloadCount: 103
  },
];

const PapersList = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Fetch papers from API
    fetchPapers();
  }, []);

  const fetchPapers = async () => {
    setLoading(true);
    try {
      // Call the paperService from adminService
      const response = await paperService.getAllPapers();
      setPapers(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to load papers. Please try again.');
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

  const handleUploadClick = () => {
    // Change tab to upload paper
    navigate(`${ROUTES.ADMIN.DASHBOARD}?tab=2`);
  };

  const handleViewPaper = (paperId) => {
    navigate(`/papers/${paperId}`);
  };

  const handleDeleteClick = (paper) => {
    setSelectedPaper(paper);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedPaper) return;
    
    try {
      // Call the deletePaper method from paperService
      await paperService.deletePaper(selectedPaper._id);
      
      // Update local state
      setPapers(papers.filter(p => p._id !== selectedPaper._id));
      setDeleteDialogOpen(false);
      setSelectedPaper(null);
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error deleting paper:', err);
      setError('Failed to delete paper. Please try again.');
    }
  };

  const handleApproveClick = (paper) => {
    setSelectedPaper(paper);
    setApproveDialogOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!selectedPaper) return;
    
    try {
      await paperService.approvePaper(selectedPaper._id);
      
      // Update local state
      setPapers(papers.map(p => 
        p._id === selectedPaper._id ? { ...p, approved: true } : p
      ));
      
      setApproveDialogOpen(false);
      setSelectedPaper(null);
    } catch (err) {
      console.error('Error approving paper:', err);
      setError('Failed to approve paper. Please try again.');
    }
  };

  // Filter and search papers (only filtering by search now)
  const filteredPapers = papers.filter(paper => {
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        paper.title?.toLowerCase().includes(query) ||
        paper.subject?.toLowerCase().includes(query) ||
        paper.batch?.toLowerCase().includes(query) ||
        paper.year?.toLowerCase().includes(query) ||
        paper.semester?.toLowerCase().includes(query) ||
        paper.examType?.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Format date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch (e) {
      return 'Unknown date';
    }
  };

  const getStatusChipColor = (status) => {
    return status ? 'success' : 'warning';
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

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Manage Papers
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          {/* Search field */}
          <TextField
            placeholder="Search papers..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ width: '300px' }}
          />
          
          <Box>
            {/* Upload button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<UploadIcon />}
              onClick={handleUploadClick}
            >
              Upload Paper
            </Button>
          </Box>
        </Box>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : filteredPapers.length === 0 ? (
        <Alert severity="info">
          No papers found. {searchQuery && 'Try a different search term.'}
        </Alert>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Year & Semester</TableCell>
                <TableCell>Exam Type</TableCell>
                <TableCell>Upload Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPapers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((paper) => (
                  <TableRow key={paper._id}>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: '200px' }}>
                        {paper.title}
                      </Typography>
                    </TableCell>
                    <TableCell>{paper.subject}</TableCell>
                    <TableCell>{paper.batch}</TableCell>
                    <TableCell>
                      {paper.year}, {paper.semester}
                    </TableCell>
                    <TableCell>{paper.examType}</TableCell>
                    <TableCell>{formatDate(paper.createdAt)}</TableCell>
                    <TableCell>
                      <Chip
                        label={paper.approved ? 'Approved' : 'Pending'}
                        color={getStatusChipColor(paper.approved)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="View Paper">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewPaper(paper._id)}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {!paper.approved && (
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => handleApproveClick(paper)}
                            >
                              <ApproveIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(paper)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredPapers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this paper?
            <br />
            Title: {selectedPaper?.title}
            <br />
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
      
      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Confirm Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve this paper?
            <br />
            Title: {selectedPaper?.title}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApproveConfirm} color="success">Approve</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PapersList; 