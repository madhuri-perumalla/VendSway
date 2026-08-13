# VendSway - Database Design

## Document Information

- **Project Name**: VendSway
- **Document Version**: 1.0
- **Date**: July 15, 2026
- **Purpose**: Complete PostgreSQL database design reference
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.0+
- **Status**: FINAL - Official database reference

---

# 1. Database Entities Overview

## Entity List

1. **User** - User accounts and authentication
2. **Region** - Geographical regions (states)
3. **Festival** - Festivals and their fashion relevance
4. **Textile** - Regional textile types
5. **GIProduct** - GI-tagged products
6. **RegionalTrend** - Regional fashion trends
7. **CatalogItem** - Myntra catalog items
8. **DemandSignal** - Demand signals for regions and categories
9. **CatalogGap** - Gaps between demand and catalog availability
10. **Seller** - Seller/artisan accounts
11. **SellerApplication** - Seller onboarding applications
12. **Product** - Products in the catalog
13. **RegionalCollection** - Curated regional collections
14. **AnalyticsSnapshot** - Analytics data snapshots

---

# 2. Entity Definitions

## 2.1 User

### Table Purpose
Store user account information for authentication and role-based access control.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique user identifier |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| role | VARCHAR(20) | NOT NULL, CHECK (role IN ('ADMIN', 'SELLER', 'CUSTOMER')) | User role |
| name | VARCHAR(255) | NOT NULL | User full name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- None

### Relationships
- One-to-Many: User → Seller (if role is SELLER)

### Indexes
- `idx_user_email` on `email` (UNIQUE)
- `idx_user_role` on `role`

### Constraints
- `chk_user_role`: CHECK (role IN ('ADMIN', 'SELLER', 'CUSTOMER'))
- `uniq_user_email`: UNIQUE (email)

### Seed Data Requirements
- 1 Admin user
- 3 Demo users (Admin, Seller, Customer)
- Email: admin@demo.com, seller@demo.com, customer@demo.com

---

## 2.2 Region

### Table Purpose
Store geographical region information (states) for regional intelligence.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique region identifier |
| name | VARCHAR(255) | NOT NULL | Region name (e.g., "Andhra Pradesh") |
| code | VARCHAR(10) | UNIQUE, NOT NULL | Region code (e.g., "AP") |
| center_lat | DECIMAL(10, 8) | NOT NULL | Center latitude |
| center_lng | DECIMAL(11, 8) | NOT NULL | Center longitude |
| description | TEXT | NULL | Region description |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- None

### Relationships
- One-to-Many: Region → Festival
- One-to-Many: Region → Textile
- One-to-Many: Region → GIProduct
- One-to-Many: Region → RegionalTrend
- One-to-Many: Region → CatalogItem
- One-to-Many: Region → DemandSignal
- One-to-Many: Region → CatalogGap
- One-to-Many: Region → Seller
- One-to-Many: Region → Product
- One-to-Many: Region → RegionalCollection

### Indexes
- `idx_region_code` on `code` (UNIQUE)
- `idx_region_name` on `name`
- `idx_region_location` on `center_lat`, `center_lng`

### Constraints
- `uniq_region_code`: UNIQUE (code)

### Seed Data Requirements
- 3-5 Indian states (Andhra Pradesh, Telangana, Tamil Nadu, Karnataka, Maharashtra)
- Geographic coordinates for map display
- Regional descriptions

---

## 2.3 Festival

### Table Purpose
Store festival information and their fashion relevance for demand analysis.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique festival identifier |
| name | VARCHAR(255) | NOT NULL | Festival name (e.g., "Sankranti") |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Associated region |
| date | DATE | NOT NULL | Festival date |
| description | TEXT | NULL | Festival description |
| fashion_relevance | VARCHAR(20) | NOT NULL, CHECK (fashion_relevance IN ('HIGH', 'MEDIUM', 'LOW')) | Fashion relevance level |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE CASCADE)

### Relationships
- Many-to-One: Festival → Region
- One-to-Many: Festival → DemandSignal
- One-to-Many: Festival → CatalogGap
- One-to-Many: Festival → RegionalCollection

### Indexes
- `idx_festival_region` on `region_id`
- `idx_festival_date` on `date`
- `idx_festival_name` on `name`

### Constraints
- `fk_festival_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE
- `chk_fashion_relevance`: CHECK (fashion_relevance IN ('HIGH', 'MEDIUM', 'LOW'))

### Seed Data Requirements
- 2-3 festivals per region
- Major Indian festivals (Sankranti, Diwali, Ugadi, Pongal)
- Festival dates for current year
- Fashion relevance levels

---

## 2.4 Textile

### Table Purpose
Store regional textile type information for regional intelligence.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique textile identifier |
| name | VARCHAR(255) | NOT NULL | Textile name (e.g., "Pochampally Ikat") |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Associated region |
| description | TEXT | NULL | Textile description |
| gi_tagged | BOOLEAN | NOT NULL, DEFAULT FALSE | GI-tagged status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE CASCADE)

### Relationships
- Many-to-One: Textile → Region
- Many-to-Many: Textile ↔ Product (via junction table)

### Indexes
- `idx_textile_region` on `region_id`
- `idx_textile_name` on `name`
- `idx_textile_gi_tagged` on `gi_tagged`

### Constraints
- `fk_textile_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE

### Seed Data Requirements
- 3-5 textiles per region
- Famous regional textiles (Pochampally Ikat, Kalamkari, Banarasi)
- GI-tagged status

---

## 2.5 GIProduct

### Table Purpose
Store GI-tagged product information for regional intelligence.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique GI product identifier |
| name | VARCHAR(255) | NOT NULL | GI product name (e.g., "Pochampally Ikat Sarees") |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Associated region |
| category | VARCHAR(100) | NOT NULL | Product category |
| description | TEXT | NULL | Product description |
| registration_number | VARCHAR(100) | UNIQUE, NULL | GI registration number |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE CASCADE)

### Relationships
- Many-to-One: GIProduct → Region
- One-to-Many: GIProduct → Product

### Indexes
- `idx_gi_product_region` on `region_id`
- `idx_gi_product_category` on `category`
- `idx_gi_product_registration` on `registration_number` (UNIQUE)

### Constraints
- `fk_gi_product_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE
- `uniq_gi_registration`: UNIQUE (registration_number)

### Seed Data Requirements
- 2-3 GI products per region
- GI registration numbers
- Product categories

---

## 2.6 RegionalTrend

### Table Purpose
Store regional fashion trend information for demand analysis.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique trend identifier |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Associated region |
| category | VARCHAR(100) | NOT NULL | Fashion category |
| trend_score | DECIMAL(5, 2) | NOT NULL, CHECK (trend_score >= 0 AND trend_score <= 100) | Trend score (0-100) |
| seasonality | VARCHAR(20) | NOT NULL, CHECK (seasonality IN ('HIGH', 'MEDIUM', 'LOW')) | Seasonality level |
| period | VARCHAR(20) | NOT NULL | Time period (e.g., "Q1 2026") |
| source | VARCHAR(100) | NOT NULL | Data source |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE CASCADE)

### Relationships
- Many-to-One: RegionalTrend → Region

### Indexes
- `idx_regional_trend_region` on `region_id`
- `idx_regional_trend_category` on `category`
- `idx_regional_trend_period` on `period`

### Constraints
- `fk_regional_trend_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE
- `chk_trend_score`: CHECK (trend_score >= 0 AND trend_score <= 100)
- `chk_seasonality`: CHECK (seasonality IN ('HIGH', 'MEDIUM', 'LOW'))

### Seed Data Requirements
- 3-5 trends per region
- Trend scores by category
- Seasonality levels
- Time periods

---

## 2.7 CatalogItem

### Table Purpose
Store Myntra catalog item information for gap analysis.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique catalog item identifier |
| product_id | UUID | NULL, FOREIGN KEY → Product.id | Associated product |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Available region |
| category | VARCHAR(100) | NOT NULL | Product category |
| available_quantity | INTEGER | NOT NULL, DEFAULT 0 | Available quantity |
| last_updated | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `product_id` → Product.id (ON DELETE SET NULL)
- `region_id` → Region.id (ON DELETE CASCADE)

### Relationships
- Many-to-One: CatalogItem → Product
- Many-to-One: CatalogItem → Region

### Indexes
- `idx_catalog_item_product` on `product_id`
- `idx_catalog_item_region` on `region_id`
- `idx_catalog_item_category` on `category`

### Constraints
- `fk_catalog_item_product`: FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE SET NULL
- `fk_catalog_item_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE

### Seed Data Requirements
- 10-15 catalog items per region
- Available quantities
- Product categories

---

## 2.8 DemandSignal

### Table Purpose
Store demand signals for regions and categories for gap analysis.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique demand signal identifier |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Associated region |
| category | VARCHAR(100) | NOT NULL | Product category |
| festival_id | UUID | NULL, FOREIGN KEY → Festival.id | Associated festival |
| demand_score | DECIMAL(5, 2) | NOT NULL, CHECK (demand_score >= 0 AND demand_score <= 100) | Demand score (0-100) |
| seasonality | VARCHAR(20) | NOT NULL, CHECK (seasonality IN ('HIGH', 'MEDIUM', 'LOW')) | Seasonality level |
| source | VARCHAR(100) | NOT NULL | Data source |
| period | VARCHAR(20) | NOT NULL | Time period (e.g., "Q1 2026") |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE CASCADE)
- `festival_id` → Festival.id (ON DELETE SET NULL)

### Relationships
- Many-to-One: DemandSignal → Region
- Many-to-One: DemandSignal → Festival
- One-to-Many: DemandSignal → CatalogGap

### Indexes
- `idx_demand_signal_region` on `region_id`
- `idx_demand_signal_category` on `category`
- `idx_demand_signal_festival` on `festival_id`
- `idx_demand_signal_period` on `period`
- `idx_demand_signal_score` on `demand_score`

### Constraints
- `fk_demand_signal_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE
- `fk_demand_signal_festival`: FOREIGN KEY (festival_id) REFERENCES Festival(id) ON DELETE SET NULL
- `chk_demand_score`: CHECK (demand_score >= 0 AND demand_score <= 100)
- `chk_seasonality`: CHECK (seasonality IN ('HIGH', 'MEDIUM', 'LOW'))

### Seed Data Requirements
- 5-10 demand signals per region
- Demand scores by category
- Festival associations
- Seasonality levels

---

## 2.9 CatalogGap

### Table Purpose
Store catalog gaps between demand and availability.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique gap identifier |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Associated region |
| category | VARCHAR(100) | NOT NULL | Product category |
| festival_id | UUID | NULL, FOREIGN KEY → Festival.id | Associated festival |
| product_id | UUID | NULL, FOREIGN KEY → Product.id | Associated product |
| demand | INTEGER | NOT NULL, DEFAULT 0 | Demand quantity |
| available | INTEGER | NOT NULL, DEFAULT 0 | Available quantity |
| gap | INTEGER | NOT NULL, DEFAULT 0 | Gap quantity (demand - available) |
| priority | VARCHAR(20) | NOT NULL, CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW')) | Gap priority |
| identified_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Gap identification timestamp |
| resolved_at | TIMESTAMP | NULL | Gap resolution timestamp |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE CASCADE)
- `festival_id` → Festival.id (ON DELETE SET NULL)
- `product_id` → Product.id (ON DELETE SET NULL)

### Relationships
- Many-to-One: CatalogGap → Region
- Many-to-One: CatalogGap → Festival
- Many-to-One: CatalogGap → Product

### Indexes
- `idx_catalog_gap_region` on `region_id`
- `idx_catalog_gap_category` on `category`
- `idx_catalog_gap_festival` on `festival_id`
- `idx_catalog_gap_priority` on `priority`
- `idx_catalog_gap_gap` on `gap` (DESC)
- `idx_catalog_gap_resolved` on `resolved_at`

### Constraints
- `fk_catalog_gap_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE
- `fk_catalog_gap_festival`: FOREIGN KEY (festival_id) REFERENCES Festival(id) ON DELETE SET NULL
- `fk_catalog_gap_product`: FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE SET NULL
- `chk_priority`: CHECK (priority IN ('HIGH', 'MEDIUM', 'LOW'))

### Seed Data Requirements
- 5-10 catalog gaps per region
- Demand and available quantities
- Gap calculations
- Priority levels

---

## 2.10 Seller

### Table Purpose
Store seller/artisan account information.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique seller identifier |
| user_id | UUID | NULL, FOREIGN KEY → User.id | Associated user account |
| business_name | VARCHAR(255) | NOT NULL | Business name |
| contact_person | VARCHAR(255) | NOT NULL | Contact person name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Business email |
| phone | VARCHAR(20) | NOT NULL | Contact phone number |
| location | VARCHAR(255) | NOT NULL | Business location |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Associated region |
| gi_tagged | BOOLEAN | NOT NULL, DEFAULT FALSE | GI-tagged status |
| msme | BOOLEAN | NOT NULL, DEFAULT FALSE | MSME status |
| msme_number | VARCHAR(100) | NULL | MSME registration number |
| categories | TEXT[] | NOT NULL | Product categories (array) |
| production_capacity | INTEGER | NOT NULL, DEFAULT 0 | Production capacity |
| rating | DECIMAL(3, 2) | NOT NULL, CHECK (rating >= 1 AND rating <= 5) | Seller rating (1-5) |
| status | VARCHAR(20) | NOT NULL, CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')) | Seller status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `user_id` → User.id (ON DELETE SET NULL)
- `region_id` → Region.id (ON DELETE CASCADE)

### Relationships
- Many-to-One: Seller → User
- Many-to-One: Seller → Region
- One-to-Many: Seller → SellerApplication
- One-to-Many: Seller → Product

### Indexes
- `idx_seller_user` on `user_id`
- `idx_seller_email` on `email` (UNIQUE)
- `idx_seller_region` on `region_id`
- `idx_seller_status` on `status`
- `idx_seller_gi_tagged` on `gi_tagged`
- `idx_seller_msme` on `msme`
- `idx_seller_rating` on `rating`

### Constraints
- `fk_seller_user`: FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE SET NULL
- `fk_seller_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE
- `uniq_seller_email`: UNIQUE (email)
- `chk_rating`: CHECK (rating >= 1 AND rating <= 5)
- `chk_status`: CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))

### Seed Data Requirements
- 15-20 sellers across regions
- Business details (name, contact, location)
- GI-tagged and MSME status
- Product categories
- Production capacities
- Ratings

---

## 2.11 SellerApplication

### Table Purpose
Store seller onboarding application information.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique application identifier |
| seller_id | UUID | NOT NULL, UNIQUE, FOREIGN KEY → Seller.id | Associated seller |
| status | VARCHAR(20) | NOT NULL, CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED')) | Application status |
| submitted_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Submission timestamp |
| reviewed_at | TIMESTAMP | NULL | Review timestamp |
| reviewed_by | VARCHAR(255) | NULL | Reviewer name |
| notes | TEXT | NULL | Review notes |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `seller_id` → Seller.id (ON DELETE CASCADE)

### Relationships
- One-to-One: SellerApplication → Seller

### Indexes
- `idx_seller_application_seller` on `seller_id` (UNIQUE)
- `idx_seller_application_status` on `status`

### Constraints
- `fk_seller_application_seller`: FOREIGN KEY (seller_id) REFERENCES Seller(id) ON DELETE CASCADE
- `uniq_seller_application_seller`: UNIQUE (seller_id)
- `chk_application_status`: CHECK (status IN ('SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'))

### Seed Data Requirements
- 1 application per seller
- Application statuses
- Review information

---

## 2.12 Product

### Table Purpose
Store product information in the catalog.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique product identifier |
| name | VARCHAR(255) | NOT NULL | Product name |
| category | VARCHAR(100) | NOT NULL | Product category |
| region_id | UUID | NULL, FOREIGN KEY → Region.id | Associated region |
| seller_id | UUID | NOT NULL, FOREIGN KEY → Seller.id | Associated seller |
| gi_product_id | UUID | NULL, FOREIGN KEY → GIProduct.id | Associated GI product |
| price | DECIMAL(10, 2) | NOT NULL, CHECK (price > 0) | Product price |
| gi_tagged | BOOLEAN | NOT NULL, DEFAULT FALSE | GI-tagged status |
| description | TEXT | NULL | Product description |
| image_url | VARCHAR(500) | NULL | Product image URL |
| available | BOOLEAN | NOT NULL, DEFAULT TRUE | Availability status |
| stock | INTEGER | NOT NULL, DEFAULT 0 | Stock quantity |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE SET NULL)
- `seller_id` → Seller.id (ON DELETE CASCADE)
- `gi_product_id` → GIProduct.id (ON DELETE SET NULL)

### Relationships
- Many-to-One: Product → Region
- Many-to-One: Product → Seller
- Many-to-One: Product → GIProduct
- Many-to-Many: Product ↔ Textile (via junction table)
- One-to-Many: Product → CatalogItem
- One-to-Many: Product → CatalogGap

### Indexes
- `idx_product_region` on `region_id`
- `idx_product_seller` on `seller_id`
- `idx_product_category` on `category`
- `idx_product_gi_tagged` on `gi_tagged`
- `idx_product_price` on `price`
- `idx_product_available` on `available`

### Constraints
- `fk_product_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE SET NULL
- `fk_product_seller`: FOREIGN KEY (seller_id) REFERENCES Seller(id) ON DELETE CASCADE
- `fk_product_gi_product`: FOREIGN KEY (gi_product_id) REFERENCES GIProduct(id) ON DELETE SET NULL
- `chk_price`: CHECK (price > 0)

### Seed Data Requirements
- 15-20 products across sellers
- Product details (name, category, price)
- GI-tagged status
- Stock quantities
- Image URLs

---

## 2.13 ProductTextile (Junction Table)

### Table Purpose
Many-to-many relationship between products and textiles.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| product_id | UUID | NOT NULL, FOREIGN KEY → Product.id | Product identifier |
| textile_id | UUID | NOT NULL, FOREIGN KEY → Textile.id | Textile identifier |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Primary Key
- Composite: (`product_id`, `textile_id`)

### Foreign Keys
- `product_id` → Product.id (ON DELETE CASCADE)
- `textile_id` → Textile.id (ON DELETE CASCADE)

### Relationships
- Many-to-Many: Product ↔ Textile

### Indexes
- `idx_product_textile_product` on `product_id`
- `idx_product_textile_textile` on `textile_id`

### Constraints
- `fk_product_textile_product`: FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
- `fk_product_textile_textile`: FOREIGN KEY (textile_id) REFERENCES Textile(id) ON DELETE CASCADE
- `pk_product_textile`: PRIMARY KEY (product_id, textile_id)

### Seed Data Requirements
- 1-3 textiles per product
- Product-textile associations

---

## 2.14 RegionalCollection

### Table Purpose
Store curated regional collection information.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique collection identifier |
| name | VARCHAR(255) | NOT NULL | Collection name |
| region_id | UUID | NOT NULL, FOREIGN KEY → Region.id | Associated region |
| festival_id | UUID | NULL, FOREIGN KEY → Festival.id | Associated festival |
| description | TEXT | NULL | Collection description |
| is_active | BOOLEAN | NOT NULL, DEFAULT TRUE | Active status |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE CASCADE)
- `festival_id` → Festival.id (ON DELETE SET NULL)

### Relationships
- Many-to-One: RegionalCollection → Region
- Many-to-One: RegionalCollection → Festival
- Many-to-Many: RegionalCollection ↔ Product (via junction table)

### Indexes
- `idx_regional_collection_region` on `region_id`
- `idx_regional_collection_festival` on `festival_id`
- `idx_regional_collection_active` on `is_active`

### Constraints
- `fk_regional_collection_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE CASCADE
- `fk_regional_collection_festival`: FOREIGN KEY (festival_id) REFERENCES Festival(id) ON DELETE SET NULL

### Seed Data Requirements
- 2-3 collections per region
- Festival associations
- Active status

---

## 2.15 RegionalCollectionProduct (Junction Table)

### Table Purpose
Many-to-many relationship between regional collections and products.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| collection_id | UUID | NOT NULL, FOREIGN KEY → RegionalCollection.id | Collection identifier |
| product_id | UUID | NOT NULL, FOREIGN KEY → Product.id | Product identifier |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Primary Key
- Composite: (`collection_id`, `product_id`)

### Foreign Keys
- `collection_id` → RegionalCollection.id (ON DELETE CASCADE)
- `product_id` → Product.id (ON DELETE CASCADE)

### Relationships
- Many-to-Many: RegionalCollection ↔ Product

### Indexes
- `idx_regional_collection_product_collection` on `collection_id`
- `idx_regional_collection_product_product` on `product_id`

### Constraints
- `fk_regional_collection_product_collection`: FOREIGN KEY (collection_id) REFERENCES RegionalCollection(id) ON DELETE CASCADE
- `fk_regional_collection_product_product`: FOREIGN KEY (product_id) REFERENCES Product(id) ON DELETE CASCADE
- `pk_regional_collection_product`: PRIMARY KEY (collection_id, product_id)

### Seed Data Requirements
- 5-10 products per collection
- Collection-product associations

---

## 2.16 AnalyticsSnapshot

### Table Purpose
Store analytics data snapshots for reporting.

### Columns

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique snapshot identifier |
| region_id | UUID | NULL, FOREIGN KEY → Region.id | Associated region |
| metric_type | VARCHAR(50) | NOT NULL | Metric type (e.g., "DEMAND", "GAP", "SELLER") |
| metric_value | DECIMAL(15, 2) | NOT NULL | Metric value |
| period | VARCHAR(20) | NOT NULL | Time period (e.g., "Q1 2026") |
| additional_data | JSONB | NULL | Additional metric data |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### Primary Key
- `id` (UUID)

### Foreign Keys
- `region_id` → Region.id (ON DELETE SET NULL)

### Relationships
- Many-to-One: AnalyticsSnapshot → Region

### Indexes
- `idx_analytics_snapshot_region` on `region_id`
- `idx_analytics_snapshot_metric_type` on `metric_type`
- `idx_analytics_snapshot_period` on `period`
- `idx_analytics_snapshot_created` on `created_at`

### Constraints
- `fk_analytics_snapshot_region`: FOREIGN KEY (region_id) REFERENCES Region(id) ON DELETE SET NULL

### Seed Data Requirements
- Historical analytics data
- Multiple metric types
- Time periods

---

# 3. Entity Relationship Diagram

```
┌─────────────┐
│    USER     │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│   SELLER    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│SELLER_APP   │
└─────────────┘

┌─────────────┐
│   REGION    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐         ┌─────────────┐
│  FESTIVAL   │         │   TEXTILE   │
└──────┬──────┘         └──────┬──────┘
       │                        │
       │ *                      │ *
┌──────▼──────┐         ┌──────▼──────┐
│ DEMAND_SIG  │         │   PRODUCT   │
└──────┬──────┘         └──────┬──────┘
       │ *                      │ *
       M                        M
       │                        │
┌──────▼──────┐         ┌──────▼──────┐
│ CATALOG_GAP │         │PRODUCT_TEXTILE│
└─────────────┘         └─────────────┘

┌─────────────┐
│   REGION    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│   SELLER    │
└──────┬──────┘
       │
       │ *
┌──────▼──────┐
│   PRODUCT   │
└─────────────┘

┌─────────────┐
│   REGION    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│GI_PRODUCT   │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│   PRODUCT   │
└─────────────┘

┌─────────────┐
│   REGION    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│REG_COLLECT  │
└──────┬──────┘
       │
       │ *
┌──────▼──────┐
│REG_COLLECT_ │
│   PRODUCT   │
└─────────────┘

┌─────────────┐
│   REGION    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│CATALOG_ITEM │
└─────────────┘

┌─────────────┐
│   REGION    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│REG_TREND    │
└─────────────┘

┌─────────────┐
│   REGION    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│ANALYTICS_SNAP│
└─────────────┘
```

**Relationship Legend**:
- `1` = One
- `*` = Many
- `M` = Many
- `N` = Many
- `M` ↔ `N` = Many-to-many relationship

---

# 4. Database Normalization

## Normalization Level: 3NF (Third Normal Form)

### First Normal Form (1NF)
- All tables have primary keys
- All columns contain atomic values
- No repeating groups
- Arrays used only for categories (PostgreSQL native type)

### Second Normal Form (2NF)
- All non-key attributes are fully dependent on primary key
- No partial dependencies
- Junction tables for many-to-many relationships

### Third Normal Form (3NF)
- No transitive dependencies
- All non-key attributes depend only on primary key
- Foreign keys properly defined

### Normalization Benefits
- Reduced data redundancy
- Improved data integrity
- Easier maintenance
- Better query performance
- Consistent data structure

### Denormalization Considerations
- Categories stored as arrays (PostgreSQL native type) for query efficiency
- Analytics snapshots for historical reporting (intentional denormalization)
- No denormalization for MVP - keep normalized structure

---

# 5. Query Optimization Strategy

## Index Strategy

### Primary Indexes
- All primary keys (UUID) automatically indexed
- Composite primary keys for junction tables

### Foreign Key Indexes
- All foreign keys indexed for JOIN performance
- Region-based indexes for regional queries
- Festival-based indexes for festival queries

### Query-Specific Indexes
- `idx_demand_signal_score` for sorting by demand score
- `idx_catalog_gap_gap` for sorting by gap size
- `idx_seller_rating` for sorting by seller rating
- `idx_product_price` for price-based queries
- `idx_analytics_snapshot_period` for time-based queries

### Unique Indexes
- Email addresses (User, Seller)
- Region codes
- GI registration numbers

## Query Optimization Techniques

### JOIN Optimization
- Use INNER JOIN for required relationships
- Use LEFT JOIN for optional relationships
- Index foreign keys for JOIN performance
- Limit JOIN depth to 3-4 tables maximum

### WHERE Clause Optimization
- Index columns used in WHERE clauses
- Use indexed columns first in WHERE clauses
- Avoid functions on indexed columns in WHERE clauses
- Use parameterized queries

### ORDER BY Optimization
- Index columns used in ORDER BY clauses
- Limit ORDER BY to indexed columns
- Use LIMIT for pagination

### Subquery Optimization
- Use EXISTS instead of IN for subqueries
- Use JOIN instead of subqueries when possible
- Materialize complex subqueries

### Aggregation Optimization
- Index columns used in GROUP BY
- Use HAVING after GROUP BY
- Pre-aggregate data in analytics snapshots

## Caching Strategy

### Query Caching
- Cache frequently accessed regional data
- Cache festival data (changes seasonally)
- Cache seller data (changes periodically)

### Materialized Views (Future)
- Regional demand aggregates
- Catalog gap summaries
- Seller performance metrics

---

# 6. Future Scalability Considerations

## Horizontal Scaling

### Database Sharding
- Shard by region for regional data
- Shard by seller for seller data
- Shard by time period for analytics data

### Read Replicas
- Primary database for writes
- Read replicas for read-heavy queries
- Analytics queries on read replicas

### Connection Pooling
- Use PgBouncer for connection pooling
- Configure appropriate pool size
- Monitor connection usage

## Vertical Scaling

### Hardware Upgrades
- Increase CPU for query processing
- Increase RAM for caching
- Increase storage for data growth

### Query Optimization
- Analyze slow queries with EXPLAIN ANALYZE
- Optimize indexes based on query patterns
- Rewrite inefficient queries

## Data Archival

### Historical Data
- Archive old analytics snapshots
- Archive resolved catalog gaps
- Archive old demand signals

### Partitioning
- Partition analytics snapshots by time
- Partition demand signals by period
- Partition catalog gaps by region

## Performance Monitoring

### Query Performance
- Monitor slow query log
- Track query execution time
- Monitor index usage

### Database Metrics
- Monitor CPU usage
- Monitor memory usage
- Monitor disk I/O
- Monitor connection count

## Backup Strategy

### Regular Backups
- Daily full backups
- Hourly incremental backups
- Point-in-time recovery

### Backup Testing
- Regular restore testing
- Backup integrity verification
- Disaster recovery planning

---

# 7. Database Constraints Summary

## Primary Key Constraints
- All tables have UUID primary keys
- Junction tables have composite primary keys

## Foreign Key Constraints
- All foreign keys properly defined
- CASCADE DELETE for dependent data
- SET NULL for optional relationships

## Unique Constraints
- User email
- Seller email
- Region code
- GI registration number
- Seller application (one-to-one)

## Check Constraints
- User role (ADMIN, SELLER, CUSTOMER)
- Fashion relevance (HIGH, MEDIUM, LOW)
- Seasonality (HIGH, MEDIUM, LOW)
- Trend score (0-100)
- Demand score (0-100)
- Seller rating (1-5)
- Price (> 0)
- Seller status (PENDING, APPROVED, REJECTED)
- Application status (SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED)

## Not Null Constraints
- All required fields marked as NOT NULL
- Optional fields allow NULL

---

# 8. Seed Data Summary

## Minimum Seed Data Requirements

### Users
- 1 Admin user
- 3 Demo users (Admin, Seller, Customer)

### Regions
- 3-5 Indian states
- Geographic coordinates
- Regional descriptions

### Festivals
- 2-3 festivals per region
- Festival dates
- Fashion relevance levels

### Textiles
- 3-5 textiles per region
- GI-tagged status

### GI Products
- 2-3 GI products per region
- Registration numbers

### Regional Trends
- 3-5 trends per region
- Trend scores

### Catalog Items
- 10-15 items per region
- Available quantities

### Demand Signals
- 5-10 signals per region
- Demand scores

### Catalog Gaps
- 5-10 gaps per region
- Gap calculations

### Sellers
- 15-20 sellers across regions
- Business details
- GI-tagged and MSME status

### Seller Applications
- 1 application per seller
- Application statuses

### Products
- 15-20 products across sellers
- Product details
- Stock quantities

### Regional Collections
- 2-3 collections per region
- Festival associations

### Analytics Snapshots
- Historical analytics data
- Multiple metric types

---

# 9. Database Migration Strategy

## Migration Order

1. **User** - Base user table
2. **Region** - Base region table
3. **Festival** - Depends on Region
4. **Textile** - Depends on Region
5. **GIProduct** - Depends on Region
6. **RegionalTrend** - Depends on Region
7. **CatalogItem** - Depends on Region, Product
8. **DemandSignal** - Depends on Region, Festival
9. **CatalogGap** - Depends on Region, Festival, Product
10. **Seller** - Depends on User, Region
11. **SellerApplication** - Depends on Seller
12. **Product** - Depends on Region, Seller, GIProduct
13. **ProductTextile** - Depends on Product, Textile
14. **RegionalCollection** - Depends on Region, Festival
15. **RegionalCollectionProduct** - Depends on RegionalCollection, Product
16. **AnalyticsSnapshot** - Depends on Region

## Rollback Strategy
- Each migration includes rollback script
- Rollback in reverse order of migration
- Test rollback scripts before deployment

---

# 10. Security Considerations

## Data Security
- Encrypt sensitive data at rest (future)
- Use SSL/TLS for database connections
- Implement row-level security (future)
- Regular security audits

## Access Control
- Least privilege principle for database users
- Separate read and write users
- Application user with limited permissions
- Admin user for migrations

## SQL Injection Prevention
- Use parameterized queries (Prisma ORM)
- Validate all inputs
- Sanitize user inputs
- Use prepared statements

---

## Sign-Off

This Database Design is **FINAL**. All database decisions are frozen and should not change during implementation without explicit instruction from the project lead.

**Approved By**: Database Architect
**Date**: July 15, 2026
**Version**: 1.0
