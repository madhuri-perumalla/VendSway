// ============================================================================
// API RESPONSE TYPES
// ============================================================================
// These types define the structure of API responses from the backend

import { PaginationMeta } from './shared';

// ============================================================================
// GENERIC API RESPONSE
// ============================================================================

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

// ============================================================================
// API REQUEST TYPES
// ============================================================================

export interface ApiRequest {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  body?: unknown;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filter?: Record<string, unknown>;
}

// ============================================================================
// API RESPONSE WRAPPERS
// ============================================================================

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

// ============================================================================
// BULK OPERATION RESPONSES
// ============================================================================

export interface BulkOperationResponse {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
  message?: string;
  timestamp: string;
}

export interface BulkDeleteResponse extends BulkOperationResponse {}
export interface BulkUpdateResponse extends BulkOperationResponse {}
export interface BulkCreateResponse extends BulkOperationResponse {
  createdIds: string[];
}

// ============================================================================
// VALIDATION ERROR RESPONSE
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: ValidationError[];
}
