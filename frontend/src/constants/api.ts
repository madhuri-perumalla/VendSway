// ============================================================================
// API CONSTANTS
// ============================================================================
// API-related constants

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  TIMEOUT: 10000,
  RETRY_COUNT: 1,
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Regional Intelligence
  REGIONS: '/regions',
  REGION_BY_ID: (id: string) => `/regions/${id}`,
  FESTIVALS: '/festivals',
  FESTIVAL_BY_ID: (id: string) => `/festivals/${id}`,
  FESTIVALS_BY_REGION: (regionId: string) => `/festivals?regionId=${regionId}`,
  TEXTILES: '/textiles',
  TEXTILE_BY_ID: (id: string) => `/textiles/${id}`,
  TEXTILES_BY_REGION: (regionId: string) => `/textiles?regionId=${regionId}`,
  GI_PRODUCTS: '/gi-products',
  GI_PRODUCT_BY_ID: (id: string) => `/gi-products/${id}`,
  GI_PRODUCTS_BY_REGION: (regionId: string) => `/gi-products?regionId=${regionId}`,
  REGIONAL_TRENDS: '/regional-trends',
  REGIONAL_TREND_BY_ID: (id: string) => `/regional-trends/${id}`,
  REGIONAL_TRENDS_BY_REGION: (regionId: string) => `/regional-trends?regionId=${regionId}`,
  
  // Catalog Gap
  CATALOG_ITEMS: '/catalog-items',
  CATALOG_ITEM_BY_ID: (id: string) => `/catalog-items/${id}`,
  DEMAND_SIGNALS: '/demand-signals',
  DEMAND_SIGNAL_BY_ID: (id: string) => `/demand-signals/${id}`,
  DEMAND_SIGNALS_BY_REGION: (regionId: string) => `/demand-signals?regionId=${regionId}`,
  CATALOG_GAPS: '/catalog-gaps',
  CATALOG_GAP_BY_ID: (id: string) => `/catalog-gaps/${id}`,
  CATALOG_GAPS_BY_REGION: (regionId: string) => `/catalog-gaps?regionId=${regionId}`,
  HIGH_PRIORITY_GAPS: '/catalog-gaps?priority=HIGH',
  
  // Seller
  SELLERS: '/sellers',
  SELLER_BY_ID: (id: string) => `/sellers/${id}`,
  SELLERS_BY_REGION: (regionId: string) => `/sellers?regionId=${regionId}`,
  GI_TAGGED_SELLERS: '/sellers?giTagged=true',
  MSME_SELLERS: '/sellers?msme=true',
  SELLER_APPLICATIONS: '/seller-applications',
  SELLER_APPLICATION_BY_ID: (id: string) => `/seller-applications/${id}`,
  SELLER_APPLICATIONS_BY_STATUS: (status: string) => `/seller-applications?status=${status}`,
  
  // Product
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id: string) => `/products/${id}`,
  PRODUCTS_BY_REGION: (regionId: string) => `/products?regionId=${regionId}`,
  PRODUCTS_BY_SELLER: (sellerId: string) => `/products?sellerId=${sellerId}`,
  GI_TAGGED_PRODUCTS: '/products?giTagged=true',
  
  // Storefront
  COLLECTIONS: '/collections',
  COLLECTION_BY_ID: (id: string) => `/collections/${id}`,
  COLLECTIONS_BY_REGION: (regionId: string) => `/collections?regionId=${regionId}`,
  FESTIVAL_COLLECTIONS: (festivalId: string) => `/collections?festivalId=${festivalId}`,
  ACTIVE_COLLECTIONS: '/collections?isActive=true',
  
  // Analytics
  ANALYTICS_SNAPSHOTS: '/analytics',
  ANALYTICS_SNAPSHOT_BY_ID: (id: string) => `/analytics/${id}`,
  ANALYTICS_BY_REGION: (regionId: string) => `/analytics?regionId=${regionId}`,
  ANALYTICS_BY_METRIC_TYPE: (metricType: string) => `/analytics?metricType=${metricType}`,
  DEMAND_ANALYTICS: '/analytics?metricType=demand_score',
  GAP_ANALYTICS: '/analytics?metricType=total_gaps',
  SELLER_ANALYTICS: '/analytics?metricType=seller_growth',
  
  // User
  USERS: '/users',
  USER_BY_ID: (id: string) => `/users/${id}`,
  USER_PROFILE: '/users/me',
  
  // Admin
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
