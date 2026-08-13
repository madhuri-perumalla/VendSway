// ============================================================================
// SELLER APPLICATION DTO TYPES
// ============================================================================
// Data Transfer Objects for SellerApplication entity

import { UUID } from '../shared/base';
import { ApplicationStatus } from '../shared/enums';

export interface SellerApplicationDTO {
  id: UUID;
  sellerId: UUID;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSellerApplicationDTO {
  sellerId: UUID;
  status: ApplicationStatus;
  submittedAt: string;
}

export interface UpdateSellerApplicationDTO {
  status?: ApplicationStatus;
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  notes?: string | null;
}

export interface SellerApplicationResponseDTO extends SellerApplicationDTO {}

export interface SellerApplicationListDTO {
  applications: SellerApplicationDTO[];
  total: number;
}
