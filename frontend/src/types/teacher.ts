// Teacher dashboard type definitions
export interface TeacherDashboardData {
  teacherId: string;
  classes: ClassOverview[];
  notifications: TeacherNotification[];
  recentActivity: RecentActivity[];
}

export interface ClassOverview {
  id: string;
  name: string;
  grade: number;
  subject: string;
  studentCount: number;
  averagePerformance: number;
  engagementRate: number;
  lastActivity: Date;
  students: StudentSummary[];
}

export interface StudentSummary {
  id: string;
  name: string;
  email: string;
  totalXP: number;
  currentLevel: number;
  currentStreak: number;
  averageScore: number;
  timeSpent: number;
  lastActive: Date;
  weakAreas: WeakArea[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface WeakArea {
  subject: string;
  topic: string;
  bloomLevel: number;
  successRate: number;
  attemptsCount: number;
}

export interface ClassPerformanceMetrics {
  classId: string;
  averageScore: number;
  completionRate: number;
  engagementMetrics: EngagementMetrics;
  subjectPerformance: SubjectPerformance[];
  weaknessPatterns: WeaknessPattern[];
  timeAnalytics: TimeAnalytics;
}

export interface EngagementMetrics {
  dailyActiveUsers: number;
  averageSessionDuration: number;
  streakDistribution: StreakDistribution;
  activityHeatmap: ActivityHeatmap[];
}

export interface StreakDistribution {
  '0-7': number;
  '8-14': number;
  '15-30': number;
  '30+': number;
}

export interface ActivityHeatmap {
  date: string;
  activityCount: number;
  averageScore: number;
}

export interface SubjectPerformance {
  subject: string;
  averageScore: number;
  completionRate: number;
  bloomLevelDistribution: BloomLevelDistribution;
  topicPerformance: TopicPerformance[];
}

export interface BloomLevelDistribution {
  level1: number;
  level2: number;
  level3: number;
  level4: number;
  level5: number;
  level6: number;
}

export interface TopicPerformance {
  topic: string;
  averageScore: number;
  completionRate: number;
  difficultyLevel: number;
}

export interface WeaknessPattern {
  pattern: string;
  affectedStudents: number;
  subjects: string[];
  topics: string[];
  recommendedIntervention: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TimeAnalytics {
  averageStudyTime: number;
  peakActivityHours: number[];
  weeklyTrends: WeeklyTrend[];
  monthlyComparison: MonthlyComparison;
}

export interface WeeklyTrend {
  week: string;
  totalTime: number;
  averageScore: number;
  activeStudents: number;
}

export interface MonthlyComparison {
  currentMonth: MonthData;
  previousMonth: MonthData;
  growthRate: number;
}

export interface MonthData {
  totalTime: number;
  averageScore: number;
  completedQuizzes: number;
  activeStudents: number;
}

export interface TeacherNotification {
  id: string;
  type: 'student_risk' | 'performance_drop' | 'achievement' | 'system' | 'assessment_due';
  title: string;
  message: string;
  studentId?: string;
  studentName?: string;
  classId?: string;
  className?: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  read: boolean;
  actionRequired: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'quiz_completed' | 'lesson_accessed' | 'achievement_unlocked' | 'streak_broken';
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  description: string;
  timestamp: Date;
  score?: number;
  subject?: string;
}

export interface StudentFilter {
  classId?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  performanceRange?: {
    min: number;
    max: number;
  };
  lastActiveRange?: {
    start: Date;
    end: Date;
  };
  subject?: string;
  searchQuery?: string;
}

export interface InterventionRecommendation {
  id: string;
  studentId: string;
  studentName: string;
  type: 'remedial_content' | 'peer_tutoring' | 'additional_practice' | 'parent_contact';
  priority: 'low' | 'medium' | 'high';
  description: string;
  suggestedActions: string[];
  estimatedImpact: 'low' | 'medium' | 'high';
  timeframe: string;
  resources: Resource[];
}

export interface Resource {
  type: 'lesson' | 'quiz' | 'video' | 'document';
  title: string;
  url: string;
  description: string;
}

// Assessment creation types
export interface CustomAssessment {
  id?: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  bloomLevels: number[];
  topics: string[];
  questionCount: number;
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  scheduledDate?: Date;
  dueDate?: Date;
  assignedClasses: string[];
  questions: AssessmentQuestion[];
  rubric?: AssessmentRubric;
}

export interface AssessmentQuestion {
  id?: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  bloomLevel: number;
  topic: string;
  difficulty: number;
  points: number;
}

export interface AssessmentRubric {
  id?: string;
  criteria: RubricCriterion[];
  totalPoints: number;
}

export interface RubricCriterion {
  name: string;
  description: string;
  levels: RubricLevel[];
  weight: number;
}

export interface RubricLevel {
  name: string;
  description: string;
  points: number;
}

export interface AssessmentAnalytics {
  assessmentId: string;
  title: string;
  completionRate: number;
  averageScore: number;
  averageTime: number;
  questionAnalytics: QuestionAnalytics[];
  classComparison: ClassComparison[];
  difficultyAnalysis: DifficultyAnalysis;
}

export interface QuestionAnalytics {
  questionId: string;
  question: string;
  correctRate: number;
  averageTime: number;
  commonMistakes: string[];
  bloomLevel: number;
}

export interface ClassComparison {
  classId: string;
  className: string;
  averageScore: number;
  completionRate: number;
  topPerformers: string[];
  strugglingStudents: string[];
}

export interface DifficultyAnalysis {
  easy: {
    averageScore: number;
    completionRate: number;
  };
  medium: {
    averageScore: number;
    completionRate: number;
  };
  hard: {
    averageScore: number;
    completionRate: number;
  };
}
// Message system types
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  subject: string;
  content: string;
  messageType: MessageType;
  priority: MessagePriority;
  createdAt: Date;
  scheduledAt?: Date;
  sentAt?: Date;
  metadata?: Record<string, any>;
  isDraft: boolean;
  isArchived: boolean;
  recipients: MessageRecipient[];
}

export interface MessageRecipient {
  id: string;
  recipientId: string;
  recipientName: string;
  recipientType: 'student' | 'parent' | 'teacher';
  deliveryStatus: DeliveryStatus;
  deliveredAt?: Date;
  readAt?: Date;
  failureReason?: string;
}

export type MessageType = 'direct' | 'group' | 'class' | 'announcement' | 'automated';
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';
export type DeliveryStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface MessageCreate {
  subject: string;
  content: string;
  messageType: MessageType;
  priority: MessagePriority;
  recipientIds: string[];
  scheduledAt?: Date;
  metadata?: Record<string, any>;
  isDraft: boolean;
}

export interface MessageTemplate {
  id: string;
  name: string;
  description?: string;
  subjectTemplate: string;
  contentTemplate: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  category?: string;
  variables?: Record<string, any>;
}

export interface MessageTemplateCreate {
  name: string;
  description?: string;
  subjectTemplate: string;
  contentTemplate: string;
  isPublic: boolean;
  category?: string;
  variables?: Record<string, any>;
}

export interface MessageStatistics {
  totalMessagesSent: number;
  messagesByType: Record<string, number>;
  deliveryStatistics: Record<string, number>;
  recentActivity: number;
  draftMessages: number;
}

export interface RecipientInfo {
  id: string;
  name: string;
  email?: string;
  role: string;
  className?: string;
}

export interface RecipientSelection {
  messageType: MessageType;
  classIds?: string[];
  studentIds?: string[];
  includeParents: boolean;
}

export interface RecipientSelectionResponse {
  recipients: RecipientInfo[];
  totalCount: number;
  studentCount: number;
  parentCount: number;
  teacherCount: number;
}

export interface MessageComposerState {
  subject: string;
  content: string;
  messageType: MessageType;
  priority: MessagePriority;
  selectedRecipients: string[];
  selectedClasses: string[];
  includeParents: boolean;
  scheduledAt?: Date;
  isDraft: boolean;
  template?: MessageTemplate;
}

export interface MessageFilter {
  messageType?: MessageType;
  priority?: MessagePriority;
  deliveryStatus?: DeliveryStatus;
  dateFrom?: Date;
  dateTo?: Date;
  isDraft?: boolean;
  isArchived?: boolean;
  searchQuery?: string;
}

export interface MessageThread {
  id: string;
  subject: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isClosed: boolean;
  participantIds: string[];
  messages: Message[];
}

export interface NotificationSettings {
  id: string;
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  weekendNotifications: boolean;
  directMessages: boolean;
  groupMessages: boolean;
  announcements: boolean;
  automatedMessages: boolean;
}
// Announcement and notification system types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  targetClasses: string[];
  priority: MessagePriority;
  scheduledAt?: Date;
  createdAt: Date;
  includeParents: boolean;
  metadata?: Record<string, any>;
}

export interface AnnouncementCreate {
  title: string;
  content: string;
  targetClasses: string[];
  priority: MessagePriority;
  scheduledAt?: Date;
  includeParents: boolean;
  metadata?: Record<string, any>;
}

export interface ProgressReport {
  studentId: string;
  studentName: string;
  reportPeriod: {
    startDate: Date;
    endDate: Date;
    days: number;
  };
  metrics: {
    totalXpGained: number;
    currentLevel: number;
    currentStreak: number;
    subjectsStudied: string[];
    topicsCompleted: number;
    averageScore: number;
    totalAttempts: number;
  };
  weakAreas: Array<{
    subject: string;
    averageScore: number;
    attempts: number;
  }>;
  recommendations: string[];
  generatedAt: Date;
}

export interface ProgressReportRequest {
  studentId: string;
  reportPeriodDays: number;
  includeParents: boolean;
}

export interface PerformanceAlert {
  studentId: string;
  studentName: string;
  averageScore: number;
  threshold: number;
  alertGeneratedAt: Date;
  recentPerformance: Array<{
    subject: string;
    score: number;
    date: Date;
  }>;
}

export interface PerformanceAlertRequest {
  classIds: string[];
  performanceThreshold: number;
  daysToCheck: number;
}

export interface WeeklySummary {
  classId: string;
  className: string;
  weekPeriod: {
    startDate: Date;
    endDate: Date;
  };
  metrics: {
    totalStudents: number;
    activeStudents: number;
    engagementRate: number;
    totalAttempts: number;
    classAverage: number;
  };
  subjectPerformance: Record<string, {
    averageScore: number;
    totalAttempts: number;
  }>;
  topPerformers: Array<{
    name: string;
    averageScore: number;
  }>;
  generatedAt: Date;
}

export type NotificationType = 
  | 'progress_report'
  | 'performance_alert'
  | 'achievement_notification'
  | 'weekly_summary'
  | 'assessment_reminder'
  | 'milestone_completion';

export interface NotificationSchedule {
  teacherId: string;
  notificationType: NotificationType;
  scheduleConfig: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
    time: string;
    timezone?: string;
  };
  targetClasses?: string[];
  enabled: boolean;
  nextExecution?: Date;
}

export interface AnnouncementTemplate {
  id: string;
  name: string;
  subjectTemplate: string;
  contentTemplate: string;
  variables: string[];
  category?: string;
}

export interface NotificationSettings {
  progressReports: {
    enabled: boolean;
    frequency: 'weekly' | 'monthly';
    includeParents: boolean;
  };
  performanceAlerts: {
    enabled: boolean;
    threshold: number;
    daysToCheck: number;
    includeParents: boolean;
  };
  weeklySummaries: {
    enabled: boolean;
    dayOfWeek: number;
    includeParents: boolean;
  };
  achievements: {
    enabled: boolean;
    includeParents: boolean;
  };
}