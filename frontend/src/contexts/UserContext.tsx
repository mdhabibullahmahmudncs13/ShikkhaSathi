import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/apiClient';
import { logger } from '../services/logger';

interface User {
  id: string;
  email: string;
  full_name: string;
  first_name?: string;
  last_name?: string;
  grade?: number;
  medium?: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      
      // Store user ID for other API calls
      localStorage.setItem('user_id', userData.id);
      
      logger.info('User data loaded successfully', {
        userId: userData.id,
        name: userData.full_name,
        role: userData.role
      });
      
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to load user data';
      setError(errorMessage);
      logger.error('Failed to load user data', err);
      
      // If token is invalid, clear it
      if (err.message?.includes('401') || err.message?.includes('unauthorized')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    refreshUser: fetchUser,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};