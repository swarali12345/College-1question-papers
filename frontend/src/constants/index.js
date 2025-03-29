export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    GOOGLE: '/api/auth/google',
  },
  PAPERS: {
    BASE: '/api/papers',
    SEARCH: '/api/papers/search',
    UPLOAD: '/api/papers/upload',
    DOWNLOAD: '/api/papers/download',
    STATS: '/api/papers/stats',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    ALL: '/api/users',
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin',
  PROFILE: '/profile',
  SEARCH: '/search',
  PAPER_DETAILS: '/papers/:id',
  PAPER_VIEW: '/papers/view/:id',
  NOT_FOUND: '/404',
};

export const STORAGE_KEYS = {
  TOKEN: 'pyq_token',
  USER: 'pyq_user',
  THEME: 'pyq_theme',
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
};

export const PAPER_CATEGORIES = {
  YEARS: ['First Year', 'Second Year', 'Third Year', 'Final Year'],
  EXAM_TYPES: ['Mid-Semester', 'End-Semester', 'Quiz', 'Assignment'],
  DEPARTMENTS: [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Electrical',
    'Mechanical',
    'Civil',
    'Chemical',
    'Biotechnology',
  ],
};

export const APP_NAME = 'PYQ-PAPERS'; 