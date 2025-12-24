import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  ParentDashboardData, 
  ChildSummary, 
  ParentNotification
} from '../types/parent';
import { 
  Users, 
  FileText, 
  Bell, 
  Settings,
  Clock,
  BookOpen,
  ChevronDown,
  Medal,
  Flame,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Target
} from 'lucide-react';

// Mock data - in real app this would come from API
const mockParentData: ParentDashboardData = {
  parentId: 'parent-1',
  children: [
    {
      id: 'child-1',
      name: 'রাহুল আহমেদ',
      email: 'rahul@example.com',
      grade: 9,
      medium: 'bangla',
      totalXP: 2500,
      currentLevel: 5,
      currentStreak: 12,
      longestStreak: 18,
      averageScore: 85,
      timeSpentThisWeek: 420, // 7 hours
      lastActive: new Date('2024-12-19T09:15:00'),
      subjectProgress: [
        {
          subject: 'Physics',
          completionPercentage: 75,
          averageScore: 82,
          timeSpent: 1200,
          bloomLevelProgress: [
            { level: 1, mastery: 95, questionsAttempted: 45, successRate: 95 },
            { level: 2, mastery: 88, questionsAttempted: 32, successRate: 88 },
            { level: 3, mastery: 75, questionsAttempted: 28, successRate: 75 },
            { level: 4, mastery: 65, questionsAttempted: 20, successRate: 65 },
            { level: 5, mastery: 45, questionsAttempted: 15, successRate: 45 },
            { level: 6, mastery: 25, questionsAttempted: 8, successRate: 25 }
          ],
          lastAccessed: new Date('2024-12-19T08:30:00'),
          topicProgress: [
            {
              topic: 'Newton\'s Laws',
              completionPercentage: 80,
              averageScore: 78,
              timeSpent: 180,
              lastAccessed: new Date('2024-12-19T08:30:00')
            },
            {
              topic: 'Motion',
              completionPercentage: 90,
              averageScore: 85,
              timeSpent: 240,
              lastAccessed: new Date('2024-12-18T14:20:00')
            }
          ]
        },
        {
          subject: 'Mathematics',
          completionPercentage: 68,
          averageScore: 88,
          timeSpent: 900,
          bloomLevelProgress: [
            { level: 1, mastery: 98, questionsAttempted: 50, successRate: 98 },
            { level: 2, mastery: 92, questionsAttempted: 38, successRate: 92 },
            { level: 3, mastery: 85, questionsAttempted: 30, successRate: 85 },
            { level: 4, mastery: 78, questionsAttempted: 25, successRate: 78 },
            { level: 5, mastery: 65, questionsAttempted: 18, successRate: 65 },
            { level: 6, mastery: 45, questionsAttempted: 12, successRate: 45 }
          ],
          lastAccessed: new Date('2024-12-18T16:45:00'),
          topicProgress: [
            {
              topic: 'Algebra',
              completionPercentage: 85,
              averageScore: 90,
              timeSpent: 300,
              lastAccessed: new Date('2024-12-18T16:45:00')
            }
          ]
        }
      ],
      recentAchievements: [
        {
          id: 'ach-1',
          name: 'Physics Master',
          description: 'Completed 10 physics quizzes with 80%+ score',
          icon: '🏆',
          category: 'performance',
          unlockedAt: new Date('2024-12-18T10:00:00'),
          xpReward: 200
        },
        {
          id: 'ach-2',
          name: 'Streak Champion',
          description: 'Maintained 10-day learning streak',
          icon: '🔥',
          category: 'streak',
          unlockedAt: new Date('2024-12-17T09:00:00'),
          xpReward: 150
        }
      ],
      weakAreas: [
        {
          subject: 'Physics',
          topic: 'Thermodynamics',
          bloomLevel: 4,
          successRate: 45,
          attemptsCount: 12,
          recommendedActions: [
            'Review basic concepts with visual aids',
            'Practice more application-based problems',
            'Schedule extra practice sessions'
          ]
        }
      ],
      riskLevel: 'low',
      classInfo: {
        className: 'Physics 9A',
        teacherName: 'Dr. সালমা খান',
        classAverage: 78
      }
    },
    {
      id: 'child-2',
      name: 'ফাতিমা খান',
      email: 'fatima@example.com',
      grade: 7,
      medium: 'bangla',
      totalXP: 1200,
      currentLevel: 3,
      currentStreak: 3,
      longestStreak: 8,
      averageScore: 62,
      timeSpentThisWeek: 180, // 3 hours
      lastActive: new Date('2024-12-17T14:20:00'),
      subjectProgress: [
        {
          subject: 'Mathematics',
          completionPercentage: 45,
          averageScore: 65,
          timeSpent: 600,
          bloomLevelProgress: [
            { level: 1, mastery: 85, questionsAttempted: 30, successRate: 85 },
            { level: 2, mastery: 70, questionsAttempted: 25, successRate: 70 },
            { level: 3, mastery: 55, questionsAttempted: 20, successRate: 55 },
            { level: 4, mastery: 35, questionsAttempted: 15, successRate: 35 },
            { level: 5, mastery: 20, questionsAttempted: 8, successRate: 20 },
            { level: 6, mastery: 10, questionsAttempted: 5, successRate: 10 }
          ],
          lastAccessed: new Date('2024-12-17T14:20:00'),
          topicProgress: [
            {
              topic: 'Basic Arithmetic',
              completionPercentage: 70,
              averageScore: 68,
              timeSpent: 200,
              lastAccessed: new Date('2024-12-17T14:20:00')
            }
          ]
        }
      ],
      recentAchievements: [],
      weakAreas: [
        {
          subject: 'Mathematics',
          topic: 'Fractions',
          bloomLevel: 2,
          successRate: 38,
          attemptsCount: 15,
          recommendedActions: [
            'Use visual fraction models',
            'Practice with real-world examples',
            'Work with a tutor'
          ]
        }
      ],
      riskLevel: 'medium',
      classInfo: {
        className: 'Math 7B',
        teacherName: 'রহিম স্যার',
        classAverage: 70
      }
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'রাহুল আহমেদ has unlocked the "Physics Master" achievement',
      childId: 'child-1',
      childName: 'রাহুল আহমেদ',
      priority: 'low',
      timestamp: new Date('2024-12-18T10:00:00'),
      read: false,
      actionRequired: false,
      relatedData: {
        achievementId: 'ach-1'
      }
    },
    {
      id: 'notif-2',
      type: 'performance_alert',
      title: 'Performance Alert',
      message: 'ফাতিমা খান has not been active for 2 days. Consider encouraging study time.',
      childId: 'child-2',
      childName: 'ফাতিমা খান',
      priority: 'high',
      timestamp: new Date('2024-12-19T08:00:00'),
      read: false,
      actionRequired: true
    },
    {
      id: 'notif-3',
      type: 'weekly_report',
      title: 'Weekly Report Available',
      message: 'Your weekly progress report for রাহুল আহমেদ is ready to view',
      childId: 'child-1',
      childName: 'রাহুল আহমেদ',
      priority: 'medium',
      timestamp: new Date('2024-12-16T09:00:00'),
      read: true,
      actionRequired: false,
      relatedData: {
        reportId: 'report-1'
      }
    }
  ],
  weeklyReports: [],
  notificationPreferences: {
    achievements: true,
    weeklyReports: true,
    performanceAlerts: true,
    streakMilestones: true,
    teacherMessages: true,
    emailNotifications: true,
    smsNotifications: false,
    frequency: 'daily',
    quietHours: {
      enabled: true,
      startTime: '22:00',
      endTime: '07:00'
    }
  }
};

export const ParentDashboard: React.FC = () => {
  const { user, logout, loading } = useUser();
  const [parentData, setParentData] = useState<ParentDashboardData>(mockParentData);
  const [selectedChild, setSelectedChild] = useState<ChildSummary | null>(
    mockParentData.children[0] || null
  );
  const [currentView, setCurrentView] = useState<'overview' | 'reports' | 'notifications' | 'settings'>('overview');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Redirect if not authenticated or not a parent
  useEffect(() => {
    if (!loading && (!user || user.role !== 'parent')) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not a parent
  if (!user || user.role !== 'parent') {
    return null;
  }

  useEffect(() => {
    // In real app, fetch parent data from API
    // fetchParentData();
  }, []);

  const handleNotificationClick = (notification: ParentNotification) => {
    console.log('Notification clicked:', notification);
    
    // Mark as read
    setParentData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    }));

    // Handle different notification types
    if (notification.type === 'achievement' && notification.relatedData?.achievementId) {
      // Navigate to child's achievements
      if (notification.childId) {
        const child = parentData.children.find(c => c.id === notification.childId);
        if (child) {
          setSelectedChild(child);
          setCurrentView('overview');
        }
      }
    } else if (notification.type === 'weekly_report' && notification.relatedData?.reportId) {
      // Navigate to reports
      setCurrentView('reports');
    } else if (notification.type === 'performance_alert') {
      // Navigate to child overview
      if (notification.childId) {
        const child = parentData.children.find(c => c.id === notification.childId);
        if (child) {
          setSelectedChild(child);
          setCurrentView('overview');
        }
      }
    }
  };

  const renderReports = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Reports</h3>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Reports Coming Soon</h4>
          <p className="text-gray-600">Weekly progress reports will be available here.</p>
        </div>
      </div>
    );
  };

  const renderNotifications = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">All Notifications</h3>
        <div className="space-y-4">
          {parentData.notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50 border-blue-200' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{notification.title}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      notification.priority === 'high' ? 'bg-red-100 text-red-800' :
                      notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {notification.priority}
                    </span>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Child: {notification.childName}</span>
                    <span>{new Date(notification.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {parentData.notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h3>
        <div className="text-center py-12">
          <Settings className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Settings Coming Soon</h4>
          <p className="text-gray-600">Notification preferences will be available here.</p>
        </div>
      </div>
    );
  };



  return (
    <div className="bg-gray-100 text-gray-800 font-sans antialiased min-h-screen flex flex-col transition-colors duration-200">
      {/* Navigation Header */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <a className="flex items-center gap-2" href="/">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-blue-600">Shikshasathi</span>
              </a>
              <div className="hidden md:flex ml-10 items-center space-x-8">
                <a className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium" href="#">Features</a>
                <a className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium" href="#">About</a>
                <a className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium" href="#">Pricing</a>
                <a className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium" href="#">Contact</a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="relative">
                  <button 
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-4 transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                      {user.full_name?.charAt(0) || user.first_name?.charAt(0) || 'P'}
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {user.full_name || user.first_name || 'Parent'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400 text-xs hidden sm:block" />
                  </button>
                  
                  {/* User Dropdown Menu */}
                  {userMenuOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-200">
                          <p className="text-sm font-bold text-gray-900">{user.full_name || user.first_name}</p>
                          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                          <p className="text-xs text-gray-500 mt-1 capitalize">Role: {user.role}</p>
                        </div>
                        <a href="/profile" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          Profile Settings
                        </a>
                        <a href="/settings" className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          Account Settings
                        </a>
                        <div className="border-t border-gray-200 my-1"></div>
                        <button 
                          onClick={logout}
                          className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 font-bold text-lg hidden sm:block">Shikshasathi</span>
            <span className="text-gray-300 text-xl hidden sm:block">/</span>
            <h1 className="text-gray-700 font-medium text-lg">Parent Portal</h1>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-600 hover:bg-gray-100">
              <span>English</span>
            </button>
            <button className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-6">
        {/* Child Overview Section */}
        {selectedChild && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedChild.name}'s Overview</h2>
                <p className="text-sm text-gray-500 mt-1">Class {selectedChild.grade} • Science Group</p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                On Track
              </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Level Card */}
              <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-100">
                <div className="text-blue-500 mb-2 flex justify-center">
                  <Medal className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold text-xs mb-1">Level</div>
                <div className="text-2xl font-bold text-gray-900">{selectedChild.currentLevel}</div>
                <div className="text-xs text-gray-400">{selectedChild.totalXP} XP</div>
              </div>

              {/* Streak Card */}
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-100">
                <div className="text-green-500 mb-2 flex justify-center">
                  <Flame className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold text-xs mb-1">Streak</div>
                <div className="text-2xl font-bold text-gray-900">{selectedChild.currentStreak}</div>
                <div className="text-xs text-gray-400">days</div>
              </div>

              {/* Avg Score Card */}
              <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-100">
                <div className="text-purple-500 mb-2 flex justify-center">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold text-xs mb-1">Avg Score</div>
                <div className="text-2xl font-bold text-gray-900">{selectedChild.averageScore}%</div>
                <div className="text-xs text-gray-400">Top 10%</div>
              </div>

              {/* This Week Card */}
              <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-100">
                <div className="text-orange-500 mb-2 flex justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold text-xs mb-1">This Week</div>
                <div className="text-2xl font-bold text-gray-900">{Math.floor(selectedChild.timeSpentThisWeek / 60)}</div>
                <div className="text-xs text-gray-400">hours</div>
              </div>
            </div>
          </section>
        )}

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-8 border-b border-gray-200 px-2 scrollbar-hide">
          <button 
            onClick={() => setCurrentView('overview')}
            className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
              currentView === 'overview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="w-4 h-4" />
            Child Overview
          </button>
          <button 
            onClick={() => setCurrentView('reports')}
            className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
              currentView === 'reports' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            Reports
          </button>
          <button 
            onClick={() => setCurrentView('notifications')}
            className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors relative ${
              currentView === 'notifications' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
            {parentData.notifications.filter(n => !n.read).length > 0 && (
              <span className="bg-red-100 text-red-600 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {parentData.notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setCurrentView('settings')}
            className={`pb-3 border-b-2 font-medium text-sm whitespace-nowrap flex items-center gap-2 transition-colors ${
              currentView === 'settings' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Subject Progress Section */}
        {currentView === 'overview' && selectedChild && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Subject Progress</h3>
            </div>
            
            {selectedChild.subjectProgress.map((subject, index) => (
              <div key={subject.subject} className={`p-6 ${index < selectedChild.subjectProgress.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex justify-between items-end mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 text-lg">{subject.subject}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Core</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{subject.averageScore}%</div>
                    <div className="text-xs text-gray-400">{Math.floor(subject.timeSpent / 60)}h {subject.timeSpent % 60}m spent</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Completion</span>
                    <span>{subject.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${subject.completionPercentage}%` }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {subject.bloomLevelProgress.map((level, levelIndex) => (
                    <div key={levelIndex} className="flex flex-col gap-1">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            level.mastery >= 80 ? 'bg-green-500' : 
                            level.mastery >= 60 ? 'bg-yellow-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${level.mastery}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span>L{levelIndex + 1}</span>
                        <span>{level.mastery}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-medium">Recent Topics:</span>
                  {subject.topicProgress.map((topic, topicIndex) => (
                    <span key={topicIndex} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200">
                      {topic.topic} ({topic.averageScore}%)
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Recent Achievements */}
        {currentView === 'overview' && selectedChild && selectedChild.recentAchievements.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Achievements</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {selectedChild.recentAchievements.map((achievement) => (
                <div key={achievement.id} className="bg-amber-50 border border-amber-100 p-4 rounded-lg flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-600">
                    <Medal className="w-5 h-5" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-800 text-sm">{achievement.name}</h4>
                      <span className="text-amber-600 text-xs font-bold">+{achievement.xpReward} XP</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                    <p className="text-[10px] text-gray-400 mt-2">{new Date(achievement.unlockedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Areas for Improvement */}
        {currentView === 'overview' && selectedChild && selectedChild.weakAreas.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="text-amber-500 w-5 h-5" />
              <h3 className="text-lg font-bold text-gray-900">Areas for Improvement</h3>
            </div>
            <div className="pl-0 md:pl-7">
              {selectedChild.weakAreas.map((area, index) => (
                <div key={index} className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-8 bg-amber-400 rounded-full"></div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{area.subject} - {area.topic}</h4>
                        <p className="text-xs text-gray-500">Bloom Level {area.bloomLevel} • {area.attemptsCount} attempts</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-400 uppercase mb-2">Recommended actions:</p>
                      <ul className="space-y-1">
                        {area.recommendedActions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-center gap-2 text-xs text-gray-600">
                            <CheckCircle className="text-green-500 w-3 h-3" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="text-right flex md:flex-col items-center md:items-end gap-2 md:gap-0">
                    <span className="text-red-500 font-bold text-sm">{area.successRate}% success rate</span>
                    <button className="text-xs text-blue-600 hover:underline mt-1">View Detailed Report</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Learning Activity */}
        {currentView === 'overview' && selectedChild && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Learning Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 text-blue-500 mb-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm font-medium">Study Time</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{Math.floor(selectedChild.timeSpentThisWeek / 60)}h {selectedChild.timeSpentThisWeek % 60}m</div>
                <div className="text-xs text-gray-400">this week</div>
              </div>
              <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0">
                <div className="flex items-center gap-2 text-green-500 mb-2">
                  <Target className="w-5 h-5" />
                  <span className="text-sm font-medium">Streak</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{selectedChild.currentStreak}</div>
                <div className="text-xs text-gray-400">days (best: {selectedChild.longestStreak})</div>
              </div>
              <div className="flex flex-col items-center border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0">
                <div className="flex items-center gap-2 text-purple-500 mb-2">
                  <Medal className="w-5 h-5" />
                  <span className="text-sm font-medium">Performance</span>
                </div>
                <div className="text-3xl font-bold text-gray-900">{selectedChild.averageScore}%</div>
                <div className="text-xs text-gray-400">average score</div>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between items-center text-xs text-gray-500">
              <div>
                <span className="block">Last active: <span className="text-gray-700">Just now</span></span>
                <span className="block mt-1">Class performance: <span className="text-gray-700">Top 15%</span></span>
              </div>
              <div className="text-right">
                <span className="block">{new Date(selectedChild.lastActive).toLocaleString()}</span>
                <span className="block mt-1">{selectedChild.averageScore}% vs {selectedChild.classInfo?.classAverage || 78}% class avg</span>
              </div>
            </div>
          </section>
        )}

        {/* Other Views */}
        {currentView === 'reports' && renderReports()}
        {currentView === 'notifications' && renderNotifications()}
        {currentView === 'settings' && renderSettings()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © 2024 Shikshasathi. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ParentDashboard;