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
MONGODB_URI=mongodb+srv://swaralilimaye60:StnfhbSiiam6q67b@cluster144.0ytesid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster144
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
EMAIL=swaralilimaye60@gmail.com
PASSWORD=Swarali@1

```

## Deployment Guide

### Backend Deployment (Render.com)

1. Create an account on [Render.com](https://render.com/)
2. Create a new Web Service
3. Connect your GitHub repository or upload your code
4. Configure your Web Service:
   - **Name**: Your preferred service name
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or paid plan based on your needs

5. Set up the following environment variables in the Render dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for JWT token generation
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `NODE_ENV`: Set to `production`
   - `CLIENT_URL`: Your frontend URL from Netlify
   - Any other environment variables used in your .env file

6. Deploy your application

### Frontend Deployment (Netlify)

1. Create an account on [Netlify](https://netlify.com/)
2. Create a new site from Git
3. Connect your GitHub repository
4. Configure your build settings:
   - **Base directory**: frontend
   - **Build command**: `npm ci --legacy-peer-deps && npm run netlify-build`
   - **Publish directory**: build

5. Set up environment variables in the Netlify dashboard:
   - `REACT_APP_API_URL`: Your backend URL from Render

6. Deploy your site

### Post-Deployment Steps

1. Verify that the backend is accessible by visiting an endpoint directly in the browser
2. Test the complete application flow from the frontend
3. Check that authentication works as expected
4. Monitor application logs for any issues
