import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { subjectService } from '../../services';
import { ACADEMIC_OPTIONS } from '../../constants';

const SubjectManager = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openNewDialog, setOpenNewDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New subject form state
  const [newSubject, setNewSubject] = useState({
    name: '',
    year: '',
    semester: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Load subjects on component mount
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Fetch all subjects
  const fetchSubjects = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await subjectService.getAllSubjects();
      setSubjects(response.data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      setError('Failed to load subjects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle subject form input changes
  const handleSubjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubject({ ...newSubject, [name]: value });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  // Validate the new subject form
  const validateForm = () => {
    const errors = {};
    
    if (!newSubject.name.trim()) {
      errors.name = 'Subject name is required';
    }
    
    if (!newSubject.year) {
      errors.year = 'Year is required';
    }
    
    if (!newSubject.semester) {
      errors.semester = 'Semester is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle adding a new subject
  const handleAddSubject = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await subjectService.createSubject(newSubject);
      setSuccess('Subject added successfully!');
      setOpenNewDialog(false);
      setNewSubject({ name: '', year: '', semester: '' });
      fetchSubjects();
    } catch (error) {
      console.error('Error creating subject:', error);
      setError('Failed to add subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle opening delete confirmation dialog
  const handleDeleteClick = (subject) => {
    setSelectedSubject(subject);
    setOpenDeleteDialog(true);
  };

  // Handle deleting a subject
  const handleDeleteSubject = async () => {
    if (!selectedSubject) return;
    
    setLoading(true);
    setError('');
    
    try {
      await subjectService.deleteSubject(selectedSubject._id);
      setSuccess('Subject deleted successfully!');
      setOpenDeleteDialog(false);
      fetchSubjects();
    } catch (error) {
      console.error('Error deleting subject:', error);
      setError('Failed to delete subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.year.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.semester.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get paginated subjects
  const paginatedSubjects = filteredSubjects.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Subject Management
      </Typography>
      
      {/* Control Panel */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Search Subjects"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={8} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={fetchSubjects}
              sx={{ mr: 1 }}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenNewDialog(true)}
            >
              Add New Subject
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Status Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Subjects Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography variant="subtitle2">Subject Name</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Year</Typography></TableCell>
              <TableCell><Typography variant="subtitle2">Semester</Typography></TableCell>
              <TableCell align="right"><Typography variant="subtitle2">Actions</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && subjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress size={24} sx={{ my: 2 }} />
                </TableCell>
              </TableRow>
            ) : paginatedSubjects.length > 0 ? (
              paginatedSubjects.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.year}</TableCell>
                  <TableCell>{subject.semester}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(subject)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {searchTerm
                    ? 'No subjects match your search criteria'
                    : 'No subjects available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSubjects.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Add New Subject Dialog */}
      <Dialog open={openNewDialog} onClose={() => setOpenNewDialog(false)}>
        <DialogTitle>Add New Subject</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the details for the new subject.
          </DialogContentText>
          
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                fullWidth
                label="Subject Name"
                name="name"
                value={newSubject.name}
                onChange={handleSubjectInputChange}
                error={!!formErrors.name}
                helperText={formErrors.name}
                margin="normal"
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!formErrors.year} required>
                <InputLabel>Year</InputLabel>
                <Select
                  name="year"
                  value={newSubject.year}
                  onChange={handleSubjectInputChange}
                  label="Year"
                >
                  {ACADEMIC_OPTIONS.YEARS.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
                {formErrors.year && (
                  <Typography variant="caption" color="error">
                    {formErrors.year}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" error={!!formErrors.semester} required>
                <InputLabel>Semester</InputLabel>
                <Select
                  name="semester"
                  value={newSubject.semester}
                  onChange={handleSubjectInputChange}
                  label="Semester"
                >
                  {ACADEMIC_OPTIONS.SEMESTERS.map((semester) => (
                    <MenuItem key={semester} value={semester}>{semester}</MenuItem>
                  ))}
                </Select>
                {formErrors.semester && (
                  <Typography variant="caption" color="error">
                    {formErrors.semester}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNewDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddSubject}
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Subject'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Subject</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the subject "{selectedSubject?.name}"?
            This action cannot be undone, and may affect papers associated with this subject.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteSubject}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubjectManager; 