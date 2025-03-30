const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  getPaperFeedbacks,
  updateFeedbackStatus,
  deleteFeedback,
  getUserFeedbacks
} = require('../controllers/feedbackController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/paper/:paperId', getPaperFeedbacks);

// Private routes (logged in users)
router.post('/', protect, createFeedback);
router.delete('/:id', protect, deleteFeedback);
router.get('/me', protect, getUserFeedbacks);

// Admin routes
router.get('/', protect, adminOnly, getFeedbacks);
router.put('/:id', protect, adminOnly, updateFeedbackStatus);

module.exports = router; 