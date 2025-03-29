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

// Mock API service - replace with actual API calls
const mockUsers = [
  {
    id: 'u1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    role: 'admin',
    createdAt: new Date('2023-01-15'),
    status: 'active',
    lastLogin: new Date('2023-04-28'),
    avatar: null,
    department: 'Computer Science'
  },
  {
    id: 'u2',
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    role: 'user',
    createdAt: new Date('2023-02-20'),
    status: 'active',
    lastLogin: new Date('2023-04-27'),
    avatar: null,
    department: 'Information Technology'
  },
  {
    id: 'u3',
    name: 'Michael Johnson',
    email: 'michael.j@example.com',
    role: 'moderator',
    createdAt: new Date('2023-03-10'),
    status: 'active',
    lastLogin: new Date('2023-04-25'),
    avatar: null,
    department: 'Computer Science'
  },
  {
    id: 'u4',
    name: 'Emily Williams',
    email: 'emily.w@example.com',
    role: 'user',
    createdAt: new Date('2023-03-15'),
    status: 'blocked',
    lastLogin: new Date('2023-04-10'),
    avatar: null,
    department: 'Electrical Engineering'
  },
  {
    id: 'u5',
    name: 'David Brown',
    email: 'david.b@example.com',
    role: 'user',
    createdAt: new Date('2023-03-20'),
    status: 'pending',
    lastLogin: null,
    avatar: null,
    department: 'Information Technology'
  }
];

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

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
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
      await userService.deleteUser(selectedUser.id);
      
      // Update local state
      setUsers(users.filter(u => u.id !== selectedUser.id));
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
      // Call the updateUserStatus method from userService
      await userService.updateUserStatus(selectedUser.id, 
        selectedUser.status === 'blocked' ? 'active' : 'blocked');
      
      // Update local state
      setUsers(users.map(u => 
        u.id === selectedUser.id 
          ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } 
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

  const handleRoleChange = async (role) => {
    if (!currentUser) return;
    
    try {
      // Call the updateUserRole method from userService
      await userService.updateUserRole(currentUser.id, role);
      
      // Update local state
      setUsers(users.map(u => 
        u.id === currentUser.id ? { ...u, role } : u
      ));
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    } finally {
      handleRoleMenuClose();
    }
  };

  const handleVerifyUser = async (user) => {
    try {
      // Call the updateUserStatus method from userService
      await userService.updateUserStatus(user.id, 'active');
      
      // Update local state
      setUsers(users.map(u => 
        u.id === user.id ? { ...u, status: 'active' } : u
      ));
      
      // Show a success message (in a real app)
    } catch (err) {
      console.error('Error verifying user:', err);
      setError('Failed to verify user. Please try again.');
    } finally {
      handleActionMenuClose();
    }
  };

  const handleSendEmail = (user) => {
    // Implement email functionality
    console.log(`Send email to ${user.email}`);
    handleActionMenuClose();
    // In a real app, this might open a dialog to compose an email
  };

  // Filter users based on search query, role filter, and status filter
  const filteredUsers = users.filter(user => {
    // Apply role filter
    if (roleFilter !== 'all' && user.role !== roleFilter) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== 'all' && user.status !== statusFilter) {
      return false;
    }
    
    // Apply search filter (case insensitive)
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.department && user.department.toLowerCase().includes(searchLower))
    );
  });

  // Paginate filtered users
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getRoleChipColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'moderator':
        return 'primary';
      case 'user':
      default:
        return 'default';
    }
  };

  const getStatusChipColor = (status) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'blocked':
        return 'error';
      default:
        return 'default';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Function to get color based on name (for avatar)
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

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" component="h2">
          Manage Users
        </Typography>
        <Button
          variant="contained"
          color="primary"
        >
          Export User Data
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Box p={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <TextField
            placeholder="Search users..."
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
            {/* Role Filters */}
            <Box>
              <Typography variant="caption" display="block" gutterBottom>
                Role
              </Typography>
              <Box display="flex" gap={1}>
                <Chip 
                  label="All" 
                  onClick={() => handleRoleFilterChange('all')}
                  color={roleFilter === 'all' ? 'primary' : 'default'}
                  variant={roleFilter === 'all' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="Admin" 
                  onClick={() => handleRoleFilterChange('admin')}
                  color={roleFilter === 'admin' ? 'error' : 'default'}
                  variant={roleFilter === 'admin' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="Moderator" 
                  onClick={() => handleRoleFilterChange('moderator')}
                  color={roleFilter === 'moderator' ? 'primary' : 'default'}
                  variant={roleFilter === 'moderator' ? 'filled' : 'outlined'}
                  size="small"
                />
                <Chip 
                  label="User" 
                  onClick={() => handleRoleFilterChange('user')}
                  color={roleFilter === 'user' ? 'secondary' : 'default'}
                  variant={roleFilter === 'user' ? 'filled' : 'outlined'}
                  size="small"
                />
              </Box>
            </Box>
            
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
                  label="Active" 
                  onClick={() => handleStatusFilterChange('active')}
                  color={statusFilter === 'active' ? 'success' : 'default'}
                  variant={statusFilter === 'active' ? 'filled' : 'outlined'}
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
                  label="Blocked" 
                  onClick={() => handleStatusFilterChange('blocked')}
                  color={statusFilter === 'blocked' ? 'error' : 'default'}
                  variant={statusFilter === 'blocked' ? 'filled' : 'outlined'}
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Joined</TableCell>
              <TableCell>Last Login</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        sx={{ 
                          bgcolor: stringToColor(user.name),
                          width: 32, 
                          height: 32,
                          marginRight: 1
                        }}
                      >
                        {getInitials(user.name)}
                      </Avatar>
                      <Typography variant="body2">
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department || '-'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
                      size="small" 
                      color={getRoleChipColor(user.role)}
                      onClick={(e) => handleRoleMenuOpen(e, user)}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status.charAt(0).toUpperCase() + user.status.slice(1)} 
                      size="small" 
                      color={getStatusChipColor(user.status)}
                    />
                  </TableCell>
                  <TableCell>{format(user.createdAt, 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    {user.lastLogin 
                      ? format(user.lastLogin, 'dd MMM yyyy')
                      : 'Never'
                    }
                  </TableCell>
                  <TableCell align="right">
                    <Box>
                      <Tooltip title="More Actions">
                        <IconButton 
                          size="small" 
                          onClick={(e) => handleActionMenuOpen(e, user)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </Tooltip>
                      {user.status === 'active' ? (
                        <Tooltip title="Block User">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleBlockClick(user)}
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      ) : user.status === 'blocked' ? (
                        <Tooltip title="Unblock User">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleBlockClick(user)}
                          >
                            <VerifyIcon />
                          </IconButton>
                        </Tooltip>
                      ) : user.status === 'pending' ? (
                        <Tooltip title="Verify User">
                          <IconButton 
                            size="small" 
                            color="success"
                            onClick={() => handleVerifyUser(user)}
                          >
                            <VerifyIcon />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" py={3}>
                    {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                      ? 'No users match your search criteria.' 
                      : 'No users available.'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* Role Selection Menu */}
      <Menu
        anchorEl={roleMenuAnchor}
        open={Boolean(roleMenuAnchor)}
        onClose={handleRoleMenuClose}
      >
        <MenuItem onClick={() => handleRoleChange('admin')}>
          <ListItemIcon>
            <AdminIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Admin</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange('moderator')}>
          <ListItemIcon>
            <ModeratorIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Moderator</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleRoleChange('user')}>
          <ListItemIcon>
            <UserIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Regular User</ListItemText>
        </MenuItem>
      </Menu>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => handleSendEmail(currentUser)}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          handleActionMenuClose();
          handleDeleteClick(currentUser);
        }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete User</ListItemText>
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the user "{selectedUser?.name}" with email "{selectedUser?.email}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Block/Unblock Confirmation Dialog */}
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
              ? `Are you sure you want to unblock the user "${selectedUser?.name}"? They will regain access to the platform.`
              : `Are you sure you want to block the user "${selectedUser?.name}"? They will no longer be able to access the platform.`
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBlockConfirm} 
            color={selectedUser?.status === 'blocked' ? 'success' : 'error'} 
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