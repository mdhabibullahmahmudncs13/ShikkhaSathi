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
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Student!</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wide">Grade 6</span>
            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
            <p className="text-slate-500 font-medium">
              Your daily learning goal is <span className="text-primary">80%</span> complete
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-amber-50 p-5 rounded-DEFAULT border border-amber-100 hover:scale-[1.02] transition-transform duration-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">Total XP</p>
                <h3 className="text-3xl font-extrabold text-amber-900 mt-2">{studentProgress.totalXP}</h3>
                <p className="text-xs text-amber-700/60 mt-1 font-medium">Level {studentProgress.currentLevel} Novice</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500">
                <span className="material-icons-round text-2xl">bolt</span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-5 rounded-DEFAULT border border-orange-100 hover:scale-[1.02] transition-transform duration-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">Streak</p>
                <h3 className="text-3xl font-extrabold text-orange-900 mt-2">{studentProgress.currentStreak}</h3>
                <p className="text-xs text-orange-700/60 mt-1 font-medium">Days in a row</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm text-orange-500">
                <span className="material-icons-round text-2xl">local_fire_department</span>
              </div>
            </div>
          </div>

          <div className="bg-sky-50 p-5 rounded-DEFAULT border border-sky-100 hover:scale-[1.02] transition-transform duration-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-sky-600 uppercase tracking-wide">Study Time</p>
                <h3 className="text-3xl font-extrabold text-sky-900 mt-2">
                  {Math.floor(studentProgress.subjectProgress.reduce((acc, s) => acc + s.timeSpent, 0) / 60)}h
                </h3>
                <p className="text-xs text-sky-700/60 mt-1 font-medium">This week</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm text-sky-500">
                <span className="material-icons-round text-2xl">schedule</span>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-5 rounded-DEFAULT border border-purple-100 hover:scale-[1.02] transition-transform duration-200 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">Achievements</p>
                <h3 className="text-3xl font-extrabold text-purple-900 mt-2">
                  {studentProgress.achievements.filter(a => a.unlockedAt).length}
                </h3>
                <p className="text-xs text-purple-700/60 mt-1 font-medium">Unlocked</p>
              </div>
              <div className="p-3 bg-white rounded-xl shadow-sm text-purple-500">
                <span className="material-icons-round text-2xl">emoji_events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/quiz')}
            className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white p-8 rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:shadow-blue-500/30 transition-all cursor-pointer group relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-indigo-900 opacity-20 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 shadow-inner border border-white/10">
                  <span className="material-icons-round text-white text-3xl">play_arrow</span>
                </div>
                <h3 className="text-2xl font-bold">Continue Learning</h3>
                <p className="text-blue-100 text-sm mt-2 font-medium opacity-90">Resume Mathematics: Linear Equations</p>
              </div>
              <div className="flex items-center text-sm font-bold bg-white text-blue-600 w-fit px-5 py-2.5 rounded-xl shadow-md group-hover:bg-blue-50 transition-colors">
                Start Now <span className="material-icons-round text-base ml-2">arrow_forward</span>
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/quiz')}
            className="bg-gradient-to-br from-rose-500 to-pink-600 text-white p-8 rounded-2xl shadow-xl shadow-rose-500/20 hover:shadow-2xl hover:shadow-rose-500/30 transition-all cursor-pointer group relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-rose-900 opacity-20 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 shadow-inner border border-white/10 group-hover:rotate-12 transition-transform">
                  <span className="material-icons-round text-white text-2xl">quiz</span>
                </div>
                <h3 className="text-2xl font-bold">Take Quiz</h3>
                <p className="text-rose-100 text-sm mt-2 font-medium opacity-90">Test your knowledge on recent topics</p>
              </div>
              <div className="flex items-center text-sm font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm w-fit px-5 py-2.5 rounded-xl border border-white/30 transition-colors">
                Start Quiz
              </div>
            </div>
          </div>

          <div 
            onClick={() => navigate('/chat')}
            className="bg-gradient-to-br from-violet-600 to-purple-600 text-white p-8 rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30 transition-all cursor-pointer group relative overflow-hidden transform hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-purple-900 opacity-20 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col h-full justify-between gap-8">
              <div>
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center mb-6 shadow-inner border border-white/10 group-hover:scale-110 transition-transform">
                  <span className="material-icons-round text-white text-2xl">psychology</span>
                </div>
                <h3 className="text-2xl font-bold">AI Tutor</h3>
                <p className="text-purple-100 text-sm mt-2 font-medium opacity-90">Get personalized help instantly</p>
              </div>
              <div className="flex items-center text-sm font-bold bg-white/20 hover:bg-white/30 backdrop-blur-sm w-fit px-5 py-2.5 rounded-xl border border-white/30 transition-colors">
                Ask Now
              </div>
            </div>
          </div>
        </div>

        {/* Your Subjects Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="material-icons-round text-primary">auto_stories</span>
            Your Subjects
          </h2>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-sm min-h-[250px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors duration-500"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <span className="material-icons-round text-slate-400 text-4xl">library_books</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Start Your Journey</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
                You haven't started any subjects yet. Pick a subject from the sidebar to begin learning!
              </p>
              <button className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-primary hover:text-primary transition-all shadow-sm hover:shadow-md">
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
