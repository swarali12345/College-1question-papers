import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import { APP_NAME } from '../constants';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <AppBar position="static" sx={{ boxShadow: 2 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <SchoolIcon sx={{ mr: 1, fontSize: isMobile ? 28 : 32 }} />
          <Typography 
            variant={isMobile ? "h6" : "h5"} 
            component="div"
            sx={{ 
              fontWeight: 'bold',
              letterSpacing: '0.5px'
            }}
          >
            {APP_NAME}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 