// ============================================================================
// REGIONAL INTELLIGENCE DOMAIN TYPES
// ============================================================================
// Domain models for Regional Intelligence feature

import { BaseEntity } from '../shared/common';
import { ProductCategory } from '../shared/enums';

export interface Region extends BaseEntity {
  id: string;
  name: string;
  code: string;
  centerLat: number;
  centerLng: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Festival extends BaseEntity {
  id: string;
  name: string;
  regionId: string;
  date: string;
  description: string;
  fashionRelevance: string;
  createdAt: string;
  updatedAt: string;
}

export interface Textile extends BaseEntity {
  id: string;
  name: string;
  regionId: string;
  description: string;
  giTagged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GIProduct extends BaseEntity {
  id: string;
  name: string;
  textileId: string;
  regionId: string;
  category: ProductCategory;
  description: string;
  registrationNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegionalTrend extends BaseEntity {
  id: string;
  regionId: string;
  category: ProductCategory;
  trendScore: number;
  period: string;
  source: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Relationship types
export interface RegionWithRelations extends Region {
  textiles?: Textile[];
  festivals?: Festival[];
}

export interface FestivalWithRelations extends Festival {
  region?: Region;
}

export interface TextileWithRelations extends Textile {
  region?: Region;
  giProducts?: GIProduct[];
}
