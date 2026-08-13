// ============================================================================
// PRODUCT DTO TYPES
// ============================================================================
// Data Transfer Objects for Product entity

import { UUID } from '../shared/base';

export interface ProductDTO {
  id: UUID;
  name: string;
  category: string;
  regionId: UUID | null;
  sellerId: UUID;
  textileIds: UUID[];
  price: number;
  giTagged: boolean;
  description: string;
  imageUrl: string;
  available: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDTO {
  name: string;
  category: string;
  regionId: UUID | null;
  sellerId: UUID;
  textileIds: UUID[];
  price: number;
  giTagged: boolean;
  description: string;
  imageUrl: string;
  available: boolean;
  stock: number;
}

export interface UpdateProductDTO {
  name?: string;
  category?: string;
  regionId?: UUID | null;
  sellerId?: UUID;
  textileIds?: UUID[];
  price?: number;
  giTagged?: boolean;
  description?: string;
  imageUrl?: string;
  available?: boolean;
  stock?: number;
}

export interface ProductResponseDTO extends ProductDTO {}

export interface ProductListDTO {
  products: ProductDTO[];
  total: number;
}
