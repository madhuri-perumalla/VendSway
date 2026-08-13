// ============================================================================
// API SORTING TYPES
// ============================================================================
// Sorting types for API queries

export interface SortConfig {
  field: string;
  direction: 'ASC' | 'DESC';
}

export interface SortRequest {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface MultiSortRequest {
  sorts: SortConfig[];
}

export interface SortOption {
  label: string;
  value: string;
  direction?: 'ASC' | 'DESC';
}

// Common sort fields for different entities
export const RegionSortFields = ['name', 'code', 'createdAt'] as const;
export const FestivalSortFields = ['name', 'date', 'createdAt'] as const;
export const SellerSortFields = ['businessName', 'rating', 'createdAt'] as const;
export const ProductSortFields = ['name', 'price', 'createdAt'] as const;
export const CatalogGapSortFields = ['gap', 'priority', 'identifiedAt'] as const;
