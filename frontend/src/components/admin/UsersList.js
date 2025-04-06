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
  Avatar,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  CheckCircle as VerifyIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  MoreVert as MoreIcon,
  SupervisorAccount as ModeratorIcon,
  Mail as EmailIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { userService } from '../../services/adminService';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleMenuAnchor, setRoleMenuAnchor] = useState(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Fetch users from API
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Call the userService from adminService
      const response = await userService.getAllUsers();
      setUsers(response);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
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

  const handleRoleFilterChange = (role) => {
    setRoleFilter(role);
    setPage(0);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      // Call the deleteUser method from userService
      await userService.deleteUser(selectedUser._id);
      
      // Update local state
      setUsers(users.filter(u => u._id !== selectedUser._id));
      setDeleteDialogOpen(false);
      setSelectedUser(null);
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
    }
  };

  const handleBlockClick = (user) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

  const handleBlockConfirm = async () => {
    if (!selectedUser) return;
    
    try {
      // Get current status (default to active if undefined)
      const currentStatus = selectedUser.status || 'active';
      const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
      
      // Call the updateUserStatus method from userService
      await userService.updateUserStatus(selectedUser._id, newStatus);
      
      // Update local state
      setUsers(users.map(u => 
        u._id === selectedUser._id 
          ? { ...u, status: newStatus } 
          : u
      ));
      setBlockDialogOpen(false);
      setSelectedUser(null);
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error blocking/unblocking user:', err);
      setError('Failed to update user status. Please try again.');
    }
  };

  const handleRoleMenuOpen = (event, user) => {
    setRoleMenuAnchor(event.currentTarget);
    setCurrentUser(user);
  };

  const handleRoleMenuClose = () => {
    setRoleMenuAnchor(null);
    setCurrentUser(null);
  };

  const handleActionMenuOpen = (event, user) => {
    setActionMenuAnchor(event.currentTarget);
    setCurrentUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setCurrentUser(null);
  };

  const handleRoleChange = async (isAdmin) => {
    if (!currentUser) return;
    
    try {
      // Call the updateUserRole method from userService
      await userService.updateUserRole(currentUser._id, isAdmin);
      
      // Update local state
      setUsers(users.map(u => 
        u._id === currentUser._id ? { ...u, isAdmin } : u
      ));
      
      handleRoleMenuClose();
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };

  // Filter users according to search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = 
      roleFilter === 'all' || 
      (roleFilter === 'admin' && user.isAdmin) || 
      (roleFilter === 'user' && !user.isAdmin);
    
    return matchesSearch && matchesRole;
  });

  // Get paginated users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getRoleChipColor = (isAdmin) => {
    if (isAdmin) return 'primary';
    return 'default';
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" my={4}>
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
      <Typography variant="h6" component="h2" gutterBottom>
        Users Management
      </Typography>
      
      {/* Search and filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by name or email"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Box>
              <Typography variant="body2" component="span" mr={1}>
                Role:
              </Typography>
              <Chip 
                label="All" 
                onClick={() => handleRoleFilterChange('all')} 
                color={roleFilter === 'all' ? 'primary' : 'default'}
                sx={{ mr: 1 }}
              />
              <Chip 
                label="Admin" 
                onClick={() => handleRoleFilterChange('admin')} 
                color={roleFilter === 'admin' ? 'primary' : 'default'}
                sx={{ mr: 1 }}
              />
              <Chip 
                label="User" 
                onClick={() => handleRoleFilterChange('user')} 
                color={roleFilter === 'user' ? 'primary' : 'default'}
              />
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Users Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map(user => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={user.profilePicture} 
                          sx={{ 
                            mr: 2,
                            bgcolor: user.profilePicture ? 'transparent' : '#1976d2'
                          }}
                        >
                          {!user.profilePicture && getInitials(user.name)}
                        </Avatar>
                        <Typography variant="body1">{user.name || 'Unknown'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={user.isAdmin ? 'Admin' : 'User'} 
                        color={getRoleChipColor(user.isAdmin)}
                        size="small"
                        icon={user.isAdmin ? <AdminIcon /> : <UserIcon />}
                      />
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Actions">
                        <IconButton 
                          onClick={(e) => handleActionMenuOpen(e, user)}
                          size="small"
                        >
                          <MoreIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          component="div"
          count={filteredUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>
      
      {/* Role change menu */}
      <Menu
        anchorEl={roleMenuAnchor}
        open={Boolean(roleMenuAnchor)}
        onClose={handleRoleMenuClose}
      >
        <MenuItem onClick={() => handleRoleChange(true)}>
          <ListItemIcon>
            <AdminIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Make Admin</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange(false)}>
          <ListItemIcon>
            <UserIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Make Regular User</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Action menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => {
          handleRoleMenuOpen(actionMenuAnchor, currentUser);
          handleActionMenuClose();
        }}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Change Role</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleBlockClick(currentUser);
          handleActionMenuClose();
        }}>
          <ListItemIcon>
            {currentUser?.status === 'blocked' ? (
              <VerifyIcon fontSize="small" />
            ) : (
              <BlockIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {currentUser?.status === 'blocked' ? 'Unblock User' : 'Block User'}
          </ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleDeleteClick(currentUser);
          handleActionMenuClose();
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ color: 'error' }}>
            Delete User
          </ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Block/unblock confirmation dialog */}
      <Dialog
        open={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
      >
        <DialogTitle>
          {selectedUser?.status === 'blocked' ? 'Unblock User' : 'Block User'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedUser?.status === 'blocked' 
              ? `Are you sure you want to unblock the user "${selectedUser?.name}"?` 
              : `Are you sure you want to block the user "${selectedUser?.name}"? They will not be able to login.`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBlockConfirm} 
            color={selectedUser?.status === 'blocked' ? 'primary' : 'error'}
            variant="contained"
          >
            {selectedUser?.status === 'blocked' ? 'Unblock' : 'Block'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersList; 