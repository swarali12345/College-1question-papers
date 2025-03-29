import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authService } from '../services/api';
import { STORAGE_KEYS, USER_ROLES } from '../constants';

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
  
  // Initialize user from localStorage on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // First try to get user from localStorage
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          
          // Then validate with the backend
          try {
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
          } catch (error) {
            // If token is invalid, clear everything
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
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
      const data = await authService.login(credentials);
      setUser(data.user);
      return data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  // Register function
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      return data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
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
      const data = await authService.googleLogin(tokenId);
      setUser(data.user);
      return data.user;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Google login failed';
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
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
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
      const errorMessage = error.response?.data?.message || 'Profile update failed';
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
  const isAdmin = user?.role === USER_ROLES.ADMIN;
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