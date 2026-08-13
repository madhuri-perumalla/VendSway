// ============================================================================
// CATALOG GAP DTO TYPES
// ============================================================================
// Data Transfer Objects for CatalogGap entity

import { UUID } from '../shared/base';
import { GapPriority } from '../shared/enums';

export interface CatalogGapDTO {
  id: UUID;
  regionId: UUID;
  category: string;
  festivalId: UUID | null;
  productId: UUID | null;
  demand: number;
  available: number;
  gap: number;
  priority: GapPriority;
  identifiedAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCatalogGapDTO {
  regionId: UUID;
  category: string;
  festivalId: UUID | null;
  productId: UUID | null;
  demand: number;
  available: number;
  gap: number;
  priority: GapPriority;
  identifiedAt: string;
}

export interface UpdateCatalogGapDTO {
  regionId?: UUID;
  category?: string;
  festivalId?: UUID | null;
  productId?: UUID | null;
  demand?: number;
  available?: number;
  gap?: number;
  priority?: GapPriority;
  resolvedAt?: string | null;
}

export interface CatalogGapResponseDTO extends CatalogGapDTO {}

export interface CatalogGapListDTO {
  catalogGaps: CatalogGapDTO[];
  total: number;
}
