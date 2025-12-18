import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Placeholder components for different routes
const Dashboard = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
    <p className="mt-4 text-gray-600">Welcome to ShikkhaSathi - Your AI Learning Companion</p>
  </div>
)

const Chat = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">AI Tutor Chat</h1>
    <p className="mt-4 text-gray-600">Chat with your AI tutor here</p>
  </div>
)

const Quiz = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">Adaptive Quiz</h1>
    <p className="mt-4 text-gray-600">Take adaptive quizzes here</p>
  </div>
)

const Login = () => (
  <div className="p-8">
    <h1 className="text-3xl font-bold text-gray-900">Login</h1>
    <p className="mt-4 text-gray-600">Login to your account</p>
  </div>
)

function App() {
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
                <a href="/" className="text-gray-700 hover:text-gray-900">Dashboard</a>
                <a href="/chat" className="text-gray-700 hover:text-gray-900">AI Tutor</a>
                <a href="/quiz" className="text-gray-700 hover:text-gray-900">Quiz</a>
                <a href="/login" className="text-gray-700 hover:text-gray-900">Login</a>
              </div>
            </div>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
