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
  Avatar,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Block as BlockIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { userService } from '../../services/api';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

const UsersList = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUsers = async () => {
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
      
      const response = await userService.getUsers(queryParams);
      setUsers(response.data);
      setTotalCount(response.total);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage]);

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
    fetchUsers();
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;
    
    try {
      await userService.deleteUser(userToDelete._id);
      // Remove from local state to avoid refetching
      setUsers(users.filter(u => u._id !== userToDelete._id));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleRoleClick = (user) => {
    setUserToUpdateRole(user);
    setIsAdmin(user.role === 'admin');
    setRoleDialogOpen(true);
  };

  const handleRoleConfirm = async () => {
    if (!userToUpdateRole) return;
    
    try {
      const updatedUser = await userService.updateUser(userToUpdateRole._id, {
        role: isAdmin ? 'admin' : 'user'
      });
      
      // Update the user in the local state
      setUsers(users.map(u => 
        u._id === userToUpdateRole._id ? { ...u, role: updatedUser.role } : u
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    } finally {
      setRoleDialogOpen(false);
      setUserToUpdateRole(null);
    }
  };

  const handleToggleActive = async (user) => {
    try {
      const updatedUser = await userService.updateUser(user._id, {
        isActive: !user.isActive
      });
      
      // Update the user in the local state
      setUsers(users.map(u => 
        u._id === user._id ? { ...u, isActive: updatedUser.isActive } : u
      ));
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  // Generate random avatar color based on user id
  const getAvatarColor = (userId) => {
    const colors = [
      '#e57373', '#f06292', '#ba68c8', '#9575cd', 
      '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1',
      '#4db6ac', '#81c784', '#aed581', '#dce775',
      '#fff176', '#ffd54f', '#ffb74d', '#ff8a65'
    ];
    
    // Simple hash function to generate a consistent index
    const hashCode = (str) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return Math.abs(hash);
    };
    
    const index = hashCode(userId) % colors.length;
    return colors[index];
  };

  return (
    <Box>
      <Typography variant="h6" component="h2" gutterBottom>
        Manage Users
      </Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flex: 1 }}>
            <TextField
              fullWidth
              placeholder="Search users by name or email"
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
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Auth Method</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="center">Joined On</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Loading users...</TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">No users found</TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar 
                          sx={{ 
                            mr: 2, 
                            bgcolor: user.avatar ? 'transparent' : getAvatarColor(user._id) 
                          }}
                          src={user.avatar}
                        >
                          {!user.avatar && user.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography>{user.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell align="center">
                      <Chip 
                        icon={user.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                        label={user.role === 'admin' ? 'Admin' : 'User'} 
                        color={user.role === 'admin' ? 'secondary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={user.googleId ? 'Google' : 'Email'} 
                        size="small"
                        color={user.googleId ? 'primary' : 'default'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        icon={user.isActive ? <CheckIcon /> : <BlockIcon />}
                        label={user.isActive ? 'Active' : 'Inactive'} 
                        color={user.isActive ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {user.createdAt ? format(new Date(user.createdAt), 'MMM dd, yyyy') : ''}
                    </TableCell>
                    <TableCell align="center">
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => handleToggleActive(user)}
                          title={user.isActive ? 'Deactivate User' : 'Activate User'}
                          color={user.isActive ? 'default' : 'success'}
                          disabled={user._id === currentUser?._id} // Can't deactivate yourself
                        >
                          {user.isActive ? <BlockIcon fontSize="small" /> : <CheckIcon fontSize="small" />}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleRoleClick(user)}
                          title="Change Role"
                          color={user.role === 'admin' ? 'secondary' : 'default'}
                          disabled={user._id === currentUser?._id} // Can't change your own role
                        >
                          {user.role === 'admin' ? <UserIcon fontSize="small" /> : <AdminIcon fontSize="small" />}
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => handleDeleteClick(user)}
                          title="Delete User"
                          color="error"
                          disabled={user._id === currentUser?._id} // Can't delete yourself
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
            Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone.
            All papers uploaded by this user will remain in the system but will be marked as uploaded by a deleted user.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Change Role Dialog */}
      <Dialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
      >
        <DialogTitle>Change User Role</DialogTitle>
        <DialogContent>
          <DialogContentText gutterBottom>
            Change role for user "{userToUpdateRole?.name}":
          </DialogContentText>
          <FormControlLabel
            control={
              <Switch 
                checked={isAdmin} 
                onChange={(e) => setIsAdmin(e.target.checked)} 
                color="primary"
              />
            }
            label={isAdmin ? "Admin (Can manage all content)" : "Regular User"}
          />
          
          {isAdmin && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Warning: Admins have full access to all system functions including user management and content moderation.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleRoleConfirm} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList; 