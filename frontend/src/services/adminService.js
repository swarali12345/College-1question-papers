import axios from '../utils/axios';

/**
 * Admin Services for Papers Management
 */
export const paperService = {
  // Get paper statistics for admin dashboard
  getPaperStats: async () => {
    try {
      const response = await axios.get('/api/papers/stats/overview');
      return response.data.data || {
        totalPapers: 0,
        approvedPapers: 0,
        pendingPapers: 0,
        totalDownloads: 0,
        totalViews: 0,
        recentPapers: [],
        topPapers: [],
        departmentStats: [],
        monthlyUploads: []
      };
    } catch (error) {
      console.error('Error fetching paper stats:', error);
      throw error.response?.data || { message: 'Failed to fetch paper statistics' };
    }
  },
  
  // Get all papers
  getAllPapers: async () => {
    try {
      const response = await axios.get('/api/papers?limit=100');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching papers:', error);
      throw error.response?.data || { message: 'Failed to fetch papers' };
    }
  },
  
  // Upload new paper
  uploadPaper: async (paperData) => {
    try {
      // Get the token directly from localStorage
      const token = localStorage.getItem('token');
      
      const response = await axios.post('/api/papers', paperData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Explicitly set token for multipart requests
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading paper:', error);
      throw error.response?.data || { message: 'Failed to upload paper' };
    }
  },
  
  // Delete paper
  deletePaper: async (paperId) => {
    try {
      const response = await axios.delete(`/api/papers/${paperId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting paper:', error);
      throw error.response?.data || { message: 'Failed to delete paper' };
    }
  },
  
  // Approve paper
  approvePaper: async (paperId) => {
    try {
      const response = await axios.put(`/api/papers/${paperId}`, { approved: true });
      return response.data;
    } catch (error) {
      console.error('Error approving paper:', error);
      throw error.response?.data || { message: 'Failed to approve paper' };
    }
  },
  
  // Update paper
  updatePaper: async (paperId, paperData) => {
    try {
      // Check if paperData is FormData (contains file)
      const isFormData = paperData instanceof FormData;
      
      // Get the token directly from localStorage for multipart requests
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
        `/api/papers/${paperId}`, 
        paperData,
        isFormData ? {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` // Explicitly set token
          }
        } : undefined
      );
      return response.data;
    } catch (error) {
      console.error('Error updating paper:', error);
      throw error.response?.data || { message: 'Failed to update paper' };
    }
  },
  
  // Get paper by ID
  getPaperById: async (paperId) => {
    try {
      const response = await axios.get(`/api/papers/${paperId}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching paper:', error);
      throw error.response?.data || { message: 'Failed to fetch paper' };
    }
  }
};

/**
 * Admin Services for Users Management
 */
export const userService = {
  // Get user statistics for admin dashboard
  getUserStats: async () => {
    try {
      const response = await axios.get('/api/users/stats');
      return response.data.data || {
        totalUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
        dailyRegistrations: []
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error.response?.data || { message: 'Failed to fetch user statistics' };
    }
  },
  
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get('/api/users');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },
  
  // Update user role
  updateUserRole: async (userId, isAdmin) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, { isAdmin });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error.response?.data || { message: 'Failed to update user role' };
    }
  },
  
  // Update user status (active/banned)
  updateUserStatus: async (userId, status) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error.response?.data || { message: 'Failed to update user status' };
    }
  },
  
  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  }
};

/**
 * Admin Services for Feedback Management
 */
export const feedbackService = {
  // Get all feedback
  getAllFeedback: async () => {
    try {
      const response = await axios.get('/api/feedback');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error.response?.data || { message: 'Failed to fetch feedback' };
    }
  },
  
  // Update feedback status
  updateFeedbackStatus: async (feedbackId, status) => {
    try {
      const response = await axios.put(`/api/feedback/${feedbackId}`, { status });
      return response.data.data;
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error.response?.data || { message: 'Failed to update feedback status' };
    }
  },
  
  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    try {
      const response = await axios.delete(`/api/feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error.response?.data || { message: 'Failed to delete feedback' };
    }
  }
}; 