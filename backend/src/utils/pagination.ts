import { PaginationParams } from '../types';

/**
 * Parse and validate pagination parameters from request query
 * @param query - Request query object
 * @param defaultPage - Default page number (default: 1)
 * @param defaultLimit - Default limit (default: 10)
 * @param maxLimit - Maximum allowed limit (default: 100)
 * @returns Pagination parameters
 */
export const parsePagination = (
  query: any,
  defaultPage: number = 1,
  defaultLimit: number = 10,
  maxLimit: number = 100
): PaginationParams => {
  const page = Math.max(1, parseInt(query.page || defaultPage, 10));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || defaultLimit, 10)));
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = (query.sortOrder || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';

  return {
    page,
    limit,
    sortBy,
    sortOrder,
  };
};

/**
 * Calculate pagination metadata
 * @param total - Total number of records
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Pagination metadata
 */
export const calculatePagination = (
  total: number,
  page: number,
  limit: number
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
} => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrevious,
  };
};

/**
 * Calculate skip value for pagination
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Skip value for Prisma queries
 */
export const calculateSkip = (page: number, limit: number): number => {
  return (page - 1) * limit;
};

/**
 * Build Prisma orderBy object from sort parameters
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (asc or desc)
 * @returns Prisma orderBy object
 */
export const buildOrderBy = (sortBy: string, sortOrder: 'asc' | 'desc'): any => {
  return {
    [sortBy]: sortOrder,
  };
};

/**
 * Build pagination response metadata
 * @param total - Total number of records
 * @param page - Current page number
 * @param limit - Items per page
 * @returns Pagination response object
 */
export const buildPaginationResponse = (
  total: number,
  page: number,
  limit: number
): {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
} => {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
};
