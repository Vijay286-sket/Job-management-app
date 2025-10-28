import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  allowedRoles = null,
  fallbackPath = '/dashboard' 
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
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

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access if specified
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. This page is only available for {requiredRole}s.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary mr-2"
          >
            Go Back
          </button>
          <Navigate to={fallbackPath} replace />
        </div>
      </div>
    );
  }

  // Check multiple allowed roles if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-red-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page. This page is only available for {allowedRoles.join(' or ')}s.
          </p>
          <button
            onClick={() => window.history.back()}
            className="btn btn-primary mr-2"
          >
            Go Back
          </button>
          <Navigate to={fallbackPath} replace />
        </div>
      </div>
    );
  }

  // Render the protected component
  return children;
};

// Higher-order component for role-based route protection
export const withRoleProtection = (Component, requiredRole) => {
  return (props) => (
    <ProtectedRoute requiredRole={requiredRole}>
      <Component {...props} />
    </ProtectedRoute>
  );
};

// Specific role-based route components
export const RecruiterRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="recruiter" {...props}>
    {children}
  </ProtectedRoute>
);

export const JobSeekerRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRole="jobseeker" {...props}>
    {children}
  </ProtectedRoute>
);

export const AnyAuthenticatedRoute = ({ children, ...props }) => (
  <ProtectedRoute allowedRoles={['jobseeker', 'recruiter']} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
