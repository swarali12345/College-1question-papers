const Feedback = require('../models/Feedback');
const Paper = require('../models/Paper');

/**
 * @desc    Create a new feedback
 * @route   POST /api/feedback
 * @access  Private
 */
exports.createFeedback = async (req, res) => {
  try {
    const { paper, rating, comment } = req.body;

    // Check if paper exists
    const paperExists = await Paper.findById(paper);
    if (!paperExists) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if user has already submitted feedback for this paper
    const existingFeedback = await Feedback.findOne({
      user: req.user.id,
      paper
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this paper'
      });
    }

    // Create new feedback
    const feedback = await Feedback.create({
      user: req.user.id,
      paper,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all feedback
 * @route   GET /api/feedback
 * @access  Private/Admin
 */
exports.getFeedbacks = async (req, res) => {
  try {
    const { paper, status, limit = 10, page = 1 } = req.query;

    // Build query
    const query = {};
    
    if (paper) query.paper = paper;
    if (status) query.status = status;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get feedbacks with user and paper data
    const feedbacks = await Feedback.find(query)
      .populate('user', 'name email')
      .populate('paper', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: feedbacks
    });
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get feedback for a specific paper
 * @route   GET /api/feedback/paper/:paperId
 * @access  Public
 */
exports.getPaperFeedbacks = async (req, res) => {
  try {
    const { limit = 5, page = 1 } = req.query;
    const paperId = req.params.paperId;

    // Check if paper exists
    const paper = await Paper.findById(paperId);
    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // For public access, only show approved feedback
    const query = {
      paper: paperId,
      status: 'approved'
    };

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get approved feedbacks for the paper
    const feedbacks = await Feedback.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Feedback.countDocuments(query);

    // Calculate average rating
    const ratingStats = await Feedback.aggregate([
      { $match: { paper: paper._id, status: 'approved' } },
      { 
        $group: { 
          _id: null, 
          averageRating: { $avg: '$rating' },
          count: { $sum: 1 }
        } 
      }
    ]);

    const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating : 0;
    const ratingCount = ratingStats.length > 0 ? ratingStats[0].count : 0;

    res.status(200).json({
      success: true,
      averageRating,
      ratingCount,
      count: feedbacks.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: feedbacks
    });
  } catch (error) {
    console.error('Get paper feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Update feedback status (approve/reject)
 * @route   PUT /api/feedback/:id
 * @access  Private/Admin
 */
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (pending, approved, rejected)'
      });
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    feedback.status = status;
    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete feedback
 * @route   DELETE /api/feedback/:id
 * @access  Private/Admin or User (own feedback)
 */
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Check if user is the feedback owner or admin
    if (feedback.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this feedback'
      });
    }

    await feedback.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 