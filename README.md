# SIT Nagpur Question Papers Portal

This application provides access to previous year question papers for students of SIT Nagpur. The project consists of a frontend React application and a backend API service.

## URLs and Endpoints

### Frontend URLs

| URL | Description |
|-----|-------------|
| `/` | Home page with search functionality |
| `/login` | User login page |
| `/register` | User registration page |
| `/search` | Browse and search question papers |
| `/feedback` | Submit feedback about the application |

### Backend API Endpoints

| Endpoint | Method | Description | Example Request | Example Response |
|----------|--------|-------------|----------------|------------------|
| `/api/auth/register` | POST | Register a new user | `{"name": "Student", "email": "student@example.com", "password": "password123"}` | `{"success": true, "user": {...}}` |
| `/api/auth/login` | POST | Authenticate a user | `{"email": "student@example.com", "password": "password123"}` | `{"success": true, "token": "jwt_token_here"}` |
| `/api/papers` | GET | Get all papers (can include query params) | `/api/papers?year=2023&semester=5` | `{"success": true, "papers": [...]}` |
| `/api/papers/:id` | GET | Get a specific paper by ID | `/api/papers/12345` | `{"success": true, "paper": {...}}` |
| `/api/papers/search` | GET | Search papers by parameters | `/api/papers/search?query=computer networks` | `{"success": true, "results": [...]}` |
| `/api/feedback` | POST | Submit user feedback | `{"message": "Great resource!", "rating": 5}` | `{"success": true, "feedback": {...}}` |

## Authentication

Most API endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Data Models

### Paper Object

```json
{
  "id": "12345",
  "title": "Computer Networks",
  "year": 2023,
  "semester": 5,
  "branch": "Computer Science",
  "fileUrl": "https://example.com/papers/12345.pdf",
  "uploadedBy": "admin",
  "uploadedAt": "2023-10-15T10:30:00Z"
}
```

## Setup and Installation

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
npm install
npm start
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sit-papers
JWT_SECRET=your_jwt_secret
``` 