// ============================================================================
// PRODUCT DOMAIN TYPES
// ============================================================================
// Domain models for Product feature

import { BaseEntity } from '../shared/common';
import { Region } from './regional-intelligence';
import { Seller } from './seller';
import { Textile } from './regional-intelligence';

export interface Product extends BaseEntity {
  id: string;
  name: string;
  category: string;
  regionId: string | null;
  sellerId: string;
  textileIds: string[];
  price: number;
  giTagged: boolean;
  description: string;
  imageUrl: string;
  available: boolean;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

// Relationship types
export interface ProductWithRelations extends Product {
  region?: Region;
  seller?: Seller;
  textiles?: Textile[];
}
