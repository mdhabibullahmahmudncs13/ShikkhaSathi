import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  Clock,
  FileText as DocumentTextIcon,
  Plus,
  Settings
} from 'lucide-react';
import { codeConnectionService } from '../services/codeConnectionService';

interface TeacherData {
  teacher: {
    id: string;
    name: string;
    email: string;
    subjects: string[];
    classes: any[];
  };
  classes: any[];
  students: any[];
  analytics: {
    totalStudents: number;
    activeStudents: number;
    averageScore: number;
    completionRate: number;
  };
  notifications?: any[];
}

export const TeacherDashboard: React.FC = () => {
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [createClassLoading, setCreateClassLoading] = useState(false);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        
        // Mock teacher data for now
        const mockData: TeacherData = {
          teacher: {
            id: 'teacher-1',
            name: 'Teacher Test',
            email: 'teacher@test.com',
            subjects: ['Mathematics', 'Physics'],
            classes: []
          },
          classes: [],
          students: [],
          analytics: {
            totalStudents: 0,
            activeStudents: 0,
            averageScore: 0,
            completionRate: 0
          },
          notifications: []
        };
        
        setTeacherData(mockData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load teacher data');
        console.error('Error fetching teacher data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const handleCreateClass = async (classData: {
    class_name: string;
    subject: string;
    grade_level: number;
    section?: string;
    description?: string;
  }) => {
    try {
      setCreateClassLoading(true);
      const result = await codeConnectionService.createClassWithCode(classData);
      
      if (result.success) {
        // Add the new class to the teacher data
        const newClass = {
          id: result.class_id,
          name: classData.class_name,
          subject: classData.subject,
          grade: classData.grade_level,
          section: classData.section,
          class_code: result.class_code,
          students: []
        };
        
        setTeacherData(prev => prev ? {
          ...prev,
          classes: [...prev.classes, newClass]
        } : prev);
        
        setShowCreateClassModal(false);
        alert(`Class created successfully! Share code "${result.class_code}" with students.`);
      }
    } catch (error: any) {
      alert(`Failed to create class: ${error.message}`);
    } finally {
      setCreateClassLoading(false);
    }
  };

  const handleSettings = () => {
    alert('Settings functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teacher dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ Error</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!teacherData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No teacher data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-gray-600">Welcome back, {teacherData.teacher.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowCreateClassModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Class
              </button>
              <button 
                onClick={handleSettings}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{teacherData.analytics.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-3xl font-bold text-gray-900">{teacherData.analytics.activeStudents}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{teacherData.analytics.averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{teacherData.analytics.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Classes Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Classes</h2>
            <button 
              onClick={() => setShowCreateClassModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Class
            </button>
          </div>
          
          {teacherData.classes.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No classes yet</h3>
              <p className="text-gray-500 mb-6">Create your first class to start managing students and assignments.</p>
              <button 
                onClick={() => setShowCreateClassModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Your First Class
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherData.classes.map((classItem: any) => (
                <div key={classItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{classItem.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{classItem.subject} • Grade {classItem.grade}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{classItem.students?.length || 0} students</span>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      View Class
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="text-center py-8">
            <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity to display</p>
          </div>
        </div>
      </div>

      {/* Create Class Modal */}
      {showCreateClassModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Create New Class</h2>
              <button
                onClick={() => setShowCreateClassModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleCreateClass({
                  class_name: formData.get('class_name') as string,
                  subject: formData.get('subject') as string,
                  grade_level: parseInt(formData.get('grade_level') as string),
                  section: formData.get('section') as string || undefined,
                  description: formData.get('description') as string || undefined,
                });
              }}
              className="p-6 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  name="class_name"
                  required
                  placeholder="e.g., Physics Advanced"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <select
                  name="subject"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Subject</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="Bangla">Bangla</option>
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade *
                  </label>
                  <select
                    name="grade_level"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Grade</option>
                    {[6, 7, 8, 9, 10, 11, 12].map(grade => (
                      <option key={grade} value={grade}>Grade {grade}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section
                  </label>
                  <input
                    type="text"
                    name="section"
                    placeholder="A, B, C..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Brief description of the class..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateClassModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={createClassLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createClassLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createClassLoading ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;