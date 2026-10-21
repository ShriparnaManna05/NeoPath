import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { careerAPI } from '../../services/api';
import { 
  BriefcaseIcon, 
  StarIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const CareerPaths = () => {
  const [filters, setFilters] = useState({
    category: '',
    minSalary: '',
    maxSalary: '',
    outlook: ''
  });

  const queryClient = useQueryClient();

  const { data: careerPathsRes, isLoading: pathsLoading } = useQuery(
    ['careerPaths', filters],
    () => careerAPI.getPaths(filters)
  );
  const careerPaths = careerPathsRes?.data || careerPathsRes;

  const { data: recommendationsRes, isLoading: recommendationsLoading } = useQuery(
    'careerRecommendations',
    careerAPI.getRecommendations
  );
  const recommendations = recommendationsRes?.data || recommendationsRes;

  const generateRecommendationsMutation = useMutation(
    careerAPI.generateRecommendations,
    {
      onSuccess: () => {
        queryClient.invalidateQueries('careerRecommendations');
        toast.success('Career recommendations generated successfully!');
      },
      onError: () => {
        toast.error('Failed to generate recommendations');
      }
    }
  );

  const updateRecommendationMutation = useMutation(
    ({ recommendationId, status }) => careerAPI.updateRecommendation(recommendationId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('careerRecommendations');
        toast.success('Recommendation updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update recommendation');
      }
    }
  );

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerateRecommendations = () => {
    generateRecommendationsMutation.mutate();
  };

  const handleRecommendationAction = (recommendationId, status) => {
    updateRecommendationMutation.mutate({ recommendationId, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-600 mb-3 tracking-tight">
          Career Paths
        </h1>
        <p className="text-slate-600 text-lg font-medium max-w-2xl">
          Explore career opportunities and discover paths that match your skills and interests.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <ChartBarIcon className="w-6 h-6 mr-2 text-indigo-500" />
          Filter Careers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Education Level
            </label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="">All Levels</option>
              <option value="high_school">High School</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Salary
            </label>
            <input
              type="number"
              value={filters.minSalary}
              onChange={(e) => handleFilterChange('minSalary', e.target.value)}
              placeholder="e.g., 50000"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Salary
            </label>
            <input
              type="number"
              value={filters.maxSalary}
              onChange={(e) => handleFilterChange('maxSalary', e.target.value)}
              placeholder="e.g., 100000"
              className="input-field"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Outlook
            </label>
            <select
              value={filters.outlook}
              onChange={(e) => handleFilterChange('outlook', e.target.value)}
              className="input-field"
            >
              <option value="">All Outlooks</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <StarIcon className="w-6 h-6 mr-2 text-yellow-500" />
              AI-Powered Recommendations
            </h2>
            <button
              onClick={handleGenerateRecommendations}
              disabled={generateRecommendationsMutation.isLoading}
              className="btn-primary flex items-center shadow-md hover:shadow-indigo-500/30"
            >
              {generateRecommendationsMutation.isLoading ? 'Generating...' : '✨ Generate Recommendations'}
            </button>
          </div>
        </div>
        <div className="p-8 bg-white/20">
          {recommendationsLoading ? (
            <LoadingSpinner text="Loading recommendations..." />
          ) : recommendations?.length > 0 ? (
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.recommendation_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {rec.CareerPath?.title}
                        </h3>
                        <div className="flex items-center ml-2">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium text-gray-600">
                            {rec.match_score?.toFixed(1)}% match
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {rec.CareerPath?.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                          ${rec.CareerPath?.salary_range_min?.toLocaleString()} - ${rec.CareerPath?.salary_range_max?.toLocaleString()}
                        </div>
                        <div className="flex items-center">
                          <ChartBarIcon className="h-4 w-4 mr-1" />
                          {rec.CareerPath?.job_market_outlook} outlook
                        </div>
                      </div>
                      {rec.reasoning && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                          "{rec.reasoning}"
                        </p>
                      )}
                      {rec.CareerPath?.required_skills && rec.CareerPath.required_skills.length > 0 && (
                        <div className="mt-3">
                          <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Recommended Skills to Develop</p>
                          <div className="flex flex-wrap gap-2">
                            {rec.CareerPath.required_skills.map((skill, idx) => (
                              <span key={idx} className="px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 font-medium">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`badge ${
                        rec.status === 'accepted' ? 'badge-success' :
                        rec.status === 'rejected' ? 'badge-error' :
                        'badge-warning'
                      }`}>
                        {rec.status}
                      </span>
                      {rec.status === 'pending' && (
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleRecommendationAction(rec.recommendation_id, 'accepted')}
                            className="p-1 text-green-600 hover:text-green-700"
                            title="Accept"
                          >
                            <CheckCircleIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRecommendationAction(rec.recommendation_id, 'rejected')}
                            className="p-1 text-red-600 hover:text-red-700"
                            title="Reject"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recommendations yet</p>
              <p className="text-sm text-gray-400 mt-1">Generate AI-powered recommendations based on your profile</p>
            </div>
          )}
        </div>
      </div>

      {/* All Career Paths */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <BriefcaseIcon className="w-6 h-6 mr-2 text-indigo-500" />
            All Career Paths
          </h2>
        </div>
        <div className="p-8 bg-white/20">
          {pathsLoading ? (
            <div className="py-8"><LoadingSpinner text="Loading career paths..." /></div>
          ) : careerPaths?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerPaths.map((career) => (
                <div key={career.career_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {career.title}
                    </h3>
                    <span className={`badge ${
                      career.job_market_outlook === 'Excellent' ? 'badge-success' :
                      career.job_market_outlook === 'Good' ? 'badge-info' :
                      career.job_market_outlook === 'Fair' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {career.job_market_outlook}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                    {career.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      ${career.salary_range_min?.toLocaleString()} - ${career.salary_range_max?.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <BriefcaseIcon className="h-4 w-4 mr-2" />
                      {career.required_education}
                    </div>
                    {career.growth_rate && (
                      <div className="flex items-center">
                        <ChartBarIcon className="h-4 w-4 mr-2" />
                        {career.growth_rate}% growth rate
                      </div>
                    )}
                  </div>

                  {career.required_skills && career.required_skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {career.required_skills.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded border border-slate-200">
                            {skill}
                          </span>
                        ))}
                        {career.required_skills.length > 5 && (
                          <span className="px-2 py-0.5 text-[10px] bg-slate-50 text-slate-400 rounded border border-slate-100">
                            +{career.required_skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button className="w-full mt-4 btn-primary">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No career paths found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerPaths;
