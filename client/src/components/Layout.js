import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';

// Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import Assessments from '../pages/student/Assessments';
import CareerPaths from '../pages/student/CareerPaths';
import Sessions from '../pages/student/Sessions';
import CounsellorDashboard from '../pages/counsellor/CounsellorDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import StudentProfile from '../pages/student/Profile';
import GenericProfile from '../pages/Profile';
import NotFound from '../pages/NotFound';
import TakeAssessment from '../pages/student/TakeAssessment';
import Messages from '../pages/student/Messages';

const Layout = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  const getDefaultRoute = () => {
    switch (user.role) {
      case 'student':
        return '/student';
      case 'counsellor':
        return '/counsellor';
      case 'admin':
        return '/admin';
      default:
        return '/login';
    }
  };

  return (
    <div className="flex h-screen bg-transparent">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userRole={user.role}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              {/* Common Routes */}
              <Route path="profile" element={<GenericProfile />} />

              {/* Student Routes */}
              {user.role === 'student' && (
                <>
                  <Route path="student/profile" element={<StudentProfile />} />
                  <Route path="student" element={<StudentDashboard />} />
                  <Route path="student/assessments" element={<Assessments />} />
                  <Route path="student/assessments/:assessmentId" element={<TakeAssessment />} />
                  <Route path="student/careers" element={<CareerPaths />} />
                  <Route path="student/sessions" element={<Sessions />} />
                  <Route path="student/messages" element={<Messages />} />
                </>
              )}
              
              {/* Counsellor Routes */}
              {user.role === 'counsellor' && (
                <Route path="counsellor" element={<CounsellorDashboard />} />
              )}
              
              {/* Admin Routes */}
              {user.role === 'admin' && (
                <Route path="admin" element={<AdminDashboard />} />
              )}
              
              {/* Default redirect */}
              <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
