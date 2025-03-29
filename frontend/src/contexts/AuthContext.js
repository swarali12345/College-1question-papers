import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authService } from '../services';
import { USER_ROLES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

export const AuthContext = createContext();

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  // Initialize user from localStorage on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // First try to get user from localStorage
        const storedUser = localStorage.getItem('user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          
          // Then validate with the backend
          try {
            const currentUser = await authService.getProfile();
            setUser(currentUser);
          } catch (error) {
            // If token is invalid, clear everything
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Login function
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext login with:', credentials);
      const { email, password } = credentials; 
      
      // Validate credentials before sending to API
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Call the auth service login method
      const data = await authService.login(email, password);
      
      // Log authentication data received
      console.log('Login successful, user data:', { 
        id: data.user?.id,
        name: data.user?.name,
        isAdmin: data.user?.isAdmin,
        hasToken: !!data.token,
        tokenLength: data.token?.length,
        redirect: data.redirect
      });
      
      if (!data.user) {
        throw new Error('User data missing from login response');
      }
      
      // Set the authenticated user in state
      setUser(data.user);

      // Handle redirect path from backend response
      if (data.redirect && data.redirect.path) {
        console.log('Redirecting to:', data.redirect.path);
        navigate(data.redirect.path);
      } else {
        // Fallback redirect if redirect info is missing
        navigate(data.user.isAdmin ? '/admin' : '/dashboard');
      }
      
      return data.user;
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      
      // Create user-friendly error message
      let errorMessage = 'Login failed';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 'Server error during login';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error; // Re-throw to let the component handle it
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('AuthContext register with:', userData);
      const { name, email, password } = userData;
      const data = await authService.register(name, email, password);
      setUser(data.user);
      
      // Redirect to the search page after successful registration
      navigate(ROUTES.SEARCH);
      
      return data.user;
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Google login function
  const googleLogin = async (tokenId) => {
    setLoading(true);
    setError(null);
    
    try {
      // This is a placeholder - we don't have Google login implemented yet
      setError('Google login is not yet implemented');
      throw new Error('Google login is not yet implemented');
    } catch (error) {
      const errorMessage = error.message || 'Google login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Logout function
  const logout = useCallback(async () => {
    setLoading(true);
    
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server logout fails, clear local user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update profile function
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authService.updateProfile(profileData);
      setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
      return updatedUser;
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear error
  const clearError = () => {
    setError(null);
  };
  
  // Check if user is admin
  const isAdmin = user?.isAdmin === true;
  const isAuthenticated = !!user;
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        register,
        googleLogin,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 