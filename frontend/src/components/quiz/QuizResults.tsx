import React from 'react';
import { Trophy, Star, Clock, Target, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react';
import { QuizResult } from '../../types/quiz';

interface QuizResultsProps {
  result: QuizResult;
  onRetake: () => void;
  onBackToDashboard: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  result,
  onRetake,
  onBackToDashboard,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90) return { text: 'Outstanding!', color: 'text-green-600' };
    if (percentage >= 75) return { text: 'Great Job!', color: 'text-blue-600' };
    if (percentage >= 60) return { text: 'Good Effort!', color: 'text-yellow-600' };
    return { text: 'Keep Practicing!', color: 'text-orange-600' };
  };

  const performance = getPerformanceMessage(result.percentage);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <Trophy className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <h1 className={`text-4xl font-bold mb-4 ${performance.color}`}>
          {performance.text}
        </h1>
        
        <div className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
          {result.percentage.toFixed(0)}%
        </div>
        
        <p className="text-gray-600 text-xl mb-8 font-medium">
          You scored {result.score} out of {result.max_score}
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-100 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-600">+{result.xp_earned}</div>
            <div className="text-sm text-gray-600 font-semibold">XP Earned</div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-600">{result.score}</div>
            <div className="text-sm text-gray-600 font-semibold">Correct</div>
          </div>
          
          <div className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border border-orange-100 shadow-sm">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-orange-600">
              {formatTime(result.time_taken_seconds)}
            </div>
            <div className="text-sm text-gray-600 font-semibold">Time Taken</div>
          </div>
        </div>
      </div>

      {/* Question Review */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Target className="w-5 h-5 text-white" />
          </div>
          Question Review
        </h2>

        <div className="space-y-6">
          {result.results?.map((qResult, index) => (
            <div
              key={qResult.question_id}
              className={`p-6 rounded-2xl border-2 shadow-sm ${
                qResult.is_correct
                  ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
                  : 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50'
              }`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  qResult.is_correct ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {qResult.is_correct ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <XCircle className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900 mb-3 text-lg">
                    {index + 1}. {qResult.question_text}
                  </div>
                  
                  <div className="space-y-2 text-base">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 font-semibold">Your answer:</span>
                      <span className={`font-bold ${qResult.is_correct ? 'text-green-600' : 'text-red-600'}`}>
                        {qResult.student_answer || 'Not answered'}
                      </span>
                    </div>
                    
                    {!qResult.is_correct && (
                      <div className="flex items-center gap-3">
                        <span className="text-gray-600 font-semibold">Correct answer:</span>
                        <span className="text-green-600 font-bold">
                          {qResult.correct_answer}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {qResult.explanation && (
                    <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                      <div className="text-xs text-purple-600 font-bold uppercase tracking-wide mb-2">Explanation:</div>
                      <div className="text-sm text-gray-700 leading-relaxed">{qResult.explanation}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )) || []}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onRetake}
          className="flex-1 flex items-center justify-center gap-3 px-8 py-4 border-2 border-purple-500 text-purple-600 rounded-2xl hover:bg-purple-50 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          <RotateCcw className="w-6 h-6" />
          Retake Quiz
        </button>
        
        <button
          onClick={onBackToDashboard}
          className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600 font-bold text-lg shadow-lg hover:shadow-xl transition-all"
        >
          <Home className="w-6 h-6" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default QuizResults;
