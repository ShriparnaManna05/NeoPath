import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

const Header = ({ onMenuClick, user }) => {
  const { logout } = useAuth();
  const { connected } = useSocket();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 z-40 transition-colors duration-300">
      <div className="flex items-center justify-between h-20 px-6 lg:px-8">
        {/* Left side */}
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="ml-4 lg:ml-0">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
              Welcome back, <span className="text-gradient">{user?.email?.split('@')[0]}!</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 capitalize mt-0.5">
              {user?.role} Dashboard
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-5">
          {/* Connection status */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${connected ? 'bg-emerald-500 shadow-emerald-500/50 animate-pulse' : 'bg-rose-500 shadow-rose-500/50'}`} />
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 tracking-wide">
              {connected ? 'CONNECTED' : 'OFFLINE'}
            </span>
          </div>

          {/* Theme toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors"
          >
            {theme === 'light' ? (
              <MoonIcon className="h-6 w-6" />
            ) : (
              <SunIcon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors">
            <BellIcon className="h-6 w-6" />
            <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 pr-4 text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-sm font-semibold text-slate-700">
                {user?.email?.split('@')[0]}
              </span>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl py-2 z-50 border border-slate-100 transform transition-all">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl -mt-2 mb-2">
                  <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                  <p className="text-xs font-medium text-slate-500 capitalize mt-1">{user?.role}</p>
                </div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // Navigate to profile
                  }}
                  className="flex items-center w-full px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <UserCircleIcon className="h-5 w-5 mr-3" />
                  Profile Settings
                </button>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="flex items-center w-full px-5 py-2.5 text-sm font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 transition-colors mt-1 border-t border-slate-50 pt-3"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
