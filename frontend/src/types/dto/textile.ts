// ============================================================================
// TEXTILE DTO TYPES
// ============================================================================
// Data Transfer Objects for Textile entity

import { UUID } from '../shared/base';

export interface TextileDTO {
  id: UUID;
  name: string;
  regionId: UUID;
  description: string;
  giTagged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTextileDTO {
  name: string;
  regionId: UUID;
  description: string;
  giTagged: boolean;
}

export interface UpdateTextileDTO {
  name?: string;
  regionId?: UUID;
  description?: string;
  giTagged?: boolean;
}

export interface TextileResponseDTO extends TextileDTO {}

export interface TextileListDTO {
  textiles: TextileDTO[];
  total: number;
}
