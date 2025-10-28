# Job Recruitment Platform - Authentication System

A secure user authentication system for a job recruitment platform with role-based access control.

## ✅ Completed Features

### 🔐 Authentication System
- **User Registration** with role selection (Job Seeker/Recruiter)
- **Secure Login** with JWT token authentication
- **Password Security** with bcrypt hashing and strength requirements
- **Profile Management** with editable user information
- **Role-Based Access Control** with protected routes

### 🎨 Frontend (React)
- **Responsive Registration Form** with comprehensive validation
- **Login Component** with error handling and loading states
- **Personalized Dashboards** for Job Seekers and Recruiters
- **Profile Management** with inline editing capabilities
- **Mobile-Responsive Design** with hamburger menu
- **Toast Notifications** for user feedback
- **Protected Routes** with role-based access control

### ⚙️ Backend (Express.js)
- **RESTful API** with proper HTTP status codes
- **JWT Authentication** with 7-day token expiration
- **Input Validation** using express-validator
- **Security Middleware** (Helmet, CORS, Rate Limiting)
- **MongoDB Integration** with Mongoose ODM
- **Error Handling** with detailed error responses

### 🔒 Security Features
- **Password Hashing** with bcrypt salt rounds
- **JWT Token Security** with proper expiration handling
- **Input Sanitization** and validation on both ends
- **CORS Protection** with configurable origins
- **Rate Limiting** (100 requests per 15 minutes)
- **Security Headers** via Helmet.js

### 📱 Responsive Design
- **Mobile-First Approach** with breakpoint optimization
- **Accessible UI Components** with ARIA labels
- **High Contrast Support** for accessibility
- **Reduced Motion Support** for user preferences
- **Touch-Friendly Interface** for mobile devices

## Project Structure

```
├── backend/          # Express.js server
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Authentication middleware
│   ├── models/       # User models
│   ├── routes/       # API routes
│   └── server.js     # Main server file
├── frontend/         # React application
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   └── utils/       # Utility functions
│   └── public/
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v4.4+)
- npm or yarn

### Backend Setup
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Ensure MongoDB is running
4. Start server: `npm run dev` (development) or `npm start`

### Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start`

### Access the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

📖 **For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

## Environment Variables

Create a `.env` file in the backend directory with:
```
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
MONGODB_URI=mongodb://localhost:27017/job-recruitment
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

## User Roles

- **Job Seeker**: Can create profile, search and apply for jobs
- **Recruiter**: Can post jobs, view applications, manage candidates
