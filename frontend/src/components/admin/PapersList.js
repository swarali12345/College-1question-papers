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
  Edit as EditIcon,
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

  const handleEditPaper = (paperId) => {
    navigate(`${ROUTES.ADMIN.PAPERS_EDIT}/${paperId}`);
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
      await paperService.deletePaper(selectedPaper.id);
      
      // Update local state
      setPapers(papers.filter(p => p.id !== selectedPaper.id));
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
      // Call the approvePaper method from paperService
      await paperService.approvePaper(selectedPaper.id);
      
      // Update local state
      setPapers(papers.map(p => 
        p.id === selectedPaper.id ? { ...p, status: 'approved' } : p
      ));
      setApproveDialogOpen(false);
      setSelectedPaper(null);
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error approving paper:', err);
      setError('Failed to approve paper. Please try again.');
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  // Filter papers based on search query and status filter
  const filteredPapers = papers.filter(paper => {
    // Apply status filter
    if (statusFilter !== 'all' && paper.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    const searchLower = searchQuery.toLowerCase();
    return (
      paper.title.toLowerCase().includes(searchLower) ||
      paper.subject.toLowerCase().includes(searchLower) ||
      paper.department.toLowerCase().includes(searchLower) ||
      paper.year.includes(searchQuery) ||
      paper.examType.toLowerCase().includes(searchLower)
    );
  });

  // Paginate filtered papers
  const paginatedPapers = filteredPapers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
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
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2">
          Manage Papers
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<UploadIcon />}
          onClick={handleUploadClick}
        >
          Upload New Paper
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <TextField
            placeholder="Search papers..."
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
          
          <Stack direction="row" spacing={1}>
            <Chip 
              label="All" 
              onClick={() => handleStatusFilterChange('all')}
              color={statusFilter === 'all' ? 'primary' : 'default'}
              variant={statusFilter === 'all' ? 'filled' : 'outlined'}
            />
            <Chip 
              label="Approved" 
              onClick={() => handleStatusFilterChange('approved')}
              color={statusFilter === 'approved' ? 'success' : 'default'}
              variant={statusFilter === 'approved' ? 'filled' : 'outlined'}
            />
            <Chip 
              label="Pending" 
              onClick={() => handleStatusFilterChange('pending')}
              color={statusFilter === 'pending' ? 'warning' : 'default'}
              variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
            />
          </Stack>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell>Title</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Upload Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Downloads</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPapers.length > 0 ? (
              paginatedPapers.map((paper) => (
                <TableRow key={paper.id} hover>
                  <TableCell sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {paper.title}
                  </TableCell>
                  <TableCell>{paper.subject}</TableCell>
                  <TableCell>{paper.department}</TableCell>
                  <TableCell>{paper.year} (Sem {paper.semester})</TableCell>
                  <TableCell>{format(paper.uploadDate, 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Chip 
                      label={paper.status.charAt(0).toUpperCase() + paper.status.slice(1)} 
                      size="small" 
                      color={getStatusChipColor(paper.status)}
                    />
                  </TableCell>
                  <TableCell>{paper.downloadCount}</TableCell>
                  <TableCell align="right">
                    <Box>
                      <Tooltip title="View Paper">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleViewPaper(paper.id)}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Paper">
                        <IconButton 
                          size="small" 
                          color="secondary"
                          onClick={() => handleEditPaper(paper.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {paper.status === 'pending' && (
                        <Tooltip title="Approve Paper">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleApproveClick(paper)}
                          >
                            <ApproveIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete Paper">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteClick(paper)}
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
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" py={3}>
                    {searchQuery 
                      ? 'No papers match your search criteria.' 
                      : 'No papers available.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Paper</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the paper "{selectedPaper?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approve Confirmation Dialog */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>Approve Paper</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to approve the paper "{selectedPaper?.title}"? Once approved, it will be visible to all users.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleApproveConfirm} color="success" variant="contained">
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PapersList; 