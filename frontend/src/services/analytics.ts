// ============================================================================
// ANALYTICS SERVICE
// ============================================================================
// Service for analytics API calls

import { api } from './api';
import { ApiResponse } from '@/types/api';

export const analyticsService = {
  // Demand Analytics
  getDemandAnalytics: async (params?: { regionId?: string; period?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/demand', { params }).then(res => res.data);
  },

  // Gap Analytics
  getGapAnalytics: async (params?: { regionId?: string; priority?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/gaps', { params }).then(res => res.data);
  },

  // Seller Analytics
  getSellerAnalytics: async (params?: { regionId?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/sellers', { params }).then(res => res.data);
  },

  // Dashboard Overview
  getDashboardOverview: async (params?: { regionId?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/dashboard', { params }).then(res => res.data);
  },

  // Recent Activity (notifications + audit logs)
  getRecentActivity: async (params?: { regionId?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/recent-activity', { params }).then(res => res.data);
  },

  // Regional Comparison
  getRegionalComparison: async (params?: { regionIds?: string[] }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/regional-comparison', { params }).then(res => res.data);
  },

  // Get unique categories
  getCategories: async (): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/categories').then(res => res.data);
  },

  // Get unique festivals
  getFestivals: async (): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/festivals').then(res => res.data);
  },

  // Performance Tracking - Conversion Metrics
  getConversionMetrics: async (params?: { period?: string; regionId?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/conversions', { params }).then(res => res.data);
  },

  // Performance Tracking - Revenue Metrics
  getRevenueMetrics: async (params?: { period?: string; regionId?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/revenue', { params }).then(res => res.data);
  },

  // Performance Tracking - Customer Behavior
  getCustomerBehavior: async (params?: { period?: string; regionId?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/customer-behavior', { params }).then(res => res.data);
  },

  // Performance Tracking - Product Performance
  getProductPerformance: async (params?: { period?: string; regionId?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/product-performance', { params }).then(res => res.data);
  },

  // Performance Tracking - Seller Performance
  getSellerPerformance: async (params?: { period?: string; regionId?: string }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/analytics/seller-performance', { params }).then(res => res.data);
  },

  // Track custom event
  trackEvent: async (eventName: string, eventData?: any): Promise<void> => {
    try {
      await api.post('/analytics/track', { eventName, eventData });
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  },

  // Track page view
  trackPageView: async (pageName: string, pageData?: any): Promise<void> => {
    try {
      await api.post('/analytics/page-view', { pageName, pageData });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  },
};
