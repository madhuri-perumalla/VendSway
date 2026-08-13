// ============================================================================
// CATALOG GAP SERVICE
// ============================================================================
// Service for catalog gap API calls

import { api } from './api';
import { ApiResponse } from '@/types/api';

export const catalogGapService = {
  // Get Catalog Gaps
  getCatalogGaps: async (params?: { regionId?: string; category?: string; festivalId?: string; priority?: string }): Promise<any> => {
    return api.get<ApiResponse<any>>('/gaps', { params }).then(res => res.data.data);
  },

  // Get Gap Details
  getCatalogGapById: async (id: string): Promise<any> => {
    return api.get<ApiResponse<any>>(`/gaps/${id}`).then(res => res.data.data);
  },

  // Calculate Gaps
  calculateGaps: async (data: { regionId: string; category?: string }): Promise<any> => {
    return api.post<ApiResponse<any>>('/gaps/calculate', data).then(res => res.data.data);
  },

  // Get Gaps by Region
  getCatalogGapsByRegion: async (regionId: string): Promise<any> => {
    return api.get<ApiResponse<any>>('/gaps', { params: { regionId } }).then(res => res.data.data);
  },

  // Get High Priority Gaps
  getHighPriorityGaps: async (): Promise<any> => {
    return api.get<ApiResponse<any>>('/gaps', { params: { priority: 'HIGH' } }).then(res => res.data.data);
  },
};
