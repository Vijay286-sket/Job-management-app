import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, Home, Briefcase, Users, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout, isJobSeeker, isRecruiter } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Briefcase className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              JobPlatform
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                {/* Common navigation */}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {/* Common Jobs Link */}
                <Link
                  to="/jobs"
                  className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Jobs</span>
                </Link>

                {/* Job Seeker specific navigation */}
                {isJobSeeker() && (
                  <Link
                    to="/applications"
                    className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    <span>My Applications</span>
                  </Link>
                )}

                {/* Recruiter specific navigation */}
                {isRecruiter() && (
                  <>
                    <Link
                      to="/jobs/manage"
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Manage Jobs</span>
                    </Link>
                    <Link
                      to="/candidates"
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      <span>Candidates</span>
                    </Link>
                  </>
                )}

                {/* Profile dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>{user.firstName}</span>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Profile Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Public navigation */
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          {user && (
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-3">
              {/* User info */}
              <div className="flex items-center space-x-3 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Navigation links */}
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>

              {/* Common Jobs Link */}
              <Link
                to="/jobs"
                className="flex items-center space-x-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Briefcase className="w-5 h-5" />
                <span>Jobs</span>
              </Link>

              {/* Job Seeker specific navigation */}
              {isJobSeeker() && (
                <Link
                  to="/applications"
                  className="flex items-center space-x-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="w-5 h-5" />
                  <span>My Applications</span>
                </Link>
              )}

              {/* Recruiter specific navigation */}
              {isRecruiter() && (
                <>
                  <Link
                    to="/jobs/manage"
                    className="flex items-center space-x-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Briefcase className="w-5 h-5" />
                    <span>Manage Jobs</span>
                  </Link>
                  <Link
                    to="/candidates"
                    className="flex items-center space-x-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="w-5 h-5" />
                    <span>Candidates</span>
                  </Link>
                </>
              )}

              {/* Profile and logout */}
              <div className="pt-3 border-t border-gray-200 space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5" />
                  <span>Profile Settings</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 py-2 text-gray-700 hover:text-red-600 transition-colors w-full text-left"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
