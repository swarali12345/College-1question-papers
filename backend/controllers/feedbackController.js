const Feedback = require('../models/Feedback');
const User = require('../models/User');

// @desc    Create new feedback
// @route   POST /api/feedback
// @access  Private
exports.createFeedback = async (req, res) => {
  try {
    // Add user to req.body
    req.body.user = req.user.id;

    const feedback = await Feedback.create(req.body);

    res.status(201).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Create feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create feedback',
      error: error.message
    });
  }
};

// @desc    Get all feedbacks (admin only)
// @route   GET /api/feedback
// @access  Private/Admin
exports.getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate({
      path: 'user',
      select: 'name email'
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Get all feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feedbacks',
      error: error.message
    });
  }
};

// @desc    Get feedbacks for a specific paper
// @route   GET /api/feedback/paper/:paperId
// @access  Public
exports.getPaperFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ 
      paper: req.params.paperId,
      status: 'approved' // Only return approved feedbacks for public view
    }).populate({
      path: 'user',
      select: 'name'
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Get paper feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get feedbacks for this paper',
      error: error.message
    });
  }
};

// @desc    Update feedback status (admin only)
// @route   PUT /api/feedback/:id
// @access  Private/Admin
exports.updateFeedbackStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a status'
      });
    }

    // Only allow certain statuses
    if (!['pending', 'approved', 'rejected', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    let feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Update fields
    feedback.status = status;
    if (adminResponse) {
      feedback.adminResponse = adminResponse;
    }

    await feedback.save();

    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Update feedback status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback status',
      error: error.message
    });
  }
};

// @desc    Delete feedback
// @route   DELETE /api/feedback/:id
// @access  Private
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    // Make sure user is feedback owner or admin
    if (feedback.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(401).json({
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
      message: 'Failed to delete feedback',
      error: error.message
    });
  }
};

// @desc    Get all feedbacks for the current user
// @route   GET /api/feedback/me
// @access  Private
exports.getUserFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user.id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error('Get user feedbacks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get your feedbacks',
      error: error.message
    });
  }
};
