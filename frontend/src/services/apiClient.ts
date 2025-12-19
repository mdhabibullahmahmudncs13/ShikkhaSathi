import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { apiCache, dashboardCache, quizCache, cacheKeys, withCache } from './cacheManager';
import { logger } from './logger';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_VERSION = '/api/v1';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}${API_VERSION}`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and logging
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add request timestamp for performance monitoring
    (config as any).metadata = { startTime: Date.now() };
    
    logger.debug(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      params: config.params,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    logger.error('API Request Error', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful response
    const config = response.config;
    const duration = Date.now() - ((config as any).metadata?.startTime || 0);
    
    logger.monitorAPICall(
      config.url || '',
      config.method?.toUpperCase() || 'GET',
      (config as any).metadata?.startTime || 0,
      Date.now(),
      true
    );
    
    logger.debug(`API Response: ${config.method?.toUpperCase()} ${config.url} (${duration}ms)`, {
      status: response.status,
      data: response.data
    });
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const duration = Date.now() - (originalRequest?.metadata?.startTime || 0);

    // Log failed response
    logger.monitorAPICall(
      originalRequest?.url || '',
      originalRequest?.method?.toUpperCase() || 'GET',
      originalRequest?.metadata?.startTime || 0,
      Date.now(),
      false,
      error
    );

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          logger.info('Attempting token refresh');
          
          const response = await axios.post(`${API_BASE_URL}${API_VERSION}/auth/refresh`, {
            refresh_token: refreshToken
          });
          
          const { access_token } = response.data;
          localStorage.setItem('access_token', access_token);
          
          logger.info('Token refresh successful');
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        logger.error('Token refresh failed', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle network errors
    if (!error.response) {
      logger.error('Network error', { message: error.message, duration });
      throw new Error('Network connection failed. Please check your internet connection.');
    }

    // Handle other HTTP errors
    const errorMessage = error.response.data?.detail || error.response.data?.message || 'An error occurred';
    logger.error(`API Error: ${error.response.status}`, {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status: error.response.status,
      message: errorMessage,
      duration
    });
    
    throw new Error(errorMessage);
  }
);

// Generic API methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.get(url, config).then(response => response.data),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.post(url, data, config).then(response => response.data),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.put(url, data, config).then(response => response.data),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.patch(url, data, config).then(response => response.data),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    apiClient.delete(url, config).then(response => response.data),
};

// Specific API endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
    
  register: (userData: {
    email: string;
    password: string;
    full_name: string;
    grade: number;
    medium: string;
    role: string;
  }) => api.post('/auth/register', userData),
  
  logout: () => api.post('/auth/logout'),
  
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refresh_token: refreshToken }),
    
  getCurrentUser: () => api.get('/users/me'),
};

export const dashboardAPI = {
  getDashboardData: () => {
    const userId = localStorage.getItem('user_id') || 'anonymous';
    return withCache(
      dashboardCache,
      cacheKeys.dashboardData(userId),
      () => api.get('/progress/dashboard'),
      2 * 60 * 1000 // 2 minutes cache
    );
  },
  getAnalytics: () => api.get('/progress/analytics'),
};

export const quizAPI = {
  getQuizzes: (subject?: string, difficulty?: number) =>
    withCache(
      quizCache,
      cacheKeys.quizList(subject, difficulty),
      () => api.get('/quiz/list', { params: { subject, difficulty } }),
      5 * 60 * 1000 // 5 minutes cache
    ),
    
  getQuiz: (quizId: string) =>
    withCache(
      quizCache,
      cacheKeys.quiz(quizId),
      () => api.get(`/quiz/${quizId}`),
      10 * 60 * 1000 // 10 minutes cache
    ),
  
  submitQuiz: (quizId: string, answers: any[]) =>
    api.post(`/quiz/${quizId}/submit`, { answers }),
    
  getQuizResults: (attemptId: string) =>
    withCache(
      quizCache,
      cacheKeys.quizResults(attemptId),
      () => api.get(`/quiz/results/${attemptId}`),
      30 * 60 * 1000 // 30 minutes cache
    ),
    
  generateQuiz: (params: {
    subject: string;
    topic: string;
    difficulty_level: number;
    bloom_level: number;
    question_count: number;
  }) => api.post('/quiz/generate', params),
};

export const chatAPI = {
  sendMessage: (message: string, sessionId?: string) =>
    api.post('/chat/message', { message, session_id: sessionId }),
    
  getChatHistory: (sessionId: string) =>
    api.get(`/chat/history/${sessionId}`),
    
  processVoiceInput: (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    return api.post('/chat/voice', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const gamificationAPI = {
  getGamificationData: async () => {
    // First get current user to get their ID
    const currentUser = await api.get('/users/me');
    const userId = currentUser.id;
    
    return withCache(
      apiCache,
      cacheKeys.gamificationData(userId),
      () => api.get(`/gamification/profile/${userId}`),
      3 * 60 * 1000 // 3 minutes cache
    );
  },
  getLeaderboard: (type: string = 'global', timeframe: string = 'weekly') =>
    withCache(
      apiCache,
      cacheKeys.leaderboard(type, timeframe),
      () => api.get('/gamification/leaderboard/xp', { params: { leaderboard_type: type, time_frame: timeframe } }),
      5 * 60 * 1000 // 5 minutes cache
    ),
  getAchievements: async () => {
    const currentUser = await api.get('/users/me');
    return api.get('/gamification/achievements', { params: { user_id: currentUser.id } });
  },
  useStreakFreeze: async () => {
    const currentUser = await api.get('/users/me');
    return api.post('/gamification/streak/freeze', null, { params: { user_id: currentUser.id } });
  },
  awardXP: (userId: string, activityType: string, amount?: number, metadata?: any) =>
    api.post('/gamification/award-xp', null, { 
      params: { user_id: userId, activity_type: activityType, amount, metadata } 
    }),
  getStreakInfo: async () => {
    const currentUser = await api.get('/users/me');
    return api.get('/gamification/streak', { params: { user_id: currentUser.id } });
  },
};

export const teacherAPI = {
  getClassOverview: () => api.get('/teacher/class-overview'),
  getStudentAnalytics: (studentId: string) =>
    api.get(`/teacher/student/${studentId}/analytics`),
  getClassPerformance: () => api.get('/teacher/class-performance'),
  createAssessment: (assessmentData: any) =>
    api.post('/assessment/create', assessmentData),
  getAssessments: () => api.get('/assessment/list'),
  getAssessmentResults: (assessmentId: string) =>
    api.get(`/assessment/${assessmentId}/results`),
};

export const parentAPI = {
  getChildProgress: (childId: string) =>
    api.get(`/parent/child/${childId}/progress`),
  getWeeklyReport: (childId: string, weekStart: string) =>
    api.get(`/parent/child/${childId}/report`, { params: { week_start: weekStart } }),
  getNotifications: () => api.get('/parent/notifications'),
  updateNotificationPreferences: (preferences: any) =>
    api.put('/parent/notification-preferences', preferences),
};

// Error handling utilities
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Loading state management
export const createLoadingState = () => {
  let loadingCount = 0;
  const listeners: ((loading: boolean) => void)[] = [];
  
  return {
    increment: () => {
      loadingCount++;
      listeners.forEach(listener => listener(true));
    },
    decrement: () => {
      loadingCount = Math.max(0, loadingCount - 1);
      if (loadingCount === 0) {
        listeners.forEach(listener => listener(false));
      }
    },
    subscribe: (listener: (loading: boolean) => void) => {
      listeners.push(listener);
      return () => {
        const index = listeners.indexOf(listener);
        if (index > -1) listeners.splice(index, 1);
      };
    },
    isLoading: () => loadingCount > 0,
  };
};

export const globalLoadingState = createLoadingState();

export default apiClient;