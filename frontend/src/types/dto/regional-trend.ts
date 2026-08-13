// ============================================================================
// REGIONAL TREND DTO TYPES
// ============================================================================
// Data Transfer Objects for RegionalTrend entity

import { UUID } from '../shared/base';
import { ProductCategory } from '../shared/enums';

export interface RegionalTrendDTO {
  id: UUID;
  regionId: UUID;
  category: ProductCategory;
  trendScore: number;
  period: string;
  source: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegionalTrendDTO {
  regionId: UUID;
  category: ProductCategory;
  trendScore: number;
  period: string;
  source: string;
  description: string;
}

export interface UpdateRegionalTrendDTO {
  regionId?: UUID;
  category?: ProductCategory;
  trendScore?: number;
  period?: string;
  source?: string;
  description?: string;
}

export interface RegionalTrendResponseDTO extends RegionalTrendDTO {}

export interface RegionalTrendListDTO {
  trends: RegionalTrendDTO[];
  total: number;
}
