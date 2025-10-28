# Job Recruitment Platform - Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the job recruitment platform with authentication system locally.

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation Steps

### 1. Clone/Navigate to Project Directory

```bash
cd "c:\Users\hp\OneDrive\Documents\web project"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file (if not exists)
# Copy the .env file and update values as needed
```

**Environment Variables (.env):**
```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
MONGODB_URI=mongodb://localhost:27017/job-recruitment
NODE_ENV=development
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**macOS/Linux:**
```bash
# Start MongoDB
sudo systemctl start mongod
# or
brew services start mongodb/brew/mongodb-community
```

## 🏃‍♂️ Running the Application

### Start Backend Server

```bash
# From backend directory
cd backend
npm run dev
# or
npm start
```

The backend will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## 🧪 Testing the Application

### 1. Register New Users

1. Open `http://localhost:3000`
2. Click "Sign Up" 
3. Fill the registration form with:
   - First Name & Last Name
   - Valid email address
   - Strong password (min 6 chars, with uppercase, lowercase, number)
   - Select role: Job Seeker or Recruiter

### 2. Login

1. Use registered credentials to login
2. You'll be redirected to the dashboard based on your role

### 3. Test Role-Based Access

**Job Seeker Features:**
- Dashboard with job search stats
- Profile management
- Access to "Find Jobs" and "My Applications" (placeholder)

**Recruiter Features:**
- Dashboard with recruitment stats  
- Profile management
- Access to "Post Jobs" and "Manage Candidates" (placeholder)

### 4. Test Authentication

- Try accessing protected routes without login
- Test JWT token expiration
- Verify role-based route protection

## 🔧 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/register` | User registration | Public |
| POST | `/api/auth/login` | User login | Public |
| GET | `/api/auth/profile` | Get user profile | Protected |
| PUT | `/api/auth/profile` | Update profile | Protected |
| GET | `/api/auth/test` | Test authentication | Protected |

### Example API Calls

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe", 
    "email": "john@example.com",
    "password": "Password123",
    "role": "jobseeker"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## 🎨 Features Implemented

### ✅ Backend Features
- **Express.js Server** with security middleware
- **JWT Authentication** with 7-day expiration
- **Password Hashing** using bcrypt
- **Role-Based Access Control** (Job Seeker/Recruiter)
- **Input Validation** with express-validator
- **MongoDB Integration** with Mongoose
- **Error Handling** with proper HTTP status codes

### ✅ Frontend Features
- **React 18** with modern hooks
- **Responsive Design** with mobile-first approach
- **Form Validation** using react-hook-form
- **Authentication Context** for state management
- **Role-Based Routing** with protected routes
- **Toast Notifications** for user feedback
- **Accessible UI** with proper ARIA labels

### ✅ Security Features
- **Password Requirements** (min 6 chars, mixed case, numbers)
- **JWT Token Security** with proper expiration
- **CORS Protection** with origin validation
- **Rate Limiting** (100 requests per 15 minutes)
- **Input Sanitization** and validation
- **Helmet.js** for security headers

## 🔒 Security Considerations

1. **Change JWT Secret** in production
2. **Use HTTPS** in production
3. **Set up proper CORS** origins
4. **Enable MongoDB authentication**
5. **Use environment variables** for sensitive data
6. **Implement email verification** (future enhancement)

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)  
- **Mobile** (320px - 767px)

### Accessibility Features
- **Keyboard Navigation** support
- **Screen Reader** compatibility
- **High Contrast** mode support
- **Reduced Motion** preference support

## 🐛 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if MongoDB is running
- Verify environment variables in `.env`
- Check if port 5000 is available

**Frontend won't connect to backend:**
- Ensure backend is running on port 5000
- Check proxy setting in `frontend/package.json`
- Verify CORS configuration

**Authentication not working:**
- Check JWT_SECRET in backend `.env`
- Clear browser localStorage
- Verify token format in network requests

### Debug Mode

**Backend Debug:**
```bash
# Enable debug logging
DEBUG=* npm run dev
```

**Frontend Debug:**
- Open browser DevTools
- Check Console for errors
- Inspect Network tab for API calls

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use production MongoDB URI
3. Set secure JWT secret
4. Configure proper CORS origins
5. Use process manager (PM2)

### Frontend Deployment
1. Build production version: `npm run build`
2. Serve static files with nginx/Apache
3. Update API base URL for production

## 📝 Next Steps

1. **Email Verification** system
2. **Password Reset** functionality  
3. **Job Posting** and management
4. **Application Tracking** system
5. **File Upload** for resumes/documents
6. **Search and Filtering** capabilities
7. **Real-time Notifications**
8. **Admin Dashboard**

## 🤝 Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Write responsive components
5. Test authentication flows
6. Update documentation

---

**Happy Coding! 🎉**
