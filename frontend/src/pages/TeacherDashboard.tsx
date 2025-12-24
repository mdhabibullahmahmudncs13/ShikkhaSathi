import React, { useState, useEffect } from 'react';
import { AnalyticsDashboard } from '../components/teacher/AnalyticsDashboard';
import { StudentRoster } from '../components/teacher/StudentRoster';
import { NotificationCenter } from '../components/teacher/NotificationCenter';
import AssessmentManager from '../components/teacher/AssessmentManager';
import { useUser } from '../contexts/UserContext';
import { 
  TeacherDashboardData, 
  TeacherNotification,
  StudentSummary 
} from '../types/teacher';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Clock,
  AlertTriangle,
  FileText as DocumentTextIcon,
  School,
  Plus,
  Bell,
  ChevronDown,
  Search,
  Filter,
  Calendar,
  PieChart,
  BookOpen,
  Zap,
  ArrowUp
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
  const { user, logout, loading } = useUser();
  const [teacherData, setTeacherData] = useState<TeacherDashboardData>(mockTeacherData);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [currentView, setCurrentView] = useState<'overview' | 'roster' | 'notifications' | 'analytics' | 'assessments'>('overview');
  const [selectedStudents, setSelectedStudents] = useState<StudentSummary[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Redirect if not authenticated or not a teacher
  useEffect(() => {
    if (!loading && (!user || user.role !== 'teacher')) {
      window.location.href = '/login';
    }
  }, [user, loading]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated or not a teacher
  if (!user || user.role !== 'teacher') {
    return null;
  }

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
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students - Blue */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 p-6 rounded-2xl text-white relative overflow-hidden group transition-all hover:shadow-lg hover:shadow-blue-200">
            <div className="absolute -right-4 -top-4 bg-white/10 w-20 h-20 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">+4 this week</span>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{totalStudents}</div>
                <div className="text-sm font-medium opacity-90">Total Students</div>
              </div>
            </div>
          </div>

          {/* Avg Performance - Teal/Green */}
          <div className="bg-gradient-to-br from-teal-400 to-teal-500 p-6 rounded-2xl text-white relative overflow-hidden group transition-all hover:shadow-lg hover:shadow-teal-200">
            <div className="absolute -right-4 -top-4 bg-white/10 w-20 h-20 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full flex items-center gap-1">
                  <ArrowUp className="w-3 h-3" /> 5%
                </span>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{avgPerformance}%</div>
                <div className="text-sm font-medium opacity-90">Avg Performance</div>
              </div>
            </div>
          </div>

          {/* Engagement - Purple */}
          <div className="bg-gradient-to-br from-purple-400 to-purple-500 p-6 rounded-2xl text-white relative overflow-hidden group transition-all hover:shadow-lg hover:shadow-purple-200">
            <div className="absolute -right-4 -top-4 bg-white/10 w-20 h-20 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">High</span>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{avgEngagement}%</div>
                <div className="text-sm font-medium opacity-90">Engagement</div>
              </div>
            </div>
          </div>

          {/* At Risk - Yellow/Orange */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-6 rounded-2xl text-white relative overflow-hidden group transition-all hover:shadow-lg hover:shadow-yellow-200">
            <div className="absolute -right-4 -top-4 bg-white/10 w-20 h-20 rounded-full"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Alert</span>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{highRiskStudents}</div>
                <div className="text-sm font-medium opacity-90">At Risk</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Priority Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full relative overflow-hidden">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-700">
              <span className="w-1.5 h-6 bg-blue-400 rounded-full"></span>
              Recent Activity
            </h3>
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <Clock className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium">No recent activity found</p>
              <p className="text-xs mt-1 text-gray-400">Check back later for updates</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-full relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 relative z-10">
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-6 bg-red-400 rounded-full"></span>
                Priority Alerts
              </h3>
              <button 
                onClick={() => setCurrentView('notifications')}
                className="text-purple-500 text-sm font-medium hover:underline flex items-center gap-1"
              >
                View all <ArrowUp className="w-3 h-3 rotate-45" />
              </button>
            </div>
            <div className="space-y-3 relative z-10">
              {teacherData.notifications
                .filter(n => n.priority === 'high' && !n.read)
                .slice(0, 1)
                .map((notification) => (
                  <div key={notification.id} className="bg-red-50 border-l-4 border-red-400 rounded-r-xl p-4 flex gap-4 items-start shadow-sm">
                    <div className="p-2 bg-white rounded-full shrink-0">
                      <AlertTriangle className="text-red-500 w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-red-600 font-bold text-sm">{notification.title}</h4>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                        <span className="font-bold text-gray-800">{notification.studentName}</span> has not been active for <span className="font-bold text-red-500">2 days</span> and performance is declining in {notification.className}.
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button className="text-[10px] font-bold bg-white text-gray-500 px-3 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors">Message Parent</button>
                        <button className="text-[10px] font-bold bg-red-400 text-white px-3 py-1 rounded shadow-sm hover:bg-red-500 transition-colors">View Profile</button>
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg flex items-center gap-2 text-gray-700">
              <span className="w-1.5 h-6 bg-purple-400 rounded-full"></span>
              Class Performance Overview
            </h3>
            <select className="text-xs border-gray-200 rounded-lg bg-gray-50 text-gray-600 py-1.5 px-3">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teacherData.classes.map((classItem, index) => (
              <div 
                key={classItem.id}
                onClick={() => handleClassSelect(classItem.id)}
                className="group border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all bg-white hover:bg-blue-50 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className={`font-bold text-base text-gray-700 transition-colors ${
                      index === 0 ? 'group-hover:text-blue-600' : 'group-hover:text-purple-600'
                    }`}>
                      {classItem.name}
                    </h4>
                    <span className="text-xs text-gray-400">Science Dept.</span>
                  </div>
                  <div className={`w-10 h-10 rounded-full text-xs font-bold flex items-center justify-center ${
                    index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {classItem.averagePerformance}%
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4 overflow-hidden">
                  <div 
                    className={`h-1.5 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-purple-400'}`}
                    style={{ width: `${classItem.averagePerformance}%` }}
                  ></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs font-medium flex items-center gap-2">
                      <Users className="text-gray-400 w-4 h-4" />
                      Students
                    </span>
                    <span className="font-bold text-gray-700">{classItem.studentCount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-500 text-xs font-medium flex items-center gap-2">
                      <TrendingUp className="text-gray-400 w-4 h-4" />
                      Engagement
                    </span>
                    <span className="font-bold text-emerald-500">{classItem.engagementRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Outfit',sans-serif]">
      {/* Dashboard Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <a className="flex items-center gap-2 font-bold text-xl" href="/">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <School className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-800 font-['Lexend'] tracking-tight">Shikshasathi</span>
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 ml-8">
            <a className="hover:text-purple-600 transition-colors" href="/dashboard">Dashboard</a>
            <a className="hover:text-purple-600 transition-colors" href="/classes">My Classes</a>
            <a className="hover:text-purple-600 transition-colors" href="/assessments">Assessments</a>
            <a className="hover:text-purple-600 transition-colors" href="/analytics">Analytics</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <BarChart3 className="text-purple-600 w-8 h-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 font-['Lexend']">Teacher Dashboard</h1>
              <p className="text-xs text-gray-500 font-medium">
                Welcome back, {user?.full_name || user?.first_name || 'Teacher'}!
              </p>
            </div>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all transform hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            Create Assessment
          </button>
          <button className="relative p-2.5 text-gray-500 hover:bg-white rounded-full transition-all shadow-sm hover:shadow-md bg-white border border-gray-200">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full ring-2 ring-white animate-pulse"></span>
          </button>
          {user && (
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1.5 rounded-full pr-4 transition-all shadow-sm hover:shadow-md bg-white border border-gray-200"
              >
                <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm">
                  {user.full_name?.charAt(0) || user.first_name?.charAt(0) || 'T'}
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-bold block leading-tight text-gray-700">
                    {user.full_name || user.first_name || 'Teacher'}
                  </span>
                  <span className="text-[10px] text-gray-500 block font-medium capitalize">
                    {user.role || 'Teacher'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block ml-1" />
              </button>
              
              {/* User Dropdown Menu */}
              {userMenuOpen && (
                <>
                  {/* Backdrop to close menu */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-bold text-gray-900 break-words">
                        {user.full_name || user.first_name}
                      </p>
                      <p className="text-xs text-gray-500 break-all mt-1">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1 capitalize">Role: {user.role}</p>
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
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-0">
        
        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-6">
          {/* My Classes */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-5 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-bold text-lg text-gray-700">My Classes</h2>
              <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">2 Active</span>
            </div>
            <div className="p-4 space-y-4">
              <div className="relative group">
                <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 group-focus-within:text-purple-500 transition-colors" />
                <input 
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all placeholder-gray-400" 
                  placeholder="Search classes..." 
                  type="text"
                />
              </div>
              <button className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-purple-600 transition-colors w-full px-1">
                <Filter className="w-4 h-4" />
                Filter by performance
              </button>
              
              <div className="space-y-3">
                {teacherData.classes.map((classItem) => (
                  <div 
                    key={classItem.id}
                    onClick={() => handleClassSelect(classItem.id)}
                    className="p-4 border border-gray-200 rounded-xl hover:border-blue-300 transition-all cursor-pointer group bg-white shadow-sm hover:shadow-md hover:bg-blue-50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm text-gray-700 group-hover:text-blue-600 transition-colors">{classItem.name}</h3>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        classItem.averagePerformance >= 75 ? 'text-emerald-600 bg-emerald-100' :
                        classItem.averagePerformance >= 60 ? 'text-yellow-600 bg-yellow-100' :
                        'text-red-600 bg-red-100'
                      }`}>
                        Good
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span className={`w-2 h-2 rounded-full ${classItem.subject === 'Physics' ? 'bg-blue-400' : 'bg-purple-400'}`}></span>
                      Grade {classItem.grade} • {classItem.subject}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs mb-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
                      <div>
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Avg Score</span>
                        <span className={`font-bold text-base ${classItem.subject === 'Physics' ? 'text-blue-600' : 'text-purple-500'}`}>{classItem.averagePerformance}%</span>
                      </div>
                      <div className="text-right">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold tracking-wider">Engage</span>
                        <span className="font-bold text-emerald-500 text-base">{classItem.engagementRate}%</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Last activity: {new Date(classItem.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 border-t border-purple-100 flex justify-between items-center text-center">
              <div>
                <div className="text-xl font-black text-purple-600">
                  {teacherData.classes.reduce((sum, cls) => sum + cls.studentCount, 0)}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-purple-500 font-bold">Total Students</div>
              </div>
              <div className="h-8 w-px bg-purple-200"></div>
              <div>
                <div className="text-xl font-black text-teal-500">
                  {Math.round(teacherData.classes.reduce((sum, cls) => sum + cls.averagePerformance, 0) / teacherData.classes.length)}%
                </div>
                <div className="text-[10px] uppercase tracking-wider text-teal-500 font-bold">Avg Performance</div>
              </div>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <h2 className="font-bold text-lg mb-4 text-gray-700 p-5 flex items-center gap-2">
              <Zap className="text-orange-500 w-5 h-5" />
              Quick Tools
            </h2>
            <div className="px-5 pb-5 grid grid-cols-1 gap-2">
              <a className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-sm font-medium text-gray-600 hover:text-orange-600 transition-all group hover:shadow-sm border border-transparent hover:border-orange-100" href="#">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PieChart className="w-5 h-5" />
                </div>
                Performance Analytics
              </a>
              <a className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-sm font-medium text-gray-600 hover:text-blue-600 transition-all group hover:shadow-sm border border-transparent hover:border-blue-100" href="#">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                Student Management
              </a>
              <a className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-all group hover:shadow-sm border border-transparent hover:border-emerald-100" href="#">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                Schedule Assessment
              </a>
              <a className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-sm font-medium text-gray-600 hover:text-purple-600 transition-all group hover:shadow-sm border border-transparent hover:border-purple-100" href="#">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                Progress Reports
              </a>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9 space-y-6">
          {/* Navigation Tabs */}
          <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-200 overflow-x-auto flex items-center gap-2">
            <button 
              onClick={() => setCurrentView('overview')}
              className={`px-4 py-2 font-bold text-sm whitespace-nowrap rounded-lg flex items-center gap-2 transition-colors ${
                currentView === 'overview' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Overview
            </button>
            <button 
              onClick={() => setCurrentView('roster')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap rounded-lg flex items-center gap-2 transition-colors ${
                currentView === 'roster' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-5 h-5" />
              Student Roster
            </button>
            <button 
              onClick={() => setCurrentView('assessments')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap rounded-lg flex items-center gap-2 transition-colors ${
                currentView === 'assessments' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
            >
              <DocumentTextIcon className="w-5 h-5" />
              Assessments
            </button>
            <button 
              onClick={() => setCurrentView('notifications')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap rounded-lg flex items-center gap-2 transition-colors relative ${
                currentView === 'notifications' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Bell className="w-5 h-5" />
              Notifications
              {teacherData.notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400"></span>
                </span>
              )}
            </button>
            <button 
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap rounded-lg flex items-center gap-2 transition-colors ${
                currentView === 'analytics' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
              }`}
            >
              <PieChart className="w-5 h-5" />
              Analytics
            </button>
          </div>

          {/* Content based on current view */}
          {currentView === 'overview' && renderOverview()}
          {currentView === 'roster' && (
            <StudentRoster
              students={selectedStudents}
              classId={selectedClass}
              onStudentSelect={handleStudentSelect}
              onStudentAction={handleStudentAction}
            />
          )}
          {currentView === 'notifications' && (
            <NotificationCenter
              notifications={teacherData.notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
              onDeleteNotification={handleDeleteNotification}
            />
          )}
          {currentView === 'analytics' && (
            <AnalyticsDashboard
              classId={selectedClass || teacherData.classes[0]?.id || 'default'}
              className={teacherData.classes.find(c => c.id === selectedClass)?.name || teacherData.classes[0]?.name || 'Default Class'}
            />
          )}
          {currentView === 'assessments' && (
            <AssessmentManager
              teacherId={teacherData.teacherId}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default TeacherDashboard;