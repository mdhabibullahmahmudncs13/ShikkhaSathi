import React, { useState, useEffect } from 'react';
import { TeacherDashboardLayout } from '../components/teacher/TeacherDashboardLayout';
import { StudentRoster } from '../components/teacher/StudentRoster';
import { NotificationCenter } from '../components/teacher/NotificationCenter';
import { 
  TeacherDashboardData, 
  ClassOverview, 
  TeacherNotification,
  StudentSummary 
} from '../types/teacher';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Clock,
  Award,
  AlertTriangle
} from 'lucide-react';

// Mock data - in real app this would come from API
const mockTeacherData: TeacherDashboardData = {
  teacherId: 'teacher-1',
  classes: [
    {
      id: 'class-1',
      name: 'Physics 9A',
      grade: 9,
      subject: 'Physics',
      studentCount: 32,
      averagePerformance: 78,
      engagementRate: 85,
      lastActivity: new Date('2024-12-19T10:30:00'),
      students: [
        {
          id: 'student-1',
          name: 'রাহুল আহমেদ',
          email: 'rahul@example.com',
          totalXP: 2500,
          currentLevel: 5,
          currentStreak: 12,
          averageScore: 85,
          timeSpent: 1800, // minutes
          lastActive: new Date('2024-12-19T09:15:00'),
          weakAreas: [
            {
              subject: 'Physics',
              topic: 'Newton\'s Laws',
              bloomLevel: 3,
              successRate: 45,
              attemptsCount: 8
            }
          ],
          riskLevel: 'low'
        },
        {
          id: 'student-2',
          name: 'ফাতিমা খান',
          email: 'fatima@example.com',
          totalXP: 1200,
          currentLevel: 3,
          currentStreak: 3,
          averageScore: 62,
          timeSpent: 900,
          lastActive: new Date('2024-12-17T14:20:00'),
          weakAreas: [
            {
              subject: 'Physics',
              topic: 'Motion',
              bloomLevel: 2,
              successRate: 38,
              attemptsCount: 12
            }
          ],
          riskLevel: 'medium'
        }
      ]
    },
    {
      id: 'class-2',
      name: 'Chemistry 10B',
      grade: 10,
      subject: 'Chemistry',
      studentCount: 28,
      averagePerformance: 72,
      engagementRate: 78,
      lastActivity: new Date('2024-12-18T16:45:00'),
      students: []
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      type: 'student_risk',
      title: 'Student at Risk',
      message: 'ফাতিমা খান has not been active for 2 days and performance is declining',
      studentId: 'student-2',
      studentName: 'ফাতিমা খান',
      classId: 'class-1',
      className: 'Physics 9A',
      priority: 'high',
      timestamp: new Date('2024-12-19T08:00:00'),
      read: false,
      actionRequired: true
    },
    {
      id: 'notif-2',
      type: 'achievement',
      title: 'Student Achievement',
      message: 'রাহুল আহমেদ has reached Level 5 and maintained a 12-day streak!',
      studentId: 'student-1',
      studentName: 'রাহুল আহমেদ',
      classId: 'class-1',
      className: 'Physics 9A',
      priority: 'low',
      timestamp: new Date('2024-12-19T07:30:00'),
      read: false,
      actionRequired: false
    }
  ],
  recentActivity: []
};

export const TeacherDashboard: React.FC = () => {
  const [teacherData, setTeacherData] = useState<TeacherDashboardData>(mockTeacherData);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [currentView, setCurrentView] = useState<'overview' | 'roster' | 'notifications' | 'analytics'>('overview');
  const [selectedStudents, setSelectedStudents] = useState<StudentSummary[]>([]);

  useEffect(() => {
    // In real app, fetch teacher data from API
    // fetchTeacherData();
  }, []);

  const handleClassSelect = (classId: string) => {
    setSelectedClass(classId);
    const classData = teacherData.classes.find(c => c.id === classId);
    if (classData) {
      setSelectedStudents(classData.students);
      setCurrentView('roster');
    }
  };

  const handleNotificationClick = (notification: TeacherNotification) => {
    console.log('Notification clicked:', notification);
    // Handle notification action
    if (notification.studentId) {
      // Navigate to student details
      setCurrentView('roster');
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setTeacherData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    }));
  };

  const handleMarkAllAsRead = () => {
    setTeacherData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  const handleDeleteNotification = (notificationId: string) => {
    setTeacherData(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== notificationId)
    }));
  };

  const handleStudentSelect = (studentId: string) => {
    console.log('Student selected:', studentId);
    // Navigate to student details view
  };

  const handleStudentAction = (studentId: string, action: string) => {
    console.log('Student action:', studentId, action);
    // Handle student actions (contact, assign work, etc.)
  };

  const renderOverview = () => {
    const totalStudents = teacherData.classes.reduce((sum, cls) => sum + cls.studentCount, 0);
    const avgPerformance = Math.round(
      teacherData.classes.reduce((sum, cls) => sum + cls.averagePerformance, 0) / teacherData.classes.length
    );
    const avgEngagement = Math.round(
      teacherData.classes.reduce((sum, cls) => sum + cls.engagementRate, 0) / teacherData.classes.length
    );
    const highRiskStudents = teacherData.classes.reduce((sum, cls) => 
      sum + cls.students.filter(s => s.riskLevel === 'high').length, 0
    );

    return (
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                <p className="text-2xl font-bold text-gray-900">{avgPerformance}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Engagement</p>
                <p className="text-2xl font-bold text-gray-900">{avgEngagement}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-gray-900">{highRiskStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {teacherData.recentActivity.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No recent activity</p>
              ) : (
                teacherData.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Priority Alerts</h3>
              <button
                onClick={() => setCurrentView('notifications')}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View all
              </button>
            </div>
            <div className="space-y-3">
              {teacherData.notifications
                .filter(n => n.priority === 'high' && !n.read)
                .slice(0, 3)
                .map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="p-3 bg-red-50 border border-red-200 rounded-md cursor-pointer hover:bg-red-100"
                  >
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">{notification.title}</p>
                        <p className="text-sm text-red-700 mt-1">{notification.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              {teacherData.notifications.filter(n => n.priority === 'high' && !n.read).length === 0 && (
                <p className="text-gray-500 text-center py-4">No priority alerts</p>
              )}
            </div>
          </div>
        </div>

        {/* Class Performance Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Class Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teacherData.classes.map((classItem) => (
              <div
                key={classItem.id}
                onClick={() => handleClassSelect(classItem.id)}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    classItem.averagePerformance >= 80 ? 'bg-green-100 text-green-800' :
                    classItem.averagePerformance >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {classItem.averagePerformance}%
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Students:</span>
                    <span>{classItem.studentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engagement:</span>
                    <span>{classItem.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Activity:</span>
                    <span>{new Date(classItem.lastActivity).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentView) {
      case 'roster':
        return (
          <StudentRoster
            students={selectedStudents}
            classId={selectedClass}
            onStudentSelect={handleStudentSelect}
            onStudentAction={handleStudentAction}
          />
        );
      case 'notifications':
        return (
          <NotificationCenter
            notifications={teacherData.notifications}
            onNotificationClick={handleNotificationClick}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        );
      case 'analytics':
        return (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Dashboard</h2>
            <p className="text-gray-600">Analytics components will be implemented in the next subtask.</p>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <TeacherDashboardLayout
      teacherData={teacherData}
      onClassSelect={handleClassSelect}
      onNotificationClick={handleNotificationClick}
    >
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: BarChart3 },
              { key: 'roster', label: 'Student Roster', icon: Users },
              { key: 'notifications', label: 'Notifications', icon: AlertTriangle },
              { key: 'analytics', label: 'Analytics', icon: TrendingUp }
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
                {key === 'notifications' && teacherData.notifications.filter(n => !n.read).length > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                    {teacherData.notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </TeacherDashboardLayout>
  );
};

export default TeacherDashboard;