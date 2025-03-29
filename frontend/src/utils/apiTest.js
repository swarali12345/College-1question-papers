import { authService, paperService, userService, feedbackService } from '../services';

// This file is not meant to be imported. It's just a reference for testing API connectivity.

// Example of using the auth service
const testAuthService = async () => {
  try {
    // Register a new user
    const registerData = await authService.register('Test User', 'test@example.com', 'password123');
    console.log('Registration successful:', registerData);
    
    // Login
    const loginData = await authService.login('test@example.com', 'password123');
    console.log('Login successful:', loginData);
    
    // Get profile
    const profileData = await authService.getProfile();
    console.log('Profile data:', profileData);
    
    // Update profile
    const updateData = await authService.updateProfile({ name: 'Updated Name' });
    console.log('Profile updated:', updateData);
    
    // Logout
    await authService.logout();
    console.log('Logout successful');
  } catch (error) {
    console.error('Auth service test failed:', error);
  }
};

// Example of using the paper service
const testPaperService = async () => {
  try {
    // Get all papers
    const papers = await paperService.getAllPapers();
    console.log('All papers:', papers);
    
    // Create a paper (admin only)
    const newPaper = await paperService.createPaper({
      title: 'Test Paper',
      authors: 'Test Author',
      abstract: 'This is a test paper',
      year: '2023',
      department: 'Computer Science',
      subject: 'Programming',
      // file would be a File object from a form
    });
    console.log('New paper created:', newPaper);
    
    // Get paper stats (admin only)
    const stats = await paperService.getPaperStats();
    console.log('Paper stats:', stats);
  } catch (error) {
    console.error('Paper service test failed:', error);
  }
};

// Example of using the user service
const testUserService = async () => {
  try {
    // Get all users (admin only)
    const users = await userService.getAllUsers();
    console.log('All users:', users);
    
    // Get user stats (admin only)
    const stats = await userService.getUserStats();
    console.log('User stats:', stats);
  } catch (error) {
    console.error('User service test failed:', error);
  }
};

// Example of using the feedback service
const testFeedbackService = async () => {
  try {
    // Create feedback
    const newFeedback = await feedbackService.createFeedback({
      subject: 'Test Feedback',
      message: 'This is a test feedback',
      rating: 5,
      // paper is optional
    });
    console.log('New feedback created:', newFeedback);
    
    // Get all feedback (admin only)
    const allFeedback = await feedbackService.getAllFeedback();
    console.log('All feedback:', allFeedback);
  } catch (error) {
    console.error('Feedback service test failed:', error);
  }
};

// Run the tests
// Use these in the browser console to test API connectivity
console.log('API test functions available:');
console.log('- testAuthService()');
console.log('- testPaperService()');
console.log('- testUserService()');
console.log('- testFeedbackService()');

// Don't run automatically to avoid unintended side effects
// window.testAuthService = testAuthService;
// window.testPaperService = testPaperService;
// window.testUserService = testUserService;
// window.testFeedbackService = testFeedbackService; 