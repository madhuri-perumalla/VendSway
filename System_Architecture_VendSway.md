# VendSway - System Architecture Design

## Document Information

- **Project Name**: VendSway
- **Document Version**: 1.0
- **Date**: July 15, 2026
- **Purpose**: Complete system architecture blueprint for implementation
- **Status**: FINAL - Official architecture reference

---

# 1. High-Level System Architecture

## Architecture Overview

VendSway is a full-stack regional commerce intelligence platform with five distinct layers:

### Frontend Layer
**Responsibility**: User interface and interaction
- React.js SPA with TypeScript
- Demo role selection (Admin/Seller/Customer)
- Client-side routing with React Router
- State management via Zustand (global state)
- Server state via React Query (API data)
- Component-based architecture with feature modules
- Communication with backend via REST API

### Backend Layer
**Responsibility**: Business logic and intelligence services
- Node.js with Express and TypeScript
- RESTful API endpoints
- Two intelligence services:
  - **Intelligence Service**:
    - Regional Analysis Module
    - Demand Scoring Module
    - Catalog Gap Module
    - Seller Matching Module
  - **Storefront Service**:
    - Regional Personalization Module
    - Recommendation Logic Module
- Request validation and error handling
- CORS and security middleware

### Database Layer
**Responsibility**: Data persistence and relationships
- Supabase (PostgreSQL cloud database)
- Prisma ORM for data access
- Seed data for mock government and seller datasets
- Schema management via Prisma db push
- Query optimization and indexing

### External Data Layer
**Responsibility**: Mock data sources for MVP
- Mock government textile datasets (JSON → PostgreSQL)
- Mock MSME directories (JSON → PostgreSQL)
- Mock GI-tag registries (JSON → PostgreSQL)
- Mock platform catalog data (JSON → PostgreSQL)
- Mock festival calendars (JSON → PostgreSQL)
- Future: Real government APIs, platform internal APIs

### Intelligence Layer
**Responsibility**: Business logic and calculations
- Regional data aggregation and profiling
- Demand score calculations (festival + preferences + catalog + GI)
- Gap detection and prioritization
- Seller matching and ranking algorithms
- Regional storefront generation
- Product and festival recommendations

## Layer Communication

**Frontend → Backend**: HTTP/REST via Axios
- JSON request/response format
- JWT token in Authorization header (future)
- Error handling with standardized format
- Request/response interceptors

**Backend → Database**: Prisma ORM
- Type-safe queries
- Relationship loading
- Transaction support
- Connection pooling

**Backend → External Data**: Direct data access (MVP)
- JSON file imports during seeding
- Future: REST API calls to government services
- Future: Platform internal API integration

**Intelligence Engines → Database**: Read/Write via Prisma
- Read: Regional data, catalog data, seller data
- Write: Calculated gaps, demand scores, recommendations
- Batch operations for performance

## Layer Responsibilities

| Layer | Primary Responsibility | Key Technologies |
|-------|----------------------|------------------|
| Frontend | User experience, role-based UI | React, TypeScript, TailwindCSS |
| Backend | API, business logic, intelligence | Node.js, Express, TypeScript |
| Database | Data persistence, relationships | PostgreSQL, Prisma |
| External Data | Source data for intelligence | JSON files (MVP), APIs (future) |
| Intelligence | Calculations, algorithms, matching | Custom business logic engines |

---

# 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USERS                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │  Admin   │  │  Seller  │  │ Customer │                     │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                     │
│       │             │             │                             │
└───────┼─────────────┼─────────────┼─────────────────────────────┘
        │             │             │
        └─────────────┼─────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    FRONTEND LAYER                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React SPA + TypeScript                                   │  │
│  │  - Demo Role Selection (Admin/Seller/Customer)            │  │
│  │  - Feature Modules (Regional, Gap, Seller, Storefront)    │  │
│  │  - State Management (React Context)                       │  │
│  │  - Routing (React Router)                                 │  │
│  └───────────────────────┬───────────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────────────┘
                           │ HTTP/REST (Axios)
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    BACKEND LAYER                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Express API + TypeScript                                 │  │
│  │  - RESTful Endpoints                                      │  │
│  │  - Middleware (Validation, CORS, Error)                   │  │
│  └───────────────────────┬───────────────────────────────────┘  │
│                          │                                       │
│  ┌───────────────────────▼───────────────────────────────────┐  │
│  │              INTELLIGENCE SERVICES                         │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Intelligence Service                                │  │  │
│  │  │ - Regional Analysis Module                           │  │  │
│  │  │ - Demand Scoring Module                              │  │  │
│  │  │ - Catalog Gap Module                                 │  │  │
│  │  │ - Seller Matching Module                              │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────┐  │  │
│  │  │ Storefront Service                                   │  │  │
│  │  │ - Regional Personalization Module                     │  │  │
│  │  │ - Recommendation Logic Module                         │  │  │
│  │  └─────────────────────────────────────────────────────┘  │  │
│  └───────────────────────┬───────────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────────────┘
                           │ Prisma ORM
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    DATABASE LAYER                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  PostgreSQL + Prisma ORM                                    │  │
│  │  - Regions, Festivals, Textile Clusters                  │  │
│  │  - Sellers, Products, Catalog Gaps                        │  │
│  │  - Demand Signals, Recommendations                         │  │
│  │  - User Preferences, Applications                         │  │
│  └───────────────────────┬───────────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                 EXTERNAL DATA LAYER (MVP)                         │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Mock Government Data (JSON → PostgreSQL)                   │  │
│  │  - Textile datasets                                        │  │
│  │  - MSME directories                                        │  │
│  │  - GI-tag registries                                       │  │
│  │  - Festival calendars                                      │  │
│  │  - Platform catalog data                                  │  │
│  │  - Seller databases                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

---

# 3. Detailed Module Architecture

## Regional Intelligence Module

### Purpose
Aggregate and analyze regional fashion information to build comprehensive regional profiles.

### Responsibilities
- Collect regional textile data
- Aggregate festival information
- Map textile clusters
- Identify GI-tag products
- Compute regional fashion profiles
- Provide demand signals

### Inputs
- Government textile datasets
- MSME directories
- GI-tag registries
- Festival calendars
- Textile cluster information
- Regional fashion traditions

### Processing
1. **Data Ingestion**: Import JSON datasets into PostgreSQL
2. **Normalization**: Standardize data formats across sources
3. **Aggregation**: Group data by region and category
4. **Profiling**: Compute regional fashion profiles
5. **Indexing**: Create searchable indexes for queries

### Outputs
- Regional profiles (textiles, festivals, clusters, GI-tags)
- Demand signals by region and category
- Regional fashion scores
- Textile cluster mappings

### Dependencies
- PostgreSQL database
- Prisma ORM
- External data sources (JSON files)
- Regional Intelligence Service

---

## Catalog Gap Detection Module

### Purpose
Compare regional demand signals with platform catalog availability to identify missing products.

### Responsibilities
- Calculate demand scores for regions and categories
- Compare demand vs available inventory
- Identify catalog gaps
- Prioritize gaps by opportunity score
- Track gap resolution

### Inputs
- Regional demand signals (from Regional Intelligence Module)
- Platform catalog data (mock)
- Festival calendar data
- GI-tag product data

### Processing
1. **Demand Calculation**: 
   - Festival demand weight
   - Regional preference weight
   - Catalog availability weight
   - GI importance weight
   - Total demand score = sum of weighted factors

2. **Gap Calculation**:
   - Gap = Demand - Available
   - Priority = HIGH if gap > threshold
   - Priority = MEDIUM if gap > lower threshold
   - Priority = LOW otherwise

3. **Prioritization**:
   - Sort by gap size
   - Sort by festival urgency
   - Sort by GI importance

### Outputs
- Catalog gaps by region and category
- Gap priority scores
- Opportunity rankings
- Gap resolution status

### Dependencies
- Regional Intelligence Module
- Catalog data
- Demand Prediction Engine
- PostgreSQL database

---

## Seller Discovery Module

### Purpose
Identify and match potential sellers to fill identified catalog gaps.

### Responsibilities
- Search seller databases
- Match seller capabilities to catalog gaps
- Filter by region, category, capacity
- Rank sellers by GI-tag, MSME status, rating
- Provide seller recommendations

### Inputs
- Catalog gaps (from Catalog Gap Module)
- Seller databases (MSME, handloom, GI producers)
- Regional data
- Capacity information

### Processing
1. **Matching Algorithm**:
   - Filter sellers by gap region
   - Filter by gap category
   - Filter by production capacity
   - Calculate match score:
     - GI-tagged: +20 points
     - MSME certified: +15 points
     - High rating: +10 points
     - Close proximity: +5 points

2. **Ranking**:
   - Sort by match score
   - Sort by production capacity
   - Sort by rating

3. **Filtering**:
   - Apply user filters (GI-tag, MSME, distance)
   - Return top N matches

### Outputs
- Matched seller lists
- Seller match scores
- Seller profiles
- Contact information

### Dependencies
- Catalog Gap Module
- Seller databases
- Regional Intelligence Module
- Seller Matching Engine

---

## Seller Portal Module

### Purpose
Provide sellers with registration, product management, and application tracking capabilities.

### Responsibilities
- Seller registration
- Business detail submission
- Product addition and management
- Image upload
- Application status tracking
- Onboarding workflow

### Inputs
- Seller registration forms
- Product details
- Image uploads
- Application updates

### Processing
1. **Registration Workflow**:
   - Validate business details
   - Check for duplicates
   - Create seller record
   - Set status to PENDING

2. **Product Addition**:
   - Validate product details
   - Assign regional tags
   - Link to seller
   - Set availability status

3. **Status Tracking**:
   - Update application status
   - Track onboarding progress
   - Notify seller of changes

### Outputs
- Seller records
- Product records
- Application status
- Onboarding progress

### Dependencies
- PostgreSQL database
- Product catalog
- Seller Onboarding Engine
- Image storage (placeholder services)

---

## Regional Storefront Module

### Purpose
Generate personalized shopping experiences for customers based on their region.

### Responsibilities
- Generate regional storefronts
- Create festival collections
- Recommend local products
- Show local sellers
- Personalize by region

### Inputs
- Customer region selection
- Regional data (from Regional Intelligence Module)
- Product catalog
- Festival calendar
- Seller data

### Processing
1. **Storefront Generation**:
   - Select region-specific products
   - Filter by regional tags
   - Prioritize GI-tagged products
   - Include local sellers

2. **Festival Collections**:
   - Identify upcoming festivals in region
   - Select festival-appropriate products
   - Create curated collections
   - Update based on festival calendar

3. **Personalization**:
   - Apply regional theme
   - Show regional categories
   - Highlight local sellers
   - Display festival collections

### Outputs
- Regional storefront pages
- Festival collections
- Product recommendations
- Local seller listings

### Dependencies
- Regional Intelligence Module
- Product catalog
- Festival data
- Personalization Engine
- Recommendation Engine

---

## Analytics Module

### Purpose
Provide platform teams with insights into regional demand, catalog gaps, seller growth, and market opportunities.

### Responsibilities
- Aggregate regional demand insights
- Track catalog gap metrics
- Monitor seller onboarding progress
- Identify market opportunities
- Generate analytics reports

### Inputs
- Regional demand data
- Catalog gap data
- Seller application data
- Product catalog data
- User interaction data (future)

### Processing
1. **Demand Analytics**:
   - Aggregate demand by region
   - Trend analysis over time
   - Festival demand spikes
   - Category popularity

2. **Gap Analytics**:
   - Track gap resolution
   - Identify persistent gaps
   - Measure gap impact
   - Prioritize gap filling

3. **Seller Analytics**:
   - Track onboarding progress
   - Monitor seller growth
   - Analyze seller performance
   - Identify top sellers

### Outputs
- Regional demand dashboards
- Catalog gap reports
- Seller growth metrics
- Market opportunity insights
- Analytics visualizations

### Dependencies
- All data sources
- Regional Intelligence Module
- Catalog Gap Module
- Seller Discovery Module
- Visualization libraries (Recharts)

---

## Admin Module

### Purpose
Provide platform administrators with tools to manage the platform, review applications, and configure settings.

### Responsibilities
- Review seller applications
- Approve/reject sellers
- Manage regional data
- Configure system settings
- Monitor platform health

### Inputs
- Seller applications
- System configuration
- Admin actions

### Processing
1. **Application Review**:
   - View seller applications
   - Review business details
   - Approve or reject
   - Update seller status

2. **Data Management**:
   - Add/update regional data
   - Manage festival calendars
   - Update GI-tag information
   - Configure categories

3. **System Configuration**:
   - Configure thresholds
   - Set system parameters
   - Manage user roles
   - Monitor system health

### Outputs
- Approved seller records
- Updated regional data
- System configuration
- Platform health reports

### Dependencies
- Seller Portal Module
- Regional Intelligence Module
- Database
- Admin authentication

---

# 4. Database Architecture

## Main Entities (MVP - 10 Tables)

### User
**Purpose**: Represent all users of the platform (Admin, Seller, Customer)

**Important Attributes**:
- id (UUID, primary key)
- email (string, unique)
- role (enum: ADMIN, SELLER, CUSTOMER)
- name (string)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- One-to-many: User → Seller (if role is SELLER)

---

### Region
**Purpose**: Represent geographical regions (states)

**Important Attributes**:
- id (UUID, primary key)
- name (string, e.g., "Andhra Pradesh")
- code (string, e.g., "AP")
- centerLat (number)
- centerLng (number)
- description (string)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- One-to-many: Region → Textiles
- One-to-many: Region → Festivals
- One-to-many: Region → Sellers
- One-to-many: Region → DemandSignals
- One-to-many: Region → CatalogGaps
- One-to-many: Region → RegionalCollections

---

### Festival
**Purpose**: Represent festivals and their fashion relevance

**Important Attributes**:
- id (UUID, primary key)
- name (string, e.g., "Sankranti")
- regionId (UUID, foreign key to Region)
- date (date)
- description (string)
- fashionRelevance (string)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- Many-to-one: Festival → Region
- One-to-many: Festival → DemandSignals
- One-to-many: Festival → CatalogGaps
- One-to-many: Festival → RegionalCollections

---

### Textile
**Purpose**: Represent regional textile types

**Important Attributes**:
- id (UUID, primary key)
- name (string, e.g., "Pochampally Ikat")
- regionId (UUID, foreign key to Region)
- description (string)
- giTagged (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- Many-to-one: Textile → Region
- Many-to-many: Textile → Products

---

### Product
**Purpose**: Represent products in the catalog

**Important Attributes**:
- id (UUID, primary key)
- name (string)
- category (string)
- regionId (UUID, nullable, foreign key to Region)
- sellerId (UUID, foreign key to Seller)
- textileIds (array of UUIDs, foreign keys to Textile)
- price (number)
- giTagged (boolean)
- description (string)
- imageUrl (string)
- available (boolean)
- stock (number)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- Many-to-one: Product → Region
- Many-to-one: Product → Seller
- Many-to-many: Product → Textiles
- One-to-many: Product → CatalogGaps

---

### Seller
**Purpose**: Represent sellers/artisans on the platform

**Important Attributes**:
- id (UUID, primary key)
- userId (UUID, foreign key to User)
- businessName (string)
- contactPerson (string)
- email (string)
- phone (string)
- location (string)
- regionId (UUID, foreign key to Region)
- giTagged (boolean)
- msme (boolean)
- msmeNumber (string, nullable)
- categories (array of strings)
- productionCapacity (number)
- rating (number, 1-5)
- status (enum: PENDING, APPROVED, REJECTED)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- Many-to-one: Seller → User
- Many-to-one: Seller → Region
- One-to-many: Seller → Products
- One-to-one: Seller → SellerApplication

---

### DemandSignal
**Purpose**: Represent demand signals for regions and categories

**Important Attributes**:
- id (UUID, primary key)
- regionId (UUID, foreign key to Region)
- category (string)
- festivalId (UUID, nullable, foreign key to Festival)
- demandScore (number, 1-100)
- seasonality (enum: HIGH, MEDIUM, LOW)
- source (string)
- period (string)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- Many-to-one: Demand Signal → Region
- Many-to-one: Demand Signal → Festival

---

### CatalogGap
**Purpose**: Represent gaps between demand and catalog availability

**Important Attributes**:
- id (UUID, primary key)
- regionId (UUID, foreign key to Region)
- category (string)
- festivalId (UUID, nullable, foreign key to Festival)
- productId (UUID, nullable, foreign key to Product)
- demand (number)
- available (number)
- gap (number)
- priority (enum: HIGH, MEDIUM, LOW)
- identifiedAt (timestamp)
- resolvedAt (timestamp, nullable)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- Many-to-one: Catalog Gap → Region
- Many-to-one: Catalog Gap → Festival
- Many-to-one: Catalog Gap → Product

---

### SellerApplication
**Purpose**: Track seller onboarding applications

**Important Attributes**:
- id (UUID, primary key)
- sellerId (UUID, foreign key to Seller)
- status (enum: SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED)
- submittedAt (timestamp)
- reviewedAt (timestamp, nullable)
- reviewedBy (string, nullable)
- notes (string, nullable)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- One-to-one: Seller Application → Seller

---

### RegionalCollection
**Purpose**: Represent curated regional collections

**Important Attributes**:
- id (UUID, primary key)
- name (string)
- regionId (UUID, foreign key to Region)
- festivalId (UUID, nullable, foreign key to Festival)
- productIds (array of UUIDs)
- description (string)
- isActive (boolean)
- createdAt (timestamp)
- updatedAt (timestamp)

**Relationships**:
- Many-to-one: Regional Collection → Region
- Many-to-one: Regional Collection → Festival
- Many-to-many: Regional Collection → Products

---

# 5. Database ER Diagram

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
       │ *
┌──────▼──────┐
│   PRODUCT   │
└──────┬──────┘
       │
       │ *
┌──────▼──────┐
│ CATALOG_GAP │
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
└─────────────┘         └─────────────┘
       *                        *
       M                        N

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
│ SELLER_APP  │
└─────────────┘

┌─────────────┐
│   REGION    │
└──────┬──────┘
       │
       │ 1
       │
       │ *
┌──────▼──────┐
│ REG_COLLECT │
└──────┬──────┘
       │
       │ *
┌──────▼──────┐
│   PRODUCT   │
└─────────────┘
```

**Relationship Legend**:
- `1` = One
- `*` = Many
- `M` = Many
- `N` = Many
- `◄──────►` = Many-to-many relationship

---

# 6. API Architecture

## API Layers

### Frontend Layer
**Responsibility**: User interface and API consumption
- React components
- HTTP client (Axios)
- Request/response interceptors
- Error handling
- Loading states

### Controller Layer
**Responsibility**: Request handling and validation
- Express route handlers
- Request validation (Zod schemas)
- Response formatting
- Error propagation
- Authentication checks (future)

### Service Layer
**Responsibility**: Business logic and intelligence
- Intelligence engines
- Business rules
- Data transformation
- Algorithm execution
- Complex calculations

### Repository Layer
**Responsibility**: Data access (abstracted by Prisma)
- Prisma ORM
- Database queries
- Relationship loading
- Transaction management

### Database Layer
**Responsibility**: Data persistence
- PostgreSQL
- Schema enforcement
- Indexing
- Constraints

## API Groups

### Authentication APIs
**Purpose**: Handle user authentication and role selection (demo)

**Responsibilities**:
- Demo role selection (Admin/Seller/Customer)
- Role validation
- Session management (demo)

**Expected Operations**:
- POST /api/auth/select-role - Select demo role
- GET /api/auth/current-role - Get current role
- POST /api/auth/logout - Clear role (demo)

---

### User APIs
**Purpose**: Manage user profiles and preferences

**Responsibilities**:
- User profile management
- Preference management
- User data retrieval

**Expected Operations**:
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- GET /api/users/preferences - Get user preferences
- PUT /api/users/preferences - Update user preferences

---

### Regional Intelligence APIs
**Purpose**: Provide regional fashion intelligence data

**Responsibilities**:
- Regional data retrieval
- Textile information
- Festival information
- Textile cluster data
- GI-tag product data

**Expected Operations**:
- GET /api/intelligence/regions - Get all regions
- GET /api/intelligence/regions/:id - Get region details
- GET /api/intelligence/regions/:id/textiles - Get regional textiles
- GET /api/intelligence/regions/:id/festivals - Get regional festivals
- GET /api/intelligence/regions/:id/clusters - Get textile clusters
- GET /api/intelligence/regions/:id/gi-products - Get GI-tag products
- GET /api/intelligence/demand-signals - Get demand signals

---

### Catalog Gap APIs
**Purpose**: Provide catalog gap analysis and identification

**Responsibilities**:
- Gap calculation
- Gap retrieval
- Gap filtering
- Gap prioritization
- Gap tracking

**Expected Operations**:
- GET /api/gaps - Get catalog gaps
- GET /api/gaps/:id - Get gap details
- GET /api/gaps/region/:regionId - Get gaps by region
- GET /api/gaps/category/:categoryId - Get gaps by category
- GET /api/gaps/festival/:festivalId - Get gaps by festival
- GET /api/gaps/high-priority - Get high-priority gaps
- POST /api/gaps/calculate - Trigger gap calculation

---

### Seller APIs
**Purpose**: Manage seller discovery and information

**Responsibilities**:
- Seller search
- Seller filtering
- Seller matching
- Seller profile retrieval
- Seller ranking

**Expected Operations**:
- GET /api/sellers - Get all sellers
- GET /api/sellers/:id - Get seller details
- GET /api/sellers/region/:regionId - Get sellers by region
- GET /api/sellers/category/:category - Get sellers by category
- GET /api/sellers/match/:gapId - Get sellers matching a gap
- GET /api/sellers/gi-tagged - Get GI-tagged sellers
- GET /api/sellers/msme - Get MSME sellers

---

### Product APIs
**Purpose**: Manage product catalog and information

**Responsibilities**:
- Product retrieval
- Product filtering
- Product search
- Regional product listing
- GI-tagged product listing

**Expected Operations**:
- GET /api/products - Get all products
- GET /api/products/:id - Get product details
- GET /api/products/region/:regionId - Get products by region
- GET /api/products/category/:categoryId - Get products by category
- GET /api/products/seller/:sellerId - Get products by seller
- GET /api/products/gi-tagged - Get GI-tagged products
- GET /api/search/products - Search products

---

### Storefront APIs
**Purpose**: Provide personalized storefront data

**Responsibilities**:
- Regional storefront generation
- Festival collection creation
- Product recommendations
- Local seller listing
- Personalization

**Expected Operations**:
- GET /api/storefront/region/:regionId - Get regional storefront
- GET /api/storefront/festival/:festivalId - Get festival collection
- GET /api/storefront/recommendations/:customerId - Get recommendations
- GET /api/storefront/local-sellers/:regionId - Get local sellers
- GET /api/storefront/categories/:regionId - Get regional categories

---

### Analytics APIs
**Purpose**: Provide analytics and insights

**Responsibilities**:
- Regional demand analytics
- Catalog gap analytics
- Seller growth analytics
- Market opportunity insights
- Report generation

**Expected Operations**:
- GET /api/analytics/demand - Get demand analytics
- GET /api/analytics/gaps - Get gap analytics
- GET /api/analytics/sellers - Get seller analytics
- GET /api/analytics/opportunities - Get market opportunities
- GET /api/analytics/region/:regionId - Get regional analytics

---

# 7. Authentication Architecture

## Authentication Process

### Demo Role Selection (MVP)
1. User loads application
2. Frontend displays role selection screen
3. User selects role (Admin/Seller/Customer)
4. Frontend stores role in Zustand store
5. Frontend stores role in localStorage (persistence)
6. Frontend redirects to role-specific dashboard
7. No backend authentication required

**Storage**: Zustand (global state) + localStorage (persistence)
**Reason**: Hackathon demo only, no real authentication needed

### Future JWT Authentication (Post-MVP)
- JWT tokens for production authentication
- httpOnly cookies for secure token storage
- Token refresh mechanism
- RBAC implementation

## Authorization Process

### Role-Based Access Control (RBAC)
**Roles**:
- **Admin**: Full access to all features, can manage sellers and regional data
- **Seller**: Access to seller portal, can manage products and view status
- **Customer**: Access to storefront, can browse and purchase
- **Platform Analyst**: Access to analytics and insights (future)

### Permission Matrix
| Feature | Admin | Seller | Customer | Platform Analyst |
|---------|-------|--------|----------|---------------|
| Regional Intelligence | ✓ | ✗ | ✗ | ✓ |
| Catalog Gap Detection | ✓ | ✗ | ✗ | ✓ |
| Seller Discovery | ✓ | ✗ | ✗ | ✓ |
| Seller Portal | ✓ | ✓ | ✗ | ✗ |
| Regional Storefront | ✓ | ✗ | ✓ | ✓ |
| Analytics Dashboard | ✓ | ✗ | ✗ | ✓ |
| Seller Management | ✓ | ✗ | ✗ | ✗ |
| Regional Data Management | ✓ | ✗ | ✗ | ✓ |

## Protected Routes
**Admin Routes**:
- `/admin/*` - All admin features
- `/api/intelligence/*` - Regional intelligence management
- `/api/gaps/*` - Gap management
- `/api/sellers/approve` - Seller approval
- `/api/analytics/*` - Analytics access

**Seller Routes**:
- `/seller/*` - Seller portal
- `/api/seller/products` - Product management
- `/api/seller/status` - Status tracking

**Customer Routes**:
- `/storefront/*` - Storefront access
- `/api/storefront/*` - Storefront data

**Public Routes**:
- `/` - Landing page
- `/api/auth/select-role` - Role selection
- `/api/intelligence/regions` - Public regional data

**MVP Implementation**: Role-based routing on frontend using Zustand store

---

# 8. Data Flow Architecture

## Complete Data Movement

### Government & Regional Data Ingestion
```
Government Data (JSON)
    ↓
Data Processing (Normalization)
    ↓
PostgreSQL Database (Seed)
    ↓
Regional Intelligence Engine
    ↓
Regional Profiles
```

**Steps**:
1. Import JSON datasets (textiles, MSME, GI-tags, festivals, clusters)
2. Normalize data formats and structure
3. Seed data into PostgreSQL via Prisma
4. Regional Intelligence Engine aggregates data by region
5. Compute regional fashion profiles
6. Store profiles in database

### Demand Analysis Flow
```
Regional Profiles
    ↓
Demand Prediction Engine
    ↓
Demand Signals (Festival + Preferences + Catalog + GI)
    ↓
Demand Scores
    ↓
PostgreSQL Database
```

**Steps**:
1. Regional Intelligence Engine provides regional profiles
2. Demand Prediction Engine calculates demand scores:
   - Festival demand weight (40%)
   - Regional preference weight (25%)
   - Catalog availability weight (20%)
   - GI importance weight (15%)
3. Generate demand signals by region and category
4. Store demand signals in database

### Catalog Gap Detection Flow
```
Demand Signals
    ↓
Platform Catalog Data
    ↓
Catalog Gap Engine
    ↓
Gap Calculation (Demand - Available)
    ↓
Gap Prioritization
    ↓
Catalog Gaps
    ↓
PostgreSQL Database
```

**Steps**:
1. Retrieve demand signals from database
2. Retrieve platform catalog data
3. Catalog Gap Engine compares demand vs available
4. Calculate gap = demand - available
5. Prioritize gaps by size and urgency
6. Store catalog gaps in database

### Seller Discovery Flow
```
Catalog Gaps
    ↓
Seller Databases (MSME, Handloom, GI)
    ↓
Seller Matching Engine
    ↓
Matching Algorithm (GI + MSME + Capacity + Rating)
    ↓
Seller Rankings
    ↓
Matched Sellers
    ↓
PostgreSQL Database
```

**Steps**:
1. Retrieve catalog gaps from database
2. Retrieve seller databases
3. Seller Matching Engine matches sellers to gaps:
   - Filter by region and category
   - Calculate match score
   - Rank by score
4. Return matched sellers
5. Store match results in database

### Seller Onboarding Flow
```
Seller Registration Form
    ↓
Validation
    ↓
Seller Onboarding Engine
    ↓
Seller Record Creation
    ↓
Product Addition
    ↓
Product Record Creation
    ↓
Application Status Tracking
    ↓
PostgreSQL Database
```

**Steps**:
1. Seller submits registration form
2. Validate business details
3. Seller Onboarding Engine creates seller record
4. Seller adds products
5. Validate product details
6. Create product records
7. Track application status
8. Store all data in database

### Customer Storefront Flow
```
Customer Region Selection
    ↓
Personalization Engine
    ↓
Regional Storefront Generation
    ↓
Festival Collection Creation
    ↓
Recommendation Engine
    ↓
Product Recommendations
    ↓
Local Seller Listing
    ↓
Frontend Display
```

**Steps**:
1. Customer selects region
2. Personalization Engine generates regional storefront
3. Create festival collections based on calendar
4. Recommendation Engine suggests products
5. List local sellers
6. Send data to frontend
7. Frontend displays personalized storefront

### Analytics Flow
```
All Data Sources
    ↓
Analytics Engine
    ↓
Data Aggregation
    ↓
Trend Analysis
    ↓
Report Generation
    ↓
Visualization
    ↓
Admin Dashboard
```

**Steps**:
1. Retrieve data from all sources
2. Analytics Engine aggregates data
3. Analyze trends and patterns
4. Generate reports
5. Create visualizations
6. Display in admin dashboard

---

# 9. Demo Journey Architecture

## Complete Judge Demo Flow

This is the critical demo story that judges will understand in 3 minutes.

### Step 1: Admin View - Regional Intelligence
```
Admin logs in (Demo Role: ADMIN)
    ↓
Selects "Andhra Pradesh" from India Map
    ↓
Regional Intelligence Dashboard displays:
    - Famous textiles: Pochampally Ikat, Kalamkari
    - Upcoming festivals: Sankranti (Jan), Ugadi (Mar)
    - Textile clusters: Pochampally, Dharmavaram
    - GI-tagged products: 12
```

### Step 2: Demand Analysis
```
System analyzes regional data
    ↓
Demand Scoring Module calculates:
    - Festival demand: HIGH (Sankranti approaching)
    - Regional preference: 85/100
    - Catalog availability: 30/100
    - GI importance: 90/100
    ↓
Output: "Saree demand high during Sankranti"
```

### Step 3: Catalog Gap Detection
```
Catalog Gap Module compares demand vs available
    ↓
Identifies gaps:
    - Category: Sarees
    - Region: Andhra Pradesh
    - Festival: Sankranti
    - Demand: 450 units
    - Available: 120 units
    - Gap: 330 units
    - Priority: HIGH
    ↓
System highlights: "Missing Pochampally Ikat Collection"
```

### Step 4: Seller Discovery
```
Seller Matching Module finds sellers for the gap
    ↓
Filters by:
    - Region: Andhra Pradesh
    - Category: Sarees
    - GI-tagged: Yes
    - MSME: Yes
    ↓
Matches 12 sellers:
    - Pochampally Weavers (GI-tagged, MSME, Rating 4.8)
    - Kalamkari Artisans (GI-tagged, MSME, Rating 4.5)
    - Dharmavaram Silk (GI-tagged, MSME, Rating 4.7)
    ↓
System displays: "Found 12 GI-tagged MSME sellers"
```

### Step 5: Seller Portal
```
Demo transitions to Seller View (Demo Role: SELLER)
    ↓
Seller fills registration form:
    - Business Name: Pochampally Weavers
    - Location: Pochampally, Telangana
    - GI Tag: Yes
    - MSME: Yes
    - Categories: Sarees, Fabrics
    ↓
Seller adds products:
    - Product: Pochampally Ikat Saree
    - Price: ₹5,000
    - Stock: 50 units
    - Images: Upload
    ↓
Application status: "SUBMITTED → UNDER REVIEW → APPROVED"
```

### Step 6: Customer View - Regional Storefront
```
Demo transitions to Customer View (Demo Role: CUSTOMER)
    ↓
Customer selects region: "Andhra Pradesh"
    ↓
Personalization Module generates regional storefront:
    - Hero Banner: "Andhra Pradesh Fashion"
    - Festival Collection: "Sankranti Special"
    - Featured Products: Pochampally Ikat Sarees
    - Local Sellers: Pochampally Weavers, Kalamkari Artisans
    - Regional Categories: Sarees, Fabrics, Handicrafts
    ↓
Customer sees: "Personalized Andhra Sankranti Storefront"
```

## Demo Script Summary

**Opening (30 seconds)**:
> "VendSway helps expand across Bharat by connecting regional fashion demand with local sellers. Let me show you how it works."

**Admin Intelligence (45 seconds)**:
> "First, our Admin selects Andhra Pradesh. The system analyzes regional data and identifies that saree demand is high during Sankranti. We're missing 330 units of Pochampally Ikat sarees."

**Seller Discovery (30 seconds)**:
> "The system automatically finds 12 GI-tagged MSME sellers who can fill this gap. Here's Pochampally Weavers with a 4.8 rating."

**Seller Onboarding (30 seconds)**:
> "Sellers can easily register through our portal. They add products and track their application status. This seller just got approved."

**Customer Experience (45 seconds)**:
> "Now, customers from Andhra Pradesh see a personalized storefront with Sankranti collections, local products, and regional sellers. This is the Bharat shopping experience."

**Closing (30 seconds)**:
> "VendSway connects regional demand with regional supply, helping expand across Bharat while empowering local artisans."

## Key Demo Points

1. **Regional Intelligence**: Shows we understand Bharat's diverse fashion landscape
2. **Demand Detection**: Proves we can identify market opportunities
3. **Gap Analysis**: Demonstrates we can find what's missing
4. **Seller Matching**: Shows we can connect gaps to real sellers
5. **Seller Onboarding**: Proves the platform is seller-friendly
6. **Personalization**: Demonstrates customer value

## Demo Technical Flow

```
Admin Role Selection
    ↓
Regional Intelligence API Call
    ↓
Demand Scoring Calculation
    ↓
Catalog Gap Detection
    ↓
Seller Matching API Call
    ↓
Seller Registration (Demo)
    ↓
Customer Role Selection
    ↓
Personalization API Call
    ↓
Regional Storefront Generation
    ↓
Demo Complete
```

---

# 10. Frontend Component Architecture

## Application Structure

```
App
├── RoleSelection (Demo login)
├── AdminDashboard
│   ├── RegionalIntelligence
│   │   ├── RegionalMap
│   │   ├── StateDetailsPanel
│   │   └── MapControls
│   ├── CatalogGapDetection
│   │   ├── GapTable
│   │   ├── GapSummaryCards
│   │   └── GapFilters
│   ├── SellerDiscovery
│   │   ├── SellerList
│   │   ├── SellerCard
│   │   ├── SellerProfile
│   │   └── SellerFilters
│   └── AnalyticsDashboard
│       ├── DemandCharts
│       ├── GapCharts
│       └── SellerCharts
├── SellerPortal
│   ├── RegistrationForm
│   ├── ProductForm
│   ├── ProductList
│   └── StatusView
└── RegionalStorefront
    ├── RegionSelector
    ├── HeroBanner
    ├── FestivalCollection
    ├── ProductGrid
    ├── ProductCard
    └── LocalSellers
```

## Layouts
```
Layout
├── MainLayout
│   ├── Header
│   ├── Sidebar
│   └── Content
├── AdminLayout
│   ├── AdminHeader
│   ├── AdminSidebar
│   └── AdminContent
├── SellerLayout
│   ├── SellerHeader
│   └── SellerContent
└── StorefrontLayout
    ├── StorefrontHeader
    └── StorefrontContent
```

## Reusable Components
```
Common Components
├── Button
├── Card
├── Input
├── Select
├── Modal
├── Table
├── Badge
├── Spinner
├── EmptyState
├── ErrorMessage
└── RegionSelector
```

## Feature Modules
```
Features
├── RegionalIntelligence
│   ├── components
│   ├── hooks
│   ├── services
│   └── types
├── CatalogGap
│   ├── components
│   ├── hooks
│   ├── services
│   └── types
├── SellerDiscovery
│   ├── components
│   ├── hooks
│   ├── services
│   └── types
├── SellerOnboarding
│   ├── components
│   ├── hooks
│   ├── services
│   └── types
└── RegionalStorefront
    ├── components
    ├── hooks
    ├── services
    └── types
```

---

# 11. State Management Architecture

## Global State
**Data that should be global**:
- User role (Admin/Seller/Customer)
- Current selected region
- User preferences
- Navigation state

**Implementation**: Zustand

### Role Store (Zustand)
```typescript
useRoleStore
├── role: 'ADMIN' | 'SELLER' | 'CUSTOMER'
├── setRole: (role) => void
└── isAuthenticated: boolean
```

### Region Store (Zustand)
```typescript
useRegionStore
├── selectedRegion: Region | null
├── setSelectedRegion: (region) => void
└── availableRegions: Region[]
```

## Server State
**Data that should be server state**:
- Regional data
- Festival data
- Product data
- Seller data
- Catalog gap data
- Analytics data

**Implementation**: React Query (TanStack Query)

### React Query Hooks
```typescript
useRegions() - Fetch all regions
useRegion(id) - Fetch single region
useFestivals(regionId) - Fetch festivals by region
useProducts(regionId) - Fetch products by region
useSellers(filters) - Fetch sellers with filters
useCatalogGaps(regionId) - Fetch gaps by region
useAnalytics(regionId) - Fetch analytics data
```

## Local State
**Data that should be local**:
- Form inputs
- Modal states
- Loading states
- Error states
- Component-specific data

**Implementation**: React useState, useReducer

### Form State
```typescript
Component State
├── formData: object
├── errors: object
├── isSubmitting: boolean
└── setFormData: (data) => void
```

## State Ownership
| State | Owner | Scope | Technology |
|-------|-------|-------|------------|
| User Role | Role Store | Global | Zustand |
| Selected Region | Region Store | Global | Zustand |
| Regional Data | Server State | Global | React Query |
| Product Data | Server State | Global | React Query |
| Form Data | Component | Local | useState |
| Loading State | Component | Local | useState |
| Error State | Component | Local | useState |
| Modal State | Component | Local | useState |

## Data Fetching Strategy
- **Initial Load**: React Query fetches on component mount
- **User Actions**: React Query refetches on user interaction
- **Region Change**: React Query invalidates and refetches when region changes
- **Real-time**: Polling or WebSocket (future)

## Synchronization Strategy
- **Optimistic Updates**: Update UI immediately, rollback on error
- **Cache Invalidation**: React Query invalidates cache on data changes
- **Background Refresh**: React Query refetches in background
- **Conflict Resolution**: Last-write-wins (MVP)

---

# 12. Caching Strategy

## Frontend Caching
**What to cache**:
- Regional data (rarely changes)
- Festival data (changes seasonally)
- Product data (changes periodically)
- User preferences (changes on user action)

**Cache duration**:
- Regional data: 24 hours
- Festival data: 7 days
- Product data: 1 hour
- User preferences: Session

**Implementation**: React Query or custom caching

## API Caching
**What to cache**:
- Regional intelligence results
- Catalog gap calculations
- Seller matching results
- Recommendation results

**Cache duration**:
- Regional intelligence: 1 hour
- Catalog gaps: 30 minutes
- Seller matching: 15 minutes
- Recommendations: 10 minutes

**Implementation**: Redis (future) or in-memory cache

## Database Caching
**What to cache**:
- Frequently accessed regions
- Popular products
- Top sellers
- Festival collections

**Cache duration**:
- Regions: 24 hours
- Popular products: 1 hour
- Top sellers: 30 minutes
- Festival collections: 6 hours

**Implementation**: PostgreSQL query cache, Redis (future)

## Cache Invalidation
**Triggers**:
- Data updates
- Manual invalidation
- Time-based expiration
- Region change

**Strategy**:
- Write-through cache
- Cache-aside pattern
- Time-to-live (TTL)

---

# 13. Error Handling Architecture

## Frontend Errors
**Types**:
- Validation errors
- Network errors
- API errors
- Rendering errors

**Error Format**:
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details: any
  }
}
```

**Logging Strategy**:
- Console logging (development)
- Error tracking service (future: Sentry)
- User feedback mechanism

**User Messages**:
- Friendly error messages
- Actionable next steps
- Retry options

**Recovery Approach**:
- Retry mechanism
- Fallback to cached data
- Graceful degradation
- Error boundaries

## Backend Errors
**Types**:
- Validation errors
- Database errors
- External API errors
- Business logic errors

**Error Format**:
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details: any
  }
}
```

**Logging Strategy**:
- Winston logger
- Error levels: error, warn, info, debug
- Log to file (production)
- Log to console (development)

**User Messages**:
- Standardized error messages
- HTTP status codes
- Error codes for debugging

**Recovery Approach**:
- Try-catch blocks
- Error middleware
- Database transaction rollback
- Graceful error responses

## Database Errors
**Types**:
- Connection errors
- Query errors
- Constraint violations
- Transaction errors

**Logging Strategy**:
- Log all database errors
- Include query and parameters
- Log stack traces

**Recovery Approach**:
- Connection pooling
- Retry mechanism
- Transaction rollback
- Fallback queries

## API Failures
**Types**:
- Timeout errors
- Rate limit errors
- Server errors
- Network errors

**Logging Strategy**:
- Log API failures
- Include request/response
- Log retry attempts

**Recovery Approach**:
- Exponential backoff
- Retry mechanism
- Circuit breaker pattern
- Fallback to cached data

## External Data Failures
**Types**:
- Data source unavailable
- Data format errors
- Data validation errors

**Logging Strategy**:
- Log external data failures
- Include data source and error
- Monitor data quality

**Recovery Approach**:
- Use cached data
- Fallback to default data
- Alert monitoring system
- Manual data review

---

# 14. Security Architecture

## Authentication Security
- Demo role selection (MVP) - no real authentication
- JWT-based authentication (future)
- httpOnly cookies for token storage
- Secure flag for cookies (HTTPS only)
- Token expiration and refresh
- Strong secret key for JWT signing

## Authorization
- Role-based access control (RBAC)
- Permission matrix for each role
- Protected routes for each role
- Middleware for authorization checks
- Route guards on frontend

## Data Validation
- Input validation on frontend (Zod schemas)
- Input validation on backend (Zod schemas)
- SQL injection prevention (Prisma ORM)
- XSS prevention (input sanitization)
- CSRF protection (future)

## API Security
- CORS configuration
- Rate limiting (future)
- Request size limits
- API key authentication (future)
- HTTPS only (production)

## Database Security
- Environment variables for credentials
- Encrypted connections (SSL/TLS)
- Principle of least privilege
- Regular backups
- Query parameterization (Prisma)

## File Upload Security
- File type validation
- File size limits
- Virus scanning (future)
- Secure file storage (S3, future)
- Access control on files

## Environment Security
- Separate environments (dev, staging, prod)
- Environment-specific configuration
- Secrets management (future: Vault)
- No secrets in code
- Regular security audits

---

# 15. Scalability Architecture

## Future Scalability Considerations

### More Regions
**Strategy**:
- Database indexing on region fields
- Regional data caching
- CDN for static assets

### More Sellers
**Strategy**:
- Database indexing on seller fields
- Caching of seller data
- Pagination for seller lists

### More Customers
**Strategy**:
- CDN for frontend assets
- Database read replicas
- Caching of storefront data

### More Products
**Strategy**:
- Product data indexing
- Product image optimization
- Efficient categorization

### Future Scalability Enhancements (Post-MVP)
- Redis caching for frequently accessed data
- Background job processing for heavy computations
- Search optimization (Elasticsearch)
- Database read replicas
- Connection pooling

---

# 16. Deployment Architecture

## Frontend Hosting
**Platform**: Docker (Local Development)
**Environment**: Local development with Docker Compose
**Configuration**:
- Docker container for React frontend
- Vite dev server in container
- Hot reload enabled
- Port mapping for local access

## Backend Hosting
**Platform**: Docker (Local Development)
**Environment**: Local development with Docker Compose
**Configuration**:
- Docker container for Node.js backend
- Express server in container
- Hot reload enabled (nodemon)
- Port mapping for API access

## Database Hosting
**Platform**: Docker (Local Development)
**Environment**: PostgreSQL in Docker container
**Configuration**:
- PostgreSQL container
- Volume persistence for data
- Port mapping for database access
- Environment variables for configuration

## Image Storage
**Platform**: Placeholder services (MVP)
**Configuration**:
- Placeholder image services (unsplash.it, placehold.co)
- Local image uploads (optional)
- No cloud storage for MVP

## Environment Configuration

### Development (Local Docker)
- Docker Compose for all services
- Frontend: React + Vite in container
- Backend: Node.js + Express in container
- Database: PostgreSQL in container
- Mock data seeding via Prisma
- Hot reload for development


## Docker Compose Setup
**Services**:
- frontend: React application
- backend: Express API
- database: PostgreSQL
- seed: Data seeding (one-time)

**Configuration**:
- docker-compose.yml for orchestration
- Dockerfile for frontend
- Dockerfile for backend
- Environment variables in .env file
- Volume persistence for database

## CI/CD Pipeline
**MVP**: Manual deployment
- Build Docker images locally
- Run docker-compose up
- Test locally
- No automated CI/CD for MVP

**Future**:
- GitHub Actions for automated builds
- Docker image registry
- Automated deployment to cloud providers

## Monitoring
**MVP**: Local monitoring
- Docker logs (docker-compose logs)
- Console logs in containers
- Manual health checks

**Future**:
- Vercel Analytics (frontend)
- Render/Railway monitoring (backend)
- Neon monitoring (database)
- Error tracking (Sentry)

---

# 17. Complete Development Dependency Order

## Implementation Sequence

### 1. Project Setup (Hours 0-2)
**Why first**: Foundation for all development
- Initialize React + Vite + TypeScript
- Configure TailwindCSS
- Install shadcn/ui
- Set up ESLint and Prettier
- Configure Git repository
- Create folder structure
- Set up environment variables
- Set up Docker configuration

### 2. Database Foundation (Hours 2-6)
**Why second**: Data layer required by all modules
- Define TypeScript interfaces for all entities
- Set up PostgreSQL
- Configure Prisma ORM
- Create Prisma schema
- Create migration files
- Seed mock data
- Test database connections

### 3. Authentication (Demo Role Selection) (Hours 6-8)
**Why third**: Role-based access needed for all features
- Create role selection screen
- Implement RoleContext
- Create role-based routing
- Set up navigation guards
- Test role flows

### 4. Backend Architecture (Hours 8-10)
**Why fourth**: API layer required by frontend
- Set up Express server
- Configure middleware
- Create API structure
- Set up error handling
- Configure CORS
- Test API endpoints

### 5. Regional Intelligence (Hours 10-14)
**Why fifth**: Core data source for all other modules
- Implement Regional Intelligence Engine
- Create regional data aggregation logic
- Build regional API endpoints
- Create regional frontend components
- Test regional data flow

### 6. Catalog Gap Detection (Hours 14-18)
**Why sixth**: Depends on regional intelligence
- Implement Catalog Gap Engine
- Create gap calculation logic
- Build gap API endpoints
- Create gap frontend components
- Test gap detection flow

### 7. Seller Discovery (Hours 18-22)
**Why seventh**: Depends on catalog gaps
- Implement Seller Matching Engine
- Create seller matching logic
- Build seller API endpoints
- Create seller frontend components
- Test seller discovery flow

### 8. Seller Portal (Hours 22-26)
**Why eighth**: Independent module, depends on database
- Implement Seller Onboarding Engine
- Create registration workflow
- Build seller API endpoints
- Create seller portal components
- Test onboarding flow

### 9. Regional Storefront (Hours 26-30)
**Why ninth**: Depends on regional intelligence and products
- Implement Personalization Engine
- Implement Recommendation Engine
- Create storefront generation logic
- Build storefront API endpoints
- Create storefront components
- Test storefront flow

### 10. Analytics (Hours 30-34)
**Why tenth**: Depends on all data sources
- Implement Analytics Engine
- Create aggregation logic
- Build analytics API endpoints
- Create analytics components
- Test analytics flow

### 11. Testing (Hours 34-36)
**Why eleventh**: Ensure quality before deployment
- Test complete user journey
- Test all role flows
- Test error handling
- Performance testing
- Cross-browser testing

### 12. Deployment (Hours 36-40)
**Why last**: Final step after development
- Create Dockerfiles
- Create docker-compose.yml
- Test Docker build locally
- Deploy to environment
- Test deployed application
- Fix deployment issues

---

# 18. Final Architecture Summary

## Component Responsibility Table

| Component | Responsibility | Technology | Communication |
|-----------|---------------|------------|----------------|
| Frontend | User interface, role-based UI | React, TypeScript, TailwindCSS, Zustand, React Query | HTTP/REST to Backend |
| Backend API | API endpoints, middleware | Node.js, Express, TypeScript | REST to Frontend, Prisma to Database |
| Intelligence Service | Regional analysis, demand scoring, gap detection, seller matching | TypeScript, Custom Logic | Prisma to Database |
| Storefront Service | Regional personalization, recommendation logic | TypeScript, Custom Logic | Prisma to Database |
| Database | Data persistence, relationships | PostgreSQL, Prisma ORM | Prisma from Backend |
| External Data | Source data for intelligence | JSON files (MVP), APIs (future) | Direct import (MVP), API calls (future) |
| Deployment | Local development environment | Docker + Docker Compose | Local system only |

---

## Sign-Off

This System Architecture Design is **FINAL**. All architectural decisions are frozen and should not change during implementation without explicit instruction from the project lead.

**Approved By**: System Architect
**Date**: July 15, 2026
**Version**: 1.0

All future implementation phases must strictly follow this architecture blueprint.
