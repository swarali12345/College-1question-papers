const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getUserStats 
} = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Admin routes - all protected with admin access only
router.get('/', protect, adminOnly, getAllUsers);
router.get('/stats', protect, adminOnly, getUserStats);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id', protect, adminOnly, updateUser);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router; 