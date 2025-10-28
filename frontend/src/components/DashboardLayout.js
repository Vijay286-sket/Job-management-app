import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  FileText,
  TrendingUp,
  User,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  Briefcase,
  Users,
  Plus,
  BarChart3,
  ChevronRight
} from 'lucide-react';

// Import individual dashboard components
import DashboardOverview from './dashboard/DashboardOverview';
import RecentApplications from './dashboard/RecentApplications';
import CareerInsights from './dashboard/CareerInsights';
import ProfileSettings from './dashboard/ProfileSettings';

const DashboardLayout = () => {
  const { user, logout, isJobSeeker } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = isJobSeeker() ? [
    { 
      id: 'overview', 
      name: 'Dashboard', 
      icon: Home, 
      description: 'Overview & stats',
      path: '/dashboard',
      exact: true
    },
    { 
      id: 'applications', 
      name: 'My Applications', 
      icon: FileText, 
      description: 'Track your applications',
      path: '/dashboard/applications'
    },
    { 
      id: 'insights', 
      name: 'Career Insights', 
      icon: TrendingUp, 
      description: 'Analytics & trends',
      path: '/dashboard/insights'
    },
    { 
      id: 'profile', 
      name: 'Profile Settings', 
      icon: User, 
      description: 'Manage your profile',
      path: '/dashboard/profile'
    },
  ] : [
    { 
      id: 'overview', 
      name: 'Dashboard', 
      icon: Home, 
      description: 'Overview & stats',
      path: '/dashboard',
      exact: true
    },
    { 
      id: 'jobs', 
      name: 'Job Management', 
      icon: Briefcase, 
      description: 'Manage job posts',
      path: '/jobs/manage'
    },
    { 
      id: 'candidates', 
      name: 'Candidates', 
      icon: Users, 
      description: 'View applicants',
      path: '/candidates'
    },
    { 
      id: 'analytics', 
      name: 'Analytics', 
      icon: BarChart3, 
      description: 'Hiring insights',
      path: '/dashboard/analytics'
    },
    { 
      id: 'profile', 
      name: 'Company Profile', 
      icon: User, 
      description: 'Company settings',
      path: '/dashboard/profile'
    },
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 flex">
      {/* Modern Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 ease-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                JP
              </div>
              <div className="hidden lg:block">
                <h2 className="text-lg font-bold text-gray-900">JobPlatform</h2>
                <p className="text-xs text-gray-500 font-medium">Professional Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-xs text-blue-600 capitalize font-medium">{user?.role}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
              Navigation
            </div>
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.path, item.exact);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center px-3 py-3 text-left rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'
                  }`} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                      {item.name}
                    </div>
                    <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                      {item.description}
                    </div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200/50 space-y-1">
            <button className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors">
              <Settings className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Settings</span>
            </button>
            <button 
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {navigation.find(item => isActiveRoute(item.path, item.exact))?.name || 'Dashboard'}
            </h1>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:block bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  {navigation.find(item => isActiveRoute(item.path, item.exact))?.name || 'Dashboard'}
                </h1>
                <p className="text-gray-600 mt-1 font-medium">
                  {navigation.find(item => isActiveRoute(item.path, item.exact))?.description}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <button className="p-2.5 text-gray-400 hover:text-gray-600 relative bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-white transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area with Routes */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="applications" element={<RecentApplications />} />
              <Route path="insights" element={<CareerInsights />} />
              <Route path="analytics" element={<CareerInsights />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
