import { RegisterRequest, AuthResponse } from '../types/auth';
import api from '../utils/api';

export const authService = {
  // Login user
  async login(identifier: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', {
        identifier,
        password,
      });
      // The backend sets the cookie; just return user info
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw Error(error.response.data.message || error.response.data);
      }
      throw Error('Login failed');
    }
  },

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      // The backend sets the cookie; just return user info
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Could not connect to server. Please try again later.');
      }
      throw new Error('Registration failed');
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/request-password-reset', {
        email,
        app_url: `${process.env.REACT_APP_FRONTEND_URL}/reset-password`,
      });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Could not connect to server. Please try again later.');
      }
      throw new Error('Password reset request failed');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Could not connect to server. Please try again later.');
      }
      throw new Error('Password reset failed');
    }
  },

  // No need to verify token client-side; rely on backend

  // Logout user
  async logout(): Promise<void> {
    await api.post('/auth/logout'); // Backend should clear the cookie
  },

  // Get current user info from backend
  async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  },

  // Check if user is authenticated by calling backend
  isAuthenticated(): boolean {
    return document.cookie.split(';').some((c) => c.trim().startsWith('auth_token'));
  },
  // async isAuthenticated(): Promise<boolean> {
  //   try {
  //     await api.get('/auth/me');
  //     return true;
  //   } catch {
  //     return false;
  //   }
  // },
};
