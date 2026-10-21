import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { sessionAPI, counsellorAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  CalendarIcon, 
  ClockIcon,
  VideoCameraIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/20/solid';
import LoadingSpinner from '../../components/LoadingSpinner';

const Sessions = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    counsellorId: '',
    sessionType: 'one_on_one',
    sessionMode: 'online',
    scheduledAt: '',
    durationMinutes: 60,
    title: '',
    description: ''
  });

  const { data: sessionsRes, isLoading, refetch } = useQuery(
    'mySessions',
    sessionAPI.getMySessions
  );
  
  const { data: counsellorsRes } = useQuery(
    'counsellors',
    counsellorAPI.getAll
  );

  const sessions = sessionsRes?.data || sessionsRes;
  const counsellors = counsellorsRes?.data || counsellorsRes || [];

  const handleSchedule = async (e) => {
    e.preventDefault();
    try {
      await sessionAPI.create({
        ...formData,
        counsellorId: parseInt(formData.counsellorId),
        durationMinutes: parseInt(formData.durationMinutes),
        scheduledAt: new Date(formData.scheduledAt).toISOString()
      });
      toast.success('Session scheduled successfully!');
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      toast.error('Failed to schedule session');
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading sessions..." />;
  }

  const upcomingSessions = sessions?.filter(session => 
    new Date(session.scheduled_at) > new Date() && session.status === 'scheduled'
  ) || [];

  const pastSessions = sessions?.filter(session => 
    new Date(session.scheduled_at) <= new Date() || session.status === 'completed'
  ) || [];

  const currentSessions = sessions?.filter(session => 
    session.status === 'in_progress'
  ) || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'badge-info';
      case 'in_progress': return 'badge-warning';
      case 'completed': return 'badge-success';
      case 'cancelled': return 'badge-error';
      default: return 'badge-info';
    }
  };

  const getSessionIcon = (mode) => {
    return mode === 'online' ? VideoCameraIcon : MapPinIcon;
  };

  const SessionCard = ({ session }) => {
    const SessionIcon = getSessionIcon(session.session_mode);
    
    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">
              {session.title || 'Counselling Session'}
            </h3>
            <p className="text-sm text-gray-600">
              with {session.Counsellor?.first_name} {session.Counsellor?.last_name}
            </p>
          </div>
          <span className={`badge ${getStatusColor(session.status)}`}>
            {session.status.replace('_', ' ')}
          </span>
        </div>

        <div className="space-y-2 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2" />
            {new Date(session.scheduled_at).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-2" />
            {new Date(session.scheduled_at).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })} ({session.duration_minutes} minutes)
          </div>
          <div className="flex items-center">
            <SessionIcon className="h-4 w-4 mr-2" />
            {session.session_mode === 'online' ? 'Online' : 'In-person'}
            {session.meeting_link && (
              <a 
                href={session.meeting_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 hover:text-blue-500"
              >
                Join Meeting
              </a>
            )}
          </div>
          {session.location && (
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-2" />
              {session.location}
            </div>
          )}
        </div>

        {session.description && (
          <p className="text-sm text-gray-600 mb-4">
            {session.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {session.status === 'scheduled' && (
              <button className="btn-secondary text-sm">
                Reschedule
              </button>
            )}
            {session.status === 'in_progress' && (
              <button className="btn-primary text-sm flex items-center">
                <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                Join Chat
              </button>
            )}
            {session.status === 'completed' && session.rating && (
              <div className="flex items-center text-sm text-gray-600">
                <span>Rating: </span>
                <div className="flex ml-1">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon 
                      key={i} 
                      className={`h-4 w-4 ${
                        i < session.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`} 
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {session.status === 'scheduled' && (
            <button className="btn-danger text-sm">
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Sessions
          </h1>
          <p className="text-gray-600 dark:text-slate-300">
            Manage your counselling sessions and connect with career counsellors.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          Schedule Session
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">
                {upcomingSessions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {currentSessions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pastSessions.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Session Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'upcoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Upcoming ({upcomingSessions.length})
            </button>
            <button
              onClick={() => setSelectedTab('current')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'current'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              In Progress ({currentSessions.length})
            </button>
            <button
              onClick={() => setSelectedTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'past'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Past ({pastSessions.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map(session => (
                  <SessionCard key={session.session_id} session={session} />
                ))
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming sessions</p>
                  <p className="text-sm text-gray-400 mt-1">Schedule a session with a counsellor</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'current' && (
            <div className="space-y-4">
              {currentSessions.length > 0 ? (
                currentSessions.map(session => (
                  <SessionCard key={session.session_id} session={session} />
                ))
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No active sessions</p>
                  <p className="text-sm text-gray-400 mt-1">Your sessions will appear here when they start</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'past' && (
            <div className="space-y-4">
              {pastSessions.length > 0 ? (
                pastSessions.map(session => (
                  <SessionCard key={session.session_id} session={session} />
                ))
              ) : (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No past sessions</p>
                  <p className="text-sm text-gray-400 mt-1">Your completed sessions will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Schedule Session Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Schedule Video Counselling</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">&times;</button>
            </div>
            <form onSubmit={handleSchedule} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Select Counsellor</label>
                <select 
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2 border"
                  value={formData.counsellorId}
                  onChange={(e) => setFormData({...formData, counsellorId: e.target.value})}
                >
                  <option value="">-- Choose a Counsellor --</option>
                  {counsellors.map(c => (
                    <option key={c.counsellor_id} value={c.counsellor_id}>
                      {c.first_name} {c.last_name} - {c.specialization || 'Career Counsellor'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Date & Time</label>
                <input 
                  type="datetime-local" 
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2 border"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Session Mode</label>
                <select 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2 border"
                  value={formData.sessionMode}
                  onChange={(e) => setFormData({...formData, sessionMode: e.target.value})}
                >
                  <option value="online">Video Counselling (Online)</option>
                  <option value="offline">In-person</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">Topic / Title</label>
                <input 
                  type="text" 
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white sm:text-sm p-2 border"
                  placeholder="E.g. Career Transition Advice"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;
