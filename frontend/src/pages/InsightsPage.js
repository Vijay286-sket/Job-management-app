import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Target,
  Award,
  Users,
  Eye,
  Calendar,
  Star,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const InsightsPage = () => {
  const { isJobSeeker } = useAuth();
  const [timeRange, setTimeRange] = useState('30d');

  // Mock data
  const applicationTrends = [
    { month: 'Jan', applications: 8, responses: 3 },
    { month: 'Feb', applications: 12, responses: 5 },
    { month: 'Mar', applications: 15, responses: 7 },
    { month: 'Apr', applications: 10, responses: 4 },
    { month: 'May', applications: 18, responses: 8 },
    { month: 'Jun', applications: 22, responses: 12 }
  ];

  const skillsData = [
    { skill: 'React', demand: 95, yourLevel: 85, jobs: 234 },
    { skill: 'JavaScript', demand: 90, yourLevel: 90, jobs: 456 },
    { skill: 'Node.js', demand: 80, yourLevel: 70, jobs: 189 },
    { skill: 'Python', demand: 85, yourLevel: 60, jobs: 312 },
    { skill: 'TypeScript', demand: 75, yourLevel: 75, jobs: 167 }
  ];

  const BarChart = ({ data, dataKey, color = 'bg-blue-500' }) => {
    const maxValue = Math.max(...data.map(item => item[dataKey]));
    
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="w-12 text-sm text-gray-600">{item.month}</div>
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div 
                className={`${color} h-3 rounded-full transition-all duration-500`}
                style={{ width: `${(item[dataKey] / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="w-8 text-sm text-gray-900 font-medium">{item[dataKey]}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isJobSeeker() ? 'Career Insights' : 'Hiring Analytics'}
            </h1>
            <p className="text-gray-600 mt-1">
              {isJobSeeker() 
                ? 'Analyze your job search performance and market trends'
                : 'Track your hiring performance and candidate insights'
              }
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 3 months</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-gray-900">67%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Views</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Interview Rate</p>
              <p className="text-2xl font-bold text-gray-900">25%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-red-600">-3% from last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">18%</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+5% from last month</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Application Trends */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
              Application Trends
            </h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Applications Sent</h4>
              <BarChart data={applicationTrends} dataKey="applications" color="bg-blue-500" />
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Responses Received</h4>
              <BarChart data={applicationTrends} dataKey="responses" color="bg-green-500" />
            </div>
          </div>
        </div>

        {/* Skills Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="w-5 h-5 mr-2 text-purple-500" />
              Skills Market Analysis
            </h3>
          </div>
          
          <div className="space-y-4">
            {skillsData.map((skill, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{skill.skill}</h4>
                  <span className="text-sm text-gray-500">{skill.jobs} jobs</span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Market Demand</span>
                      <span className="text-gray-900">{skill.demand}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.demand}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Your Level</span>
                      <span className="text-gray-900">{skill.yourLevel}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${skill.yourLevel}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {skill.yourLevel < skill.demand && (
                  <div className="mt-3 text-xs text-amber-600 bg-amber-50 rounded px-2 py-1">
                    Skill gap: {skill.demand - skill.yourLevel}% - Consider improving
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-500" />
            Personalized Recommendations
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <h4 className="font-medium text-gray-900">Learn TypeScript</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                    High Impact
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  TypeScript is in high demand and could increase your job prospects by 35%
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  2-3 weeks
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <h4 className="font-medium text-gray-900">Add Portfolio Projects</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    Medium Impact
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Profiles with portfolios get 60% more views from recruiters
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  1 week
                </div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <h4 className="font-medium text-gray-900">Apply to Remote Jobs</h4>
                  <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                    Low Impact
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  Remote positions have 40% higher response rates in your field
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Activity className="w-3 h-3 mr-1" />
                  Ongoing
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;
