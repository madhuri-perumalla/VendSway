// ============================================================================
// SHARED ENUMS
// ============================================================================
// Enumeration types used across the application

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

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}
