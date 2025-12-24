import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { quizAPI } from '../../services/apiClient';
import { Quiz, QuizResult } from '../../types/quiz';

interface QuizInterfaceProps {
  quiz: Quiz;
  onComplete: (result: QuizResult) => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ quiz, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState(
    (quiz.time_limit_minutes || 20) * 60
  );
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const answeredCount = Object.keys(answers).length;
  const startTime = Date.now();

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      const result = await quizAPI.submitQuiz({
        quiz_id: quiz.quiz_id,
        answers,
        time_taken_seconds: timeTaken,
      });

      onComplete(result);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
      alert('Failed to submit quiz. Please try again.');
      setSubmitting(false);
    }
  };

  const getOptionLabel = (option: string) => {
    return currentQuestion.options[option as keyof typeof currentQuestion.options] || '';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{quiz.subject}</h2>
            {quiz.topic && (
              <p className="text-gray-600 font-medium">{quiz.topic}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-white bg-gradient-to-r from-orange-500 to-red-500 px-4 py-2 rounded-xl font-bold shadow-lg">
            <Clock className="w-5 h-5" />
            <span className="text-lg">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all shadow-sm"
              style={{
                width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%`,
              }}
            />
          </div>
          <span className="text-sm text-gray-600 whitespace-nowrap font-semibold">
            {currentQuestionIndex + 1} / {quiz.questions.length}
          </span>
        </div>

        {/* Answered Count */}
        <div className="mt-4 text-sm text-gray-600 flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span className="font-medium">{answeredCount} of {quiz.questions.length} answered</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
        <div className="mb-8">
          <span className="text-sm text-purple-600 font-semibold uppercase tracking-wide">Question {currentQuestionIndex + 1}</span>
          <h3 className="text-2xl font-bold text-gray-900 mt-3 leading-relaxed">
            {currentQuestion.question_text}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-4">
          {['A', 'B', 'C', 'D'].map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                answers[currentQuestion.id] === option
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-start gap-4">
                <span className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg ${
                  answers[currentQuestion.id] === option
                    ? 'border-purple-500 bg-purple-500 text-white'
                    : 'border-gray-300 text-gray-600'
                }`}>
                  {option}
                </span>
                <span className="flex-1 pt-2 text-gray-800 font-medium">{getOptionLabel(option)}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-gray-700 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        {isLastQuestion ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={answeredCount === 0}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Submit Quiz?
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              You have answered {answeredCount} out of {quiz.questions.length} questions.
              {answeredCount < quiz.questions.length && (
                <span className="block mt-3 text-orange-600 font-semibold">
                  Unanswered questions will be marked as incorrect.
                </span>
              )}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold text-gray-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 font-semibold shadow-lg transition-all"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizInterface;
