// ============================================================================
// SELLER DTO TYPES
// ============================================================================
// Data Transfer Objects for Seller entity

import { UUID } from '../shared/base';
import { SellerStatus } from '../shared/enums';

export interface SellerDTO {
  id: UUID;
  userId: UUID;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  regionId: UUID;
  giTagged: boolean;
  msme: boolean;
  msmeNumber: string | null;
  categories: string[];
  productionCapacity: number;
  rating: number;
  status: SellerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSellerDTO {
  userId: UUID;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  regionId: UUID;
  giTagged: boolean;
  msme: boolean;
  msmeNumber: string | null;
  categories: string[];
  productionCapacity: number;
}

export interface UpdateSellerDTO {
  businessName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  location?: string;
  regionId?: UUID;
  giTagged?: boolean;
  msme?: boolean;
  msmeNumber?: string | null;
  categories?: string[];
  productionCapacity?: number;
}

export interface SellerResponseDTO extends SellerDTO {}

export interface SellerListDTO {
  sellers: SellerDTO[];
  total: number;
}
