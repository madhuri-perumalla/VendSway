import { api } from './api';
import { ApiResponse } from '@/types/api';

export const potentialSellerService = {
  // Dashboard statistics
  getStatistics: (): Promise<any> => {
    return api.get<ApiResponse<any>>('/admin/potential-sellers/statistics').then(res => res.data.data);
  },

  // Get all potential sellers
  getPotentialSellers: (params?: any): Promise<any> => {
    return api.get<ApiResponse<any>>('/admin/potential-sellers', { params }).then(res => res.data.data);
  },

  // Get potential seller by ID
  getPotentialSellerById: (id: string): Promise<any> => {
    return api.get<ApiResponse<any>>(`/admin/potential-sellers/${id}`).then(res => res.data.data);
  },

  // Create potential seller
  createPotentialSeller: (data: any): Promise<any> => {
    return api.post<ApiResponse<any>>('/admin/potential-sellers', data).then(res => res.data.data);
  },

  // Update potential seller
  updatePotentialSeller: (id: string, data: any): Promise<any> => {
    return api.put<ApiResponse<any>>(`/admin/potential-sellers/${id}`, data).then(res => res.data.data);
  },

  // Delete potential seller
  deletePotentialSeller: (id: string): Promise<any> => {
    return api.delete<ApiResponse<any>>(`/admin/potential-sellers/${id}`).then(res => res.data.data);
  },

  // Send invitation
  sendInvitation: (id: string, method: string, notes?: string): Promise<any> => {
    return api.post<ApiResponse<any>>(`/admin/potential-sellers/${id}/invite`, { method, notes }).then(res => res.data.data);
  },

  // Mark as interested
  markAsInterested: (id: string): Promise<any> => {
    return api.post<ApiResponse<any>>(`/admin/potential-sellers/${id}/interested`).then(res => res.data.data);
  },

  // Archive potential seller
  archivePotentialSeller: (id: string): Promise<any> => {
    return api.post<ApiResponse<any>>(`/admin/potential-sellers/${id}/archive`).then(res => res.data.data);
  },

  // Search potential sellers
  searchPotentialSellers: (query: string): Promise<any> => {
    return api.get<ApiResponse<any>>('/admin/potential-sellers/search', { params: { q: query } }).then(res => res.data.data);
  },

  // Import potential sellers
  importPotentialSellers: (file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<ApiResponse<any>>('/admin/potential-sellers/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data.data);
  },

  // Get import history
  getImportHistory: (): Promise<any> => {
    return api.get<ApiResponse<any>>('/admin/potential-sellers/import/history').then(res => res.data.data);
  },

  // Get import template
  getImportTemplate: (): Promise<any> => {
    return api.get<ApiResponse<any>>('/admin/potential-sellers/import/template').then(res => res.data.data);
  },

  // Get all invitations
  getInvitations: (): Promise<any> => {
    return api.get<ApiResponse<any>>('/admin/potential-sellers/invitations/all').then(res => res.data.data);
  },

  // Get invitations by potential seller
  getInvitationsByPotentialSeller: (id: string): Promise<any> => {
    return api.get<ApiResponse<any>>(`/admin/potential-sellers/${id}/invitations`).then(res => res.data.data);
  },
};
