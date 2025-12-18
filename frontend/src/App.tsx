import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import StudentDashboard from './pages/StudentDashboard'
import ParentDashboard from './pages/ParentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import QuizPage from './pages/QuizPage'
import { SyncStatusIndicator, SyncProgressModal, ConflictResolutionModal } from './components/sync'
import { useSyncManager } from './hooks/useSyncManager'

// Placeholder components for different routes
const Dashboard = () => <StudentDashboard />

const Chat = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">AI Tutor Chat</h1>
    <p className="mt-4 text-gray-600">Chat with your AI tutor here</p>
  </div>
)

const Login = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">Login</h1>
    <p className="mt-4 text-gray-600">Login to your account</p>
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

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">ShikkhaSathi</h1>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-700 hover:text-gray-900">Student</a>
                <a href="/parent" className="text-gray-700 hover:text-gray-900">Parent</a>
                <a href="/teacher" className="text-gray-700 hover:text-gray-900">Teacher</a>
                <a href="/chat" className="text-gray-700 hover:text-gray-900">AI Tutor</a>
                <a href="/quiz" className="text-gray-700 hover:text-gray-900">Quiz</a>
                <a href="/login" className="text-gray-700 hover:text-gray-900">Login</a>
                <SyncStatusIndicator />
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

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

        {/* Error Notification */}
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
  )
}

export default App
