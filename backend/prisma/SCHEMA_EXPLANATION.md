# Prisma Schema Explanation

## Overview

This document explains the Prisma schema for the VendSway backend API, detailing all models, relationships, enums, indexes, and constraints.

## Schema Structure

The schema follows the approved Database Design document and implements 16 models with proper relationships, indexes, and constraints.

## Enums

### UserRole
**Purpose**: Define user roles for authentication and authorization

**Values**:
- `ADMIN` - Full access to all features
- `SELLER` - Access to seller portal and product management
- `CUSTOMER` - Access to storefront and browsing

**Usage**: Used in `User.role` field

### FashionRelevance
**Purpose**: Define fashion relevance levels for festivals

**Values**:
- `HIGH` - High fashion relevance
- `MEDIUM` - Medium fashion relevance
- `LOW` - Low fashion relevance

**Usage**: Used in `Festival.fashionRelevance` field

### Seasonality
**Purpose**: Define seasonality levels for demand and trends

**Values**:
- `HIGH` - High seasonality
- `MEDIUM` - Medium seasonality
- `LOW` - Low seasonality

**Usage**: Used in `DemandSignal.seasonality` and `RegionalTrend.seasonality` fields

### SellerStatus
**Purpose**: Define seller approval status

**Values**:
- `PENDING` - Seller application pending review
- `APPROVED` - Seller approved and active
- `REJECTED` - Seller application rejected

**Usage**: Used in `Seller.status` field

### ApplicationStatus
**Purpose**: Define seller application status

**Values**:
- `SUBMITTED` - Application submitted
- `UNDER_REVIEW` - Application under review
- `APPROVED` - Application approved
- `REJECTED` - Application rejected

**Usage**: Used in `SellerApplication.status` field

### GapPriority
**Purpose**: Define catalog gap priority levels

**Values**:
- `HIGH` - High priority gap
- `MEDIUM` - Medium priority gap
- `LOW` - Low priority gap

**Usage**: Used in `CatalogGap.priority` field

### MetricType
**Purpose**: Define analytics metric types

**Values**:
- `DEMAND` - Demand-related metrics
- `GAP` - Catalog gap metrics
- `SELLER` - Seller-related metrics

**Usage**: Used in `AnalyticsSnapshot.metricType` field

## Models

### User
**Purpose**: Store user account information for authentication
**Indexes**: email (unique), role
**Table**: users

### Region
**Purpose**: Store geographical region information (states)
**Indexes**: code (unique), name, centerLat + centerLng
**Table**: regions

### Festival
**Purpose**: Store festival information and fashion relevance
**Indexes**: regionId, date, name
**Table**: festivals

### Textile
**Purpose**: Store regional textile type information
**Indexes**: regionId, name, giTagged
**Table**: textiles

### GIProduct
**Purpose**: Store GI-tagged product information
**Indexes**: regionId, category, registrationNumber (unique)
**Table**: gi_products

### RegionalTrend
**Purpose**: Store regional fashion trend information
**Indexes**: regionId, category, period
**Table**: regional_trends

### CatalogItem
**Purpose**: Store Myntra catalog item information
**Indexes**: productId, regionId, category
**Table**: catalog_items

### DemandSignal
**Purpose**: Store demand signals for regions and categories
**Indexes**: regionId, category, festivalId, period, demandScore
**Table**: demand_signals

### CatalogGap
**Purpose**: Store catalog gaps between demand and availability
**Indexes**: regionId, category, festivalId, priority, gap (descending), resolvedAt
**Table**: catalog_gaps

### Seller
**Purpose**: Store seller/artisan account information
**Indexes**: userId, email (unique), regionId, status, giTagged, msme, rating
**Table**: sellers

### SellerApplication
**Purpose**: Store seller onboarding application information
**Indexes**: sellerId (unique), status
**Table**: seller_applications

### Product
**Purpose**: Store product information in the catalog
**Indexes**: regionId, sellerId, category, giTagged, price, available
**Table**: products

### ProductTextile (Junction)
**Purpose**: Many-to-many relationship between products and textiles
**Indexes**: productId, textileId
**Table**: product_textiles

### RegionalCollection
**Purpose**: Store curated regional collection information
**Indexes**: regionId, festivalId, isActive
**Table**: regional_collections

### RegionalCollectionProduct (Junction)
**Purpose**: Many-to-many relationship between collections and products
**Indexes**: collectionId, productId
**Table**: regional_collection_products

### AnalyticsSnapshot
**Purpose**: Store analytics data snapshots
**Indexes**: regionId, metricType, period, createdAt
**Table**: analytics_snapshots

## Relationships Summary

### One-to-Many Relationships
- Region → Festival, Textile, GIProduct, RegionalTrend, CatalogItem, DemandSignal, CatalogGap, Seller, Product, RegionalCollection, AnalyticsSnapshot
- User → Seller
- Festival → DemandSignal, CatalogGap, RegionalCollection
- GIProduct → Product
- Seller → Product, SellerApplication
- RegionalCollection → RegionalCollectionProduct

### Many-to-Many Relationships
- Product ↔ Textile (via ProductTextile)
- RegionalCollection ↔ Product (via RegionalCollectionProduct)

### Optional Relationships
- Product → Region (optional)
- Product → GIProduct (optional)
- CatalogItem → Product (optional)
- DemandSignal → Festival (optional)
- CatalogGap → Festival (optional)
- CatalogGap → Product (optional)
- Seller → User (optional)
- RegionalCollection → Region (optional)
- RegionalCollection → Festival (optional)
- AnalyticsSnapshot → Region (optional)

## Index Strategy

### Unique Indexes
- User.email
- Region.code
- GIProduct.registrationNumber
- Seller.email
- SellerApplication.sellerId

### Foreign Key Indexes
- All foreign key columns are indexed for JOIN performance

### Query-Specific Indexes
- DemandSignal.demandScore - For sorting by demand score
- CatalogGap.gap (descending) - For sorting by gap size
- Seller.rating - For sorting by seller rating
- Product.price - For price-based queries
- AnalyticsSnapshot.createdAt - For time-based queries

### Composite Indexes
- Region.centerLat + centerLng - For location queries

## Constraints

### Primary Keys
- All models use UUID primary keys with `@default(uuid())`

### Foreign Keys
- All foreign keys use CASCADE or SET NULL deletion behavior
- CASCADE: Delete dependent records when parent is deleted
- SET NULL: Set foreign key to NULL when parent is deleted (for optional relationships)

### Unique Constraints
- User.email
- Region.code
- GIProduct.registrationNumber
- Seller.email
- SellerApplication.sellerId

### Default Values
- createdAt: @default(now())
- updatedAt: @updatedAt (auto-updates on record update)
- Boolean fields: @default(false) or @default(true)
- Integer fields: @default(0)

### Enum Constraints
- All enum fields are constrained to their respective enum values

## Naming Conventions

### Model Names
- PascalCase: User, Region, Festival, etc.

### Table Names
- snake_case: users, regions, festivals, etc.

### Field Names
- camelCase: userId, regionId, createdAt, etc.

### Database Column Names
- snake_case: user_id, region_id, created_at, etc.

## Data Types

### String
- Used for text fields (names, descriptions, emails, etc.)

### Int
- Used for integer values (quantities, scores, counts)

### Decimal
- Used for precise decimal values (prices, ratings, scores)
- Specified with precision: @db.Decimal(10, 2), @db.Decimal(5, 2), etc.

### Boolean
- Used for boolean flags (giTagged, msme, available, isActive)

### DateTime
- Used for timestamps (createdAt, updatedAt, dates)
- @db.Date for date-only fields

### Json
- Used for flexible JSON data (AnalyticsSnapshot.additionalData)

### String[]
- Used for array fields (Seller.categories)

## Migration Commands

### Generate Prisma Client
```bash
npm run prisma:generate
```

### Create Migration
```bash
npm run prisma:migrate dev --name migration_name
```

### Apply Migrations
```bash
npm run prisma:migrate deploy
```

### Reset Database
```bash
npx prisma migrate reset
```

### Open Prisma Studio
```bash
npm run prisma:studio
```

## Best Practices

1. **Always use enums** for fixed sets of values
2. **Index foreign keys** for JOIN performance
3. **Use UUIDs** for primary keys
4. **Add indexes** for frequently queried fields
5. **Use CASCADE** for required relationships
6. **Use SET NULL** for optional relationships
7. **Include timestamps** for audit trails
8. **Use appropriate data types** for precision
9. **Follow naming conventions** consistently
10. **Test migrations** in development first

## Schema Validation

### Validate Schema
```bash
npx prisma validate
```

### Format Schema
```bash
npx prisma format
```

## Notes

- The schema implements the approved Database Design document
- All relationships follow the ER diagram specifications
- Indexes are optimized for expected query patterns
- Constraints ensure data integrity
- Enums provide type safety for fixed value sets
