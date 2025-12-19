import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StudentDashboard from './pages/StudentDashboard'
import ParentDashboard from './pages/ParentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import QuizPage from './pages/QuizPage'
import AITutorChat from './pages/AITutorChat'
import { SyncStatusIndicator, SyncProgressModal, ConflictResolutionModal } from './components/sync'
import { useSyncManager } from './hooks/useSyncManager'
import ErrorBoundary from './components/common/ErrorBoundary'
import { GlobalLoadingBar } from './components/common/LoadingIndicator'
import { ErrorNotificationManager } from './components/common/ErrorNotification'
import { SystemStatusIndicator } from './components/common/SystemMonitor'
import { useAuth } from './hooks/useAPI'

// Placeholder components for different routes
const Dashboard = () => <StudentDashboard />

const Login = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          আপনার অ্যাকাউন্টে সাইন ইন করুন
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ShikkhaSathi প্ল্যাটফর্মে স্বাগতম
        </p>
      </div>
      <form className="mt-8 space-y-6">
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <input
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="ইমেইল ঠিকানা"
            />
          </div>
          <div>
            <input
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="পাসওয়ার্ড"
            />
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            সাইন ইন করুন
          </button>
        </div>
      </form>
    </div>
  </div>
)

function App() {
  const {
    showSyncProgress,
    showConflictResolution,
    setShowSyncProgress,
    setShowConflictResolution,
    conflicts,
    errors
  } = useSyncManager();

  const { isAuthenticated, user } = useAuth();
  
  // Type guard for user object
  const typedUser = user as { full_name?: string; role?: string } | null;

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Global Loading Bar */}
          <GlobalLoadingBar />
          
          {/* Navigation */}
          <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <h1 className="text-xl font-semibold text-gray-900">ShikkhaSathi</h1>
                  {typedUser && (
                    <span className="ml-4 text-sm text-gray-600">
                      স্বাগতম, {typedUser.full_name}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  {isAuthenticated ? (
                    <>
                      <a href="/" className="text-gray-700 hover:text-gray-900">ড্যাশবোর্ড</a>
                      {typedUser?.role === 'student' && (
                        <>
                          <a href="/chat" className="text-gray-700 hover:text-gray-900">AI টিউটর</a>
                          <a href="/quiz" className="text-gray-700 hover:text-gray-900">কুইজ</a>
                        </>
                      )}
                      {typedUser?.role === 'parent' && (
                        <a href="/parent" className="text-gray-700 hover:text-gray-900">প্যারেন্ট পোর্টাল</a>
                      )}
                      {typedUser?.role === 'teacher' && (
                        <a href="/teacher" className="text-gray-700 hover:text-gray-900">টিচার ড্যাশবোর্ড</a>
                      )}
                      <SyncStatusIndicator />
                      <SystemStatusIndicator />
                    </>
                  ) : (
                    <a href="/login" className="text-gray-700 hover:text-gray-900">লগইন</a>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>
            <ErrorBoundary>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/parent" element={<ParentDashboard />} />
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/chat" element={<AITutorChat />} />
                <Route path="/quiz" element={<QuizPage />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </ErrorBoundary>
          </main>

          {/* Global Error Notifications */}
          <ErrorNotificationManager />

          {/* Sync Management Modals */}
          <SyncProgressModal
            isOpen={showSyncProgress}
            onClose={() => setShowSyncProgress(false)}
          />
          
          <ConflictResolutionModal
            isOpen={showConflictResolution}
            onClose={() => setShowConflictResolution(false)}
          />

          {/* Conflict Notification */}
          {conflicts.length > 0 && (
            <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-40">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm">
                  {conflicts.length} টি ডেটা দ্বন্দ্ব সমাধান প্রয়োজন
                </span>
                <button
                  onClick={() => setShowConflictResolution(true)}
                  className="ml-3 text-yellow-800 hover:text-yellow-900 underline text-sm"
                >
                  সমাধান করুন
                </button>
              </div>
            </div>
          )}

          {/* Sync Error Notification */}
          {errors.length > 0 && (
            <div className="fixed bottom-4 left-4 bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-lg z-40">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm">
                  {errors.length} টি সিঙ্ক ত্রুটি
                </span>
                <button
                  onClick={() => setShowSyncProgress(true)}
                  className="ml-3 text-red-800 hover:text-red-900 underline text-sm"
                >
                  দেখুন
                </button>
              </div>
            </div>
          )}
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App
