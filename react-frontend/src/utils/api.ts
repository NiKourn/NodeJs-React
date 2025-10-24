import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig, AxiosInstance } from 'axios';

// Create axios instance with base configuration
const api: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5500/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Always send cookies
});

// No need for request interceptor for Authorization header or localStorage

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Optionally handle unauthorized (e.g., redirect to login)
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
