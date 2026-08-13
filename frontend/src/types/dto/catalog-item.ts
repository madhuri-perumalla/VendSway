// ============================================================================
// CATALOG ITEM DTO TYPES
// ============================================================================
// Data Transfer Objects for CatalogItem entity

import { UUID } from '../shared/base';
import { ProductCategory } from '../shared/enums';

export interface CatalogItemDTO {
  id: UUID;
  name: string;
  category: ProductCategory;
  regionId: UUID | null;
  description: string;
  available: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCatalogItemDTO {
  name: string;
  category: ProductCategory;
  regionId: UUID | null;
  description: string;
  available: boolean;
  stock: number;
}

export interface UpdateCatalogItemDTO {
  name?: string;
  category?: ProductCategory;
  regionId?: UUID | null;
  description?: string;
  available?: boolean;
  stock?: number;
}

export interface CatalogItemResponseDTO extends CatalogItemDTO {}

export interface CatalogItemListDTO {
  catalogItems: CatalogItemDTO[];
  total: number;
}
