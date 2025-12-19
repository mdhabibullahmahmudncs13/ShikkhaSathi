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
import React from 'react'

// Placeholder components for different routes
const Dashboard = () => (
  <div className="min-h-screen bg-neutral-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Welcome back! 👋</h1>
        <p className="mt-2 text-neutral-600">শেখার যাত্রা চালিয়ে যান</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* XP Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-500">Total XP</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">2,450</div>
          <div className="mt-2 text-sm text-neutral-600">Level 5 • 550 to next level</div>
        </div>

        {/* Streak Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-500">Current Streak</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">7 days</div>
          <div className="mt-2 text-sm text-neutral-600">Longest: 15 days 🔥</div>
        </div>

        {/* Completed Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-500">Completed</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">24</div>
          <div className="mt-2 text-sm text-neutral-600">Quizzes this week</div>
        </div>

        {/* Achievements Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-neutral-500">Achievements</span>
          </div>
          <div className="text-3xl font-bold text-neutral-900">12</div>
          <div className="mt-2 text-sm text-neutral-600">3 new this month 🎉</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900 mb-4">Continue Learning</h2>
          <div className="space-y-4">
            {/* Subject Progress */}
            {['Mathematics', 'Physics', 'Chemistry'].map((subject, idx) => (
              <div key={subject} className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-neutral-900">{subject}</h3>
                  <span className="text-sm font-medium text-neutral-600">{75 - idx * 10}%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all" 
                    style={{ width: `${75 - idx * 10}%` }}
                  ></div>
                </div>
                <p className="mt-2 text-sm text-neutral-600">Chapter {idx + 3} • {5 - idx} lessons remaining</p>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full py-3 px-4 bg-primary hover:bg-primary-400 text-neutral-900 font-semibold rounded-lg transition-all shadow-sm hover:shadow-md">
            Start Learning
          </button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* AI Tutor */}
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl p-6 border border-primary/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary rounded-lg">
                <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-900">AI Tutor</h3>
            </div>
            <p className="text-sm text-neutral-700 mb-4">Get instant help with your questions</p>
            <button className="w-full py-2 px-4 bg-white hover:bg-neutral-50 text-neutral-900 font-medium rounded-lg transition-all border border-neutral-200">
              Ask a Question
            </button>
          </div>

          {/* Practice Quiz */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-bold text-neutral-900">Practice Quiz</h3>
            </div>
            <p className="text-sm text-neutral-600 mb-4">Test your knowledge</p>
            <button className="w-full py-2 px-4 bg-neutral-900 hover:bg-neutral-800 text-white font-medium rounded-lg transition-all">
              Start Quiz
            </button>
          </div>

          {/* Achievements Preview */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-neutral-200">
            <h3 className="font-bold text-neutral-900 mb-4">Recent Achievements</h3>
            <div className="space-y-3">
              {['🏆 Week Warrior', '⚡ Speed Learner', '🎯 Perfect Score'].map((achievement) => (
                <div key={achievement} className="flex items-center gap-3 p-2 bg-neutral-50 rounded-lg">
                  <span className="text-2xl">{achievement.split(' ')[0]}</span>
                  <span className="text-sm font-medium text-neutral-700">{achievement.split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo/Brand */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            ShikkhaSathi
          </h1>
          <p className="text-neutral-600 text-sm">
            শেখার যাত্রা চালিয়ে যান
          </p>
        </div>

        {/* Welcome Message */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900">
            Let's continue learning
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            আপনার অ্যাকাউন্টে সাইন ইন করুন
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="your@email.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-4 py-3 pr-12 border border-neutral-300 placeholder-neutral-400 text-neutral-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-neutral-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-neutral-600 hover:text-neutral-900">
                Forgot password?
              </a>
            </div>
          </div>

          {/* Sign In Button */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-neutral-900 bg-primary hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-sm hover:shadow-md"
            >
              Sign in
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-neutral-100 text-neutral-500">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-neutral-300 rounded-lg text-neutral-700 bg-white hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium">Sign in with Google</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              নতুন ব্যবহারকারী?{' '}
              <a href="#" className="font-medium text-neutral-900 hover:text-primary">
                একটি অ্যাকাউন্ট তৈরি করুন
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

function App() {
  // Temporarily disable hooks to debug
  const showSyncProgress = false;
  const showConflictResolution = false;
  const setShowSyncProgress = () => {};
  const setShowConflictResolution = () => {};
  const conflicts: any[] = [];
  const errors: any[] = [];
  
  // Mock auth for now
  const isAuthenticated = false;
  const user = null;
  
  // Type guard for user object
  const typedUser = user as { full_name?: string; role?: string } | null;

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Global Loading Bar */}
          <GlobalLoadingBar />
          
          {/* Navigation */}
          <nav className="bg-white border-b border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center gap-8">
                  <h1 className="text-xl font-bold text-neutral-900">ShikkhaSathi</h1>
                  {isAuthenticated && (
                    <div className="hidden md:flex items-center space-x-1">
                      <a href="/" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                        Dashboard
                      </a>
                      {typedUser?.role === 'student' && (
                        <>
                          <a href="/chat" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                            AI Tutor
                          </a>
                          <a href="/quiz" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                            Quiz
                          </a>
                        </>
                      )}
                      {typedUser?.role === 'parent' && (
                        <a href="/parent" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                          Parent Portal
                        </a>
                      )}
                      {typedUser?.role === 'teacher' && (
                        <a href="/teacher" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                          Teacher Dashboard
                        </a>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {isAuthenticated ? (
                    <>
                      {typedUser && (
                        <span className="hidden sm:block text-sm text-neutral-600">
                          {typedUser.full_name}
                        </span>
                      )}
                      <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </button>
                      <button className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <a href="/login" className="px-4 py-2 text-sm font-medium text-neutral-900 bg-primary hover:bg-primary-400 rounded-lg transition-all">
                      Sign In
                    </a>
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
