const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users',
      error: error.message
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Admin
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user',
      error: error.message
    });
  }
};

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = async (req, res) => {
  try {
    const allowedFields = ['name', 'email', 'department', 'isAdmin'];
    
    // Filter out fields that are not allowed
    const updates = Object.keys(req.body)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    }).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message
    });
  }
};

// @desc    Get user stats (count by role, etc.)
// @route   GET /api/users/stats
// @access  Admin
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const regularUsers = totalUsers - adminUsers;
    
    // Get user registrations by date (last 7 days)
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const dailyRegistrations = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: lastWeek }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        adminUsers,
        regularUsers,
        dailyRegistrations
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user stats',
      error: error.message
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
}; 