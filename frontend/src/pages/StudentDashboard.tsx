import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Award, Clock, Zap, Play, Brain, RefreshCw, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { Notification } from '../types/dashboard';
import { useDashboardData } from '../hooks/useDashboardData';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { studentProgress, loading, error, refetch } = useDashboardData();
  
  // Mock notifications for now - will be replaced with real API
  const [notifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You\'ve earned the "Week Warrior" badge for maintaining a 7-day streak!',
      timestamp: new Date('2024-12-18T10:30:00'),
      read: false
    },
    {
      id: '2',
      type: 'recommendation',
      title: 'New Learning Path Available',
      message: 'Based on your progress, we recommend reviewing Quadratic Equations',
      timestamp: new Date('2024-12-18T09:15:00'),
      read: false
    }
  ]);

  const handleNotificationRead = (id: string) => {
    // Will be implemented with real API
    console.log('Mark notification as read:', id);
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h1>
          <p className="text-gray-600">Continue your learning journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Zap className="w-4 h-4" />
              <span className="text-sm">Level {studentProgress.currentLevel}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{studentProgress.totalXP}</p>
            <p className="text-xs text-gray-500 mt-1">Total XP</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Award className="w-4 h-4" />
              <span className="text-sm">Streak</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{studentProgress.currentStreak}</p>
            <p className="text-xs text-gray-500 mt-1">Days in a row</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Study Time</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.floor(studentProgress.subjectProgress.reduce((acc, s) => acc + s.timeSpent, 0) / 60)}h
            </p>
            <p className="text-xs text-gray-500 mt-1">This week</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Target className="w-4 h-4" />
              <span className="text-sm">Achievements</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {studentProgress.achievements.filter(a => a.unlockedAt).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">Unlocked</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => navigate('/quiz')}
            className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg transition-colors text-left"
          >
            <Play className="w-6 h-6 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Continue Learning</h3>
            <p className="text-sm text-blue-100">Resume where you left off</p>
          </button>

          <button 
            onClick={() => navigate('/quiz')}
            className="bg-white hover:bg-gray-50 border border-gray-200 p-6 rounded-lg transition-colors text-left"
          >
            <Target className="w-6 h-6 mb-3 text-gray-700" />
            <h3 className="font-semibold text-lg mb-1 text-gray-900">Take Quiz</h3>
            <p className="text-sm text-gray-600">Test your knowledge</p>
          </button>

          <button 
            onClick={() => navigate('/chat')}
            className="bg-white hover:bg-gray-50 border border-gray-200 p-6 rounded-lg transition-colors text-left"
          >
            <Brain className="w-6 h-6 mb-3 text-gray-700" />
            <h3 className="font-semibold text-lg mb-1 text-gray-900">AI Tutor</h3>
            <p className="text-sm text-gray-600">Get personalized help</p>
          </button>
        </div>

        {/* Subject Progress */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Subjects</h2>
          {studentProgress.subjectProgress.length > 0 ? (
            <div className="space-y-4">
              {studentProgress.subjectProgress.map((subject) => (
                <div key={subject.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{subject.subject}</span>
                    <span className="text-sm text-gray-600">{subject.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${subject.completionPercentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No subject progress yet. Start learning to see your progress!</p>
          )}
        </div>

        {/* Recommended Topics */}
        {studentProgress.recommendedPath.recommendedNextTopics.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h2>
            <div className="space-y-3">
              {studentProgress.recommendedPath.recommendedNextTopics.map((topic, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{topic.topic}</h3>
                    <p className="text-sm text-gray-600">{topic.subject} • {topic.estimatedTime} min</p>
                  </div>
                  <button 
                    onClick={() => navigate('/quiz')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
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
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Areas to Improve</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {studentProgress.weakAreas.map((area, index) => (
                <div key={index} className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{area.subject}</span>
                    <span className="text-xs px-2 py-1 bg-orange-200 text-orange-800 rounded-full">
                      {area.successRate}%
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-3">{area.topic}</h3>
                  <button 
                    onClick={() => navigate('/quiz')}
                    className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    Practice
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Achievements */}
        {studentProgress.achievements.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {studentProgress.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`p-4 rounded-lg text-center ${
                    achievement.unlockedAt 
                      ? 'bg-yellow-50 border-2 border-yellow-400' 
                      : 'bg-gray-50 border border-gray-200 opacity-50'
                  }`}
                >
                  <div className="text-3xl mb-2">{achievement.icon}</div>
                  <h3 className="font-medium text-sm text-gray-900">{achievement.name}</h3>
                  {achievement.progress !== undefined && achievement.target && (
                    <p className="text-xs text-gray-600 mt-1">
                      {achievement.progress}/{achievement.target}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
