import React, { useState } from 'react';
import { QuizResult } from '../../types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  onRetakeQuiz: () => void;
  onBackToDashboard: () => void;
  onShareResults?: () => void;
  onExportResults?: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  onRetakeQuiz,
  onBackToDashboard,
  onShareResults,
  onExportResults,
}) => {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'detailed' | 'analytics'>('overview');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600 bg-green-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-100';
    if (percentage >= 70) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Very Good';
    if (percentage >= 70) return 'Good';
    if (percentage >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Score Card */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getScoreColor(result.percentage)}`}>
            {Math.round(result.percentage)}%
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">
            {getPerformanceLevel(result.percentage)}
          </h2>
          <p className="text-gray-600 mt-2">
            You scored {result.total_score} out of {result.max_score} points
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Completed in {formatTime(result.time_taken_seconds)}
          </p>
        </div>
      </div>

      {/* Overall Feedback */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Overall Feedback</h3>
        <p className="text-gray-700 leading-relaxed">{result.overall_feedback}</p>
      </div>

      {/* Performance Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strong Areas */}
        {result.strong_areas.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-green-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Strong Areas
            </h3>
            <ul className="space-y-2">
              {result.strong_areas.map((area, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weak Areas */}
        {result.weak_areas.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-red-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {result.weak_areas.map((area, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span className="text-gray-700">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
            Recommendations
          </h3>
          <ul className="space-y-2">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span className="text-gray-700">{recommendation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderDetailedFeedback = () => (
    <div className="space-y-4">
      {result.question_feedbacks.map((feedback, index) => (
        <div key={feedback.question_id} className="bg-white rounded-lg shadow-md border border-gray-200">
          <button
            onClick={() => setExpandedQuestion(
              expandedQuestion === feedback.question_id ? null : feedback.question_id
            )}
            className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-500">Q{index + 1}</span>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                feedback.is_correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {feedback.is_correct ? '✓' : '✗'}
              </div>
              <span className="font-medium text-gray-900">
                {feedback.score}/{feedback.max_score} points
              </span>
            </div>
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                expandedQuestion === feedback.question_id ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedQuestion === feedback.question_id && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="space-y-4 pt-4">
                {/* Your Answer */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Your Answer:</h4>
                  <p className={`p-3 rounded-lg ${
                    feedback.is_correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {feedback.student_answer || 'No answer provided'}
                  </p>
                </div>

                {/* Correct Answer */}
                {!feedback.is_correct && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</h4>
                    <p className="p-3 bg-green-50 text-green-800 rounded-lg">
                      {feedback.correct_answer}
                    </p>
                  </div>
                )}

                {/* Explanation */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Explanation:</h4>
                  <p className="text-gray-600 leading-relaxed">{feedback.explanation}</p>
                </div>

                {/* Detailed Feedback */}
                {feedback.detailed_feedback && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Feedback:</h4>
                    <p className="text-gray-600 leading-relaxed">{feedback.detailed_feedback}</p>
                  </div>
                )}

                {/* Learning Resources */}
                {feedback.learning_resources.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Resources:</h4>
                    <ul className="space-y-1">
                      {feedback.learning_resources.map((resource, idx) => (
                        <li key={idx} className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          📚 {resource}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderAnalytics = () => {
    const correctAnswers = result.question_feedbacks.filter(f => f.is_correct).length;
    const totalQuestions = result.question_feedbacks.length;
    const averageTimePerQuestion = result.time_taken_seconds / totalQuestions;

    return (
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{correctAnswers}</div>
            <div className="text-sm text-gray-600 mt-1">Correct Answers</div>
            <div className="text-xs text-gray-500">out of {totalQuestions}</div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-green-600">{formatTime(Math.round(averageTimePerQuestion))}</div>
            <div className="text-sm text-gray-600 mt-1">Avg. Time</div>
            <div className="text-xs text-gray-500">per question</div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 text-center">
            <div className="text-3xl font-bold text-purple-600">{result.difficulty_level}</div>
            <div className="text-sm text-gray-600 mt-1">Difficulty Level</div>
            <div className="text-xs text-gray-500">out of 10</div>
          </div>
        </div>

        {/* Next Difficulty Recommendation */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Quiz Recommendation</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700">
                Based on your performance, we recommend difficulty level <strong>{result.next_difficulty}</strong> for your next quiz.
              </p>
              {result.next_difficulty > result.difficulty_level && (
                <p className="text-green-600 text-sm mt-1">
                  🎉 Great job! You're ready for a more challenging quiz.
                </p>
              )}
              {result.next_difficulty < result.difficulty_level && (
                <p className="text-blue-600 text-sm mt-1">
                  💪 Let's strengthen your foundation with some practice.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quiz Metadata */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quiz Details</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Subject:</span>
              <span className="ml-2 font-medium">{result.subject}</span>
            </div>
            <div>
              <span className="text-gray-500">Topic:</span>
              <span className="ml-2 font-medium">{result.topic}</span>
            </div>
            <div>
              <span className="text-gray-500">Grade:</span>
              <span className="ml-2 font-medium">{result.grade}</span>
            </div>
            <div>
              <span className="text-gray-500">Bloom Level:</span>
              <span className="ml-2 font-medium">{result.bloom_level}</span>
            </div>
            <div>
              <span className="text-gray-500">Completed:</span>
              <span className="ml-2 font-medium">
                {new Date(result.completed_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-semibold text-gray-900">Quiz Results</h1>
            <div className="flex items-center gap-3">
              {onShareResults && (
                <button
                  onClick={onShareResults}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Share
                </button>
              )}
              {onExportResults && (
                <button
                  onClick={onExportResults}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Export
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'detailed', label: 'Detailed Feedback', icon: '📝' },
              { id: 'analytics', label: 'Analytics', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {selectedTab === 'overview' && renderOverview()}
          {selectedTab === 'detailed' && renderDetailedFeedback()}
          {selectedTab === 'analytics' && renderAnalytics()}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onRetakeQuiz}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={onBackToDashboard}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;