// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data'
};

// Application Name
export const APP_NAME = 'PYQ-PAPERS';

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  SEARCH: '/search',
  SEARCH_RESULTS: '/search-results',
  SUBJECTS: '/subjects/:year/:semester',
  SUBJECTS_WITH_PARAMS: (year, semester) => 
    `/subjects/${encodeURIComponent(year)}/${encodeURIComponent(semester)}`,
  PAPERS_BY_SUBJECT: '/papers/:year/:semester/:subjectId',
  PAPERS_BY_SUBJECT_WITH_PARAMS: (year, semester, subjectId) => 
    `/papers/${encodeURIComponent(year)}/${encodeURIComponent(semester)}/${subjectId}`,
  DASHBOARD: '/profile',
  PAPER_DETAILS: '/papers/:id',
  PAPER_VIEW: (id) => `/papers/${id}`,
  ADMIN: {
    DASHBOARD: '/admin',
    PAPERS: '/admin/papers',
    PAPER_EDIT: '/admin/papers/edit/:id',
    PAPER_EDIT_WITH_ID: (id) => `/admin/papers/edit/${id}`,
    USERS: '/admin/users',
    FEEDBACK: '/admin/feedback',
    SUBJECTS: '/admin/subjects'
  }
};

// API Endpoints
export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  GOOGLE_LOGIN: '/auth/google',
  LOGOUT: '/auth/logout',
  PROFILE: '/users/profile',
  PAPERS: '/papers',
  FEEDBACK: '/feedback',
  SUBJECTS: '/subjects'
};

// Year and Semester Options for UI
export const ACADEMIC_OPTIONS = {
  // Year options
  YEARS: [
    'First Year',
    'Second Year',
    'Third Year',
    'Fourth Year'
  ],
  
  // Semester options
  SEMESTERS: [
    'Semester 1',
    'Semester 2',
    'Semester 3',
    'Semester 4',
    'Semester 5',
    'Semester 6',
    'Semester 7',
    'Semester 8'
  ]
};

// Paper Categories
export const PAPER_CATEGORIES = {
  // Main subject categories
  SUBJECTS: [
    { id: 'engineering', name: 'Engineering' },
    { id: 'medical', name: 'Medical Sciences' },
    { id: 'science', name: 'Science' },
    { id: 'business', name: 'Business' },
    { id: 'arts', name: 'Arts & Humanities' },
    { id: 'social', name: 'Social Sciences' },
    { id: 'law', name: 'Law' },
    { id: 'computer', name: 'Computer Science' },
    { id: 'mathematics', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'biology', name: 'Biology' }
  ],
  
  // Department options
  DEPARTMENTS: [
    'Computer Science',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Medicine',
    'Dentistry',
    'Pharmacy',
    'Business Administration',
    'Economics',
    'Finance',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Humanities',
    'Social Sciences',
    'Law',
    'Architecture',
    'Education',
    'Psychology'
  ],
  
  // Academic years
  YEARS: [
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015',
    '2014'
  ],
  
  // Semester options
  SEMESTERS: [
    'Fall',
    'Spring',
    'Summer',
    'Winter',
    'First Semester',
    'Second Semester',
    'Third Semester',
    'Fourth Semester',
    'Fifth Semester',
    'Sixth Semester',
    'Seventh Semester',
    'Eighth Semester'
  ],
  
  // Exam types
  EXAM_TYPES: [
    'Midterm',
    'Final',
    'Quiz',
    'Assignment',
    'Project',
    'Practical',
    'Comprehensive',
    'Entrance Exam',
    'Qualifying Exam',
    'Placement Test'
  ]
}; 