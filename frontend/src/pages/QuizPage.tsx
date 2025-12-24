import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuizSelection from '../components/quiz/QuizSelection';
import QuizInterface from '../components/quiz/QuizInterface';
import QuizResults from '../components/quiz/QuizResults';
import { Quiz, QuizResult } from '../types/quiz';

type QuizStage = 'selection' | 'taking' | 'results';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState<QuizStage>('selection');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const handleQuizStart = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setStage('taking');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setStage('results');
  };

  const handleRetakeQuiz = () => {
    setCurrentQuiz(null);
    setQuizResult(null);
    setStage('selection');
  };

  const handleBackToDashboard = () => {
    navigate('/student');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-30"></div>
      <div className="absolute top-32 right-20 w-16 h-16 bg-purple-200 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-200 rounded-full opacity-30"></div>
      <div className="absolute bottom-40 right-10 w-12 h-12 bg-pink-200 rounded-full opacity-40"></div>
      
      {/* Header */}
      <div className="relative z-10 p-6">
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        {stage === 'selection' && (
          <QuizSelection onQuizStart={handleQuizStart} />
        )}
        
        {stage === 'taking' && currentQuiz && (
          <QuizInterface
            quiz={currentQuiz}
            onComplete={handleQuizComplete}
          />
        )}
        
        {stage === 'results' && quizResult && (
          <QuizResults
            result={quizResult}
            onRetake={handleRetakeQuiz}
            onBackToDashboard={handleBackToDashboard}
          />
        )}
      </div>
    </div>
  );
};

export default QuizPage;
