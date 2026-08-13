// ============================================================================
// REGIONAL INTELLIGENCE SERVICE
// ============================================================================
// Service for regional intelligence API calls

import { api } from './api';
import { ApiResponse } from '@/types/api';
import { Region, Festival, Textile, GIProduct, RegionalTrend } from '@/types/domain';

export const regionalIntelligenceService = {
  // Regions
  getRegions: (): Promise<any> => {
    return api.get<ApiResponse<Region[]>>('/intelligence/regions').then(res => res.data.data);
  },

  getRegionById: (id: string): Promise<any> => {
    return api.get<ApiResponse<Region>>(`/intelligence/regions/${id}`).then(res => res.data.data);
  },

  getRegionDetails: (id: string): Promise<any> => {
    return api.get<ApiResponse<Region>>(`/intelligence/regions/${id}`).then(res => res.data.data);
  },

  // Festivals
  getFestivals: (): Promise<any> => {
    return api.get<ApiResponse<Festival[]>>('/intelligence/festivals').then(res => res.data.data);
  },

  getFestivalById: (id: string): Promise<any> => {
    return api.get<ApiResponse<Festival>>(`/intelligence/festivals/${id}`).then(res => res.data.data);
  },

  getFestivalsByRegion: (regionId: string): Promise<any> => {
    return api.get<ApiResponse<Festival[]>>(`/intelligence/festivals?regionId=${regionId}`).then(res => res.data.data);
  },

  // Textiles
  getTextiles: (): Promise<any> => {
    return api.get<ApiResponse<Textile[]>>('/intelligence/textiles').then(res => res.data.data);
  },

  getTextileById: (id: string): Promise<any> => {
    return api.get<ApiResponse<Textile>>(`/intelligence/textiles/${id}`).then(res => res.data.data);
  },

  getTextilesByRegion: (regionId: string): Promise<any> => {
    return api.get<ApiResponse<Textile[]>>(`/intelligence/textiles?regionId=${regionId}`).then(res => res.data.data);
  },

  // GI Products
  getGIProducts: (): Promise<any> => {
    return api.get<ApiResponse<GIProduct[]>>('/intelligence/gi-products').then(res => res.data.data);
  },

  getGIProductById: (id: string): Promise<any> => {
    return api.get<ApiResponse<GIProduct>>(`/intelligence/gi-products/${id}`).then(res => res.data.data);
  },

  getGIProductsByRegion: (regionId: string): Promise<any> => {
    return api.get<ApiResponse<GIProduct[]>>(`/intelligence/gi-products?regionId=${regionId}`).then(res => res.data.data);
  },

  // Regional Trends
  getRegionalTrends: (): Promise<any> => {
    return api.get<ApiResponse<RegionalTrend[]>>('/intelligence/trends').then(res => res.data.data);
  },

  getRegionalTrendById: (id: string): Promise<any> => {
    return api.get<ApiResponse<RegionalTrend>>(`/intelligence/trends/${id}`).then(res => res.data.data);
  },

  getRegionalTrendsByRegion: (regionId: string): Promise<any> => {
    return api.get<ApiResponse<RegionalTrend[]>>(`/intelligence/trends?regionId=${regionId}`).then(res => res.data.data);
  },
};
