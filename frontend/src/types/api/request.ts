// ============================================================================
// API REQUEST TYPES
// ============================================================================
// API request parameter and body types

import { HttpMethod } from '../shared/enums';

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

export interface ApiRequestConfig {
  method: HttpMethod;
  url: string;
  params?: QueryParams;
  body?: unknown;
  headers?: Record<string, string>;
}
