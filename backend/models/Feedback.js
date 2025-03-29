const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    trim: true,
    maxlength: [100, 'Subject cannot be more than 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please add a rating between 1 and 5']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'resolved'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  adminResponse: {
    type: String,
    default: ''
  },
  paper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paper',
    // Paper is optional, as feedback could be about the platform in general
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent user from submitting multiple feedbacks for the same paper
FeedbackSchema.index({ user: 1, paper: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', FeedbackSchema); 