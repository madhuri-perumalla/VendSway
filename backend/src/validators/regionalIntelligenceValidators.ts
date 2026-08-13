import { z } from 'zod';

/**
 * Validation schemas for Regional Intelligence endpoints
 */

/**
 * Region ID validation schema
 */
export const regionIdSchema = z.object({
  id: z.string().uuid('Invalid region ID format'),
});

/**
 * Search query validation schema
 */
export const searchQuerySchema = z.object({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
});

/**
 * Regional trends query validation schema
 */
export const regionalTrendsQuerySchema = z.object({
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 10),
});

/**
 * Region details response schema
 */
export const regionDetailsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  centerLat: z.number(),
  centerLng: z.number(),
  description: z.string().nullable(),
  festivals: z.array(z.any()),
  textiles: z.array(z.any()),
  giProducts: z.array(z.any()),
  regionalTrends: z.array(z.any()),
});

/**
 * Regional summary response schema
 */
export const regionalSummarySchema = z.object({
  region: z.object({
    id: z.string().uuid(),
    name: z.string(),
    code: z.string(),
    description: z.string().nullable(),
    centerLat: z.number(),
    centerLng: z.number(),
  }),
  statistics: z.object({
    textileCount: z.number(),
    festivalCount: z.number(),
    giProductCount: z.number(),
    trendCount: z.number(),
  }),
  textiles: z.array(z.any()),
  festivals: z.array(z.any()),
  giProducts: z.array(z.any()),
  trends: z.array(z.any()),
});
