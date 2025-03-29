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
  TextField,
  InputAdornment,
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
  InputLabel
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  CheckCircle as ApproveIcon,
  Block as RejectIcon
} from '@mui/icons-material';
import { paperService } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { PAPER_CATEGORIES } from '../../constants';

const PapersList = () => {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paperToDelete, setPaperToDelete] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState('all');
  const [department, setDepartment] = useState('');
  const [examType, setExamType] = useState('');
  const [year, setYear] = useState('');

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page + 1,
        limit: rowsPerPage,
      });
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      if (approvalStatus !== 'all') {
        queryParams.append('approved', approvalStatus === 'approved' ? 'true' : 'false');
      }
      
      if (department) {
        queryParams.append('department', department);
      }
      
      if (examType) {
        queryParams.append('examType', examType);
      }
      
      if (year) {
        queryParams.append('year', year);
      }
      
      const response = await paperService.getPapers(queryParams);
      setPapers(response.data);
      setTotalCount(response.total);
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to load papers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, [page, rowsPerPage, approvalStatus, department, examType, year]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0); // Reset to first page when searching
    fetchPapers();
  };

  const handleDeleteClick = (paper) => {
    setPaperToDelete(paper);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!paperToDelete) return;
    
    try {
      await paperService.deletePaper(paperToDelete._id);
      // Remove from local state to avoid refetching
      setPapers(papers.filter(p => p._id !== paperToDelete._id));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting paper:', err);
      setError('Failed to delete paper. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setPaperToDelete(null);
    }
  };

  const handleApproveToggle = async (paper) => {
    try {
      const updatedPaper = await paperService.updatePaper(paper._id, {
        approved: !paper.approved
      });
      
      // Update the paper in the local state
      setPapers(papers.map(p => 
        p._id === paper._id ? { ...p, approved: updatedPaper.approved } : p
      ));
    } catch (err) {
      console.error('Error updating paper approval status:', err);
      setError('Failed to update paper status. Please try again.');
    }
  };

  const handleViewPaper = (paperId) => {
    navigate(`/papers/${paperId}`);
  };

  const handleEditPaper = (paperId) => {
    navigate(`/admin/papers/edit/${paperId}`);
  };

  const handleFilterChange = () => {
    setPage(0); // Reset to first page when filter changes
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Manage Papers
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flex: 1 }}>
            <TextField
              fullWidth
              placeholder="Search papers by title, subject, or uploader"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <Button type="submit" variant="contained" size="small">
                      Search
                    </Button>
                  </InputAdornment>
                )
              }}
            />
          </Box>
        </Stack>
        
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2} 
          sx={{ mb: 3 }}
          alignItems="center"
        >
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={approvalStatus}
              label="Status"
              onChange={(e) => {
                setApprovalStatus(e.target.value);
                handleFilterChange();
              }}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Department</InputLabel>
            <Select
              value={department}
              label="Department"
              onChange={(e) => {
                setDepartment(e.target.value);
                handleFilterChange();
              }}
            >
              <MenuItem value="">All Departments</MenuItem>
              {PAPER_CATEGORIES.DEPARTMENTS.map((dept) => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Exam Type</InputLabel>
            <Select
              value={examType}
              label="Exam Type"
              onChange={(e) => {
                setExamType(e.target.value);
                handleFilterChange();
              }}
            >
              <MenuItem value="">All Types</MenuItem>
              {PAPER_CATEGORIES.EXAM_TYPES.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => {
                setYear(e.target.value);
                handleFilterChange();
              }}
            >
              <MenuItem value="">All Years</MenuItem>
              {PAPER_CATEGORIES.YEARS.map((yr) => (
                <MenuItem key={yr} value={yr}>{yr}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box flexGrow={1} />
          
          <Button 
            variant="outlined" 
            onClick={() => {
              setSearchTerm('');
              setApprovalStatus('all');
              setDepartment('');
              setExamType('');
              setYear('');
              setPage(0);
              fetchPapers();
            }}
          >
            Clear Filters
          </Button>
        </Stack>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Department</TableCell>
                <TableCell align="center">Year</TableCell>
                <TableCell align="center">Exam Type</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Stats</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Loading papers...</TableCell>
                </TableRow>
              ) : papers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">No papers found</TableCell>
                </TableRow>
              ) : (
                papers.map((paper) => (
                  <TableRow key={paper._id}>
                    <TableCell>{paper.title}</TableCell>
                    <TableCell>{paper.subject}</TableCell>
                    <TableCell>{paper.department}</TableCell>
                    <TableCell align="center">{paper.year}</TableCell>
                    <TableCell align="center">{paper.examType}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={paper.approved ? 'Approved' : 'Pending'} 
                        color={paper.approved ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2">
                        👁️ {paper.views} | ⬇️ {paper.downloads}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleViewPaper(paper._id)}
                          title="View Paper"
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleEditPaper(paper._id)}
                          title="Edit Paper"
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleApproveToggle(paper)}
                          title={paper.approved ? 'Mark as Pending' : 'Approve Paper'}
                          color={paper.approved ? 'default' : 'success'}
                        >
                          {paper.approved ? <RejectIcon fontSize="small" /> : <ApproveIcon fontSize="small" />}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(paper)}
                          title="Delete Paper"
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
            Are you sure you want to delete the paper "{paperToDelete?.title}"? This action cannot be undone.
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

export default PapersList; 