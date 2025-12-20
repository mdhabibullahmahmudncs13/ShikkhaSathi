/**
 * Advanced Analytics Dashboard for Teachers
 * Comprehensive analytics with detailed insights and visualizations
 */

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Target,
  Brain,
  Award,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

interface StudentAnalytics {
  id: string;
  name: string;
  averageScore: number;
  timeSpent: number;
  questionsAnswered: number;
  streakDays: number;
  riskLevel: 'low' | 'medium' | 'high';
  lastActive: string;
  subjectScores: Record<string, number>;
  weeklyProgress: Array<{
    week: string;
    score: number;
    timeSpent: number;
  }>;
}

interface ClassAnalytics {
  classId: string;
  className: string;
  totalStudents: number;
  activeStudents: number;
  averageScore: number;
  totalTimeSpent: number;
  completionRate: number;
  riskStudents: number;
  topPerformers: StudentAnalytics[];
  strugglingStudents: StudentAnalytics[];
  subjectPerformance: Array<{
    subject: string;
    averageScore: number;
    completionRate: number;
    timeSpent: number;
    difficulty: number;
  }>;
  weeklyTrends: Array<{
    week: string;
    averageScore: number;
    activeStudents: number;
    timeSpent: number;
  }>;
}

interface AdvancedAnalyticsProps {
  teacherId: string;
  selectedClass?: string;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  teacherId,
  selectedClass
}) => {
  const [analytics, setAnalytics] = useState<ClassAnalytics | null>(null);
  const [students, setStudents] = useState<StudentAnalytics[]>([]);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockAnalytics: ClassAnalytics = {
      classId: selectedClass || 'class-1',
      className: 'Physics 9A',
      totalStudents: 32,
      activeStudents: 28,
      averageScore: 78.5,
      totalTimeSpent: 2400, // minutes
      completionRate: 85.2,
      riskStudents: 4,
      topPerformers: [
        {
          id: 'student-1',
          name: 'রাহুল আহমেদ',
          averageScore: 92,
          timeSpent: 180,
          questionsAnswered: 45,
          streakDays: 12,
          riskLevel: 'low',
          lastActive: '2024-12-20T09:15:00',
          subjectScores: { Physics: 92, Math: 88, Chemistry: 90 },
          weeklyProgress: [
            { week: 'Week 1', score: 85, timeSpent: 120 },
            { week: 'Week 2', score: 88, timeSpent: 140 },
            { week: 'Week 3', score: 90, timeSpent: 160 },
            { week: 'Week 4', score: 92, timeSpent: 180 }
          ]
        },
        {
          id: 'student-2',
          name: 'সারা খান',
          averageScore: 89,
          timeSpent: 165,
          questionsAnswered: 42,
          streakDays: 8,
          riskLevel: 'low',
          lastActive: '2024-12-20T08:30:00',
          subjectScores: { Physics: 89, Math: 91, Chemistry: 87 },
          weeklyProgress: [
            { week: 'Week 1', score: 82, timeSpent: 110 },
            { week: 'Week 2', score: 85, timeSpent: 130 },
            { week: 'Week 3', score: 87, timeSpent: 150 },
            { week: 'Week 4', score: 89, timeSpent: 165 }
          ]
        }
      ],
      strugglingStudents: [
        {
          id: 'student-3',
          name: 'করিম উদ্দিন',
          averageScore: 45,
          timeSpent: 60,
          questionsAnswered: 15,
          streakDays: 1,
          riskLevel: 'high',
          lastActive: '2024-12-18T14:20:00',
          subjectScores: { Physics: 45, Math: 48, Chemistry: 42 },
          weeklyProgress: [
            { week: 'Week 1', score: 50, timeSpent: 80 },
            { week: 'Week 2', score: 48, timeSpent: 70 },
            { week: 'Week 3', score: 46, timeSpent: 65 },
            { week: 'Week 4', score: 45, timeSpent: 60 }
          ]
        }
      ],
      subjectPerformance: [
        {
          subject: 'Physics',
          averageScore: 78.5,
          completionRate: 82.3,
          timeSpent: 800,
          difficulty: 7.2
        },
        {
          subject: 'Mathematics',
          averageScore: 81.2,
          completionRate: 88.1,
          timeSpent: 720,
          difficulty: 6.8
        },
        {
          subject: 'Chemistry',
          averageScore: 75.8,
          completionRate: 79.5,
          timeSpent: 880,
          difficulty: 7.8
        }
      ],
      weeklyTrends: [
        { week: 'Week 1', averageScore: 75.2, activeStudents: 26, timeSpent: 520 },
        { week: 'Week 2', averageScore: 76.8, activeStudents: 27, timeSpent: 580 },
        { week: 'Week 3', averageScore: 77.5, activeStudents: 28, timeSpent: 620 },
        { week: 'Week 4', averageScore: 78.5, activeStudents: 28, timeSpent: 680 }
      ]
    };

    setAnalytics(mockAnalytics);
    setStudents([...mockAnalytics.topPerformers, ...mockAnalytics.strugglingStudents]);
    setIsLoading(false);
  }, [selectedClass, timeRange]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const generateReport = () => {
    if (!analytics) return;

    const report = `
# Class Analytics Report - ${analytics.className}
Generated on: ${new Date().toLocaleString()}
Time Range: ${timeRange}

## Class Overview
- Total Students: ${analytics.totalStudents}
- Active Students: ${analytics.activeStudents}
- Average Score: ${analytics.averageScore.toFixed(1)}%
- Completion Rate: ${analytics.completionRate.toFixed(1)}%
- At-Risk Students: ${analytics.riskStudents}

## Subject Performance
${analytics.subjectPerformance.map(subject => `
### ${subject.subject}
- Average Score: ${subject.averageScore.toFixed(1)}%
- Completion Rate: ${subject.completionRate.toFixed(1)}%
- Time Spent: ${formatTime(subject.timeSpent)}
- Difficulty Rating: ${subject.difficulty}/10
`).join('')}

## Top Performers
${analytics.topPerformers.map(student => `
- ${student.name}: ${student.averageScore}% (${student.streakDays} day streak)
`).join('')}

## Students Needing Support
${analytics.strugglingStudents.map(student => `
- ${student.name}: ${student.averageScore}% (Risk Level: ${student.riskLevel})
`).join('')}

## Recommendations
${analytics.riskStudents > 0 ? `
- Provide additional support to ${analytics.riskStudents} at-risk students
- Consider peer tutoring programs
- Schedule one-on-one sessions with struggling students
` : '- Continue current teaching strategies'}
${analytics.averageScore < 70 ? `
- Review teaching methods for challenging topics
- Increase interactive learning activities
- Provide more practice materials
` : ''}
`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${analytics.className}-analytics-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
        <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Analytics Available</h3>
        <p className="text-gray-600">Select a class to view detailed analytics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{analytics.className} Analytics</h2>
            <p className="text-gray-600">Comprehensive performance insights and trends</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={generateReport}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Subjects</option>
              <option value="Physics">Physics</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Chemistry">Chemistry</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Class Average</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.averageScore.toFixed(1)}%</p>
              <p className="text-sm text-green-600">+2.3% from last month</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Students</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.activeStudents}/{analytics.totalStudents}</p>
              <p className="text-sm text-green-600">{((analytics.activeStudents / analytics.totalStudents) * 100).toFixed(1)}% engagement</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Study Time</p>
              <p className="text-3xl font-bold text-gray-900">{formatTime(analytics.totalTimeSpent)}</p>
              <p className="text-sm text-blue-600">Avg: {formatTime(Math.round(analytics.totalTimeSpent / analytics.totalStudents))}/student</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">At-Risk Students</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.riskStudents}</p>
              <p className="text-sm text-red-600">{((analytics.riskStudents / analytics.totalStudents) * 100).toFixed(1)}% need support</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Subject Performance */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Subject Performance Analysis</h3>
        <div className="space-y-4">
          {analytics.subjectPerformance.map((subject) => (
            <div key={subject.subject} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">{subject.subject}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Difficulty: {subject.difficulty}/10</span>
                  <span>Time: {formatTime(subject.timeSpent)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average Score</span>
                    <span className="font-medium">{subject.averageScore.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        subject.averageScore >= 80 ? 'bg-green-500' :
                        subject.averageScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${subject.averageScore}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span className="font-medium">{subject.completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${subject.completionRate}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Performance Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
          </div>
          <div className="space-y-3">
            {analytics.topPerformers.map((student) => (
              <div key={student.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                  <span className="text-lg font-bold text-green-600">{student.averageScore}%</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="block text-xs">Study Time</span>
                    <span className="font-medium">{formatTime(student.timeSpent)}</span>
                  </div>
                  <div>
                    <span className="block text-xs">Questions</span>
                    <span className="font-medium">{student.questionsAnswered}</span>
                  </div>
                  <div>
                    <span className="block text-xs">Streak</span>
                    <span className="font-medium">{student.streakDays} days</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students Needing Support */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">Students Needing Support</h3>
          </div>
          <div className="space-y-3">
            {analytics.strugglingStudents.map((student) => (
              <div key={student.id} className={`p-3 border rounded-lg ${getRiskColor(student.riskLevel)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{student.name}</h4>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold">{student.averageScore}%</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRiskColor(student.riskLevel)}`}>
                      {student.riskLevel} risk
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="block text-xs">Study Time</span>
                    <span className="font-medium">{formatTime(student.timeSpent)}</span>
                  </div>
                  <div>
                    <span className="block text-xs">Last Active</span>
                    <span className="font-medium">{new Date(student.lastActive).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="block text-xs">Streak</span>
                    <span className="font-medium">{student.streakDays} days</span>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                      Send Message
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                      Schedule Meeting
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Trends */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Weekly Performance Trends</span>
        </h3>
        <div className="space-y-4">
          {analytics.weeklyTrends.map((week, index) => (
            <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-900">{week.week}</span>
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-gray-600">Avg Score</div>
                  <div className="font-bold text-gray-900">{week.averageScore.toFixed(1)}%</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Active</div>
                  <div className="font-bold text-gray-900">{week.activeStudents}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Time</div>
                  <div className="font-bold text-gray-900">{formatTime(week.timeSpent)}</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600">Trend</div>
                  <div className={`font-bold ${
                    index > 0 && week.averageScore > analytics.weeklyTrends[index - 1].averageScore
                      ? 'text-green-600' : index > 0 && week.averageScore < analytics.weeklyTrends[index - 1].averageScore
                      ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {index > 0 
                      ? week.averageScore > analytics.weeklyTrends[index - 1].averageScore ? '↗️' 
                      : week.averageScore < analytics.weeklyTrends[index - 1].averageScore ? '↘️' : '➡️'
                      : '➡️'
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};