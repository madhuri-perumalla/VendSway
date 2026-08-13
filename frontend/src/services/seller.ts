// ============================================================================
// SELLER SERVICE
// ============================================================================
// Service for seller API calls

import { api } from './api';
import { ApiResponse } from '@/types/api';

export const sellerService = {
  // Get All Sellers
  getSellers: async (params?: { regionId?: string; category?: string; giTagged?: boolean; msme?: boolean }): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/sellers', { params }).then(res => res.data);
  },

  // Get Seller Details
  getSellerById: async (id: string): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>(`/sellers/${id}`).then(res => res.data);
  },

  // Match Sellers to Gap
  matchSellers: async (regionId: string, category?: string, limit: number = 10): Promise<ApiResponse<any>> => {
    if (category) {
      return api.post<ApiResponse<any>>('/sellers/match', { regionId, category, limit }).then(res => res.data);
    }
    return api.get<ApiResponse<any>>(`/sellers/match/${regionId}`).then(res => res.data);
  },

  // Get Sellers by Region
  getSellersByRegion: async (regionId: string): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>(`/sellers/region/${regionId}`).then(res => res.data);
  },

  // Get GI Tagged Sellers
  getGITaggedSellers: async (): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/sellers', { params: { giTagged: true } }).then(res => res.data);
  },

  // Get MSME Sellers
  getMSMESellers: async (): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/sellers', { params: { msme: true } }).then(res => res.data);
  },

  // Seller Applications
  getSellerApplications: async (): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/sellers/applications').then(res => res.data);
  },

  getSellerApplicationById: async (id: string): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>(`/sellers/application/${id}`).then(res => res.data);
  },

  // Register Seller
  registerSeller: async (data: any): Promise<ApiResponse<any>> => {
    return api.post<ApiResponse<any>>('/sellers/register', data).then(res => res.data);
  },

  // Get application status by email
  getApplicationStatusByEmail: async (email: string): Promise<ApiResponse<any>> => {
    return api.get<ApiResponse<any>>('/sellers/applications/status', { params: { email } }).then(res => res.data);
  },

  // Approve Application
  approveApplication: async (id: string): Promise<ApiResponse<any>> => {
    return api.put<ApiResponse<any>>(`/sellers/applications/${id}/approve`).then(res => res.data);
  },

  // Reject Application
  rejectApplication: async (id: string): Promise<ApiResponse<any>> => {
    return api.put<ApiResponse<any>>(`/sellers/applications/${id}/reject`).then(res => res.data);
  },

  // Withdraw Application (seller-initiated)
  withdrawApplication: async (sellerId: string): Promise<ApiResponse<any>> => {
    return api.patch<ApiResponse<any>>(`/sellers/${sellerId}/withdraw`).then(res => res.data);
  },

  // Deactivate Seller Account
  deactivateSellerAccount: async (sellerId: string): Promise<ApiResponse<any>> => {
    return api.patch<ApiResponse<any>>(`/sellers/${sellerId}/deactivate`).then(res => res.data);
  },
};
