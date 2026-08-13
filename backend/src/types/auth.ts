import { UserRole } from '@prisma/client';

/**
 * Select role request payload
 */
export interface SelectRoleRequest {
  role: UserRole;
}

/**
 * Current role response
 */
export interface CurrentRoleResponse {
  role: UserRole;
  authenticated: boolean;
  timestamp: string;
}

/**
 * Auth session data (stored in memory for MVP)
 * In production, this would be stored in Redis or database
 */
export interface AuthSession {
  userId?: string;
  role: UserRole;
  createdAt: Date;
  expiresAt: Date;
}

/**
 * Auth response
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    role: UserRole;
    token?: string; // Placeholder for future JWT
  };
}

/**
 * User info attached to request
 */
export interface UserInfo {
  role: UserRole;
  userId?: string;
  authenticated: boolean;
}
