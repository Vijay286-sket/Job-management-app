import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import JobBoard from './components/JobBoard';
import JobForm from './components/JobForm';
import JobManagement from './components/JobManagement';
import JobDetail from './components/JobDetail';
import MainLayout from './components/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import InsightsPage from './pages/InsightsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute, { RecruiterRoute, JobSeekerRoute } from './components/ProtectedRoute';

// Public Route component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
            <Routes>
              {/* Public routes */}
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              
              {/* Protected Routes with Main Layout */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                } 
              >
                <Route index element={<DashboardPage />} />
              </Route>
              
              <Route 
                path="/applications" 
                element={
                  <JobSeekerRoute>
                    <MainLayout />
                  </JobSeekerRoute>
                } 
              >
                <Route index element={<ApplicationsPage />} />
              </Route>
              
              <Route 
                path="/insights" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                } 
              >
                <Route index element={<InsightsPage />} />
              </Route>
              
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                } 
              >
                <Route index element={<ProfilePage />} />
              </Route>

              {/* Job routes - Available to all authenticated users */}
              <Route 
                path="/jobs" 
                element={
                  <ProtectedRoute>
                    <MainLayout />
                  </ProtectedRoute>
                } 
              >
                <Route index element={<JobBoard />} />
                <Route path=":id" element={<JobDetail />} />
              </Route>

              {/* Recruiter specific routes */}
              <Route 
                path="/jobs/post" 
                element={
                  <RecruiterRoute>
                    <MainLayout />
                  </RecruiterRoute>
                } 
              >
                <Route index element={<JobForm mode="create" />} />
              </Route>
              <Route 
                path="/jobs/:id/edit" 
                element={
                  <RecruiterRoute>
                    <MainLayout />
                  </RecruiterRoute>
                } 
              >
                <Route index element={<JobForm mode="edit" />} />
              </Route>
              <Route 
                path="/jobs/manage" 
                element={
                  <RecruiterRoute>
                    <MainLayout />
                  </RecruiterRoute>
                } 
              >
                <Route index element={<JobManagement />} />
              </Route>
              <Route 
                path="/candidates" 
                element={
                  <RecruiterRoute>
                    <MainLayout />
                  </RecruiterRoute>
                } 
              >
                <Route index element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">Manage Candidates</h2>
                      <p className="text-gray-600">Candidate management coming soon...</p>
                    </div>
                  </div>
                } />
              </Route>
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              
              {/* 404 fallback */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          
          {/* Toast notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
