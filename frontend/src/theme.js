import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // Custom palette
  palette: {
    primary: {
      main: '#b71c1c', // Dark red primary color
      light: '#d32f2f',
      dark: '#7f0000',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffffff', // White secondary color
      light: '#ffffff',
      dark: '#f5f5f5',
      contrastText: '#b71c1c',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  // Typography settings
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
  },
  // Component overrides
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
  // Shape settings
  shape: {
    borderRadius: 4,
  },
});

export default theme; 