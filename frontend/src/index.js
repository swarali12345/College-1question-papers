import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { authService, paperService, userService, feedbackService } from './services';

// Expose services for testing in browser console
if (process.env.NODE_ENV === 'development') {
  // Create test functions
  const testAuthService = async () => {
    try {
      console.log('Testing auth service...');
      // Try login first (in case user already exists)
      try {
        const loginData = await authService.login('test@example.com', 'password123');
        console.log('Login successful:', loginData);
        return loginData;
      } catch (loginError) {
        console.log('Login failed, trying registration instead:', loginError);
        
        // If login fails, try registration
        const registerData = await authService.register('Test User', 'test@example.com', 'password123');
        console.log('Registration successful:', registerData);
        return registerData;
      }
    } catch (error) {
      console.error('Auth service test failed:', error);
      alert('API test failed. See console for details.');
      throw error;
    }
  };

  // Add services and test functions to window
  window.apiServices = {
    authService,
    paperService,
    userService,
    feedbackService,
    testAuthService
  };
  
  console.log('API services available in console. Try window.apiServices.testAuthService()');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 