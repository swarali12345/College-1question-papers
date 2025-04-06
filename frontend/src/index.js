import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { authService, paperService, userService, feedbackService } from './services';
import reportWebVitals from './reportWebVitals';

// Expose services and test utilities only in development mode
if (process.env.NODE_ENV === 'development') {

  // Test function for authService to try login, and fallback to registration if login fails
  const testAuthService = async () => {
    console.log('Testing auth service...');
    try {
      // Attempt to login with test credentials
      const loginData = await authService.login('test@example.com', 'password123');
      console.log('Login successful:', loginData);
      return loginData;
    } catch (loginError) {
      // If login fails, attempt to register the user
      console.log('Login failed, trying registration:', loginError);
      const registerData = await authService.register('Test User', 'test@example.com', 'password123');
      console.log('Registration successful:', registerData);
      return registerData;
    }
  };

  // Expose services and the test function to the browser console for quick testing/debugging
  Object.assign(window, {
    apiServices: {
      authService,
      paperService,
      userService,
      feedbackService,
      testAuthService
    }
  });

  console.log('API services available in console. Try window.apiServices.testAuthService()');
}

// Render the main React application to the DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
