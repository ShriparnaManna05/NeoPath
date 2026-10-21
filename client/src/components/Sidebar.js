import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  CalendarIcon,
  UserIcon,
  ChartBarIcon,
  UsersIcon,
  CogIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

import Logo from './Logo';

const Sidebar = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();

  const studentMenuItems = [
    { name: 'Dashboard', href: '/student', icon: HomeIcon },
    { name: 'Assessments', href: '/student/assessments', icon: AcademicCapIcon },
    { name: 'Career Paths', href: '/student/careers', icon: BriefcaseIcon },
    { name: 'Sessions', href: '/student/sessions', icon: CalendarIcon },
    { name: 'Messages', href: '/student/messages', icon: ChatBubbleLeftRightIcon },
  ];

  const counsellorMenuItems = [
    { name: 'Dashboard', href: '/counsellor', icon: HomeIcon },
    { name: 'Sessions', href: '/counsellor/sessions', icon: CalendarIcon },
    { name: 'Students', href: '/counsellor/students', icon: UsersIcon },
    { name: 'Assessments', href: '/counsellor/assessments', icon: AcademicCapIcon },
    { name: 'Messages', href: '/counsellor/messages', icon: ChatBubbleLeftRightIcon },
  ];

  const adminMenuItems = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Users', href: '/admin/users', icon: UsersIcon },
    { name: 'Sessions', href: '/admin/sessions', icon: CalendarIcon },
    { name: 'Assessments', href: '/admin/assessments', icon: AcademicCapIcon },
    { name: 'Careers', href: '/admin/careers', icon: BriefcaseIcon },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon },
  ];

  const commonMenuItems = [
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  const getMenuItems = () => {
    switch (userRole) {
      case 'student':
        return [...studentMenuItems, ...commonMenuItems];
      case 'counsellor':
        return [...counsellorMenuItems, ...commonMenuItems];
      case 'admin':
        return [...adminMenuItems, ...commonMenuItems];
      default:
        return commonMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-slate-200/60 dark:border-slate-800/60
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-20 px-8 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-center w-full">
            <Logo className="h-10 w-full hover:scale-105 transition-transform cursor-pointer" />
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-8 px-5">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center px-4 py-3.5 text-sm font-semibold rounded-2xl transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/40 dark:to-purple-900/40 text-indigo-700 dark:text-indigo-300 shadow-sm border border-indigo-100/50 dark:border-indigo-800/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 border border-transparent'
                    }
                  `}
                >
                  <item.icon
                    className={`
                      mr-4 h-5 w-5 flex-shrink-0 transition-colors
                      ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400'}
                    `}
                  />
                  {item.name}
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></div>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center border border-slate-300 dark:border-slate-600 shadow-sm">
                <UserIcon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize tracking-tight">
                {userRole} Account
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                {userRole === 'student' ? 'Student' : 
                 userRole === 'counsellor' ? 'Counsellor' : 'Administrator'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
