import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { assessmentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const TakeAssessment = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  
  const [attemptId, setAttemptId] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  
  // 1. Fetch Assessment & Questions
  const { data: assessmentRes, isLoading: assessmentLoading } = useQuery(
    ['assessment', assessmentId],
    () => assessmentAPI.getById(assessmentId),
    {
      enabled: !!assessmentId,
      onError: () => {
        toast.error('Failed to load assessment');
        navigate('/student/assessments');
      }
    }
  );
  const assessment = assessmentRes?.data;
  const questions = assessment?.Questions || [];

  // 2. Start Assessment Mutation
  const startMutation = useMutation(
    () => assessmentAPI.startAssessment(assessmentId),
    {
      onSuccess: (res) => {
        setAttemptId(res.data.attempt_id);
        toast.success('Assessment started! Good luck.');
      },
      onError: (err) => {
        const msg = err.response?.data?.message || 'Failed to start assessment';
        toast.error(msg);
        if (err.response?.data?.attempt_id) {
            // Already in progress, we can resume
            setAttemptId(err.response.data.attempt_id);
        } else {
            navigate('/student/assessments');
        }
      }
    }
  );

  // 3. Submit Answer Mutation
  const submitAnswerMutation = useMutation(
    (answerData) => assessmentAPI.submitAnswer(attemptId, answerData),
    {
      onSuccess: () => {
        // Go to next question or complete
        setSelectedAnswer('');
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(curr => curr + 1);
        } else {
          completeMutation.mutate();
        }
      },
      onError: () => toast.error('Failed to save answer')
    }
  );

  // 4. Complete Assessment Mutation
  const completeMutation = useMutation(
    () => assessmentAPI.completeAssessment(attemptId),
    {
      onSuccess: (res) => {
        toast.success(`Assessment Complete! Score: ${res.data.percentage}%`);
        navigate('/student/assessments');
      },
      onError: () => toast.error('Failed to complete assessment')
    }
  );

  if (assessmentLoading) return <LoadingSpinner text="Preparing your questions..." />;
  if (!assessment) return null;

  // Render Start Screen
  if (!attemptId) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">{assessment.title}</h1>
        <p className="text-slate-600 mb-8">{assessment.description}</p>
        
        <div className="flex justify-center space-x-12 mb-10">
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-indigo-600 mb-1">{questions.length}</span>
            <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Questions</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-pink-500 mb-1">{assessment.AssessmentType?.duration_minutes}</span>
            <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Minutes</span>
          </div>
        </div>

        <button 
          onClick={() => startMutation.mutate()}
          disabled={startMutation.isLoading}
          className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50"
        >
          {startMutation.isLoading ? 'Starting...' : 'Begin Assessment'}
        </button>
      </div>
    );
  }

  // Render Quiz Interface
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  const handleNext = () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }
    submitAnswerMutation.mutate({
      questionId: currentQuestion.question_id,
      answerText: selectedAnswer
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-semibold text-slate-600 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(progressPercentage)}% Completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-8 md:p-12">
        <h2 className="text-2xl font-semibold text-slate-800 mb-8 leading-relaxed">
          {currentQuestion.question_text}
        </h2>

        {/* Options */}
        <div className="space-y-4">
          {currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'rating_scale' ? (
            currentQuestion.options?.map((option, idx) => (
              <label 
                key={idx} 
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedAnswer === option 
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' 
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input 
                  type="radio" 
                  name={`question-${currentQuestion.question_id}`} 
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-4 font-medium text-lg">{option}</span>
              </label>
            ))
          ) : currentQuestion.question_type === 'true_false' ? (
            ['True', 'False'].map((option, idx) => (
              <label 
                key={idx} 
                className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  selectedAnswer === option 
                    ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700' 
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input 
                  type="radio" 
                  name={`question-${currentQuestion.question_id}`} 
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="ml-4 font-medium text-lg">{option}</span>
              </label>
            ))
          ) : (
            <textarea
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-700 font-medium text-lg min-h-[150px]"
              placeholder="Type your answer here..."
              value={selectedAnswer}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedAnswer || submitAnswerMutation.isLoading || completeMutation.isLoading}
            className="flex items-center px-8 py-3 bg-slate-900 text-white rounded-full font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 shadow-md"
          >
            {submitAnswerMutation.isLoading || completeMutation.isLoading ? 'Saving...' : (isLastQuestion ? 'Submit Assessment' : 'Next Question')}
            {!isLastQuestion && <ArrowRightIcon className="w-5 h-5 ml-2" />}
            {isLastQuestion && <CheckCircleIcon className="w-5 h-5 ml-2 text-emerald-400" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TakeAssessment;
