import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { assessmentAPI } from '../../services/api';
import { 
  AcademicCapIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlayIcon
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../../components/LoadingSpinner';

const Assessments = () => {
  const [selectedType, setSelectedType] = useState(null);
  
  const { data: assessmentTypesRes, isLoading: typesLoading } = useQuery(
    'assessmentTypes',
    assessmentAPI.getTypes
  );
  const assessmentTypes = assessmentTypesRes?.data || assessmentTypesRes;

  const { data: assessmentsRes, isLoading: assessmentsLoading } = useQuery(
    ['assessments', selectedType],
    () => assessmentAPI.getByType(selectedType),
    {
      enabled: !!selectedType
    }
  );
  const assessments = assessmentsRes?.data || assessmentsRes;

  const { data: historyRes, isLoading: historyLoading } = useQuery(
    'assessmentHistory',
    assessmentAPI.getHistory
  );
  const history = historyRes?.data || historyRes;

  if (typesLoading) {
    return <LoadingSpinner text="Loading assessment types..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-purple-500/20 transition-all duration-700"></div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-pink-600 mb-3 tracking-tight">
          Assessments
        </h1>
        <p className="text-slate-600 text-lg font-medium max-w-2xl">
          Take assessments to discover your strengths, interests, and career potential.
        </p>
      </div>

      {/* Assessment Types */}
      <div className="glass-panel overflow-hidden">
        <div className="px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <AcademicCapIcon className="w-6 h-6 mr-2 text-purple-500" />
            Available Assessment Types
          </h2>
        </div>
        <div className="p-8 bg-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {assessmentTypes?.map((type) => (
              <button
                key={type.type_id}
                onClick={() => setSelectedType(type.type_id)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedType === type.type_id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <AcademicCapIcon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-medium text-gray-900">{type.type_name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                  <div className="mt-2 text-xs text-gray-400">
                    {type.total_questions} questions • {type.duration_minutes} min
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assessments for Selected Type */}
      {selectedType && (
        <div className="glass-panel overflow-hidden mt-8">
          <div className="px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-md">
            <h2 className="text-xl font-bold text-slate-800 flex items-center">
              <AcademicCapIcon className="w-6 h-6 mr-2 text-pink-500" />
              {assessmentTypes?.find(t => t.type_id === selectedType)?.type_name} Assessments
            </h2>
          </div>
          <div className="p-8 bg-white/20">
            {assessmentsLoading ? (
              <LoadingSpinner text="Loading assessments..." />
            ) : assessments?.length > 0 ? (
              <div className="space-y-4">
                {assessments.map((assessment) => (
                  <div key={assessment.assessment_id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">
                          {assessment.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {assessment.description}
                        </p>
                        <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <AcademicCapIcon className="h-4 w-4 mr-1" />
                            {assessment.AssessmentType?.total_questions} questions
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            {assessment.AssessmentType?.duration_minutes} minutes
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => window.location.href = `/student/assessments/${assessment.assessment_id}`}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md shadow hover:bg-blue-700 flex items-center transition-all"
                      >
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Start Assessment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No assessments available for this type</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assessment History */}
      <div className="glass-panel overflow-hidden mt-8">
        <div className="px-6 py-5 border-b border-white/40 bg-white/30 backdrop-blur-md">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <ClockIcon className="w-6 h-6 mr-2 text-indigo-500" />
            Your Assessment History
          </h2>
        </div>
        <div className="p-8 bg-white/20">
          {historyLoading ? (
            <LoadingSpinner text="Loading history..." />
          ) : history?.length > 0 ? (
            <div className="space-y-4">
              {history.map((attempt) => (
                <div key={attempt.attempt_id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {attempt.Assessment?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {attempt.Assessment?.AssessmentType?.type_name}
                      </p>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {attempt.time_taken_minutes} minutes
                        </div>
                        <div className="flex items-center">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          {new Date(attempt.completed_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {attempt.percentage?.toFixed(1)}%
                      </div>
                      <div className={`text-sm ${
                        attempt.percentage >= 80 ? 'text-green-600' :
                        attempt.percentage >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        {attempt.status === 'completed' ? 'Completed' : 'In Progress'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No assessment history yet</p>
              <p className="text-sm text-gray-400 mt-1">Take your first assessment to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assessments;
