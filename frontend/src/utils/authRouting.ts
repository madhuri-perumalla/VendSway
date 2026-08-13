import { UserRole } from '@/services/auth';

/**
 * Centralized authentication routing utility
 * All role-based redirects should use this utility to ensure consistency
 */

export const ROUTES = {
  // Authentication routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',

  // Role-specific landing pages
  ADMIN_HOME: '/admin', // AI Command Center
  SELLER_HOME: '/seller/overview',

  // Admin routes
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_CHANGE_PASSWORD: '/admin/change-password',
  ADMIN_AI_COMMAND_CENTER: '/admin',
  ADMIN_REGIONAL_INTELLIGENCE: '/admin/regional-intelligence-new',
  ADMIN_OPPORTUNITY_PIPELINE: '/admin/opportunity-pipeline',
  ADMIN_SELLER_NETWORK: '/admin/seller-network',

  // Seller routes
  SELLER_OVERVIEW: '/seller/overview',
  SELLER_APPLICATION: '/seller/application',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_OPPORTUNITIES: '/seller/opportunities',
  SELLER_PROFILE: '/seller/profile',

  // Landing page
  LANDING: '/',
} as const;

/**
 * Get the appropriate landing page route based on user role
 */
export const getRoleBasedHomeRoute = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return ROUTES.ADMIN_HOME;
    case 'SELLER':
      return ROUTES.SELLER_OVERVIEW;
    default:
      return ROUTES.ADMIN_HOME;
  }
};

/**
 * Get the appropriate route after successful login
 */
export const getPostLoginRoute = (role: UserRole): string => {
  return getRoleBasedHomeRoute(role);
};

/**
 * Check if a route is protected (requires authentication)
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return pathname.startsWith('/admin') || 
         pathname.startsWith('/seller') ||
         pathname.startsWith('/checkout');
};

/**
 * Check if a route is public (no authentication required)
 */
export const isPublicRoute = (pathname: string): boolean => {
  return pathname === ROUTES.LOGIN ||
         pathname === ROUTES.REGISTER ||
         pathname === ROUTES.FORGOT_PASSWORD ||
         pathname === ROUTES.RESET_PASSWORD ||
         pathname === ROUTES.LANDING;
};

/**
 * Get redirect route for unauthenticated users
 */
export const getUnauthenticatedRedirect = (currentPath: string): string => {
  // Store the intended destination for post-login redirect
  if (isProtectedRoute(currentPath)) {
    return `${ROUTES.LOGIN}?redirect=${encodeURIComponent(currentPath)}`;
  }
  return ROUTES.LOGIN;
};

/**
 * Get redirect route for authenticated users visiting login page
 */
export const getAuthenticatedRedirect = (role: UserRole): string => {
  return getPostLoginRoute(role);
};