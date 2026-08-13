// ============================================================================
// API PAGINATION TYPES
// ============================================================================
// Pagination-related types for API requests and responses

import { UUID } from '../shared/base';

export interface PaginationRequest {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CursorPagination {
  cursor: string;
  limit: number;
}

export interface OffsetPagination {
  offset: number;
  limit: number;
}

export interface IdPagination {
  lastId?: UUID;
  limit: number;
}
