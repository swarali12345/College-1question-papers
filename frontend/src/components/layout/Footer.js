import React from 'react';
import {
  Box,
  Container,
  Typography,
  Link,
  Divider,
  Paper,
  Alert,
} from '@mui/material';
import { InfoOutlined as InfoIcon } from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Paper 
      component="footer" 
      square 
      variant="outlined" 
      sx={{ 
        py: 3, 
        px: 2, 
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 2 }}>
          <Alert 
            severity="info" 
            icon={<InfoIcon />}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            <Typography variant="body2">
              <strong>Copyright Protection:</strong> All paper content is protected by copyright law. 
              Downloading, screenshots, and distribution of content are prohibited. 
              Documents can only be viewed through our secure viewer for academic purposes.
            </Typography>
          </Alert>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {currentYear} SIT Nagpur Paper Repository. All rights reserved.
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: { xs: 2, sm: 0 } }}>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              <Typography variant="body2">
                Privacy Policy
              </Typography>
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              <Typography variant="body2">
                Terms of Use
              </Typography>
            </Link>
            <Link href="#" color="inherit" sx={{ mx: 1 }}>
              <Typography variant="body2">
                Contact
              </Typography>
            </Link>
          </Box>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer; 