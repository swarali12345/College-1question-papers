import React, { Component } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { APP_NAME } from '../constants';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console or an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              {APP_NAME}
            </Typography>
          </Box>

          <Container maxWidth="md" sx={{ my: 5 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 2,
              }}
            >
              <WarningIcon
                color="error"
                sx={{ fontSize: 60, mb: 2 }}
              />
              
              <Typography variant="h4" gutterBottom color="error">
                Something went wrong
              </Typography>
              
              <Typography variant="body1" paragraph color="text.secondary">
                We're sorry for the inconvenience. The application encountered an error.
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={this.handleRetry}
                  sx={{ mr: 2 }}
                >
                  Reload the page
                </Button>
                <Button 
                  variant="outlined"
                  onClick={this.handleGoHome}
                >
                  Go to homepage
                </Button>
              </Box>
              
              {this.state.error && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ textAlign: 'left', mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Error details (for developers):
                    </Typography>
                    <Paper
                      sx={{
                        p: 2,
                        bgcolor: '#f5f5f5',
                        maxHeight: '200px',
                        overflow: 'auto',
                      }}
                    >
                      <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error.toString()}
                        
                        {this.state.errorInfo &&
                          `\n\nComponent Stack: ${this.state.errorInfo.componentStack}`}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 