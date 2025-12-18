import React, { useState, useEffect } from 'react';
import { ParentDashboardLayout } from '../components/parent/ParentDashboardLayout';
import { ChildProgressOverview } from '../components/parent/ChildProgressOverview';
import { NotificationPreferencesComponent } from '../components/parent/NotificationPreferences';
import { 
  ParentDashboardData, 
  ChildSummary, 
  ParentNotification,
  NotificationPreferences
} from '../types/parent';
import { 
  Users, 
  FileText, 
  Bell, 
  Settings,
  TrendingUp,
  Award,
  Clock
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
  const [parentData, setParentData] = useState<ParentDashboardData>(mockParentData);
  const [selectedChild, setSelectedChild] = useState<ChildSummary | null>(
    mockParentData.children[0] || null
  );
  const [currentView, setCurrentView] = useState<'overview' | 'reports' | 'notifications' | 'settings'>('overview');

  useEffect(() => {
    // In real app, fetch parent data from API
    // fetchParentData();
  }, []);

  const handleChildSelect = (child: ChildSummary) => {
    setSelectedChild(child);
    setCurrentView('overview');
  };

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

  const handleSaveNotificationPreferences = (preferences: NotificationPreferences) => {
    setParentData(prev => ({
      ...prev,
      notificationPreferences: preferences
    }));
    console.log('Notification preferences saved:', preferences);
    // In real app, save to API
  };

  const renderOverview = () => {
    if (!selectedChild) {
      return (
        <div className="text-center py-12">
          <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Child Selected</h3>
          <p className="text-gray-600">Please select a child from the dropdown to view their progress.</p>
        </div>
      );
    }

    return <ChildProgressOverview child={selectedChild} />;
  };

  const renderReports = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Reports</h3>
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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All Notifications</h3>
        <div className="space-y-4">
          {parentData.notifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50 border-blue-200' : ''
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
      <NotificationPreferencesComponent
        preferences={parentData.notificationPreferences}
        onSave={handleSaveNotificationPreferences}
      />
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'reports':
        return renderReports();
      case 'notifications':
        return renderNotifications();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  const getChildrenSummary = () => {
    const totalChildren = parentData.children.length;
    const atRiskChildren = parentData.children.filter(c => c.riskLevel === 'high').length;
    const avgPerformance = Math.round(
      parentData.children.reduce((sum, child) => sum + child.averageScore, 0) / totalChildren
    );
    const totalXP = parentData.children.reduce((sum, child) => sum + child.totalXP, 0);

    return { totalChildren, atRiskChildren, avgPerformance, totalXP };
  };

  const summary = getChildrenSummary();

  return (
    <ParentDashboardLayout
      parentData={parentData}
      selectedChild={selectedChild}
      onChildSelect={handleChildSelect}
      onNotificationClick={handleNotificationClick}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Child Overview', icon: Users },
              { key: 'reports', label: 'Reports', icon: FileText },
              { key: 'notifications', label: 'Notifications', icon: Bell },
              { key: 'settings', label: 'Settings', icon: Settings }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentView(key as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  currentView === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
                {key === 'notifications' && parentData.notifications.filter(n => !n.read).length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    {parentData.notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Family Summary (only show on overview) */}
        {currentView === 'overview' && !selectedChild && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Family Learning Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Children</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{summary.totalChildren}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Avg Performance</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{summary.avgPerformance}%</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Total XP</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{summary.totalXP.toLocaleString()}</p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600">At Risk</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{summary.atRiskChildren}</p>
              </div>
            </div>

            {/* Children Quick Access */}
            <div className="mt-6 pt-6 border-t">
              <h4 className="text-md font-medium text-gray-900 mb-4">Your Children</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {parentData.children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{child.name}</h5>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        child.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        child.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {child.riskLevel === 'low' ? 'On Track' :
                         child.riskLevel === 'medium' ? 'Needs Attention' :
                         'At Risk'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Grade:</span>
                        <span>{child.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span>{child.currentLevel}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Score:</span>
                        <span>{child.averageScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Streak:</span>
                        <span>{child.currentStreak} days</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {renderContent()}
      </div>
    </ParentDashboardLayout>
  );
};

export default ParentDashboard;