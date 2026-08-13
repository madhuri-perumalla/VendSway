// ============================================================================
// FESTIVAL DTO TYPES
// ============================================================================
// Data Transfer Objects for Festival entity

import { UUID } from '../shared/base';

export interface FestivalDTO {
  id: UUID;
  name: string;
  regionId: UUID;
  date: string;
  description: string;
  fashionRelevance: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFestivalDTO {
  name: string;
  regionId: UUID;
  date: string;
  description: string;
  fashionRelevance: string;
}

export interface UpdateFestivalDTO {
  name?: string;
  regionId?: UUID;
  date?: string;
  description?: string;
  fashionRelevance?: string;
}

export interface FestivalResponseDTO extends FestivalDTO {}

export interface FestivalListDTO {
  festivals: FestivalDTO[];
  total: number;
}
