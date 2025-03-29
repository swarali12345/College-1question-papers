import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';

// Theme
import theme from './theme';

// Auth Context Provider
import { AuthProvider } from './contexts/AuthContext';

// Layout
import Layout from './components/Layout';

// Routes Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PaperDetails from './pages/PaperDetails';
import SearchResults from './pages/SearchResults';
import NotFound from './pages/NotFound';
import AdminDashboard from './pages/AdminDashboard';

// Route Guards
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';

// Admin Components
import PaperEdit from './components/admin/PaperEdit';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="papers/:id" element={<PaperDetails />} />
                <Route path="search" element={<SearchResults />} />
                
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
                      <Layout>
                        <PaperEdit />
                      </Layout>
                    </AdminRoute>
                  } 
                />
                
                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App; 