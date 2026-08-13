// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================
// These interfaces exactly match the backend database schema
// No extra fields, no renamed properties

import { BaseEntity, UUID, Timestamp, UserRole, SellerStatus, ApplicationStatus, GapPriority, Seasonality, ProductCategory } from './shared';

// ============================================================================
// USER
// ============================================================================

export interface User extends BaseEntity {
  id: UUID;
  email: string;
  role: UserRole;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// REGION
// ============================================================================

export interface Region extends BaseEntity {
  id: UUID;
  name: string;
  code: string;
  centerLat: number;
  centerLng: number;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// FESTIVAL
// ============================================================================

export interface Festival extends BaseEntity {
  id: UUID;
  name: string;
  regionId: UUID;
  date: string; // YYYY-MM-DD format
  description: string;
  fashionRelevance: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// TEXTILE
// ============================================================================

export interface Textile extends BaseEntity {
  id: UUID;
  name: string;
  regionId: UUID;
  description: string;
  giTagged: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// GI PRODUCT
// ============================================================================

export interface GIProduct extends BaseEntity {
  id: UUID;
  name: string;
  textileId: UUID;
  regionId: UUID;
  category: ProductCategory;
  description: string;
  registrationNumber: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// REGIONAL TREND
// ============================================================================

export interface RegionalTrend extends BaseEntity {
  id: UUID;
  regionId: UUID;
  category: ProductCategory;
  trendScore: number;
  period: string;
  source: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// CATALOG ITEM
// ============================================================================

export interface CatalogItem extends BaseEntity {
  id: UUID;
  name: string;
  category: ProductCategory;
  regionId: UUID | null;
  description: string;
  available: boolean;
  stock: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// DEMAND SIGNAL
// ============================================================================

export interface DemandSignal extends BaseEntity {
  id: UUID;
  regionId: UUID;
  category: string;
  festivalId: UUID | null;
  demandScore: number;
  seasonality: Seasonality;
  source: string;
  period: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// CATALOG GAP
// ============================================================================

export interface CatalogGap extends BaseEntity {
  id: UUID;
  regionId: UUID;
  category: string;
  festivalId: UUID | null;
  productId: UUID | null;
  demand: number;
  available: number;
  gap: number;
  priority: GapPriority;
  identifiedAt: Timestamp;
  resolvedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// SELLER
// ============================================================================

export interface Seller extends BaseEntity {
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// SELLER APPLICATION
// ============================================================================

export interface SellerApplication extends BaseEntity {
  id: UUID;
  sellerId: UUID;
  status: ApplicationStatus;
  submittedAt: Timestamp;
  reviewedAt: Timestamp | null;
  reviewedBy: string | null;
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// PRODUCT
// ============================================================================

export interface Product extends BaseEntity {
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
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// REGIONAL COLLECTION
// ============================================================================

export interface RegionalCollection extends BaseEntity {
  id: UUID;
  name: string;
  regionId: UUID;
  festivalId: UUID | null;
  productIds: UUID[];
  description: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// ANALYTICS SNAPSHOT
// ============================================================================

export interface AnalyticsSnapshot extends BaseEntity {
  id: UUID;
  regionId: UUID | null;
  metricType: string;
  metricValue: number;
  period: string;
  breakdown: Record<string, number>;
  metadata: Record<string, unknown>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// RELATIONSHIP TYPES (for nested data)
// ============================================================================

export interface RegionWithRelations extends Region {
  textiles?: Textile[];
  festivals?: Festival[];
  sellers?: Seller[];
  demandSignals?: DemandSignal[];
  catalogGaps?: CatalogGap[];
  regionalCollections?: RegionalCollection[];
}

export interface FestivalWithRelations extends Festival {
  region?: Region;
  demandSignals?: DemandSignal[];
  catalogGaps?: CatalogGap[];
  regionalCollections?: RegionalCollection[];
}

export interface TextileWithRelations extends Textile {
  region?: Region;
  products?: Product[];
}

export interface ProductWithRelations extends Product {
  region?: Region;
  seller?: Seller;
  textiles?: Textile[];
  catalogGaps?: CatalogGap[];
}

export interface SellerWithRelations extends Seller {
  user?: User;
  region?: Region;
  products?: Product[];
  application?: SellerApplication;
}

export interface SellerApplicationWithRelations extends SellerApplication {
  seller?: Seller;
}

export interface CatalogGapWithRelations extends CatalogGap {
  region?: Region;
  festival?: Festival;
  product?: Product;
}

export interface DemandSignalWithRelations extends DemandSignal {
  region?: Region;
  festival?: Festival;
}

export interface RegionalCollectionWithRelations extends RegionalCollection {
  region?: Region;
  festival?: Festival;
  products?: Product[];
}
