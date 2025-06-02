/**
 * API Service Configuration for AgroVault Frontend
 * Handles all HTTP requests to the backend API
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Type definitions for better type safety
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '10000');

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable cookies for authentication
});

// Request interceptor for adding auth tokens
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Unauthorized - clear auth token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden - show error message
      console.error('Access forbidden:', error.response.data);
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    } else if (error.code === 'ECONNABORTED') {
      // Timeout error
      console.error('Request timeout');
    } else if (!error.response) {
      // Network error
      console.error('Network error - check your connection');
    }
    
    return Promise.reject(error);
  }
);

// API Service Class
export class ApiService {
  // Health check
  static async healthCheck(): Promise<{ message: string }> {
    const response = await apiClient.get('/');
    return response.data;
  }

  // Authentication endpoints
  static async login(credentials: LoginCredentials): Promise<ApiResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }

  static async register(userData: RegisterData): Promise<ApiResponse> {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  }

  static async logout(): Promise<ApiResponse> {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  }

  // User management
  static async getUserProfile(): Promise<ApiResponse> {
    const response = await apiClient.get('/user/profile');
    return response.data;
  }

  static async updateUserProfile(userData: Record<string, any>): Promise<ApiResponse> {
    const response = await apiClient.put('/user/profile', userData);
    return response.data;
  }

  // Marketplace endpoints
  static async getProducts(params?: Record<string, any>): Promise<ApiResponse> {
    const response = await apiClient.get('/marketplace/products', { params });
    return response.data;
  }

  static async getProduct(id: string): Promise<ApiResponse> {
    const response = await apiClient.get(`/marketplace/products/${id}`);
    return response.data;
  }

  static async createProduct(productData: Record<string, any>): Promise<ApiResponse> {
    const response = await apiClient.post('/marketplace/products', productData);
    return response.data;
  }

  static async updateProduct(id: string, productData: Record<string, any>): Promise<ApiResponse> {
    const response = await apiClient.put(`/marketplace/products/${id}`, productData);
    return response.data;
  }

  static async deleteProduct(id: string): Promise<ApiResponse> {
    const response = await apiClient.delete(`/marketplace/products/${id}`);
    return response.data;
  }

  // Transaction endpoints
  static async getTransactions(params?: Record<string, any>): Promise<ApiResponse> {
    const response = await apiClient.get('/transactions', { params });
    return response.data;
  }

  static async createTransaction(transactionData: Record<string, any>): Promise<ApiResponse> {
    const response = await apiClient.post('/transactions', transactionData);
    return response.data;
  }

  // Analytics endpoints
  static async getDashboardData(): Promise<ApiResponse> {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  }

  static async getMarketStats(): Promise<ApiResponse> {
    const response = await apiClient.get('/analytics/market-stats');
    return response.data;
  }

  // Admin endpoints
  static async getUsers(params?: Record<string, any>): Promise<ApiResponse> {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  }

  static async updateUserStatus(userId: string, status: string): Promise<ApiResponse> {
    const response = await apiClient.put(`/admin/users/${userId}/status`, { status });
    return response.data;
  }

  static async getPlatformSettings(): Promise<ApiResponse> {
    const response = await apiClient.get('/admin/settings');
    return response.data;
  }

  static async updatePlatformSettings(settings: Record<string, any>): Promise<ApiResponse> {
    const response = await apiClient.put('/admin/settings', settings);
    return response.data;
  }
}

// Export the configured axios instance for custom requests
export { apiClient };

// Export API configuration
export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: API_TIMEOUT,
};