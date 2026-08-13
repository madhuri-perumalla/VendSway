// ============================================================================
// ZOD VALIDATION SCHEMAS
// ============================================================================
// Zod schemas for form validation

import { z } from 'zod';
import { UserRole, SellerStatus, ApplicationStatus, GapPriority, ProductCategory } from '@/types/shared';

// User schemas
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.nativeEnum(UserRole),
  name: z.string().min(2, 'Name must be at least 2 characters'),
});

export const createUserSchema = userSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = userSchema.partial();

// Region schemas
export const regionSchema = z.object({
  name: z.string().min(2, 'Region name must be at least 2 characters'),
  code: z.string().length(2, 'Region code must be 2 characters'),
  centerLat: z.number().min(-90).max(90),
  centerLng: z.number().min(-180).max(180),
  description: z.string().optional(),
});

// Festival schemas
export const festivalSchema = z.object({
  name: z.string().min(2, 'Festival name must be at least 2 characters'),
  regionId: z.string().uuid('Invalid region ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  description: z.string().optional(),
  fashionRelevance: z.string().optional(),
});

// Textile schemas
export const textileSchema = z.object({
  name: z.string().min(2, 'Textile name must be at least 2 characters'),
  regionId: z.string().uuid('Invalid region ID'),
  description: z.string().optional(),
  giTagged: z.boolean(),
});

// GI Product schemas
export const giProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  textileId: z.string().uuid('Invalid textile ID'),
  regionId: z.string().uuid('Invalid region ID'),
  category: z.nativeEnum(ProductCategory),
  description: z.string().optional(),
  registrationNumber: z.string().min(1, 'Registration number is required'),
});

// Seller schemas
export const sellerSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  contactPerson: z.string().min(2, 'Contact person name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  regionId: z.string().uuid('Invalid region ID'),
  giTagged: z.boolean(),
  msme: z.boolean(),
  msmeNumber: z.string().optional(),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  productionCapacity: z.number().min(0, 'Production capacity must be positive'),
  status: z.nativeEnum(SellerStatus),
});

export const createSellerSchema = sellerSchema.omit({ userId: true, status: true });

// Seller Application schemas
export const sellerApplicationSchema = z.object({
  sellerId: z.string().uuid('Invalid seller ID'),
  status: z.nativeEnum(ApplicationStatus),
  notes: z.string().optional(),
});

// Product schemas
export const productSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  regionId: z.string().uuid('Invalid region ID'),
  sellerId: z.string().uuid('Invalid seller ID'),
  textileIds: z.array(z.string().uuid()).min(1, 'At least one textile is required'),
  price: z.number().min(0, 'Price must be positive'),
  giTagged: z.boolean(),
  description: z.string().optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  available: z.boolean(),
  stock: z.number().min(0, 'Stock must be positive'),
});

export const createProductSchema = productSchema.omit({ available: true });

// Catalog Gap schemas
export const catalogGapSchema = z.object({
  regionId: z.string().uuid('Invalid region ID'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  festivalId: z.string().uuid('Invalid festival ID').optional().nullable(),
  productId: z.string().uuid('Invalid product ID').optional().nullable(),
  demand: z.number().min(0, 'Demand must be positive'),
  available: z.number().min(0, 'Available must be positive'),
  priority: z.nativeEnum(GapPriority),
});

// Regional Collection schemas
export const regionalCollectionSchema = z.object({
  name: z.string().min(2, 'Collection name must be at least 2 characters'),
  regionId: z.string().uuid('Invalid region ID'),
  festivalId: z.string().uuid('Invalid festival ID').optional().nullable(),
  productIds: z.array(z.string().uuid()).min(1, 'At least one product is required'),
  description: z.string().optional(),
  isActive: z.boolean(),
});

// Analytics schemas
export const analyticsSnapshotSchema = z.object({
  regionId: z.string().uuid('Invalid region ID').optional().nullable(),
  metricType: z.string().min(1, 'Metric type is required'),
  metricValue: z.number(),
  period: z.string().min(1, 'Period is required'),
  breakdown: z.record(z.number()),
  metadata: z.record(z.unknown()).optional(),
});

// Filter schemas
export const filterSchema = z.object({
  regionId: z.string().uuid().optional().nullable(),
  category: z.nativeEnum(ProductCategory).optional().nullable(),
  giTagged: z.boolean().optional().nullable(),
  msme: z.boolean().optional().nullable(),
  priority: z.nativeEnum(GapPriority).optional().nullable(),
  status: z.nativeEnum(SellerStatus).optional().nullable(),
  festivalId: z.string().uuid().optional().nullable(),
  dateFrom: z.string().optional().nullable(),
  dateTo: z.string().optional().nullable(),
  searchQuery: z.string().optional(),
});
