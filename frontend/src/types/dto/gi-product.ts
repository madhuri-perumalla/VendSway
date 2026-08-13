// ============================================================================
// GI PRODUCT DTO TYPES
// ============================================================================
// Data Transfer Objects for GIProduct entity

import { UUID } from '../shared/base';
import { ProductCategory } from '../shared/enums';

export interface GIProductDTO {
  id: UUID;
  name: string;
  textileId: UUID;
  regionId: UUID;
  category: ProductCategory;
  description: string;
  registrationNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGIProductDTO {
  name: string;
  textileId: UUID;
  regionId: UUID;
  category: ProductCategory;
  description: string;
  registrationNumber: string;
}

export interface UpdateGIProductDTO {
  name?: string;
  textileId?: UUID;
  regionId?: UUID;
  category?: ProductCategory;
  description?: string;
  registrationNumber?: string;
}

export interface GIProductResponseDTO extends GIProductDTO {}

export interface GIProductListDTO {
  giProducts: GIProductDTO[];
  total: number;
}
