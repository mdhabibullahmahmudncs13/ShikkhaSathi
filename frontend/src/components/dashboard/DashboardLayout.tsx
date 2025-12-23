import React, { useState } from 'react';
import { Notification, StudentProgress } from '../../types/dashboard';
import { useUser } from '../../contexts/UserContext';

// User Menu Component
const UserMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useUser();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = user?.full_name || user?.first_name || 'Student Name';
  const initials = getInitials(displayName);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 cursor-pointer pl-2"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-blue-50 dark:ring-slate-800">
          {initials}
        </div>
        <div className="hidden md:block max-w-[150px]">
          <p className="text-sm font-bold text-slate-700 truncate">{displayName}</p>
          <p className="text-xs text-slate-500 truncate">
            {user?.grade ? `Class ${user.grade} • ` : 'Class 6 • '}Science
          </p>
        </div>
        <span className="material-icons-round text-slate-400 text-sm">expand_more</span>
      </button>
      
      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close menu */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-bold text-gray-900 break-words">{displayName}</p>
              <p className="text-xs text-gray-500 break-all mt-1">{user?.email}</p>
              {user?.grade && (
                <p className="text-xs text-gray-500 mt-1">Grade {user.grade} • {user.medium}</p>
              )}
            </div>
            <a href="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <span className="material-icons-round text-purple-500 mr-3 text-lg">person</span>
              Profile Settings
            </a>
            <a href="/settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              <span className="material-icons-round text-gray-500 mr-3 text-lg">settings</span>
              Account Settings
            </a>
            <div className="border-t border-gray-200 my-1"></div>
            <button 
              onClick={logout}
              className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <span className="material-icons-round text-red-500 mr-3 text-lg">logout</span>
              Sign Out
            </button>
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

  // Debug function for mobile sidebar
  const handleSidebarToggle = (action: 'open' | 'close') => {
    console.log(`Sidebar ${action} clicked`);
    setSidebarOpen(action === 'open');
  };

  const subjects = [
    { name: 'Mathematics', icon: 'bar_chart', color: 'text-blue-500', bgColor: 'bg-blue-500', progress: 35 },
    { name: 'Physics', icon: 'science', color: 'text-purple-500', bgColor: 'bg-purple-500', progress: 12 },
    { name: 'Chemistry', icon: 'biotech', color: 'text-teal-500', bgColor: 'bg-teal-500', progress: 5 },
    { name: 'Biology', icon: 'spa', color: 'text-green-500', bgColor: 'bg-green-500', progress: 0 },
  ];

  const unreadNotifications = notifications.filter(n => !n.read);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => handleSidebarToggle('close')}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto transition-transform duration-300 ease-in-out shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-50 lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="material-icons-round text-white text-2xl">local_library</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">Shikshasathi</h1>
            </div>
            <button
              onClick={() => handleSidebarToggle('close')}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <span className="material-icons-round">close</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
          <nav className="space-y-3">
            <a 
              onClick={() => handleSidebarToggle('close')}
              className="flex items-center px-4 py-3 text-sm font-semibold text-rose-700 bg-rose-50 rounded-DEFAULT hover:bg-rose-100 transition-all group shadow-sm hover:shadow-md border border-rose-100 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
                <span className="material-icons-round text-rose-500 text-lg">quiz</span>
              </div>
              Take Quiz
            </a>
            <a 
              onClick={() => handleSidebarToggle('close')}
              className="flex items-center px-4 py-3 text-sm font-semibold text-violet-700 bg-violet-50 rounded-DEFAULT hover:bg-violet-100 transition-all group shadow-sm hover:shadow-md border border-violet-100 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
                <span className="material-icons-round text-violet-500 text-lg">smart_toy</span>
              </div>
              AI Tutor Chat
            </a>
            <a 
              onClick={() => handleSidebarToggle('close')}
              className="flex items-center px-4 py-3 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-DEFAULT hover:bg-emerald-100 transition-all group shadow-sm hover:shadow-md border border-emerald-100 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
                <span className="material-icons-round text-emerald-500 text-lg">menu_book</span>
              </div>
              Study Materials
            </a>
          </nav>
        </div>

        <div className="px-6 py-2 flex-1">
          <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Subjects</h3>
          <div className="space-y-2">
            {subjects.map((subject) => {
              const progress = studentProgress.subjectProgress.find(p => p.subject === subject.name);
              const completionPercentage = progress?.completionPercentage || subject.progress;
              
              return (
                <div 
                  key={subject.name} 
                  onClick={() => handleSidebarToggle('close')}
                  className="group cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center text-sm font-medium text-slate-600 group-hover:text-blue-600`}>
                      <span className={`material-icons-round mr-3 ${subject.color}`}>{subject.icon}</span>
                      {subject.name}
                    </div>
                    <span className={`text-xs font-semibold ${subject.color} bg-blue-100 px-2 py-0.5 rounded-full`}>
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${subject.bgColor} h-2 rounded-full`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto hidden lg:flex transition-colors duration-200 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-20">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="material-icons-round text-white text-2xl">local_library</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-600">Shikshasathi</h1>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Actions</h3>
          <nav className="space-y-3">
            <a className="flex items-center px-4 py-3 text-sm font-semibold text-rose-700 bg-rose-50 rounded-DEFAULT hover:bg-rose-100 transition-all group shadow-sm hover:shadow-md border border-rose-100" href="#">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
                <span className="material-icons-round text-rose-500 text-lg">quiz</span>
              </div>
              Take Quiz
            </a>
            <a className="flex items-center px-4 py-3 text-sm font-semibold text-violet-700 bg-violet-50 rounded-DEFAULT hover:bg-violet-100 transition-all group shadow-sm hover:shadow-md border border-violet-100" href="#">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
                <span className="material-icons-round text-violet-500 text-lg">smart_toy</span>
              </div>
              AI Tutor Chat
            </a>
            <a className="flex items-center px-4 py-3 text-sm font-semibold text-emerald-700 bg-emerald-50 rounded-DEFAULT hover:bg-emerald-100 transition-all group shadow-sm hover:shadow-md border border-emerald-100" href="#">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center mr-3 shadow-sm">
                <span className="material-icons-round text-emerald-500 text-lg">menu_book</span>
              </div>
              Study Materials
            </a>
          </nav>
        </div>

        <div className="px-6 py-2 flex-1">
          <h3 className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Subjects</h3>
          <div className="space-y-2">
            {subjects.map((subject) => {
              const progress = studentProgress.subjectProgress.find(p => p.subject === subject.name);
              const completionPercentage = progress?.completionPercentage || subject.progress;
              
              return (
                <div key={subject.name} className="group cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`flex items-center text-sm font-medium text-slate-600 group-hover:text-blue-600`}>
                      <span className={`material-icons-round mr-3 ${subject.color}`}>{subject.icon}</span>
                      {subject.name}
                    </div>
                    <span className={`text-xs font-semibold ${subject.color} bg-blue-100 px-2 py-0.5 rounded-full`}>
                      {Math.round(completionPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${subject.bgColor} h-2 rounded-full`}
                      style={{ width: `${completionPercentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleSidebarToggle('open')}
              className="lg:hidden p-2.5 text-slate-500 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
            >
              <span className="material-icons-round">menu</span>
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-slate-800 leading-tight">Dashboard</h2>
              <p className="text-sm text-slate-700">Good morning! Ready to learn?</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-orange-500/20">
              <span className="material-icons-round text-base mr-1">emoji_events</span>
              <span className="mr-2">Level {studentProgress.currentLevel}</span>
              <span className="w-1 h-3 bg-white/30 rounded-full mx-1"></span>
              <span>{studentProgress.totalXP} XP</span>
            </div>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2.5 text-slate-500 hover:text-slate-700 bg-slate-100 rounded-full transition-colors"
            >
              <span className="material-icons-round">notifications_none</span>
              {unreadNotifications.length > 0 && (
                <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="flex items-center gap-3 cursor-pointer pl-2">
              <UserMenu />
            </div>
          </div>

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
        </header>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;