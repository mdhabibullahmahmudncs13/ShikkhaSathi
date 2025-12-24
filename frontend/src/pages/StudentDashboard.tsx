import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useDashboardData } from '../hooks/useDashboardData';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../hooks/useNotifications';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { studentProgress, loading, error, refetch } = useDashboardData();
  const { notifications, markAsRead } = useNotifications(10); // Get 10 most recent notifications

  const handleNotificationRead = (id: string) => {
    markAsRead(id);
  };

  const emptyProgress = {
    userId: '',
    totalXP: 0,
    currentLevel: 1,
    currentStreak: 0,
    longestStreak: 0,
    subjectProgress: [],
    achievements: [],
    weakAreas: [],
    recommendedPath: { currentTopic: '', recommendedNextTopics: [], completedTopics: [] }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        studentProgress={studentProgress || emptyProgress}
        notifications={notifications}
        onNotificationRead={handleNotificationRead}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !studentProgress) {
    return (
      <DashboardLayout
        studentProgress={studentProgress || emptyProgress}
        notifications={notifications}
        onNotificationRead={handleNotificationRead}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Failed to Load Dashboard</h2>
            <p className="text-gray-600 mb-4">{error || 'An unexpected error occurred'}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      studentProgress={studentProgress}
      notifications={notifications}
      onNotificationRead={handleNotificationRead}
    >
      <div className="max-w-7xl mx-auto space-y-8 bg-white">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Welcome back, <span className="text-indigo-600">Student!</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase tracking-wide">Grade 6</span>
              <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
              <p className="text-gray-500 font-medium">
                Your daily learning goal is <span className="text-indigo-600 font-bold">80%</span> complete
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Total XP</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{studentProgress.totalXP}</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">Level {studentProgress.currentLevel} Novice</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <span className="material-icons-round text-2xl">bolt</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-600 uppercase tracking-wide">Streak</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">{studentProgress.currentStreak}</h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">Days in a row</p>
              </div>
              <div className="p-3 bg-teal-50 rounded-xl text-teal-600">
                <span className="material-icons-round text-2xl">local_fire_department</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Study Time</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {Math.floor(studentProgress.subjectProgress.reduce((acc, s) => acc + s.timeSpent, 0) / 60)}h
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">This week</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                <span className="material-icons-round text-2xl">schedule</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Achievements</p>
                <h3 className="text-3xl font-bold text-gray-900 mt-2">
                  {studentProgress.achievements.filter(a => a.unlockedAt).length}
                </h3>
                <p className="text-xs text-gray-500 mt-1 font-medium">Unlocked</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                <span className="material-icons-round text-2xl">emoji_events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/quiz')}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 shadow-inner border border-white/10">
                  <span className="material-icons-round text-white text-3xl">play_arrow</span>
                </div>
                <h3 className="text-2xl font-bold">Continue Learning</h3>
                <p className="text-indigo-100 text-sm mt-2 font-medium opacity-90">Resume Mathematics: Linear Equations</p>
              </div>
              <div className="flex items-center text-sm font-bold bg-white text-indigo-600 w-fit px-5 py-2.5 rounded-xl shadow-md group-hover:bg-indigo-50 transition-colors">
                Start Now <span className="material-icons-round text-base ml-2">arrow_forward</span>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/quiz')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 shadow-inner border border-white/10 group-hover:rotate-12 transition-transform">
                  <span className="material-icons-round text-white text-2xl">quiz</span>
                </div>
                <h3 className="text-2xl font-bold">Take Quiz</h3>
                <p className="text-purple-100 text-sm mt-2 font-medium opacity-90">Test your knowledge on recent topics</p>
              </div>
              <div className="flex items-center text-sm font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm w-fit px-5 py-2.5 rounded-xl border border-white/30 transition-colors">
                Start Quiz
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer group relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-white text-2xl">psychology</span>
                </div>
                <h3 className="text-2xl font-bold">AI Tutor</h3>
                <p className="text-teal-100 text-sm mt-2 font-medium opacity-90">Get personalized help instantly</p>
              </div>
              <div className="flex items-center text-sm font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm w-fit px-5 py-2.5 rounded-xl border border-white/30 transition-colors">
                Ask Now
              </div>
            </div>
          </div>
        </div>

        {/* Your Subjects Section */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="material-icons-round text-indigo-600">auto_stories</span>
              Your Subjects
            </h2>
          </div>
          <div className="p-8 flex flex-col items-center justify-center text-center min-h-[250px] relative overflow-hidden group">
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-indigo-50 rounded-full blur-3xl group-hover:bg-indigo-100 transition-colors duration-500"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="material-icons-round text-gray-400 text-4xl">library_books</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Start Your Journey</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                You haven't started any subjects yet. Pick a subject from the sidebar to begin learning!
              </p>
              <button className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md">
                Explore Courses Directory
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
