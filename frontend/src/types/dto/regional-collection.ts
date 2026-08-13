// ============================================================================
// REGIONAL COLLECTION DTO TYPES
// ============================================================================
// Data Transfer Objects for RegionalCollection entity

import { UUID } from '../shared/base';

export interface RegionalCollectionDTO {
  id: UUID;
  name: string;
  regionId: UUID;
  festivalId: UUID | null;
  productIds: UUID[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegionalCollectionDTO {
  name: string;
  regionId: UUID;
  festivalId: UUID | null;
  productIds: UUID[];
  description: string;
  isActive: boolean;
}

export interface UpdateRegionalCollectionDTO {
  name?: string;
  regionId?: UUID;
  festivalId?: UUID | null;
  productIds?: UUID[];
  description?: string;
  isActive?: boolean;
}

export interface RegionalCollectionResponseDTO extends RegionalCollectionDTO {}

export interface RegionalCollectionListDTO {
  collections: RegionalCollectionDTO[];
  total: number;
}
