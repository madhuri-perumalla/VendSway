// ============================================================================
// API FILTER TYPES
// ============================================================================
// Filter types for API queries

import { UUID } from '../shared/base';
import { ProductCategory, GapPriority, SellerStatus, ApplicationStatus } from '../shared/enums';

export interface RegionFilter {
  regionId?: UUID;
  code?: string;
  name?: string;
}

export interface FestivalFilter {
  regionId?: UUID;
  festivalId?: UUID;
  dateFrom?: string;
  dateTo?: string;
}

export interface TextileFilter {
  regionId?: UUID;
  giTagged?: boolean;
}

export interface ProductFilter {
  regionId?: UUID;
  category?: ProductCategory;
  sellerId?: UUID;
  giTagged?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface SellerFilter {
  regionId?: UUID;
  giTagged?: boolean;
  msme?: boolean;
  status?: SellerStatus;
  category?: string;
  minRating?: number;
  maxRating?: number;
}

export interface CatalogGapFilter {
  regionId?: UUID;
  category?: string;
  festivalId?: UUID;
  priority?: GapPriority;
  resolved?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface DemandSignalFilter {
  regionId?: UUID;
  category?: string;
  festivalId?: UUID;
  seasonality?: string;
  period?: string;
}

export interface ApplicationFilter {
  status?: ApplicationStatus;
  regionId?: UUID;
  dateFrom?: string;
  dateTo?: string;
}

export interface CollectionFilter {
  regionId?: UUID;
  festivalId?: UUID;
  isActive?: boolean;
  type?: string;
}

export interface AnalyticsFilter {
  regionId?: UUID;
  metricType?: string;
  period?: string;
  dateFrom?: string;
  dateTo?: string;
}
