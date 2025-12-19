import { useState, useEffect, useCallback } from 'react';
import { globalLoadingState } from '../services/apiClient';

// Generic API hook for handling loading, error, and data states
export function useAPI<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = [],
  options: {
    immediate?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      globalLoadingState.increment();
      
      const result = await apiCall();
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      if (options.onError) {
        options.onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
      globalLoadingState.decrement();
    }
  }, dependencies);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, dependencies);

  const refetch = useCallback(() => execute(), [execute]);

  return {
    data,
    loading,
    error,
    execute,
    refetch,
  };
}

// Mutation hook for POST/PUT/DELETE operations
export function useMutation<T, P = any>(
  apiCall: (params: P) => Promise<T>,
  options: {
    onSuccess?: (data: T, params: P) => void;
    onError?: (error: Error, params: P) => void;
  } = {}
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (params: P) => {
    try {
      setLoading(true);
      setError(null);
      globalLoadingState.increment();
      
      const result = await apiCall(params);
      
      if (options.onSuccess) {
        options.onSuccess(result, params);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      
      if (options.onError) {
        options.onError(error, params);
      }
      
      throw error;
    } finally {
      setLoading(false);
      globalLoadingState.decrement();
    }
  }, [apiCall, options]);

  return {
    mutate,
    loading,
    error,
  };
}

// Global loading state hook
export function useGlobalLoading() {
  const [loading, setLoading] = useState(globalLoadingState.isLoading());

  useEffect(() => {
    const unsubscribe = globalLoadingState.subscribe(setLoading);
    return unsubscribe;
  }, []);

  return loading;
}

// Specific hooks for common operations
export function useDashboardData() {
  const { dashboardAPI } = require('../services/apiClient');
  
  return useAPI(
    () => dashboardAPI.getDashboardData(),
    [],
    {
      onError: (error) => {
        console.error('Failed to load dashboard data:', error);
      }
    }
  );
}

export function useQuizData(quizId: string) {
  const { quizAPI } = require('../services/apiClient');
  
  return useAPI(
    () => quizAPI.getQuiz(quizId),
    [quizId],
    {
      immediate: !!quizId,
      onError: (error) => {
        console.error('Failed to load quiz:', error);
      }
    }
  );
}

export function useQuizSubmission() {
  const { quizAPI } = require('../services/apiClient');
  
  return useMutation(
    ({ quizId, answers }: { quizId: string; answers: any[] }) =>
      quizAPI.submitQuiz(quizId, answers),
    {
      onSuccess: (result) => {
        console.log('Quiz submitted successfully:', result);
      },
      onError: (error) => {
        console.error('Failed to submit quiz:', error);
      }
    }
  );
}

export function useChatMessage() {
  const { chatAPI } = require('../services/apiClient');
  
  return useMutation(
    ({ message, sessionId }: { message: string; sessionId?: string }) =>
      chatAPI.sendMessage(message, sessionId),
    {
      onError: (error) => {
        console.error('Failed to send message:', error);
      }
    }
  );
}

export function useAuth() {
  const { authAPI } = require('../services/apiClient');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useMutation(
    ({ email, password }: { email: string; password: string }) =>
      authAPI.login(email, password),
    {
      onSuccess: (data) => {
        localStorage.setItem('access_token', (data as any).access_token);
        localStorage.setItem('refresh_token', (data as any).refresh_token);
        setUser((data as any).user);
        setIsAuthenticated(true);
      }
    }
  );

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const userData = await authAPI.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        logout();
      }
    }
  }, [logout]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    login: login.mutate,
    logout,
    loginLoading: login.loading,
    loginError: login.error,
  };
}

// Error boundary hook
export function useErrorHandler() {
  const [errors, setErrors] = useState<Error[]>([]);

  const addError = useCallback((error: Error) => {
    setErrors(prev => [...prev, error]);
  }, []);

  const removeError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
  };
}