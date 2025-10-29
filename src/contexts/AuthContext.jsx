import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { extractErrorMessage, handleApiCall } from '@/utils/apiHelpers';
import { handleError } from '@/utils/errorHandling';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const response = await api.get('/api/auth/me');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    const result = await handleApiCall(
      () => api.post('/api/auth/login', { email, password }),
      {
        showErrorToast: false, // We'll handle this in the component
        fallbackMessage: 'Login failed'
      }
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data } = result;
    
    // Validate response data
    if (!data.token) {
      throw new Error('No token received from server');
    }
    if (!data.user) {
      throw new Error('No user data received from server');
    }
    
    // Store authentication data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    
    return data;
  };

  const register = async (email, password, name, username, confirmPassword) => {
    const result = await handleApiCall(
      () => api.post('/api/auth/register', { email, password, name, username, confirmPassword }),
      {
        showErrorToast: false, // We'll handle this in the component
        fallbackMessage: 'Registration failed'
      }
    );

    if (!result.success) {
      throw new Error(result.error);
    }

    const { data } = result;
    
    // Store authentication data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    
    return data;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (error) {
      // Logout should succeed even if API call fails
      handleError(error, {
        showToast: false,
        severity: 'low'
      });
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  const updateUser = async (updatedUserData) => {
    // Update local state immediately for better UX
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));

    // Sync with server in background
    try {
      const response = await api.get('/api/auth/me');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      // If sync fails, keep the local update but log the error
      handleError(error, {
        showToast: false,
        severity: 'medium',
        context: 'user_sync'
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      setUser, 
      updateUser,
      login, 
      register, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};