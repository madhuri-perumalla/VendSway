// ============================================================================
// CATALOG GAP DOMAIN TYPES
// ============================================================================
// Domain models for Catalog Gap feature

import { BaseEntity } from '../shared/common';
import { GapPriority, Seasonality } from '../shared/enums';
import { Region, Festival } from './regional-intelligence';
import { Product } from './product';

export interface CatalogItem extends BaseEntity {
  id: string;
  name: string;
  category: string;
  regionId: string | null;
  description: string;
  available: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface DemandSignal extends BaseEntity {
  id: string;
  regionId: string;
  category: string;
  festivalId: string | null;
  demandScore: number;
  seasonality: Seasonality;
  source: string;
  period: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogGap extends BaseEntity {
  id: string;
  regionId: string;
  category: string;
  festivalId: string | null;
  productId: string | null;
  demand: number;
  available: number;
  gap: number;
  priority: GapPriority;
  identifiedAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Relationship types
export interface DemandSignalWithRelations extends DemandSignal {
  region?: Region;
  festival?: Festival;
}

export interface CatalogGapWithRelations extends CatalogGap {
  region?: Region;
  festival?: Festival;
  product?: Product;
}
