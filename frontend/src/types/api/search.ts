// ============================================================================
// API SEARCH TYPES
// ============================================================================
// Search types for API queries

export interface SearchQuery {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
}

export interface SearchRequest {
  query: string;
  page?: number;
  limit?: number;
  filters?: Record<string, unknown>;
}

export interface SearchResult<T> {
  id: string;
  score: number;
  highlights?: Record<string, string[]>;
  data: T;
}

export interface SearchResponse<T> {
  results: SearchResult<T>[];
  total: number;
  page: number;
  limit: number;
  query: string;
}

export interface AutocompleteRequest {
  query: string;
  limit?: number;
  field?: string;
}

export interface AutocompleteResponse {
  suggestions: string[];
  query: string;
}
