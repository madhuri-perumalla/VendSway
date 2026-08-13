import { api } from './api';
import { ApiResponse } from '@/types/api';

export type UserRole = 'ADMIN' | 'SELLER';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user';

/**
 * Authentication service with JWT tokens
 * Handles registration, login, token refresh, email verification, and password management
 */
export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    
    const authData = response.data.data;
    
    // Store tokens and user data
    localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    
    // Refresh token is stored in httpOnly cookie by backend
    
    return authData;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    
    const authData = response.data.data;
    
    // Store tokens and user data
    localStorage.setItem(ACCESS_TOKEN_KEY, authData.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
    
    // Refresh token is stored in httpOnly cookie by backend
    
    return authData;
  },

  /**
   * Refresh access token
   */
  refreshAccessToken: async (): Promise<string> => {
    const response = await api.post<ApiResponse<{ accessToken: string }>>(
      '/auth/refresh',
      {}
    );
    
    const { accessToken } = response.data.data;
    
    // Update access token
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    
    return accessToken;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await api.post<ApiResponse<{ success: boolean }>>('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Verify email
   */
  verifyEmail: async (token: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(
      '/auth/verify-email',
      { token }
    );
    
    return response.data.data;
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(
      '/auth/request-password-reset',
      { email }
    );
    
    return response.data.data;
  },

  /**
   * Reset password
   */
  resetPassword: async (token: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(
      '/auth/reset-password',
      { token, newPassword }
    );
    
    return response.data.data;
  },

  /**
   * Get current user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    const user = response.data.data.user;
    
    // Update stored user data
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.post<ApiResponse<{ success: boolean; message: string }>>(
      '/auth/change-password',
      { currentPassword, newPassword }
    );
    
    return response.data.data;
  },

  /**
   * Get stored access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  /**
   * Get stored user data
   */
  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    // @ts-ignore
    const token = this.getAccessToken();
    // @ts-ignore
    const user = this.getStoredUser();
    return !!(token && user);
  },

  /**
   * Get current user role
   */
  getCurrentUserRole: (): UserRole => {
    // @ts-ignore
    const user = this.getStoredUser();
    if (!user) return 'ADMIN';
    // @ts-ignore
    return user.role as UserRole;
  },

  /**
   * Check if user has specific role
   */
  hasRole: (role: UserRole): boolean => {
    return authService.getCurrentUserRole() === role;
  },

  /**
   * Check if user is admin
   */
  isAdmin: (): boolean => {
    return authService.hasRole('ADMIN');
  },

  /**
   * Check if user is seller
   */
  isSeller: (): boolean => {
    return authService.hasRole('SELLER');
  },

  /**
   * Check if user email is verified
   */
  isEmailVerified: (): boolean => {
    // @ts-ignore
    const user = this.getStoredUser();
    if (!user) return false;
    // @ts-ignore
    return user.isEmailVerified || false;
  },
};
