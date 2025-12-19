import React, { useState } from 'react';
import { Notification, StudentProgress } from '../../types/dashboard';

// User Menu Component
const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
          S
        </div>
        <span className="hidden sm:block text-sm font-medium text-gray-700">Student</span>
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              👤 Profile Settings
            </a>
            <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
              ⚙️ Account Settings
            </a>
            <div className="border-t border-gray-200 my-2"></div>
            <a href="/" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
              🚪 Sign Out
            </a>
          </div>
        </>
      )}
    </div>
  );
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  studentProgress: StudentProgress;
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  studentProgress,
  notifications,
  onNotificationRead
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const subjects = [
    { name: 'Mathematics', icon: '📊', color: 'bg-blue-500' },
    { name: 'Physics', icon: '⚛️', color: 'bg-purple-500' },
    { name: 'Chemistry', icon: '🧪', color: 'bg-green-500' },
    { name: 'Biology', icon: '🧬', color: 'bg-red-500' },
    { name: 'Bangla', icon: '📚', color: 'bg-yellow-500' },
    { name: 'English', icon: '🌍', color: 'bg-indigo-500' },
    { name: 'ICT', icon: '💻', color: 'bg-gray-500' },
  ];

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-xl font-bold text-gray-900 truncate">ShikkhaSathi</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="mt-6 px-3 overflow-y-auto overflow-x-hidden" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quick Actions</h3>
            <div className="mt-2 space-y-1">
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900">
                <span className="mr-3">🎯</span>
                Take Quiz
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900">
                <span className="mr-3">💬</span>
                AI Tutor Chat
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900">
                <span className="mr-3">📖</span>
                Study Materials
              </button>
            </div>
          </div>

          {/* Subjects */}
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Subjects</h3>
            <div className="mt-2 space-y-1">
              {subjects.map((subject) => {
                const progress = studentProgress.subjectProgress.find(p => p.subject === subject.name);
                const completionPercentage = progress?.completionPercentage || 0;
                
                return (
                  <div
                    key={subject.name}
                    className="w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0 mt-0.5">{subject.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-sm font-medium truncate flex-1">{subject.name}</span>
                          <span className="text-xs text-gray-500 flex-shrink-0 tabular-nums">{Math.round(completionPercentage)}%</span>
                        </div>
                        {/* Progress bar with strict width constraints */}
                        <div 
                          className="relative h-1.5 bg-gray-200 rounded-full"
                          style={{ 
                            width: '100%',
                            maxWidth: '100%',
                            overflow: 'hidden'
                          }}
                        >
                          <div 
                            className={`absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out ${subject.color}`}
                            style={{ 
                              width: `${Math.min(Math.max(completionPercentage, 0), 100)}%`,
                              maxWidth: '100%'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 w-full">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg font-semibold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500">Welcome back! Ready to learn?</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* XP and Level Display */}
              <div className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full">
                <span className="text-sm font-medium">Level {studentProgress.currentLevel}</span>
                <span className="text-xs opacity-75">•</span>
                <span className="text-sm">{studentProgress.totalXP} XP</span>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-600 relative"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H7a2 2 0 01-2-2V7a2 2 0 012-2h5m4 0v6m0 0l3-3m-3 3l-3-3" />
                  </svg>
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-md cursor-pointer ${
                              notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'
                            }`}
                            onClick={() => onNotificationRead(notification.id)}
                          >
                            <div className="flex items-start">
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.timestamp).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {notifications.length === 0 && (
                        <p className="text-sm text-gray-500 text-center py-4">No notifications</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;