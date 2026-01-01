import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Award, Clock, Zap, Brain, RefreshCw, AlertCircle, BookOpen, Trophy, Users, UserPlus, Plus } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatCard from '../components/dashboard/StatCard';
import SubjectCard from '../components/dashboard/SubjectCard';
import ContinueLearningHero from '../components/dashboard/ContinueLearningHero';
import CodeInputModal from '../components/dashboard/CodeInputModal';
import { useDashboardData } from '../hooks/useDashboardData';
import { useUser } from '../contexts/UserContext';
import { useNotifications } from '../hooks/useNotifications';
import { codeConnectionService } from '../services/codeConnectionService';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { studentProgress, loading, error, refetch } = useDashboardData();
  const { notifications, markAsRead } = useNotifications(10); // Get 10 most recent notifications
  
  // Code input modal states
  const [showClassModal, setShowClassModal] = React.useState(false);
  const [showParentModal, setShowParentModal] = React.useState(false);
  const [codeLoading, setCodeLoading] = React.useState(false);

  const handleNotificationRead = (id: string) => {
    markAsRead(id);
  };

  const handleJoinClass = async (classCode: string) => {
    setCodeLoading(true);
    try {
      const result = await codeConnectionService.joinClassByCode(classCode);
      if (result.success) {
        // Refresh dashboard data to show new class
        refetch();
      }
    } catch (error: any) {
      throw error;
    } finally {
      setCodeLoading(false);
    }
  };

  const handleConnectParent = async (parentCode: string) => {
    setCodeLoading(true);
    try {
      const result = await codeConnectionService.connectToParentByCode(parentCode);
      if (result.success) {
        // Could refresh connections data here if needed
      }
    } catch (error: any) {
      throw error;
    } finally {
      setCodeLoading(false);
    }
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
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-gray-600">
              {user?.grade ? `Grade ${user.grade} • ` : ''}Ready to continue your learning journey?
            </p>
          </div>
          
          {/* Quick Action Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => navigate('/chat')}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <Brain className="w-4 h-4" />
              AI Tutor
            </button>
            <button 
              onClick={() => navigate('/quiz')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              <Target className="w-4 h-4" />
              Take Quiz
            </button>
          </div>
        </div>

        {/* Code Connection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Join Class Card */}
          <div 
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg"
            onClick={() => setShowClassModal(true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Join Class</h3>
                  <p className="text-blue-100">Enter your teacher's class code</p>
                </div>
              </div>
              <Plus className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          {/* Connect to Parent Card */}
          <div 
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg"
            onClick={() => setShowParentModal(true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Connect Parent</h3>
                  <p className="text-green-100">Enter your parent's connection code</p>
                </div>
              </div>
              <Plus className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </div>

        {/* Continue Learning Hero Section */}
        <ContinueLearningHero 
          studentProgress={studentProgress}
          onContinue={() => navigate('/quiz')}
        />

        {/* Learning Arenas Entry Card */}
        <div 
          className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg"
          onClick={() => navigate('/learning')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Learning Arenas</h3>
                <p className="text-violet-100">Explore gamified learning adventures</p>
              </div>
            </div>
            <Trophy className="w-8 h-8 text-violet-200" />
          </div>
        </div>

        {/* Gamification Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Experience Points"
            value={studentProgress.totalXP.toLocaleString()}
            subtitle={`Level ${studentProgress.currentLevel}`}
            icon={Zap}
            progress={studentProgress.totalXP % 100}
            maxProgress={100}
            color="blue"
            trend="up"
            trendValue="+125 XP"
          />
          
          <StatCard
            title="Current Streak"
            value={`${studentProgress.currentStreak} days`}
            subtitle={`Best: ${studentProgress.longestStreak} days`}
            icon={Award}
            progress={studentProgress.currentStreak}
            maxProgress={studentProgress.longestStreak || studentProgress.currentStreak}
            color="orange"
            trend={studentProgress.currentStreak > 0 ? "up" : "neutral"}
            trendValue={studentProgress.currentStreak > 0 ? "Active" : "Start today"}
          />
          
          <StatCard
            title="Study Time"
            value={`${Math.floor(studentProgress.subjectProgress.reduce((acc, s) => acc + s.timeSpent, 0) / 60)}h`}
            subtitle="This week"
            icon={Clock}
            color="green"
            trend="up"
            trendValue="+2.5h"
          />
          
          <StatCard
            title="Achievements"
            value={studentProgress.achievements.filter(a => a.unlockedAt).length}
            subtitle={`of ${studentProgress.achievements.length} total`}
            icon={Trophy}
            progress={studentProgress.achievements.filter(a => a.unlockedAt).length}
            maxProgress={studentProgress.achievements.length}
            color="purple"
          />
        </div>

        {/* Subject Progress Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Subjects</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span>{studentProgress.subjectProgress.length} subjects</span>
            </div>
          </div>
          
          {studentProgress.subjectProgress.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentProgress.subjectProgress.map((subject) => (
                <SubjectCard
                  key={subject.subject}
                  subject={subject}
                  onClick={() => navigate('/quiz')}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No subjects yet</h3>
              <p className="text-gray-500 mb-6">Start learning to see your progress here!</p>
              <button 
                onClick={() => navigate('/quiz')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Start Learning
              </button>
            </div>
          )}
        </div>

        {/* Recommended Topics */}
        {studentProgress.recommendedPath.recommendedNextTopics.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {studentProgress.recommendedPath.recommendedNextTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-semibold text-gray-900 truncate">{topic.topic}</h3>
                    <p className="text-sm text-gray-600 truncate">{topic.subject} • {topic.estimatedTime} min</p>
                    <p className="text-xs text-blue-600 mt-1">{topic.reason}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/quiz')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex-shrink-0"
                  >
                    Start
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas to Improve */}
        {studentProgress.weakAreas.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Areas to Improve</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentProgress.weakAreas.map((area, index) => (
                <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 truncate">{area.subject}</span>
                    <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full flex-shrink-0 ml-2">
                      {area.successRate}%
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3 truncate">{area.topic}</h3>
                  <button 
                    onClick={() => navigate('/quiz')}
                    className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    Practice Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {studentProgress.achievements.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="w-6 h-6 text-yellow-600" />
              <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {studentProgress.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-xl text-center transition-all duration-200 hover:scale-105 ${
                    achievement.unlockedAt 
                      ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-400 shadow-md' 
                      : 'bg-gray-50 border border-gray-200 opacity-60'
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-semibold text-sm text-gray-900 mb-1">{achievement.name}</h3>
                  {achievement.progress !== undefined && achievement.target && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-600 mb-1">
                        {achievement.progress}/{achievement.target}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {achievement.unlockedAt && (
                    <div className="mt-2">
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full font-medium">
                        Unlocked!
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Code Input Modals */}
      <CodeInputModal
        isOpen={showClassModal}
        onClose={() => setShowClassModal(false)}
        type="class"
        onSubmit={handleJoinClass}
        loading={codeLoading}
      />

      <CodeInputModal
        isOpen={showParentModal}
        onClose={() => setShowParentModal(false)}
        type="parent"
        onSubmit={handleConnectParent}
        loading={codeLoading}
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;
