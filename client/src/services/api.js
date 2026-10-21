import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  verifyToken: () => api.get('/auth/verify'),
  getProfile: () => api.get('/auth/profile'),
  updatePassword: (currentPassword, newPassword) => 
    api.put('/auth/password', { currentPassword, newPassword }),
};

// Student API
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  getSkills: () => api.get('/students/skills'),
  addSkill: (skillData) => api.post('/students/skills', skillData),
  updateSkill: (skillId, skillData) => api.put(`/students/skills/${skillId}`, skillData),
  removeSkill: (skillId) => api.delete(`/students/skills/${skillId}`),
  getDashboard: () => api.get('/students/dashboard'),
  getAll: (params) => api.get('/students', { params }),
};

// Skill API
export const skillAPI = {
  getAll: () => api.get('/skills'),
};

// Counsellor API
export const counsellorAPI = {
  getProfile: () => api.get('/counsellors/profile'),
  updateProfile: (data) => api.put('/counsellors/profile', data),
  getDashboard: () => api.get('/counsellors/dashboard'),
  getAll: () => api.get('/counsellors'),
};

// Assessment API
export const assessmentAPI = {
  getTypes: () => api.get('/assessments/types'),
  getByType: (typeId) => api.get(`/assessments/type/${typeId}`),
  getById: (assessmentId) => api.get(`/assessments/${assessmentId}`),
  startAssessment: (assessmentId) => api.post(`/assessments/${assessmentId}/start`),
  submitAnswer: (attemptId, answerData) => 
    api.post(`/assessments/attempts/${attemptId}/answers`, answerData),
  completeAssessment: (attemptId) => 
    api.post(`/assessments/attempts/${attemptId}/complete`),
  getHistory: () => api.get('/assessments/history/student'),
  getAttemptResults: (attemptId) => api.get(`/assessments/attempts/${attemptId}/results`),
  create: (data) => api.post('/assessments', data),
  addQuestion: (assessmentId, questionData) => 
    api.post(`/assessments/${assessmentId}/questions`, questionData),
};

// Career API
export const careerAPI = {
  getPaths: (params) => api.get('/careers/paths', { params }),
  getPathById: (careerId) => api.get(`/careers/paths/${careerId}`),
  getRecommendations: () => api.get('/careers/recommendations/student'),
  generateRecommendations: () => api.post('/careers/recommendations/generate'),
  updateRecommendation: (recommendationId, status) => 
    api.put(`/careers/recommendations/${recommendationId}`, { status }),
  createRecommendation: (data) => api.post('/careers/recommendations', data),
  getAnalytics: () => api.get('/careers/analytics'),
};

// Session API
export const sessionAPI = {
  getMySessions: () => api.get('/sessions/my-sessions'),
  getById: (sessionId) => api.get(`/sessions/${sessionId}`),
  create: (data) => api.post('/sessions', data),
  update: (sessionId, data) => api.put(`/sessions/${sessionId}`, data),
  cancel: (sessionId, reason) => api.put(`/sessions/${sessionId}/cancel`, { reason }),
  getAvailability: (counsellorId, date) => 
    api.get(`/sessions/availability/${counsellorId}`, { params: { date } }),
  getStats: (params) => api.get('/sessions/stats/overview', { params }),
};

// Message API
export const messageAPI = {
  getSessionMessages: (sessionId) => api.get(`/messages/session/${sessionId}`),
  sendMessage: (data) => api.post('/messages', data),
  markAsRead: (messageId) => api.put(`/messages/${messageId}/read`),
};

// Notification API
export const notificationAPI = {
  getMyNotifications: (unreadOnly = false) => 
    api.get('/notifications', { params: { unreadOnly } }),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  create: (data) => api.post('/notifications', data),
};

// Admin API
export const adminAPI = {
  getOverview: (params) => api.get('/admin/overview', { params }),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserStatus: (userId, isActive) => 
    api.put(`/admin/users/${userId}/status`, { isActive }),
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.put('/admin/settings', { settings }),
};

export default api;
