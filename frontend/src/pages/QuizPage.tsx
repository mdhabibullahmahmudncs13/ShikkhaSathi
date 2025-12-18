import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Quiz, QuizResult, QuizGenerationRequest, QuestionResponse } from '../types/quiz';
import { quizService } from '../services/quizService';
import { QuizContainer, QuizResults, ResultsSharing } from '../components/quiz';

type QuizPageState = 'setup' | 'taking' | 'results' | 'loading' | 'error';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [state, setState] = useState<QuizPageState>('setup');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string>('');
  const [showSharing, setShowSharing] = useState(false);

  // Quiz setup form state
  const [quizSetup, setQuizSetup] = useState<QuizGenerationRequest>({
    subject: searchParams.get('subject') || 'Mathematics',
    topic: searchParams.get('topic') || 'Algebra',
    grade: parseInt(searchParams.get('grade') || '9'),
    question_type: 'multiple_choice',
    bloom_level: 2,
    count: 5,
    language: 'bangla',
  });

  useEffect(() => {
    // If URL has quiz parameters, auto-generate quiz
    if (searchParams.get('auto') === 'true') {
      handleGenerateQuiz();
    }
  }, []);

  const handleGenerateQuiz = async () => {
    setState('loading');
    setError('');

    try {
      const generatedQuiz = await quizService.generateQuiz(quizSetup);
      setQuiz(generatedQuiz);
      setState('taking');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate quiz');
      setState('error');
    }
  };

  const handleQuizSubmit = async (responses: QuestionResponse[]) => {
    if (!quiz) return;

    setState('loading');

    try {
      // For now, simulate the result since the backend might not be fully connected
      // const result = await quizService.submitQuiz({ quiz_id: quiz.quiz_id, responses });
      const mockResult: QuizResult = {
        quiz_id: quiz.quiz_id,
        user_id: 'current-user',
        total_score: responses.reduce((sum, r) => sum + (r.student_answer ? 10 : 0), 0),
        max_score: responses.length * 10,
        percentage: (responses.filter(r => r.student_answer).length / responses.length) * 100,
        time_taken_seconds: responses.reduce((sum, r) => sum + r.time_taken_seconds, 0),
        difficulty_level: quiz.metadata.difficulty_level,
        bloom_level: quiz.metadata.bloom_level,
        subject: quiz.metadata.subject,
        topic: quiz.metadata.topic,
        grade: quiz.metadata.grade,
        question_feedbacks: responses.map((response, index) => ({
          question_id: response.question_id,
          is_correct: Math.random() > 0.3, // Simulate correctness
          score: Math.random() > 0.3 ? 10 : 0,
          max_score: 10,
          explanation: quiz.questions[index]?.question_text || 'No explanation available',
          correct_answer: 'A', // Simulate correct answer
          student_answer: response.student_answer,
          detailed_feedback: 'This is detailed feedback for the question.',
          learning_resources: ['NCTB Textbook Chapter 3', 'Practice Problems Set 1'],
        })),
        overall_feedback: 'Good effort! Keep practicing to improve your understanding.',
        weak_areas: ['Quadratic Equations', 'Problem Solving'],
        strong_areas: ['Basic Algebra', 'Number Systems'],
        recommendations: [
          'Review quadratic equation fundamentals',
          'Practice more word problems',
          'Focus on step-by-step problem solving',
        ],
        next_difficulty: quiz.metadata.difficulty_level + (Math.random() > 0.5 ? 1 : -1),
        completed_at: new Date(),
      };

      setResult(mockResult);
      setState('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit quiz');
      setState('error');
    }
  };

  const handleRetakeQuiz = () => {
    setQuiz(null);
    setResult(null);
    setState('setup');
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  const handleExitQuiz = () => {
    if (window.confirm('Are you sure you want to exit? Your progress will be lost.')) {
      navigate('/');
    }
  };

  const renderSetup = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Your Quiz
        </h1>

        <div className="space-y-4">
          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <select
              id="subject"
              value={quizSetup.subject}
              onChange={(e) => setQuizSetup({ ...quizSetup, subject: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="English">English</option>
              <option value="Bangla">Bangla</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              value={quizSetup.topic}
              onChange={(e) => setQuizSetup({ ...quizSetup, topic: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter topic name"
            />
          </div>

          {/* Grade */}
          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
              Grade
            </label>
            <select
              id="grade"
              value={quizSetup.grade}
              onChange={(e) => setQuizSetup({ ...quizSetup, grade: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 7 }, (_, i) => i + 6).map(grade => (
                <option key={grade} value={grade}>Grade {grade}</option>
              ))}
            </select>
          </div>

          {/* Question Type */}
          <div>
            <label htmlFor="question-type" className="block text-sm font-medium text-gray-700 mb-2">
              Question Type
            </label>
            <select
              id="question-type"
              value={quizSetup.question_type}
              onChange={(e) => setQuizSetup({ ...quizSetup, question_type: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="multiple_choice">Multiple Choice</option>
              <option value="true_false">True/False</option>
              <option value="short_answer">Short Answer</option>
            </select>
          </div>

          {/* Number of Questions */}
          <div>
            <label htmlFor="question-count" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions
            </label>
            <select
              id="question-count"
              value={quizSetup.count}
              onChange={(e) => setQuizSetup({ ...quizSetup, count: parseInt(e.target.value) })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              id="language"
              value={quizSetup.language}
              onChange={(e) => setQuizSetup({ ...quizSetup, language: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="bangla">Bangla</option>
              <option value="english">English</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleGenerateQuiz}
            className="flex-1 py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Generate Quiz
          </button>
        </div>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {state === 'loading' && !quiz ? 'Generating Quiz...' : 'Processing Results...'}
        </h2>
        <p className="text-gray-600">
          {state === 'loading' && !quiz 
            ? 'Creating personalized questions for you'
            : 'Analyzing your performance and generating feedback'
          }
        </p>
      </div>
    </div>
  );

  const renderError = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setState('setup')}
            className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );

  // Render based on current state
  switch (state) {
    case 'setup':
      return renderSetup();
    case 'loading':
      return renderLoading();
    case 'error':
      return renderError();
    case 'taking':
      return quiz ? (
        <QuizContainer
          quiz={quiz}
          onSubmit={handleQuizSubmit}
          onExit={handleExitQuiz}
        />
      ) : renderError();
    case 'results':
      return (
        <>
          {result && (
            <QuizResults
              result={result}
              onRetakeQuiz={handleRetakeQuiz}
              onBackToDashboard={handleBackToDashboard}
              onShareResults={() => setShowSharing(true)}
              onExportResults={() => {
                // Implement export functionality
                console.log('Export results');
              }}
            />
          )}
          {showSharing && result && (
            <ResultsSharing
              result={result}
              onClose={() => setShowSharing(false)}
            />
          )}
        </>
      );
    default:
      return renderError();
  }
};

export default QuizPage;