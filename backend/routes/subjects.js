const express = require('express');
const router = express.Router();
const { 
  createSubject, 
  getAllSubjects,
  getSubjectsByYearAndSemester,
  getSubjectById,
  deleteSubject,
  getGroupedSubjects
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');

// Route to get subjects grouped by year and semester
router.get('/grouped', getGroupedSubjects);

// Route to get all subjects and filter by year and semester
router.get('/filter', getSubjectsByYearAndSemester);

// Routes with ID parameter
router.route('/:id')
  .get(getSubjectById)
  .delete(protect, authorize('admin'), deleteSubject);

// Main routes
router.route('/')
  .get(getAllSubjects)
  .post(protect, authorize('admin'), createSubject);

module.exports = router; 