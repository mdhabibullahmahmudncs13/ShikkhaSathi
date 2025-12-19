import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { StudentProgress, Notification } from '../types/dashboard';
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  Clock, 
  Zap,
  ChevronRight,
  Play,
  Download
} from 'lucide-react';

const StudentDashboard: React.FC = () => {
  // Mock data - in production, this would come from API
  const [studentProgress] = useState<StudentProgress>({
    userId: '123e4567-e89b-12d3-a456-426614174000',
    totalXP: 2450,
    currentLevel: 5,
    currentStreak: 7,
    longestStreak: 15,
    subjectProgress: [
      {
        subject: 'Mathematics',
        completionPercentage: 75,
        bloomLevelProgress: [
          { level: 1, mastery: 95 },
          { level: 2, mastery: 88 },
          { level: 3, mastery: 72 },
          { level: 4, mastery: 60 },
          { level: 5, mastery: 45 },
          { level: 6, mastery: 20 }
        ],
        timeSpent: 1200,
        lastAccessed: new Date('2024-12-18')
      },
      {
        subject: 'Physics',
        completionPercentage: 60,
        bloomLevelProgress: [
          { level: 1, mastery: 90 },
          { level: 2, mastery: 75 },
          { level: 3, mastery: 55 },
          { level: 4, mastery: 40 },
          { level: 5, mastery: 25 },
          { level: 6, mastery: 10 }
        ],
        timeSpent: 900,
        lastAccessed: new Date('2024-12-17')
      },
      {
        subject: 'Chemistry',
        completionPercentage: 45,
        bloomLevelProgress: [
          { level: 1, mastery: 85 },
          { level: 2, mastery: 70 },
          { level: 3, mastery: 45 },
          { level: 4, mastery: 30 },
          { level: 5, mastery: 15 },
          { level: 6, mastery: 5 }
        ],
        timeSpent: 600,
        lastAccessed: new Date('2024-12-16')
      }
    ],
    achievements: [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        unlockedAt: new Date('2024-12-01')
      },
      {
        id: '2',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        unlockedAt: new Date('2024-12-18')
      },
      {
        id: '3',
        name: 'Quiz Master',
        description: 'Score 100% on 5 quizzes',
        icon: '🏆',
        progress: 3,
        target: 5
      },
      {
        id: '4',
        name: 'Knowledge Seeker',
        description: 'Complete 50 lessons',
        icon: '📚',
        progress: 32,
        target: 50
      }
    ],
    weakAreas: [
      {
        subject: 'Mathematics',
        topic: 'Quadratic Equations',
        bloomLevel: 3,
        successRate: 45
      },
      {
        subject: 'Physics',
        topic: 'Newton\'s Laws',
        bloomLevel: 4,
        successRate: 38
      },
      {
        subject: 'Chemistry',
        topic: 'Chemical Bonding',
        bloomLevel: 2,
        successRate: 52
      }
    ],
    recommendedPath: {
      currentTopic: 'Algebra - Linear Equations',
      recommendedNextTopics: [
        {
          subject: 'Mathematics',
          topic: 'Quadratic Equations Review',
          difficulty: 2,
          reason: 'Strengthen fundamentals before advancing',
          estimatedTime: 35
        },
        {
          subject: 'Physics',
          topic: 'Force and Motion Basics',
          difficulty: 3,
          reason: 'Build foundation for Newton\'s Laws',
          estimatedTime: 40
        }
      ],
      completedTopics: [
        'Basic Algebra',
        'Number Systems',
        'Introduction to Physics',
        'States of Matter',
        'Bangla Grammar Basics'
      ]
    }
  });

  const [notifications, setNotifications] = useState<Notification[]>([
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
    },
    {
      id: '3',
      type: 'streak',
      title: 'Keep Your Streak Going!',
      message: 'You\'re on a 7-day streak. Complete today\'s lesson to continue!',
      timestamp: new Date('2024-12-18T08:00:00'),
      read: true
    }
  ]);

  // Generate activity data for streak calendar (last 49 days)
  const generateActivityData = () => {
    const activityData: { [date: string]: boolean } = {};
    const today = new Date();
    
    for (let i = 0; i < 49; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Simulate activity pattern
      if (i < studentProgress.currentStreak) {
        activityData[dateString] = true;
      } else if (Math.random() > 0.4) {
        activityData[dateString] = true;
      }
    }
    
    return activityData;
  };

  const activityData = generateActivityData();

  const handleNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <DashboardLayout
      studentProgress={studentProgress}
      notifications={notifications}
      onNotificationRead={handleNotificationRead}
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Welcome back, Student! 👋</h1>
          <p className="text-blue-100">
            You're on a {studentProgress.currentStreak}-day streak! Keep up the great work.
          </p>
        </div>

        {/* XP and Level Progress */}
        <XPProgressBar
          currentXP={studentProgress.totalXP}
          currentLevel={studentProgress.currentLevel}
        />

        {/* Subject Progress Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Progress</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentProgress.subjectProgress.map((subject) => (
              <div key={subject.subject} className="text-center">
                <CircularProgress
                  percentage={subject.completionPercentage}
                  size={120}
                  strokeWidth={10}
                  color={
                    subject.subject === 'Mathematics' ? '#3B82F6' :
                    subject.subject === 'Physics' ? '#8B5CF6' :
                    '#10B981'
                  }
                  label={subject.subject}
                  showPercentage={true}
                />
                <div className="mt-3 text-sm text-gray-600">
                  {subject.timeSpent} minutes studied
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Streak Calendar */}
        <StreakCalendar
          currentStreak={studentProgress.currentStreak}
          longestStreak={studentProgress.longestStreak}
          activityData={activityData}
        />

        {/* Learning Path Recommendations */}
        <LearningPathRecommendations studentProgress={studentProgress} />

        {/* Weakness Heatmap */}
        <WeaknessHeatmap weakAreas={studentProgress.weakAreas} />

        {/* Achievement Showcase */}
        <AchievementShowcase achievements={studentProgress.achievements} />

        {/* Download Manager */}
        <DownloadManager />
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;