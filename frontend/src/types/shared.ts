// ============================================================================
// SHARED TYPES AND ENUMS
// ============================================================================
// These are shared types used across the application

export type UUID = string;

export type Timestamp = string; // ISO 8601 timestamp string

export type DateString = string; // YYYY-MM-DD format

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
}

export enum SellerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum GapPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum Seasonality {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum ProductCategory {
  ETHNIC_WEAR = 'ETHNIC_WEAR',
  WESTERN_WEAR = 'WESTERN_WEAR',
  FUSION_WEAR = 'FUSION_WEAR',
  ACCESSORIES = 'ACCESSORIES',
  HOME_DECOR = 'HOME_DECOR',
  TEXTILES = 'TEXTILES',
  HANDICRAFTS = 'HANDICRAFTS',
}

export enum CollectionType {
  FESTIVAL = 'FESTIVAL',
  REGIONAL = 'REGIONAL',
  TRENDING = 'TRENDING',
  CURATED = 'CURATED',
}

export enum AnalyticsPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum NotificationType {
  SUCCESS = 'SUCCESS',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  AI_RECOMMENDATION = 'AI_RECOMMENDATION',
  SELLER_ALERT = 'SELLER_ALERT',
  PRODUCT_APPROVAL = 'PRODUCT_APPROVAL',
  FESTIVAL_REMINDER = 'FESTIVAL_REMINDER',
  INFO = 'INFO',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

// ============================================================================
// SHARED INTERFACES
// ============================================================================

export interface BaseEntity {
  id: UUID;
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  category?: ProductCategory;
  giTagged?: boolean;
  msme?: boolean;
  priority?: GapPriority;
  status?: SellerStatus | ApplicationStatus;
  festivalId?: UUID;
  dateFrom?: DateString;
  dateTo?: DateString;
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

export interface Notification extends BaseEntity {
  userId: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message?: string;
  link?: string;
  isRead: boolean;
  readAt?: Timestamp;
  metadata?: Record<string, any>;
  expiresAt?: Timestamp;
}

export interface NotificationFilters {
  type?: NotificationType;
  priority?: NotificationPriority;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}
