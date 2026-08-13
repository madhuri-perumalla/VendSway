# VendSway Frontend Data Layer Design

## Document Information

- **Project Name**: VendSway
- **Document Version**: 1.0
- **Date**: July 15, 2026
- **Purpose**: Frontend data model architecture and organization
- **Status**: FINAL - Official data layer reference

---

# 1. Data Layer Overview

## Purpose

The frontend data layer provides a type-safe, scalable, and maintainable foundation for all data operations in the VendSway application. It ensures consistency between frontend and backend data structures while supporting UI-specific transformations.

## Principles

1. **Exact Backend Alignment**: Domain models exactly match backend database schema
2. **Type Safety**: All data operations are fully typed with TypeScript
3. **Separation of Concerns**: Clear separation between domain models, UI models, and API contracts
4. **Scalability**: Modular structure supports easy addition of new entities and features
5. **Maintainability**: Centralized type definitions reduce duplication and ensure consistency

---

# 2. Type Organization

## Folder Structure

```
src/types/
├── index.ts              # Barrel export - central import point
├── shared.ts             # Shared types, enums, and common interfaces
├── api.ts                # API response/request types
├── domain.ts             # Domain model interfaces (exact backend match)
├── ui.ts                 # UI-specific types and component data structures
└── forms.ts              # Form types and validation schemas
```

## File Responsibilities

### `shared.ts`
- **Purpose**: Shared types used across the entire application
- **Contents**:
  - Primitive type aliases (UUID, Timestamp, DateString)
  - Enums (UserRole, SellerStatus, ApplicationStatus, etc.)
  - Common interfaces (BaseEntity, PaginationParams, FilterParams)
  - Shared utility types (Coordinates, Address)

### `api.ts`
- **Purpose**: API contract types defining request/response structures
- **Contents**:
  - Generic API response wrapper (ApiResponse<T>)
  - Error response types
  - Paginated response types
  - Bulk operation response types
  - Validation error types
  - API request parameter types

### `domain.ts`
- **Purpose**: Domain model interfaces that exactly match backend database schema
- **Contents**:
  - Core entity interfaces (User, Region, Festival, Textile, etc.)
  - Relationship types (EntityWithRelations)
  - **Critical**: No extra fields, no renamed properties
  - Direct 1:1 mapping with PostgreSQL schema

### `ui.ts`
- **Purpose**: UI-specific types for components and state management
- **Contents**:
  - Table row types (transformed for display)
  - Card data types (aggregated for UI)
  - Dashboard metric types
  - Chart data types
  - Map data types
  - Filter UI types
  - Modal/toast types
  - Loading/empty state types

### `forms.ts`
- **Purpose**: Form submission and validation types
- **Contents**:
  - Form data interfaces (registration, update, search)
  - Validation rule interfaces
  - Form state types
  - Multi-step form types
  - Form submission result types

### `index.ts`
- **Purpose**: Central export point for all types
- **Contents**: Re-exports from all type modules
- **Usage**: `import { User, Region, ApiResponse } from '@/types'`

---

# 3. Domain Model Interfaces

## Core Entities

### User
```typescript
interface User {
  id: UUID;
  email: string;
  role: UserRole;
  name: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Region
```typescript
interface Region {
  id: UUID;
  name: string;
  code: string;
  centerLat: number;
  centerLng: number;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Festival
```typescript
interface Festival {
  id: UUID;
  name: string;
  regionId: UUID;
  date: string;
  description: string;
  fashionRelevance: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Textile
```typescript
interface Textile {
  id: UUID;
  name: string;
  regionId: UUID;
  description: string;
  giTagged: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### GIProduct
```typescript
interface GIProduct {
  id: UUID;
  name: string;
  textileId: UUID;
  regionId: UUID;
  category: ProductCategory;
  description: string;
  registrationNumber: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### RegionalTrend
```typescript
interface RegionalTrend {
  id: UUID;
  regionId: UUID;
  category: ProductCategory;
  trendScore: number;
  period: string;
  source: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### CatalogItem
```typescript
interface CatalogItem {
  id: UUID;
  name: string;
  category: ProductCategory;
  regionId: UUID | null;
  description: string;
  available: boolean;
  stock: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### DemandSignal
```typescript
interface DemandSignal {
  id: UUID;
  regionId: UUID;
  category: string;
  festivalId: UUID | null;
  demandScore: number;
  seasonality: Seasonality;
  source: string;
  period: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### CatalogGap
```typescript
interface CatalogGap {
  id: UUID;
  regionId: UUID;
  category: string;
  festivalId: UUID | null;
  productId: UUID | null;
  demand: number;
  available: number;
  gap: number;
  priority: GapPriority;
  identifiedAt: Timestamp;
  resolvedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Seller
```typescript
interface Seller {
  id: UUID;
  userId: UUID;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  regionId: UUID;
  giTagged: boolean;
  msme: boolean;
  msmeNumber: string | null;
  categories: string[];
  productionCapacity: number;
  rating: number;
  status: SellerStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### SellerApplication
```typescript
interface SellerApplication {
  id: UUID;
  sellerId: UUID;
  status: ApplicationStatus;
  submittedAt: Timestamp;
  reviewedAt: Timestamp | null;
  reviewedBy: string | null;
  notes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Product
```typescript
interface Product {
  id: UUID;
  name: string;
  category: string;
  regionId: UUID | null;
  sellerId: UUID;
  textileIds: UUID[];
  price: number;
  giTagged: boolean;
  description: string;
  imageUrl: string;
  available: boolean;
  stock: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### RegionalCollection
```typescript
interface RegionalCollection {
  id: UUID;
  name: string;
  regionId: UUID;
  festivalId: UUID | null;
  productIds: UUID[];
  description: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### AnalyticsSnapshot
```typescript
interface AnalyticsSnapshot {
  id: UUID;
  regionId: UUID | null;
  metricType: string;
  metricValue: number;
  period: string;
  breakdown: Record<string, number>;
  metadata: Record<string, unknown>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## Relationship Types

Each entity has corresponding `WithRelations` types for nested data:

```typescript
interface RegionWithRelations extends Region {
  textiles?: Textile[];
  festivals?: Festival[];
  sellers?: Seller[];
  demandSignals?: DemandSignal[];
  catalogGaps?: CatalogGap[];
  regionalCollections?: RegionalCollection[];
}
```

---

# 4. API Response Types

## Generic Response Wrapper

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
  timestamp: string;
}
```

## Paginated Response

```typescript
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
  timestamp: string;
}
```

## Error Response

```typescript
interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  timestamp: string;
  statusCode: number;
  details?: Record<string, unknown>;
}
```

## Bulk Operations

```typescript
interface BulkOperationResponse {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{
    id: string;
    error: string;
  }>;
  message?: string;
  timestamp: string;
}
```

---

# 5. UI Model Types

## Table Row Types

UI-specific transformations for table displays:

```typescript
interface RegionTableRow {
  id: UUID;
  name: string;
  code: string;
  textileCount: number;
  festivalCount: number;
  sellerCount: number;
  gapCount: number;
}
```

## Card Data Types

Aggregated data for card components:

```typescript
interface SellerCardData {
  seller: Seller;
  matchScore?: number;
  distance?: number;
  productCount: number;
}
```

## Chart Data Types

Specialized types for visualization libraries:

```typescript
interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}
```

---

# 6. Form Types

## Form Data Interfaces

Type-safe form submission data:

```typescript
interface SellerRegistrationForm {
  userId: UUID;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  regionId: UUID;
  giTagged: boolean;
  msme: boolean;
  msmeNumber?: string;
  categories: string[];
  productionCapacity: number;
}
```

## Validation Types

Zod-compatible validation structures:

```typescript
interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}
```

---

# 7. Enums

## User Roles

```typescript
enum UserRole {
  ADMIN = 'ADMIN',
  SELLER = 'SELLER',
  CUSTOMER = 'CUSTOMER',
}
```

## Seller Status

```typescript
enum SellerStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
```

## Application Status

```typescript
enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
```

## Gap Priority

```typescript
enum GapPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}
```

## Product Categories

```typescript
enum ProductCategory {
  ETHNIC_WEAR = 'ETHNIC_WEAR',
  WESTERN_WEAR = 'WESTERN_WEAR',
  FUSION_WEAR = 'FUSION_WEAR',
  ACCESSORIES = 'ACCESSORIES',
  HOME_DECOR = 'HOME_DECOR',
  TEXTILES = 'TEXTILES',
  HANDICRAFTS = 'HANDICRAFTS',
}
```

---

# 8. Feature Ownership

## Regional Intelligence Module

**Owned Types**:
- Region, RegionWithRelations
- Festival, FestivalWithRelations
- Textile, TextileWithRelations
- GIProduct
- RegionalTrend
- DemandSignal, DemandSignalWithRelations

**File Location**: `src/types/domain.ts`

## Catalog Gap Module

**Owned Types**:
- CatalogGap, CatalogGapWithRelations
- CatalogItem
- GapPriority (enum)

**File Location**: `src/types/domain.ts`, `src/types/shared.ts`

## Seller Discovery Module

**Owned Types**:
- Seller, SellerWithRelations
- SellerApplication, SellerApplicationWithRelations
- SellerStatus, ApplicationStatus (enums)

**File Location**: `src/types/domain.ts`, `src/types/shared.ts`

## Product Management Module

**Owned Types**:
- Product, ProductWithRelations
- ProductCategory (enum)

**File Location**: `src/types/domain.ts`, `src/types/shared.ts`

## Regional Storefront Module

**Owned Types**:
- RegionalCollection, RegionalCollectionWithRelations
- CollectionType (enum)

**File Location**: `src/types/domain.ts`, `src/types/shared.ts`

## Analytics Module

**Owned Types**:
- AnalyticsSnapshot
- AnalyticsPeriod (enum)

**File Location**: `src/types/domain.ts`, `src/types/shared.ts`

---

# 9. Future Scalability

## Adding New Entities

### Step 1: Add Domain Model
```typescript
// src/types/domain.ts
export interface NewEntity extends BaseEntity {
  id: UUID;
  // ... fields matching backend schema
}
```

### Step 2: Add UI Types (if needed)
```typescript
// src/types/ui.ts
export interface NewEntityCardData {
  entity: NewEntity;
  // ... UI-specific fields
}
```

### Step 3: Add Form Types (if needed)
```typescript
// src/types/forms.ts
export interface NewEntityForm {
  // ... form fields
}
```

### Step 4: Update Barrel Export
```typescript
// src/types/index.ts (automatic via export *)
```

## Extending Existing Entities

### Adding New Fields
1. Update domain interface in `src/types/domain.ts`
2. Ensure backend schema is updated first
3. Update any UI types that depend on the entity
4. Update form types if the field is user-editable

### Adding New Relationships
1. Create `EntityWithRelations` type
2. Add relationship fields as optional
3. Update API response types if needed

## Type Migration Strategy

### Breaking Changes
1. Create new type with version suffix (e.g., `UserV2`)
2. Update services to use new type
3. Update components to use new type
4. Deprecate old type with `@deprecated` comment
5. Remove old type in next major version

### Non-Breaking Changes
1. Add new optional fields to existing type
2. Update services to handle new fields
3. Components continue to work without changes

## Type Safety Guarantees

### Compile-Time Safety
- All API calls are typed with response interfaces
- Form submissions are validated against form interfaces
- Component props are typed with UI interfaces

### Runtime Safety
- Zod schemas for form validation
- API response validation (future)
- Type guards for runtime checks

---

# 10. Best Practices

## Type Usage Guidelines

### Domain Models
- **Use for**: API responses, data storage, service layer
- **Don't use for**: Component props, form state
- **Rule**: Never modify domain model properties

### UI Models
- **Use for**: Component props, state management, display logic
- **Don't use for**: API calls, data persistence
- **Rule**: Transform from domain models, don't modify directly

### Form Types
- **Use for**: Form submissions, validation, user input
- **Don't use for**: API responses, data storage
- **Rule**: Validate before converting to domain models

## Import Patterns

### Recommended
```typescript
// Import specific types
import { User, Region, ApiResponse } from '@/types';

// Import from specific modules
import { UserRole } from '@/types/shared';
import { SellerWithRelations } from '@/types/domain';
```

### Avoid
```typescript
// Don't import everything
import * as Types from '@/types';

// Don't use relative imports
import { User } from '../../types/domain';
```

## Type Guards

### Example
```typescript
function isSeller(entity: User | Seller): entity is Seller {
  return 'businessName' in entity;
}
```

## Type Inference

### Leverage TypeScript inference
```typescript
// Good - inferred return type
function transformUser(user: User) {
  return {
    fullName: user.name,
    email: user.email,
  };
}

// Bad - explicit return type when inference works
function transformUser(user: User): { fullName: string; email: string } {
  return {
    fullName: user.name,
    email: user.email,
  };
}
```

---

# 11. Integration Points

## React Query Integration

```typescript
import { useQuery } from '@tanstack/react-query';
import { ApiResponse, Region } from '@/types';

const { data } = useQuery<ApiResponse<Region[]>>({
  queryKey: ['regions'],
  queryFn: () => api.get('/api/intelligence/regions'),
});
```

## Zustand Integration

```typescript
import { create } from 'zustand';
import { User, UserRole } from '@/types';

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## React Hook Form Integration

```typescript
import { useForm } from 'react-hook-form';
import { SellerRegistrationForm } from '@/types/forms';

const { register, handleSubmit } = useForm<SellerRegistrationForm>();
```

## Zod Integration

```typescript
import { z } from 'zod';
import { SellerRegistrationForm } from '@/types/forms';

const sellerSchema = z.object({
  businessName: z.string().min(2),
  email: z.string().email(),
  // ... other fields
});
```

---

# 12. Maintenance Guidelines

## Regular Reviews

### Monthly
- Review type usage across codebase
- Identify unused types
- Check for type duplications
- Update documentation

### Quarterly
- Audit type-backend alignment
- Review enum values
- Update deprecated types
- Assess type complexity

### When Backend Changes
1. Update domain models immediately
2. Update API response types
3. Update affected UI types
4. Update form types
5. Update documentation

## Type Testing

### Unit Tests
- Test type transformations
- Test form validation
- Test type guards
- Test API response parsing

### Integration Tests
- Test API calls with typed responses
- Test form submissions
- Test state management with typed data

---

# 13. Troubleshooting

## Common Issues

### Type Mismatch Errors
**Symptom**: Type errors in API calls
**Solution**: 
1. Check backend schema
2. Update domain model
3. Clear TypeScript cache

### Missing Type Properties
**Symptom**: Property does not exist on type
**Solution**:
1. Check if property was added to backend
2. Update domain model
3. Update UI types if needed

### Circular Dependencies
**Symptom**: Type import errors
**Solution**:
1. Move shared types to `shared.ts`
2. Use type imports (`import type`)
3. Restructure type dependencies

## Debugging Tools

### TypeScript Compiler
```bash
npx tsc --noEmit
```

### Type Check
```bash
npx tsc --noEmit --pretty
```

### Type Coverage
```bash
npx type-coverage
```

---

# 14. Documentation Standards

## Type Documentation

### Inline Comments
```typescript
/**
 * Represents a user in the VendSway system
 * @property id - Unique identifier (UUID)
 * @property email - User's email address
 * @property role - User's role in the system
 */
export interface User extends BaseEntity {
  // ...
}
```

### File Headers
```typescript
// ============================================================================
// DOMAIN MODEL INTERFACES
// ============================================================================
// These interfaces exactly match the backend database schema
// No extra fields, no renamed properties
```

## Change Log

### Format
```typescript
// [Date] - [Author] - [Change Description]
// 2026-07-15 - Architect - Initial type system creation
```

---

# 15. Summary

The VendSway frontend data layer provides:

- **Type Safety**: Full TypeScript coverage for all data operations
- **Backend Alignment**: Domain models exactly match database schema
- **UI Flexibility**: Separate UI models for component needs
- **Form Validation**: Type-safe form submissions with validation
- **Scalability**: Modular structure supports easy growth
- **Maintainability**: Centralized type definitions reduce duplication

## Key Principles

1. **Exact Match**: Domain models match backend exactly
2. **Separation**: Clear separation between domain, UI, and form types
3. **Type Safety**: All operations are fully typed
4. **Scalability**: Easy to add new entities and features
5. **Maintainability**: Centralized and well-documented

## File Organization

```
src/types/
├── index.ts      # Central export
├── shared.ts     # Shared types & enums
├── api.ts        # API contracts
├── domain.ts     # Domain models
├── ui.ts         # UI models
└── forms.ts      # Form types
```

## Usage Pattern

```typescript
// Import from central point
import { User, Region, ApiResponse } from '@/types';

// Use domain models for API
const response: ApiResponse<User[]> = await api.get('/users');

// Transform to UI models for components
const userCards: UserCardData[] = response.data.map(transform);

// Use form types for submissions
const formData: UserRegistrationForm = { /* ... */ };
```

This data layer design ensures consistency, type safety, and scalability for the VendSway frontend application.
