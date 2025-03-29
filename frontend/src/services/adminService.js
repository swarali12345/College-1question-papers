import axios from 'axios';
import { API_ENDPOINTS } from '../constants';

// Mock data for testing (will be replaced with actual API calls)
const mockPaperStats = {
  totalPapers: 125,
  approvedPapers: 98,
  pendingPapers: 27,
  totalDownloads: 1250,
  totalViews: 3825,
  recentPapers: [
    {
      id: 'p1',
      title: 'Data Structures Mid-Term Exam 2023',
      subject: 'Data Structures',
      department: 'Computer Science',
      createdAt: '2023-10-15',
      status: 'approved',
    },
    {
      id: 'p2',
      title: 'Advanced Algorithms Final Exam 2023',
      subject: 'Algorithms',
      department: 'Computer Science',
      createdAt: '2023-12-02',
      status: 'pending',
    },
    {
      id: 'p3',
      title: 'Database Systems Quiz 1',
      subject: 'Database Systems',
      department: 'Information Technology',
      createdAt: '2023-09-10',
      status: 'approved',
    }
  ],
  topPapers: [
    {
      id: 'p5',
      title: 'Operating Systems Final Exam 2022',
      subject: 'Operating Systems',
      department: 'Computer Science',
      downloads: 103,
      views: 245
    },
    {
      id: 'p3',
      title: 'Database Systems Quiz 1',
      subject: 'Database Systems',
      department: 'Information Technology',
      downloads: 56,
      views: 178
    },
    {
      id: 'p1',
      title: 'Data Structures Mid-Term Exam 2023',
      subject: 'Data Structures',
      department: 'Computer Science',
      downloads: 42,
      views: 115
    }
  ],
  departmentStats: [
    { department: 'Computer Science', count: 45 },
    { department: 'Electrical Engineering', count: 32 },
    { department: 'Mechanical Engineering', count: 18 },
    { department: 'Information Technology', count: 25 },
    { department: 'Mathematics', count: 15 }
  ],
  monthlyUploads: [
    { month: 'Jan', count: 12 },
    { month: 'Feb', count: 8 },
    { month: 'Mar', count: 15 },
    { month: 'Apr', count: 10 },
    { month: 'May', count: 7 },
    { month: 'Jun', count: 9 },
    { month: 'Jul', count: 6 },
    { month: 'Aug', count: 11 },
    { month: 'Sep', count: 14 },
    { month: 'Oct', count: 19 },
    { month: 'Nov', count: 13 },
    { month: 'Dec', count: 11 }
  ]
};

const mockUserStats = {
  totalUsers: 324,
  activeUsers: 283,
  newUsersThisMonth: 42,
  usersByRole: {
    admin: 3,
    moderator: 8,
    user: 313
  },
  userActivity: [
    { date: '2023-10-01', registrations: 5, logins: 45 },
    { date: '2023-10-02', registrations: 3, logins: 38 },
    { date: '2023-10-03', registrations: 7, logins: 52 },
    { date: '2023-10-04', registrations: 4, logins: 41 },
    { date: '2023-10-05', registrations: 6, logins: 47 }
  ]
};

/**
 * Paper Services
 */
export const paperService = {
  // Get paper statistics for admin dashboard
  getPaperStats: async () => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.get(`${API_ENDPOINTS.PAPERS}/stats`);
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockPaperStats);
        }, 800);
      });
    } catch (error) {
      console.error('Error fetching paper stats:', error);
      throw error;
    }
  },
  
  // Get all papers with filters
  getAllPapers: async (filters = {}) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.get(API_ENDPOINTS.PAPERS, { params: filters });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ data: mockPaperStats.recentPapers.concat(mockPaperStats.topPapers) });
        }, 800);
      });
    } catch (error) {
      console.error('Error fetching papers:', error);
      throw error;
    }
  },
  
  // Upload a new paper
  uploadPaper: async (paperData) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.post(API_ENDPOINTS.PAPERS, paperData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   }
      // });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Paper uploaded successfully' });
        }, 1500);
      });
    } catch (error) {
      console.error('Error uploading paper:', error);
      throw error;
    }
  },
  
  // Delete a paper
  deletePaper: async (paperId) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.delete(`${API_ENDPOINTS.PAPERS}/${paperId}`);
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Paper deleted successfully' });
        }, 800);
      });
    } catch (error) {
      console.error('Error deleting paper:', error);
      throw error;
    }
  },
  
  // Approve a paper
  approvePaper: async (paperId) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.put(`${API_ENDPOINTS.PAPERS}/${paperId}/approve`);
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Paper approved successfully' });
        }, 800);
      });
    } catch (error) {
      console.error('Error approving paper:', error);
      throw error;
    }
  }
};

/**
 * User Services
 */
export const userService = {
  // Get user statistics for admin dashboard
  getUserStats: async () => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.get(`${API_ENDPOINTS.USERS}/stats`);
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockUserStats);
        }, 800);
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },
  
  // Get all users with filters
  getAllUsers: async (filters = {}) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.get(API_ENDPOINTS.USERS, { params: filters });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'u1',
              name: 'John Smith',
              email: 'john.smith@example.com',
              role: 'admin',
              createdAt: new Date('2023-01-15'),
              status: 'active',
              lastLogin: new Date('2023-04-28')
            },
            {
              id: 'u2',
              name: 'Jane Doe',
              email: 'jane.doe@example.com',
              role: 'user',
              createdAt: new Date('2023-02-20'),
              status: 'active',
              lastLogin: new Date('2023-04-27')
            }
          ]);
        }, 800);
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.put(`${API_ENDPOINTS.USERS}/${userId}/role`, { role });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'User role updated successfully' });
        }, 800);
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },
  
  // Block/unblock user
  updateUserStatus: async (userId, status) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.put(`${API_ENDPOINTS.USERS}/${userId}/status`, { status });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'User status updated successfully' });
        }, 800);
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },
  
  // Delete user
  deleteUser: async (userId) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.delete(`${API_ENDPOINTS.USERS}/${userId}`);
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'User deleted successfully' });
        }, 800);
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
};

/**
 * Feedback Services
 */
export const feedbackService = {
  // Get all feedback with filters
  getAllFeedback: async (filters = {}) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.get(API_ENDPOINTS.FEEDBACK, { params: filters });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'f1',
              user: {
                id: 'u1',
                name: 'John Smith',
                email: 'john.smith@example.com'
              },
              subject: 'Website Navigation Issue',
              message: 'I found it difficult to navigate between the paper repository and my profile. The menu structure is confusing.',
              rating: 3,
              createdAt: new Date('2023-04-15'),
              status: 'pending',
              priority: 'medium',
              response: null
            },
            {
              id: 'f2',
              user: {
                id: 'u2',
                name: 'Jane Doe',
                email: 'jane.doe@example.com'
              },
              subject: 'Search Functionality Improvement',
              message: 'The search feature works well, but it would be nice to have more advanced filters for searching papers by specific criteria like exam type or semester.',
              rating: 4,
              createdAt: new Date('2023-04-10'),
              status: 'resolved',
              priority: 'low',
              response: 'Thank you for your feedback! We are planning to add advanced search filters in our next update.'
            }
          ]);
        }, 800);
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
      throw error;
    }
  },
  
  // Respond to feedback
  respondToFeedback: async (feedbackId, response) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.put(`${API_ENDPOINTS.FEEDBACK}/${feedbackId}/respond`, { response });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Response submitted successfully' });
        }, 800);
      });
    } catch (error) {
      console.error('Error responding to feedback:', error);
      throw error;
    }
  },
  
  // Update feedback status (resolved, in_progress, etc.)
  updateFeedbackStatus: async (feedbackId, status) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.put(`${API_ENDPOINTS.FEEDBACK}/${feedbackId}/status`, { status });
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Feedback status updated successfully' });
        }, 800);
      });
    } catch (error) {
      console.error('Error updating feedback status:', error);
      throw error;
    }
  },
  
  // Delete feedback
  deleteFeedback: async (feedbackId) => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.delete(`${API_ENDPOINTS.FEEDBACK}/${feedbackId}`);
      // return response.data;
      
      // Using mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: 'Feedback deleted successfully' });
        }, 800);
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      throw error;
    }
  }
}; 