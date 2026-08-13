// ============================================================================
// API RESPONSE TYPES
// ============================================================================
// Generic API response wrapper types

import { PaginationMeta } from '../shared';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  timestamp: string;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
  timestamp: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  timestamp: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

export type Response<T> = SuccessResponse<T> | ErrorResponse;
