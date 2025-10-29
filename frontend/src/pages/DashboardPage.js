import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Heart,
  Eye,
  TrendingUp,
  Users,
  ArrowUp,
  ArrowDown,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user, isJobSeeker } = useAuth();

  // Mock data
  const jobSeekerStats = {
    appliedJobs: 12,
    savedJobs: 8,
    profileViews: 25,
    responseRate: 67
  };

  const recruiterStats = {
    activeJobs: 5,
    totalApplications: 48,
    shortlistedCandidates: 12,
    hiringRate: 84
  };

  const stats = isJobSeeker() ? jobSeekerStats : recruiterStats;

  const recentActivity = isJobSeeker() ? [
    { id: 1, type: 'application', title: 'Applied to Senior Frontend Developer', company: 'TechCorp', time: '2 hours ago' },
    { id: 2, type: 'view', title: 'Profile viewed by HR Manager', company: 'StartupXYZ', time: '5 hours ago' },
    { id: 3, type: 'save', title: 'Saved React Developer position', company: 'BigTech Inc', time: '1 day ago' }
  ] : [
    { id: 1, type: 'application', title: 'New application received', company: 'Frontend Developer', time: '1 hour ago' },
    { id: 2, type: 'post', title: 'Job post published', company: 'Backend Developer', time: '3 hours ago' },
    { id: 3, type: 'shortlist', title: 'Candidate shortlisted', company: 'UX Designer', time: '6 hours ago' }
  ];

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, colorClass = 'bg-blue-100', iconClass = 'text-blue-600' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClass}`}>
          <Icon className={`w-6 h-6 ${iconClass}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              {isJobSeeker() 
                ? "Here's your job search overview for today"
                : "Here's your recruitment dashboard overview"
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-gray-500">Today</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isJobSeeker() ? (
          <>
            <StatCard
              title="Applied Jobs"
              value={stats.appliedJobs}
              icon={Briefcase}
              trend="up"
              trendValue="+2 this week"
              colorClass="bg-blue-100"
              iconClass="text-blue-600"
            />
            <StatCard
              title="Saved Jobs"
              value={stats.savedJobs}
              icon={Heart}
              trend="up"
              trendValue="+3 new matches"
              colorClass="bg-green-100"
              iconClass="text-green-600"
            />
            <StatCard
              title="Profile Views"
              value={stats.profileViews}
              icon={Eye}
              trend="up"
              trendValue="+15% this month"
              colorClass="bg-purple-100"
              iconClass="text-purple-600"
            />
            <StatCard
              title="Response Rate"
              value={`${stats.responseRate}%`}
              icon={TrendingUp}
              trend="down"
              trendValue="-3% this month"
              colorClass="bg-orange-100"
              iconClass="text-orange-600"
            />
          </>
        ) : (
          <>
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs}
              icon={Briefcase}
              colorClass="bg-green-100"
              iconClass="text-green-600"
            />
            <StatCard
              title="Total Applications"
              value={stats.totalApplications}
              icon={Users}
              trend="up"
              trendValue="+12 today"
              colorClass="bg-blue-100"
              iconClass="text-blue-600"
            />
            <StatCard
              title="Shortlisted"
              value={stats.shortlistedCandidates}
              icon={Eye}
              colorClass="bg-purple-100"
              iconClass="text-purple-600"
            />
            <StatCard
              title="Hiring Rate"
              value={`${stats.hiringRate}%`}
              icon={TrendingUp}
              trend="up"
              trendValue="+5% this month"
              colorClass="bg-orange-100"
              iconClass="text-orange-600"
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.company}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Link
                to={isJobSeeker() ? "/applications" : "/jobs"}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="p-6 space-y-4">
            {isJobSeeker() ? (
              <>
                <Link
                  to="/jobs"
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Browse Jobs</span>
                  </div>
                  <Plus className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Update Profile</span>
                  </div>
                  <Plus className="w-4 h-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/insights"
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Career Insights</span>
                  </div>
                  <Plus className="w-4 h-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/jobs/post"
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Plus className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Post New Job</span>
                  </div>
                </Link>
                <Link
                  to="/candidates"
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">View Candidates</span>
                  </div>
                </Link>
                <Link
                  to="/insights"
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Analytics</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
