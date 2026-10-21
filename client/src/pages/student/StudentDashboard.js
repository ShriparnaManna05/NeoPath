import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { studentAPI } from '../../services/api';
import { 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CalendarIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';

const StudentDashboard = () => {
  const { data: dashboardData, isLoading, error } = useQuery(
    'studentDashboard',
    studentAPI.getDashboard,
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  if (isLoading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const actualData = dashboardData?.data || dashboardData || {};
  const { recent_assessments, career_recommendations, upcoming_sessions, skills_summary } = actualData;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="glass-panel p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-3 tracking-tight">
            Welcome to your <span className="text-gradient">Career Journey!</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 font-medium max-w-2xl text-lg">
            Track your progress, discover career paths, and connect with counsellors to achieve your goals.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl group">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 dark:bg-indigo-900/50 p-3 rounded-2xl group-hover:bg-indigo-600 transition-colors">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assessments</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">
                {recent_assessments?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl group">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-emerald-100 p-3 rounded-2xl group-hover:bg-emerald-500 transition-colors">
              <BriefcaseIcon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Recommendations</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {career_recommendations?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl group">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-100 p-3 rounded-2xl group-hover:bg-purple-600 transition-colors">
              <CalendarIcon className="h-8 w-8 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sessions</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {upcoming_sessions?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 transform transition-all duration-300 hover:scale-105 hover:shadow-xl group">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-rose-100 p-3 rounded-2xl group-hover:bg-rose-500 transition-colors">
              <ChartBarIcon className="h-8 w-8 text-rose-600 group-hover:text-white transition-colors" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Skills</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">
                {skills_summary?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Assessments */}
        <div className="glass-panel">
          <div className="px-6 py-5 border-b border-slate-200/60 bg-white/40 rounded-t-3xl">
            <h3 className="text-lg font-bold text-slate-800">Recent Assessments</h3>
          </div>
          <div className="p-6">
            {recent_assessments?.length > 0 ? (
              <div className="space-y-4">
                {recent_assessments.slice(0, 3).map((assessment) => (
                  <div key={assessment.attempt_id} className="flex items-center justify-between p-4 bg-white/60 hover:bg-white rounded-xl shadow-sm border border-slate-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-2 bg-indigo-50 rounded-lg mr-4">
                        <AcademicCapIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {assessment.Assessment?.title}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          {assessment.Assessment?.AssessmentType?.type_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-indigo-600">
                        {assessment.percentage?.toFixed(1)}%
                      </p>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {assessment.status === 'completed' ? 'Completed' : 'In Progress'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <AcademicCapIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No assessments taken yet</p>
                <button className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-bold tracking-wide">
                  Take your first assessment &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="glass-panel">
          <div className="px-6 py-5 border-b border-slate-200/60 bg-white/40 rounded-t-3xl">
            <h3 className="text-lg font-bold text-slate-800">Career Recommendations</h3>
          </div>
          <div className="p-6">
            {career_recommendations?.length > 0 ? (
              <div className="space-y-4">
                {career_recommendations.slice(0, 3).map((rec) => (
                  <div key={rec.recommendation_id} className="p-5 bg-white/60 hover:bg-white rounded-xl shadow-sm border border-slate-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-slate-800">
                          {rec.CareerPath?.title}
                        </h4>
                        <p className="text-sm font-medium text-slate-500 mt-1.5 line-clamp-2">
                          {rec.CareerPath?.description}
                        </p>
                        <div className="flex items-center mt-3 bg-amber-50 inline-flex px-2 py-1 rounded-md border border-amber-100">
                          <StarIcon className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-xs font-bold text-amber-700">
                            {rec.match_score?.toFixed(1)}% match
                          </span>
                        </div>
                      </div>
                      <span className={`ml-4 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                        rec.status === 'accepted' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        rec.status === 'rejected' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {rec.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <BriefcaseIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No career recommendations yet</p>
                <button className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-bold tracking-wide">
                  Generate recommendations &rarr;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="glass-panel">
          <div className="px-6 py-5 border-b border-slate-200/60 bg-white/40 rounded-t-3xl">
            <h3 className="text-lg font-bold text-slate-800">Upcoming Sessions</h3>
          </div>
          <div className="p-6">
            {upcoming_sessions?.length > 0 ? (
              <div className="space-y-4">
                {upcoming_sessions.slice(0, 3).map((session) => (
                  <div key={session.session_id} className="flex items-center justify-between p-4 bg-white/60 hover:bg-white rounded-xl shadow-sm border border-slate-100 transition-colors">
                    <div className="flex items-center">
                      <div className="p-2 bg-purple-50 rounded-lg mr-4">
                        <CalendarIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {session.title || 'Counselling Session'}
                        </p>
                        <p className="text-xs font-medium text-slate-500">
                          with {session.Counsellor?.first_name} {session.Counsellor?.last_name}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">
                        {new Date(session.scheduled_at).toLocaleDateString()}
                      </p>
                      <p className="text-xs font-semibold text-indigo-600">
                        {new Date(session.scheduled_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <CalendarIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No upcoming sessions</p>
                <Link to="/student/sessions" className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-bold tracking-wide block">
                  Schedule a session &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Skills Summary */}
        <div className="glass-panel">
          <div className="px-6 py-5 border-b border-slate-200/60 bg-white/40 rounded-t-3xl">
            <h3 className="text-lg font-bold text-slate-800">Your Skills</h3>
          </div>
          <div className="p-6">
            {skills_summary?.length > 0 ? (
              <div className="space-y-3">
                {skills_summary.slice(0, 5).map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/60 hover:bg-white rounded-xl shadow-sm border border-slate-100 transition-colors">
                    <div className="flex items-center">
                      <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mr-3 shadow-sm"></div>
                      <span className="text-sm font-bold text-slate-700">
                        {skill.Skill?.skill_name}
                      </span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide ${
                      skill.proficiency_level === 'expert' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      skill.proficiency_level === 'advanced' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                      skill.proficiency_level === 'intermediate' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {skill.proficiency_level}
                    </span>
                  </div>
                ))}
                {skills_summary.length > 5 && (
                  <p className="text-xs font-semibold text-slate-500 text-center mt-4">
                    +{skills_summary.length - 5} more skills
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="mx-auto h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <ChartBarIcon className="h-8 w-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">No skills added yet</p>
                <Link to="/student/profile" className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-bold tracking-wide block">
                  Add your skills &rarr;
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
