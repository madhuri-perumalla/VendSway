// ============================================================================
// APP CONSTANTS
// ============================================================================
// Application-wide constants

export const APP_CONFIG = {
  NAME: 'VendSway',
  VERSION: '1.0.0',
  DESCRIPTION: 'Regional Textile Intelligence Platform',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Debounce
  SEARCH_DEBOUNCE_MS: 300,
  
  // Storage keys
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    USER_ROLE: 'userRole',
    THEME: 'theme',
    REGION: 'selectedRegion',
    FILTERS: 'filters',
  },
  
  // LocalStorage keys
  LOCAL_STORAGE_PREFIX: 'vendsway_',
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;
