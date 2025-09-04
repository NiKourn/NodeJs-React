import { RegisterRequest, AuthResponse } from '../types/auth';
import api from '../utils/api';
import { secureStorage } from '../utils/secureStorage';

const AUTH_KEY = 'authUser';

export const authService = {
  // Login user
  async login(identifier: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', { identifier, password });
      const { user, token } = response.data;
      // Store user and token in secure storage under one key
      const authUser = { ...user, token };
      secureStorage.setItem(AUTH_KEY, authUser);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Register user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', userData);
      const { user, token } = response.data;

      // Store user and token in secure storage under one key
      const authUser = { ...user, token };
      secureStorage.setItem(AUTH_KEY, authUser);

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/request-password-reset', { email });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  },

  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await api.post('/auth/verify-token', { token });
      return response.data.valid;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  },

  // Logout user
  logout(): void {
    secureStorage.removeItem(AUTH_KEY);
  },

  // Get current user from secure storage
  getCurrentUser() {
    return secureStorage.getItem(AUTH_KEY);
  },

  // Get token from secure storage
  getToken(): string | null {
    const user = secureStorage.getItem(AUTH_KEY);
    return user?.token || null;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  },
};
