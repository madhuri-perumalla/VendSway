// ============================================================================
// PRODUCT SERVICE
// ============================================================================

import { api } from './api';
import { ApiResponse } from '@/types/api';

export const productService = {
  // ── Seller product management ──────────────────────────────────────────────

  /** GET all products for a seller with search, filters, pagination */
  getProductsBySeller: (sellerId: string, params?: { search?: string; status?: string; available?: boolean; page?: number; limit?: number }): Promise<ApiResponse<any>> =>
    api.get<ApiResponse<any>>(`/products/seller/${sellerId}`, { params }).then(r => r.data),

  /** GET single product */
  getProductById: (id: string): Promise<ApiResponse<any>> =>
    api.get<ApiResponse<any>>(`/products/${id}`).then(r => r.data),

  /** POST create product (status auto-set to PENDING) */
  createProduct: (data: any): Promise<ApiResponse<any>> =>
    api.post<ApiResponse<any>>('/products', data).then(r => r.data),

  /** PATCH update editable fields */
  updateProduct: (id: string, data: any): Promise<ApiResponse<any>> =>
    api.patch<ApiResponse<any>>(`/products/${id}`, data).then(r => r.data),

  /** DELETE product */
  deleteProduct: (id: string): Promise<ApiResponse<any>> =>
    api.delete<ApiResponse<any>>(`/products/${id}`).then(r => r.data),

  /** PATCH resubmit rejected product → PENDING */
  resubmitProduct: (id: string): Promise<ApiResponse<any>> =>
    api.patch<ApiResponse<any>>(`/products/${id}/resubmit`).then(r => r.data),

  // ── Admin product review ───────────────────────────────────────────────────

  /** GET all pending products (admin) */
  getPendingProducts: (): Promise<ApiResponse<any>> =>
    api.get<ApiResponse<any>>('/products/pending').then(r => r.data),

  /** PUT approve product */
  approveProduct: (id: string): Promise<ApiResponse<any>> =>
    api.put<ApiResponse<any>>(`/products/${id}/approve`).then(r => r.data),

  /** PUT reject product with optional feedback */
  rejectProduct: (id: string, feedback?: string): Promise<ApiResponse<any>> =>
    api.put<ApiResponse<any>>(`/products/${id}/reject`, { feedback }).then(r => r.data),

  // ── Discovery ──────────────────────────────────────────────────────────────

  /** GET products by region */
  getProductsByRegion: (regionId: string): Promise<ApiResponse<any>> =>
    api.get<ApiResponse<any>>(`/products/region/${regionId}`).then(r => r.data),
};
