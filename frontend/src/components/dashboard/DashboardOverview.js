import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Heart,
  Eye,
  Activity,
  TrendingUp,
  ArrowUp,
  Star,
  Award,
  Target,
  Users,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const DashboardOverview = () => {
  const { user, isJobSeeker } = useAuth();

  // Mock data
  const mockJobSeekerData = {
    appliedJobs: 12,
    savedJobs: 8,
    profileViews: 25,
    responseRate: 67,
    profileCompleteness: 85,
    weeklyStats: [2, 1, 3, 0, 2, 1, 0]
  };

  const mockRecruiterData = {
    activeJobs: 5,
    totalApplications: 48,
    shortlistedCandidates: 12,
    hiringRate: 84
  };

  const data = isJobSeeker() ? mockJobSeekerData : mockRecruiterData;

  const ProgressBar = ({ value, max = 100, color = 'bg-blue-500', label }) => (
    <div className="w-full">
      {label && <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${color} h-2 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  const MiniChart = ({ data, color = 'bg-blue-500' }) => (
    <div className="flex items-end space-x-1 h-8">
      {data.map((value, index) => (
        <div 
          key={index}
          className={`w-2 ${color} rounded-t opacity-70 hover:opacity-100 transition-opacity`}
          style={{ height: `${Math.max((value / Math.max(...data)) * 100, 10)}%` }}
        ></div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-blue-100">
              {isJobSeeker() 
                ? "Ready to find your dream job?" 
                : "Let's find great talent today"
              }
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Briefcase className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isJobSeeker() ? (
          <>
            {/* Applied Jobs Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center text-green-500 text-sm">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +2 this week
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Applied Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{data.appliedJobs}</p>
                <MiniChart data={data.weeklyStats} color="bg-blue-500" />
              </div>
            </div>

            {/* Saved Jobs Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                  Saved
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Saved Jobs</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{data.savedJobs}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                  3 new matches
                </div>
              </div>
            </div>

            {/* Profile Views Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex items-center text-purple-500 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15%
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{data.profileViews}</p>
                <ProgressBar value={data.profileCompleteness} color="bg-purple-500" label="Profile Complete" />
              </div>
            </div>

            {/* Response Rate Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Activity className="w-6 h-6 text-orange-600" />
                </div>
                <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                  Good
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Response Rate</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{data.responseRate}%</p>
                <ProgressBar value={data.responseRate} color="bg-orange-500" />
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Recruiter Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-emerald-100 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
                  Active
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Jobs</p>
                <p className="text-3xl font-bold text-gray-900">{data.activeJobs}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex items-center text-blue-500 text-sm">
                  <ArrowUp className="w-4 h-4 mr-1" />
                  +12 today
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">{data.totalApplications}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                <div className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                  Quality
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Shortlisted</p>
                <p className="text-3xl font-bold text-gray-900">{data.shortlistedCandidates}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                  Excellent
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Hiring Rate</p>
                <p className="text-3xl font-bold text-gray-900">{data.hiringRate}%</p>
                <ProgressBar value={data.hiringRate} color="bg-orange-500" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isJobSeeker() ? (
          <>
            <Link
              to="/jobs"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Browse Jobs</h3>
                    <p className="text-sm text-gray-500">Find your next opportunity</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>

            <Link
              to="/profile"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Update Profile</h3>
                    <p className="text-sm text-gray-500">Keep your profile current</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </Link>

            <Link
              to="/applications"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <Activity className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">View Applications</h3>
                    <p className="text-sm text-gray-500">Track your progress</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/jobs/post"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition-colors">
                    <Plus className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Post New Job</h3>
                    <p className="text-sm text-gray-500">Find great candidates</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              </div>
            </Link>

            <Link
              to="/candidates"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">View Candidates</h3>
                    <p className="text-sm text-gray-500">Review applications</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>

            <Link
              to="/analytics"
              className="group bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Analytics</h3>
                    <p className="text-sm text-gray-500">Hiring insights</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
              </div>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;
