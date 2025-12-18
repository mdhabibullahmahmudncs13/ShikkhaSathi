// Quiz type definitions
export interface Question {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  bloom_level: number;
  difficulty_level: number;
  options?: string[];
  subject: string;
  topic: string;
  grade: number;
}

export interface QuestionResponse {
  question_id: string;
  student_answer: string;
  time_taken_seconds: number;
  is_flagged: boolean;
}

export interface QuizMetadata {
  subject: string;
  topic: string;
  grade: number;
  difficulty_level: number;
  bloom_level: number;
  total_questions: number;
}

export interface Quiz {
  quiz_id: string;
  questions: Question[];
  metadata: QuizMetadata;
}

export interface QuizState {
  currentQuestionIndex: number;
  responses: QuestionResponse[];
  flaggedQuestions: Set<string>;
  startTime: Date;
  questionStartTime: Date;
  isSubmitted: boolean;
  timeRemaining: number; // in seconds
}

export interface QuestionFeedback {
  question_id: string;
  is_correct: boolean;
  score: number;
  max_score: number;
  explanation: string;
  correct_answer: string;
  student_answer: string;
  detailed_feedback: string;
  learning_resources: string[];
}

export interface QuizResult {
  quiz_id: string;
  user_id: string;
  total_score: number;
  max_score: number;
  percentage: number;
  time_taken_seconds: number;
  difficulty_level: number;
  bloom_level: number;
  subject: string;
  topic: string;
  grade: number;
  question_feedbacks: QuestionFeedback[];
  overall_feedback: string;
  weak_areas: string[];
  strong_areas: string[];
  recommendations: string[];
  next_difficulty: number;
  completed_at: Date;
}

export interface QuizGenerationRequest {
  subject: string;
  topic: string;
  grade: number;
  question_type: string;
  bloom_level: number;
  difficulty_level?: number;
  count: number;
  language: string;
}

export interface QuizSubmissionRequest {
  quiz_id: string;
  responses: QuestionResponse[];
}