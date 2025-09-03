import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios'

// Create axios instance with base configuration
const api = axios.create({
	baseURL: 'http://localhost:5500/api',
	headers: {
		'Content-Type': 'application/json',
	},
})

// Request interceptor to add auth token
api.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem('authToken')
		if (token) {
			// Type-safe way to set the Authorization header
			;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
		}
		return config
	},
	(error: AxiosError) => {
		return Promise.reject(error)
	}
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		if (error.response?.status === 401) {
			// Token expired or invalid
			localStorage.removeItem('authToken')
			localStorage.removeItem('user')
			// window.location.href = '/login'
		}
		return Promise.reject(error)
	}
)

export default api
