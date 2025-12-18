import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Clock, 
  Activity,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
  Calendar
} from 'lucide-react';
import { useTeacherAnalytics } from '../../hooks/useTeacherAnalytics';

interface AdvancedAnalyticsProps {
  classId: string;
  className: string;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  classId,
  className
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [selectedView, setSelectedView] = useState<'engagement' | 'retention' | 'patterns'>('engagement');
  
  const {
    engagementAnalysis,
    retentionMetrics,
    activityPatterns,
    loading,
    error,
    loadDetailedEngagementAnalysis,
    loadRetentionAnalysis,
    loadActivityPatterns,
    clearError
  } = useTeacherAnalytics(classId, false);

  // Load analytics when component mounts or parameters change
  useEffect(() => {
    const loadAnalytics = async () => {
      await Promise.all([
        loadDetailedEngagementAnalysis(classId, selectedTimeRange),
        loadRetentionAnalysis(classId, selectedTimeRange),
        loadActivityPatterns(classId, selectedTimeRange)
      ]);
    };
    
    loadAnalytics();
  }, [classId, selectedTimeRange, loadDetailedEngagementAnalysis, loadRetentionAnalysis, loadActivityPatterns]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading advanced analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
          <h3 className="text-red-800 font-medium">Error Loading Analytics</h3>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
        <button
          onClick={clearError}
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const renderEngagementAnalysis = () => {
    if (!engagementAnalysis?.engagement_analysis) return null;

    const analysis = engagementAnalysis.engagement_analysis;
    const recommendations = engagementAnalysis.recommendations || [];

    return (
      <div className="space-y-6">
        {/* Engagement Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Overview</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Total Students</p>
                  <p className="text-2xl font-bold text-blue-900">{analysis.total_students}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <Activity className="h-8 w-8 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">Active Students</p>
                  <p className="text-2xl font-bold text-green-900">{analysis.active_students}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-900">Avg Session</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {Math.round(analysis.session_metrics?.average_duration || 0)}m
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-900">Total Sessions</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {analysis.session_metrics?.total_sessions || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Distribution */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Engagement Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analysis.engagement_percentages || {}).map(([level, percentage]) => (
                <div key={level} className="text-center">
                  <div className={`p-3 rounded-lg ${
                    level === 'highly_engaged' ? 'bg-green-100' :
                    level === 'moderately_engaged' ? 'bg-yellow-100' :
                    level === 'low_engaged' ? 'bg-orange-100' : 'bg-red-100'
                  }`}>
                    <p className="text-sm font-medium text-gray-700 capitalize">
                      {level.replace('_', ' ')}
                    </p>
                    <p className={`text-2xl font-bold ${
                      level === 'highly_engaged' ? 'text-green-800' :
                      level === 'moderately_engaged' ? 'text-yellow-800' :
                      level === 'low_engaged' ? 'text-orange-800' : 'text-red-800'
                    }`}>
                      {percentage}%
                    </p>
                    <p className="text-xs text-gray-600">
                      {analysis.engagement_distribution?.[level] || 0} students
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
              <div className="space-y-3">
                {recommendations.map((rec: any, index: number) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-4 ${
                      rec.priority === 'high' ? 'border-red-200 bg-red-50' :
                      rec.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-gray-900">{rec.title}</h5>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                        rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {rec.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                    <div>
                      <p className="text-sm font-medium text-gray-900 mb-1">Suggested Actions:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {rec.actions?.map((action: string, actionIndex: number) => (
                          <li key={actionIndex} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderRetentionAnalysis = () => {
    if (!retentionMetrics) return null;

    return (
      <div className="space-y-6">
        {/* Retention Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Retention Analysis</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-900">Total Active</p>
                  <p className="text-2xl font-bold text-blue-900">{retentionMetrics.total_active_users || 0}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${
              (retentionMetrics.churn_risk || 0) > 25 ? 'bg-red-50' : 'bg-green-50'
            }`}>
              <div className="flex items-center">
                <AlertTriangle className={`h-8 w-8 ${
                  (retentionMetrics.churn_risk || 0) > 25 ? 'text-red-600' : 'text-green-600'
                }`} />
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    (retentionMetrics.churn_risk || 0) > 25 ? 'text-red-900' : 'text-green-900'
                  }`}>
                    Churn Risk
                  </p>
                  <p className={`text-2xl font-bold ${
                    (retentionMetrics.churn_risk || 0) > 25 ? 'text-red-900' : 'text-green-900'
                  }`}>
                    {retentionMetrics.churn_risk || 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center">
                <TrendingDown className="h-8 w-8 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-orange-900">At Risk</p>
                  <p className="text-2xl font-bold text-orange-900">{retentionMetrics.at_risk_count || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Retention Chart */}
          {retentionMetrics.weekly_retention && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Weekly Retention Trend</h4>
              <div className="space-y-3">
                {retentionMetrics.weekly_retention.map((week: any) => (
                  <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Week {week.week}</p>
                      <p className="text-xs text-gray-600">{week.active_users} active users</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                        <div
                          className={`h-2 rounded-full ${
                            week.retention_rate >= 80 ? 'bg-green-500' :
                            week.retention_rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${week.retention_rate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {week.retention_rate}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderActivityPatterns = () => {
    if (!activityPatterns) return null;

    return (
      <div className="space-y-6">
        {/* Activity Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Patterns</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Peak Hours */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Peak Activity Hours</h4>
              <div className="space-y-2">
                {activityPatterns.peak_hours?.slice(0, 5).map(([hour, count]: [number, number], index: number) => (
                  <div key={hour} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{hour}:00 - {hour + 1}:00</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ 
                            width: `${(count / Math.max(...activityPatterns.peak_hours.map(([, c]: [number, number]) => c))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Days */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Peak Activity Days</h4>
              <div className="space-y-2">
                {activityPatterns.peak_days?.slice(0, 5).map(([day, count]: [string, number]) => (
                  <div key={day} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm text-gray-700">{day}</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ 
                            width: `${(count / Math.max(...activityPatterns.peak_days.map(([, c]: [string, number]) => c))) * 100}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Trend */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Activity Trend</h4>
                <p className="text-sm text-gray-600">Overall activity pattern over time</p>
              </div>
              <div className="flex items-center">
                {activityPatterns.activity_trend === 'increasing' && (
                  <>
                    <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm font-medium text-green-600">Increasing</span>
                  </>
                )}
                {activityPatterns.activity_trend === 'decreasing' && (
                  <>
                    <TrendingDown className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-600">Decreasing</span>
                  </>
                )}
                {activityPatterns.activity_trend === 'stable' && (
                  <>
                    <Activity className="h-5 w-5 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-blue-600">Stable</span>
                  </>
                )}
                {activityPatterns.activity_trend === 'insufficient_data' && (
                  <>
                    <AlertTriangle className="h-5 w-5 text-gray-600 mr-2" />
                    <span className="text-sm font-medium text-gray-600">Insufficient Data</span>
                  </>
                )}
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-600">
                Total Activities: {activityPatterns.total_activities || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Advanced Analytics</h2>
            <p className="text-sm text-gray-600 mt-1">
              Deep insights into {className} engagement and performance patterns
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value as 'week' | 'month' | 'quarter')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setSelectedView('engagement')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'engagement'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="h-4 w-4 inline mr-2" />
            Engagement
          </button>
          <button
            onClick={() => setSelectedView('retention')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'retention'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="h-4 w-4 inline mr-2" />
            Retention
          </button>
          <button
            onClick={() => setSelectedView('patterns')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              selectedView === 'patterns'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Calendar className="h-4 w-4 inline mr-2" />
            Patterns
          </button>
        </div>
      </div>

      {/* Content based on selected view */}
      {selectedView === 'engagement' && renderEngagementAnalysis()}
      {selectedView === 'retention' && renderRetentionAnalysis()}
      {selectedView === 'patterns' && renderActivityPatterns()}
    </div>
  );
};

export default AdvancedAnalytics;