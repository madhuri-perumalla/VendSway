// ============================================================================
// SELLER DOMAIN TYPES
// ============================================================================
// Domain models for Seller feature

import { BaseEntity } from '../shared/common';
import { SellerStatus, ApplicationStatus } from '../shared/enums';
import { Region } from './regional-intelligence';
import { User } from './user';

export interface Seller extends BaseEntity {
  id: string;
  userId: string;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  regionId: string;
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

export interface SellerApplication extends BaseEntity {
  id: string;
  sellerId: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

// Relationship types
export interface SellerWithRelations extends Seller {
  user?: User;
  region?: Region;
  application?: SellerApplication;
}

export interface SellerApplicationWithRelations extends SellerApplication {
  seller?: Seller;
}
