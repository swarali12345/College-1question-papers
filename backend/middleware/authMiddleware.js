const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Get token from header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }
  // Set token from cookie
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get full user from database to include all properties
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found or token invalid'
      });
    }
    
    // Add complete user info to request
    req.user = {
      id: user._id.toString(),
      isAdmin: user.isAdmin || user.role === 'admin',
      role: user.role || 'user',
      name: user.name,
      email: user.email
    };
    
    console.log('Auth middleware user info:', {
      id: req.user.id, 
      isAdmin: req.user.isAdmin,
      role: req.user.role
    });

    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    if (!roles.includes(req.user.isAdmin ? 'admin' : 'user')) {
      return res.status(403).json({
        success: false,
        message: `User role not authorized to access this route`
      });
    }
    next();
  };
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Admin access required for this route'
    });
  }
  next();
}; 