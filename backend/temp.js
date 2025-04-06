const Subject = require('../models/Subject');

/**
 * @desc    Create a new subject
 * @route   POST /api/subjects
 * @access  Admin
 */
exports.createSubject = async (req, res) => {
  try {
    const { name, year, semester } = req.body;

    // Check if subject with the same name in the same year and semester already exists
    const existingSubject = await Subject.findOne({ name, year, semester });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: 'Subject already exists for this year and semester'
      });
    }

    // Create new subject
    const subject = await Subject.create({
      name,
      year,
      semester
    });

    res.status(201).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Subject creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all subjects
 * @route   GET /api/subjects
 * @access  Public
 */
exports.getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ year: 1, semester: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Get all subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get subjects grouped by year and semester
 * @route   GET /api/subjects/grouped
 * @access  Public
 */
exports.getGroupedSubjects = async (req, res) => {
  try {
    // Fetch all subjects sorted by year and semester
    const subjects = await Subject.find().sort({ year: 1, semester: 1, name: 1 });

    // Group subjects by year and semester
    const groupedSubjects = subjects.reduce((acc, subject) => {
      // Create year group if it doesn't exist
      if (!acc[subject.year]) {
        acc[subject.year] = {};
      }
      
      // Create semester group within year if it doesn't exist
      if (!acc[subject.year][subject.semester]) {
        acc[subject.year][subject.semester] = [];
      }
      
      // Add subject to appropriate group
      acc[subject.year][subject.semester].push(subject);
      
      return acc;
    }, {});
    
    // Convert to array format if needed
    const formattedData = Object.keys(groupedSubjects).map(year => {
      return {
        year,
        semesters: Object.keys(groupedSubjects[year]).map(semester => {
          return {
            semester,
            subjects: groupedSubjects[year][semester]
          };
        })
      };
    });

    res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Get grouped subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get subjects by year and semester
 * @route   GET /api/subjects/filter
 * @access  Public
 */
exports.getSubjectsByYearAndSemester = async (req, res) => {
  try {
    const { year, semester } = req.query;

    // Validate input
    if (!year || !semester) {
      return res.status(400).json({
        success: false,
        message: 'Year and semester are required'
      });
    }

    // Find subjects matching the criteria
    const subjects = await Subject.find({ year, semester }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: subjects.length,
      data: subjects
    });
  } catch (error) {
    console.error('Get subjects by criteria error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get subject by ID
 * @route   GET /api/subjects/:id
 * @access  Public
 */
exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: subject
    });
  } catch (error) {
    console.error('Get subject by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete subject
 * @route   DELETE /api/subjects/:id
 * @access  Admin
 */
exports.deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    
    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    await subject.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    console.error('Delete subject error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 
