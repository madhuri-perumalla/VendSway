// ============================================================================
// REGION DTO TYPES
// ============================================================================
// Data Transfer Objects for Region entity

import { UUID } from '../shared/base';

export interface RegionDTO {
  id: UUID;
  name: string;
  code: string;
  centerLat: number;
  centerLng: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRegionDTO {
  name: string;
  code: string;
  centerLat: number;
  centerLng: number;
  description: string;
}

export interface UpdateRegionDTO {
  name?: string;
  code?: string;
  centerLat?: number;
  centerLng?: number;
  description?: string;
}

export interface RegionResponseDTO extends RegionDTO {}

export interface RegionListDTO {
  regions: RegionDTO[];
  total: number;
}
