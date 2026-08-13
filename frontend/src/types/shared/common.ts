// ============================================================================
// SHARED COMMON INTERFACES
// ============================================================================
// Common interfaces used across the application

import { UUID, Timestamp } from './base';
import { SortOrder } from './enums';

export interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface FilterParams {
  regionId?: UUID;
  category?: string;
  giTagged?: boolean;
  msme?: boolean;
  priority?: string;
  status?: string;
  festivalId?: UUID;
  dateFrom?: string;
  dateTo?: string;
}

export interface DateRange {
  from: string;
  to: string;
}

export interface Money {
  amount: number;
  currency: string;
}

export interface Percentage {
  value: number;
  label: string;
}
