import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import { authService } from '../services/AuthService';
import { UserRole } from '@prisma/client';

/**
 * Extract access token from the request.
 * Checks (in order):
 *   1. Header: Authorization: Bearer <token>
 */
function extractAccessToken(req: Request): string | null {
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return null;
}

/**
 * Authentication middleware — requires a valid JWT access token
 */
export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractAccessToken(req);

  if (!token) {
    throw new UnauthorizedError('Authentication required. Please provide a valid access token.');
  }

  const user = await authService.validateAccessToken(token);

  if (!user) {
    throw new UnauthorizedError('Invalid or expired access token. Please login again.');
  }

  (req as any).user = {
    userId: user.userId,
    email: user.email,
    role: user.role,
    authenticated: true,
  };

  next();
};

/**
 * Role-based authorization middleware factory
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !user.authenticated) {
      throw new UnauthorizedError('Authentication required');
    }

    if (!allowedRoles.includes(user.role)) {
      throw new ForbiddenError(
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

export const adminOnly = authorize(UserRole.ADMIN);
export const adminOrSeller = authorize(UserRole.ADMIN, UserRole.SELLER);
export const sellerOnly = authorize(UserRole.SELLER);

/**
 * Optional authentication middleware — attaches user info if a valid token
 * is present, but always continues regardless
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  const token = extractAccessToken(req);

  if (token) {
    try {
      const user = await authService.validateAccessToken(token);

      if (user) {
        (req as any).user = {
          userId: user.userId,
          email: user.email,
          role: user.role,
          authenticated: true,
        };
      }
    } catch {
      // Silently ignore — optional auth never blocks the request
    }
  }

  next();
};
