import React from 'react';
import { useQuery } from 'react-query';
import { adminAPI } from '../../services/api';
import { 
  UsersIcon, 
  CalendarIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  CogIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const { data: overviewData, isLoading, error } = useQuery(
    'adminOverview',
    () => adminAPI.getOverview({ period: '30' })
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading admin dashboard..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const { user_statistics, session_statistics, assessment_statistics, recommendation_statistics } = overviewData || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">
          System overview and management tools for the NeoPath platform.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {user_statistics?.reduce((sum, stat) => sum + parseInt(stat.count), 0) || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {session_statistics?.total_sessions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Assessments</p>
              <p className="text-2xl font-semibold text-gray-900">
                {assessment_statistics?.total_attempts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BriefcaseIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Recommendations</p>
              <p className="text-2xl font-semibold text-gray-900">
                {recommendation_statistics?.total_recommendations || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* User Statistics */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">User Statistics (Last 30 Days)</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user_statistics?.map((stat) => (
              <div key={stat.role} className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.count}
                </div>
                <div className="text-sm text-gray-500 capitalize">
                  {stat.role}s
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Session Statistics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Session Statistics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed Sessions</span>
                <span className="text-lg font-semibold text-gray-900">
                  {session_statistics?.completed_sessions || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cancelled Sessions</span>
                <span className="text-lg font-semibold text-gray-900">
                  {session_statistics?.cancelled_sessions || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Rating</span>
                <span className="text-lg font-semibold text-gray-900">
                  {session_statistics?.avg_rating ? session_statistics.avg_rating.toFixed(1) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Statistics */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Assessment Statistics</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Attempts</span>
                <span className="text-lg font-semibold text-gray-900">
                  {assessment_statistics?.total_attempts || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="text-lg font-semibold text-gray-900">
                  {assessment_statistics?.completed_attempts || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Score</span>
                <span className="text-lg font-semibold text-gray-900">
                  {assessment_statistics?.avg_percentage ? assessment_statistics.avg_percentage.toFixed(1) : 'N/A'}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn-primary flex items-center justify-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            Manage Users
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            View Sessions
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            Manage Assessments
          </button>
          <button className="btn-secondary flex items-center justify-center">
            <CogIcon className="h-5 w-5 mr-2" />
            System Settings
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">99.9%</div>
            <div className="text-sm text-green-600">Uptime</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">2.3s</div>
            <div className="text-sm text-blue-600">Avg Response</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">1.2GB</div>
            <div className="text-sm text-yellow-600">Memory Usage</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
