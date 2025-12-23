import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import StudentDashboard from './pages/StudentDashboard'
import ParentDashboard from './pages/ParentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import QuizPage from './pages/QuizPage'
import AITutorChat from './pages/AITutorChat'
import UserProfile from './pages/UserProfile'
import { SyncProgressModal, ConflictResolutionModal } from './components/sync'
import ErrorBoundary from './components/common/ErrorBoundary'
import { GlobalLoadingBar } from './components/common/LoadingIndicator'
import { ErrorNotificationManager } from './components/common/ErrorNotification'
import { UserProvider, useUser } from './contexts/UserContext'
import React from 'react'

const Login = () => {
  const navigate = useNavigate();
  const { refreshUser } = useUser();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { authAPI } = await import('./services/apiClient');
      const response = await authAPI.login(formData.email, formData.password);
      
      localStorage.setItem('access_token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
      
      await refreshUser();
      
      const user = await authAPI.getCurrentUser();
      localStorage.setItem('user_id', user.id);
      localStorage.setItem('user_role', user.role);
      
      if (user.role === 'teacher') {
        navigate('/teacher');
      } else if (user.role === 'parent') {
        navigate('/parent');
      } else {
        navigate('/student');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none" style={{
        backgroundColor: 'hsla(270, 100%, 98%, 1)',
        backgroundImage: `
          radial-gradient(at 40% 20%, hsla(280,100%,90%,1) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(260,100%,90%,1) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(300,100%,92%,1) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(250,100%,92%,1) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(270,100%,90%,1) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(290,100%,92%,1) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(260,100%,95%,1) 0px, transparent 50%)
        `
      }}></div>

      {/* Navigation */}
      <nav className="w-full z-50 bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
<a href="/" className="font-bold text-xl tracking-tight text-gray-900">ShikkhaSathi</a>
            </div>
            <div className="hidden md:flex space-x-8">
              <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors" href="#">Features</a>
              <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors" href="#">About</a>
              <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors" href="#">Pricing</a>
              <a className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors" href="#">Contact</a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a className="text-sm font-medium text-gray-700 hover:text-purple-600 transition-colors" href="#">Log In</a>
<a href="/signup" className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-purple-500/30">
                Get Started
              </a>
            </div>
            <div className="md:hidden flex items-center">
              <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[480px] space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">ShikkhaSathi</h1>
            <p className="text-sm text-gray-500 font-medium mb-8 italic tracking-wide">শেখার যাত্রায় সাথী হোন</p>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Let's continue learning</h2>
            <p className="mt-2 text-sm text-gray-500">আপনার অ্যাকাউন্টে সাইন ইন করুন</p>
          </div>

          {/* Login Form Card */}
          <div className="bg-white py-8 px-6 shadow-2xl shadow-purple-200/50 rounded-2xl border border-gray-100 sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                  Email
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent sm:text-sm bg-gray-50 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                  Password
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent sm:text-sm bg-gray-50 transition-all pr-12"
                    placeholder="Enter your password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-600 border-gray-300 rounded cursor-pointer"
                  />
                  <label className="ml-2 block text-sm text-gray-600 cursor-pointer" htmlFor="remember-me">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a className="font-medium text-purple-600 hover:text-purple-700 transition-colors" href="#">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Sign In Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-600 transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              {/* Google Sign In */}
              <div className="mt-6">
                <button
                  type="button"
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors"
                >
                  <img
                    className="h-5 w-5 mr-3"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2p95ZSTtPmNXYvXSlsQeh9JZFiOKgsJGRZEY6fiP0GrZHFSEjvDoPYGOOZUOnfX9MPrvX1QyxlJGiFZ_-myR6uejjxQDKRvlCJA1G8PGYu5F2Jh5Lev-eIaoz6Cs1SMu23xRi6wGL0UdklOvXw66FZnxvKDBs2viRhm-tyNNKsR1PqBvKQrY5hUDLxm1frmMRIIJz89uynz1vgWvenbJ3eNgs4VK7vtg91M6MLy4RRxHZcEM4iwxX--BDGv69nDRwE2fYXl1yPU46"
                    alt="Google Logo"
                  />
                  Sign in with Google
                </button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center text-sm">
              <span className="text-gray-500">নতুন ব্যবহারকারী? </span>
              <a className="font-medium text-purple-600 hover:text-purple-700 transition-colors" href="/signup">
                একটি অ্যাকাউন্ট তৈরি করুন
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-gray-400 relative z-10">
        <p>© 2024 Shikshasathi. All rights reserved.</p>
      </footer>
    </div>
  );
}

const AppContent = () => {
  // Use UserContext for authentication state
  const { user } = useUser();
  const isAuthenticated = !!user;

  // Temporarily disable hooks to debug
  const showSyncProgress = false;
  const showConflictResolution = false;
  const setShowSyncProgress = (value?: boolean) => {};
  const setShowConflictResolution = (value?: boolean) => {};
  const conflicts: any[] = [];
  const errors: any[] = [];
  
  // Type guard for user object
  const typedUser = user as { full_name?: string; role?: string } | null;

  // Check if we're on login, signup, or landing pages to hide navigation
  const currentPath = window.location.pathname;
  const hideNavigation = currentPath === '/login' || currentPath === '/signup' || currentPath === '/';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Global Loading Bar */}
      <GlobalLoadingBar />
      
      {/* Navigation - Hidden on login/signup pages */}
      {!hideNavigation && (
        <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              {/* Logo and Brand */}
              <div className="flex items-center gap-8">
                <a href="/" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-neon transition-all">
                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold text-neutral-900 font-bengali">শিক্ষাসাথী</span>
                </a>
                
                {/* Public Navigation */}
                {!isAuthenticated && (
                  <div className="hidden md:flex items-center space-x-1">
                    <a href="/#features" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                      Features
                    </a>
                    <a href="/#about" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                      About
                    </a>
                    <a href="/#pricing" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                      Pricing
                    </a>
                    <a href="/#contact" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                      Contact
                    </a>
                  </div>
                )}
                
                {/* Authenticated Navigation */}
                {isAuthenticated && (
                  <div className="hidden md:flex items-center space-x-1">
                    <a href="/dashboard" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-primary/10 rounded-lg transition-colors">
                      Dashboard
                    </a>
                    {typedUser?.role === 'student' && (
                      <>
                        <a href="/chat" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-primary/10 rounded-lg transition-colors">
                          AI Tutor
                        </a>
                        <a href="/quiz" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-primary/10 rounded-lg transition-colors">
                          Quiz
                        </a>
                        <a href="/progress" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-primary/10 rounded-lg transition-colors">
                          Progress
                        </a>
                      </>
                    )}
                    {typedUser?.role === 'parent' && (
                      <a href="/parent" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-primary/10 rounded-lg transition-colors">
                        Parent Portal
                      </a>
                    )}
                    {typedUser?.role === 'teacher' && (
                      <>
                        <a href="/teacher" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-primary/10 rounded-lg transition-colors">
                          Dashboard
                        </a>
                        <a href="/teacher/assessments" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-primary/10 rounded-lg transition-colors">
                          Assessments
                        </a>
                        <a href="/teacher/students" className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 hover:bg-primary/10 rounded-lg transition-colors">
                          Students
                        </a>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {!isAuthenticated && (
                  <>
                    <a href="/login" className="hidden sm:block px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">
                      Log In
                    </a>
                    <a href="/signup" className="px-4 py-2 text-sm font-bold text-neutral-900 bg-primary hover:bg-primary-600 rounded-lg transition-all shadow-sm hover:shadow-neon">
                      Get Started
                    </a>
                  </>
                )}
                
                {/* Mobile Menu Button */}
                <button className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
            <Route path="/chat" element={<AITutorChat />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<UserProfile />} />
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
  );
};

function App() {
  return (
    <ErrorBoundary>
      <UserProvider>
        <Router>
          <AppContent />
        </Router>
      </UserProvider>
    </ErrorBoundary>
  )
}

export default App
