import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  InputBase,
  alpha,
  styled,
  ListItemButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Home as HomeIcon,
  School as SchoolIcon,
  Feedback as FeedbackIcon,
  Settings as SettingsIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES, APP_NAME } from '../../constants';

// Styled search bar component
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Header = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleCloseUserMenu();
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.SEARCH_RESULTS}?query=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Get user's initials for avatar
  const getUserInitials = () => {
    if (!user?.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0][0].toUpperCase();
  };

  // Drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" color="primary" fontWeight="bold">
          {APP_NAME}
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate(ROUTES.HOME)}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate(ROUTES.SEARCH)}>
            <ListItemIcon>
              <SearchIcon />
            </ListItemIcon>
            <ListItemText primary="Papers" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/feedback')}>
            <ListItemIcon>
              <FeedbackIcon />
            </ListItemIcon>
            <ListItemText primary="Feedback" />
          </ListItemButton>
        </ListItem>
      </List>
      
      {isAuthenticated && (
        <>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate(ROUTES.PROFILE)}>
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
            
            {isAdmin && (
              <ListItem disablePadding>
                <ListItemButton onClick={() => navigate(ROUTES.ADMIN.DASHBOARD)}>
                  <ListItemIcon>
                    <AdminIcon />
                  </ListItemIcon>
                  <ListItemText primary="Admin Panel" />
                </ListItemButton>
              </ListItem>
            )}
            
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.dark' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu icon */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { xs: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo and title - desktop */}
          <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: 30 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to={ROUTES.HOME}
            sx={{
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              fontSize: '1.5rem',
              letterSpacing: '.1rem',
              color: 'white',
              textDecoration: 'none',
              mr: 2,
            }}
          >
            PYQ-PAPERS
          </Typography>
          
          {/* Logo and title - mobile */}
          <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, fontSize: 28 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to={ROUTES.HOME}
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              fontSize: '1.2rem',
              letterSpacing: '.05rem',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            PYQ-PAPERS
          </Typography>
          
          {/* Navigation links - desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <Button
              component={RouterLink}
              to={ROUTES.HOME}
              sx={{ my: 2, color: 'white', display: 'block', mx: 1 }}
            >
              Home
            </Button>
            
            <Button
              component={RouterLink}
              to={ROUTES.SEARCH}
              sx={{ my: 2, color: 'white', display: 'block', mx: 1 }}
            >
              Papers
            </Button>

            <Button
              component={RouterLink}
              to="/feedback"
              sx={{ my: 2, color: 'white', display: 'block', mx: 1 }}
            >
              Feedback
            </Button>
            
            {isAdmin && (
              <Button
                component={RouterLink}
                to={ROUTES.ADMIN.DASHBOARD}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Admin
              </Button>
            )}
          </Box>
          
          {/* Search bar */}
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form onSubmit={handleSearch}>
              <StyledInputBase
                placeholder="Search papers…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </Search>
          
          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title={`${user?.name || 'User'} • Click to view profile options`}>
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {user?.profilePicture ? (
                      <Avatar alt={user.name} src={user.profilePicture} />
                    ) : (
                      <Avatar sx={{ bgcolor: 'secondary.main', color: 'primary.main' }}>
                        {getUserInitials()}
                      </Avatar>
                    )}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {user && (
                    <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
                      <Typography variant="subtitle1" fontWeight="bold">{user.name}</Typography>
                      <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                  )}
                  
                  <Divider />
                  
                  <MenuItem 
                    onClick={() => {
                      handleCloseUserMenu();
                      navigate(ROUTES.PROFILE);
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  
                  {isAdmin && (
                    <MenuItem 
                      onClick={() => {
                        handleCloseUserMenu();
                        navigate(ROUTES.ADMIN.DASHBOARD);
                      }}
                    >
                      <ListItemIcon>
                        <AdminIcon fontSize="small" />
                      </ListItemIcon>
                      <Typography textAlign="center">Admin Panel</Typography>
                    </MenuItem>
                  )}
                  
                  <Divider />
                  
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography textAlign="center" color="error">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  component={RouterLink}
                  to={ROUTES.LOGIN}
                  color="inherit"
                  variant="text"
                  sx={{ mr: 1 }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to={ROUTES.REGISTER}
                  variant="outlined"
                  color="inherit"
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Header; 