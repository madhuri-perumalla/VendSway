// ============================================================================
// ROUTE CONSTANTS
// ============================================================================
// Application route paths

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  
  // Protected routes
  // Admin routes
  ADMIN_HOME: '/admin',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_CHANGE_PASSWORD: '/admin/change-password',
  ADMIN_AI_COMMAND_CENTER: '/admin',
  ADMIN_REGIONAL_INTELLIGENCE: '/admin/regional-intelligence-new',
  ADMIN_OPPORTUNITY_PIPELINE: '/admin/opportunity-pipeline',
  ADMIN_SELLER_NETWORK: '/admin/seller-network',

  // Seller routes
  SELLER_PORTAL: '/seller/portal',
  SELLER_PRODUCTS: '/seller/products',
  
  // Regional Intelligence
  REGIONS: '/regions',
  REGION_DETAIL: '/regions/:id',
  FESTIVALS: '/festivals',
  FESTIVAL_DETAIL: '/festivals/:id',
  TEXTILES: '/textiles',
  TEXTILE_DETAIL: '/textiles/:id',
  GI_PRODUCTS: '/gi-products',
  GI_PRODUCT_DETAIL: '/gi-products/:id',
  REGIONAL_TRENDS: '/regional-trends',
  
  // Catalog Gap
  CATALOG_ITEMS: '/catalog-items',
  CATALOG_ITEM_DETAIL: '/catalog-items/:id',
  DEMAND_SIGNALS: '/demand-signals',
  DEMAND_SIGNAL_DETAIL: '/demand-signals/:id',
  CATALOG_GAPS: '/catalog-gaps',
  CATALOG_GAP_DETAIL: '/catalog-gaps/:id',
  
  // Seller
  SELLERS: '/sellers',
  SELLER_DETAIL: '/sellers/:id',
  SELLER_APPLICATIONS: '/seller-applications',
  SELLER_APPLICATION_DETAIL: '/seller-applications/:id',
  
  // Product
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  
  // Storefront
  COLLECTIONS: '/collections',
  COLLECTION_DETAIL: '/collections/:id',
  
  // Analytics
  ANALYTICS: '/analytics',
  ANALYTICS_OVERVIEW: '/analytics/overview',
  ANALYTICS_REGIONAL: '/analytics/regional',
  ANALYTICS_DEMAND: '/analytics/demand',
  ANALYTICS_GAPS: '/analytics/gaps',
  
  // Admin
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Profile
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Error
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  FORBIDDEN: '/403',
  SERVER_ERROR: '/500',
} as const;

export type RoutePath = typeof ROUTES[keyof typeof ROUTES];
