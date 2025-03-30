import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { Box } from '@mui/material';

// Theme
import theme from './theme';

// Auth Context Provider
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Layout from './components/layout/Layout';

// Routes Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PaperDetails from './pages/PaperDetails';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';
import Search from './pages/Search';
import Subjects from './pages/Subjects';
import Feedback from './pages/Feedback';
import UploadPaper from './pages/UploadPaper';

// Route Guards
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';

// Admin Components
import PaperEdit from './components/admin/PaperEdit';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <SnackbarProvider maxSnack={3}>
          <Router>
            <AuthProvider>
              <Routes>
                {/* Authentication Routes outside of layout */}
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Public Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="papers/:id" element={<PaperDetails />} />
                  <Route path="search" element={<Search />} />
                  <Route path="search-results" element={<SearchResults />} />
                  <Route path="subjects/:year/:semester" element={<Subjects />} />
                  <Route path="/feedback" element={<Feedback />} />
                  
                  {/* Protected Routes */}
                  <Route 
                    path="profile" 
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Admin Routes */}
                  <Route 
                    path="admin" 
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route 
                    path="admin/papers/edit/:id" 
                    element={
                      <AdminRoute>
                        <PaperEdit />
                      </AdminRoute>
                    } 
                  />
                  
                  <Route 
                    path="upload-paper" 
                    element={
                      <AdminRoute>
                        <UploadPaper />
                      </AdminRoute>
                    } 
                  />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AuthProvider>
          </Router>
        </SnackbarProvider>
      </Box>
    </ThemeProvider>
  );
}

export default App; 