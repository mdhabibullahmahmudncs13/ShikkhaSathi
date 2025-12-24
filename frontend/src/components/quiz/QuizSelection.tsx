import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, ArrowRight, ChevronDown } from 'lucide-react';
import { quizAPI } from '../../services/apiClient';
import { Quiz, Subject, Topic } from '../../types/quiz';

interface QuizSelectionProps {
  onQuizStart: (quiz: Quiz) => void;
}

const QuizSelection: React.FC<QuizSelectionProps> = ({ onQuizStart }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user grade from localStorage
  const userGrade = parseInt(localStorage.getItem('user_grade') || '8');

  useEffect(() => {
    loadSubjects();
  }, []);

  useEffect(() => {
    if (selectedSubject) {
      loadTopics(selectedSubject);
    }
  }, [selectedSubject]);

  const loadSubjects = async () => {
    try {
      const response = await quizAPI.getSubjects(userGrade);
      setSubjects(response.subjects || []);
    } catch (err) {
      console.error('Failed to load subjects:', err);
      setError('Failed to load subjects');
    }
  };

  const loadTopics = async (subject: string) => {
    try {
      const response = await quizAPI.getTopics(subject, userGrade);
      setTopics(response.topics || []);
    } catch (err) {
      console.error('Failed to load topics:', err);
      setTopics([]);
    }
  };

  const handleStartQuiz = async () => {
    if (!selectedSubject) {
      setError('Please select a subject');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const quiz = await quizAPI.generateQuiz({
        subject: selectedSubject,
        topic: selectedTopic || undefined,
        grade: userGrade,
        question_count: questionCount,
        time_limit_minutes: questionCount * 2, // 2 minutes per question
        language: 'english',
      });

      onQuizStart(quiz);
    } catch (err: any) {
      console.error('Failed to generate quiz:', err);
      setError(err.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Quiz</span>
          </h1>
          <p className="text-gray-500 text-base leading-relaxed">
            Customize your learning journey. Choose a topic and challenge yourself!
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Subject Selection */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Select Subject
            </label>
          </div>
          <div className="relative">
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                setSelectedTopic('');
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white text-gray-700 font-medium"
            >
              <option value="">Choose a subject...</option>
              {subjects.map((subject) => (
                <option key={subject.subject} value={subject.subject}>
                  {subject.subject}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Question Count */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-4 h-4 bg-pink-500 rounded-sm"></div>
            <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Questions Count
            </label>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[5, 10, 15, 20].map((count) => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all ${
                  questionCount === count
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white border-transparent shadow-lg'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Time Estimate */}
        <div className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Estimated Duration
              </div>
              <div className="text-lg font-bold text-gray-900">
                ~{questionCount * 2} Minutes
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          disabled={!selectedSubject || loading}
          className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating Quiz...
            </>
          ) : (
            <>
              Start Quiz Now
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizSelection;
