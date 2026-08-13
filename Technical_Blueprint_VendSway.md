# VendSway - Technical Blueprint

## Document Information

- **Project Name**: VendSway
- **Document Version**: 1.0
- **Date**: July 15, 2026
- **Purpose**: Complete technical decision freeze for hackathon MVP
- **Status**: FINAL - No changes without explicit instruction

---

# 1. Technology Stack

## Frontend Framework
**React.js 18.2+**

## Backend Framework
**Node.js with Express 4.18+** (Required)

## Language
**TypeScript 5.0+** (Frontend and Backend)

## Database
**Supabase (PostgreSQL cloud)** (Required - Free tier)

## ORM
**Prisma 5.0+**

## Authentication
**Demo Role Authentication** (Admin/Seller/Customer - no real auth, role selection for demo)

## Styling
**TailwindCSS 3.3+**

## UI Component Library
**shadcn/ui** (Radix UI primitives + TailwindCSS)

## Charts
**Recharts 2.8+**

## Maps
**Leaflet 1.9+** (OpenStreetMap - free, no API key required)

## Icons
**Lucide React 0.292+**

## Animations
**Framer Motion 10.16+**

## Image Handling
**Standard HTML img with placeholder services**

## Forms
**React Hook Form 7.45+**

## Validation
**Zod 3.22+**

## State Management
**React Context API + useReducer** (Simple state for MVP)

## HTTP Client
**Axios 1.5+**

## Environment Management
**Vite environment variables** (Frontend) + **dotenv** (Backend)

## Notifications
**React Hot Toast 2.4+**

## Logging
**Console logging**

## Deployment
**Direct deployment** (No Docker needed)

## Hosting
**Supabase** (Database) + **Vercel/Netlify** (Frontend) + **Render/Railway** (Backend)

## Version Control
**Git**

## Package Manager
**npm 9+** or **pnpm 8+**

## Linting
**ESLint 8.50+**

## Formatting
**Prettier 3.0+**

## Testing
**None for MVP**

---

# 2. Why Each Technology Was Selected

## React.js
**Why Chosen**: Industry standard, large ecosystem, excellent for hackathons
**Advantages**: 
- Massive community support
- Rich component ecosystem
- Fast development with hooks
- Excellent for single-page applications
- Judges recognize and respect React
**Trade-offs**: 
- Requires build tooling
- Learning curve for beginners
- Bundle size can be large without optimization
**Alternatives Considered**: Vue.js (simpler but smaller ecosystem), Svelte (lighter but less mature)

## TypeScript
**Why Chosen**: Type safety prevents bugs, better developer experience
**Advantages**:
- Catches errors at compile time
- Better IDE autocomplete
- Self-documenting code
- Easier refactoring
- Industry standard for modern React
**Trade-offs**:
- Slight learning curve
- Initial setup overhead
- Build time slightly longer
**Alternatives Considered**: JavaScript (faster setup but more runtime errors)

## TailwindCSS
**Why Chosen**: Rapid UI development, consistent design system
**Advantages**:
- No custom CSS files needed
- Consistent design tokens
- Responsive design built-in
- Dark mode support
- Small bundle size (purge unused styles)
**Trade-offs**:
- HTML can become verbose
- Learning curve for utility classes
- Initial configuration needed
**Alternatives Considered**: CSS Modules (more traditional but slower), Styled Components (runtime overhead)

## shadcn/ui
**Why Chosen**: Beautiful, accessible components, fully customizable
**Advantages**:
- Built on Radix UI (accessible primitives)
- Copy-paste components (full ownership)
- TailwindCSS integration
- Modern, polished design
- No runtime overhead
**Trade-offs**:
- Requires manual component installation
- Less opinionated than full libraries
**Alternatives Considered**: Material UI (heavy, opinionated), Chakra UI (good but less customizable)

## Leaflet
**Why Chosen**: Free, no API key required, lightweight
**Advantages**:
- No API key needed (unlike Google Maps)
- Open source and free
- Lightweight (40KB)
- Good documentation
- React-leaflet integration available
**Trade-offs**:
- Less polished than Google Maps
- Limited satellite imagery
**Alternatives Considered**: Google Maps (better but requires API key and billing), Mapbox (excellent but paid)

## Recharts
**Why Chosen**: Simple, composable, React-native
**Advantages**:
- Built specifically for React
- Declarative components
- Good documentation
- Lightweight
- Responsive by default
**Trade-offs**:
- Less feature-rich than D3.js
- Limited chart types compared to Chart.js
**Alternatives Considered**: Chart.js (more features but not React-native), D3.js (powerful but steep learning curve)

## Framer Motion
**Why Chosen**: Smooth animations, simple API
**Advantages**:
- Declarative animations
- Gesture support
- Layout animations
- Excellent documentation
- Performance optimized
**Trade-offs**:
- Adds bundle size
- Can be overkill for simple animations
**Alternatives Considered**: CSS transitions (simpler but limited), React Spring (good but more complex)

## React Hook Form + Zod
**Why Chosen**: Best-in-class form handling with type-safe validation
**Advantages**:
- Minimal re-renders
- Excellent performance
- Type-safe with Zod integration
- Easy to use
- Great documentation
**Trade-offs**:
- Learning curve for Zod schema
**Alternatives Considered**: Formik (older, more verbose), Yup (less type-safe)

## Prisma
**Why Chosen**: Type-safe database access, excellent migrations
**Advantages**:
- Type-safe queries
- Excellent TypeScript support
- Great migration system
- Auto-generated types
- Good documentation
**Trade-offs**:
- Adds build step
- Learning curve for schema
**Alternatives Considered**: Sequelize (mature but less type-safe), TypeORM (good but more complex)

## PostgreSQL
**Why Chosen**: Robust, feature-rich, industry standard
**Advantages**:
- ACID compliance
- Rich feature set (JSON, arrays)
- Excellent performance
- Strong community
- Free and open source
**Trade-offs**:
- More complex than SQLite
- Requires separate server
**Alternatives Considered**: SQLite (simpler but less scalable), MongoDB (flexible but less structured)

## Docker + Docker Compose
**Why Chosen**: Local development environment, consistent setup, easy demo
**Advantages**:
- Consistent development environment
- Easy local testing
- No cloud dependencies for MVP
- Simple to set up and run
- Excellent for hackathon demos (runs on any laptop)
**Trade-offs**:
- Requires Docker installation
- Slight learning curve for beginners
- Larger image sizes
**Alternatives Considered**: Vercel (simpler but requires cloud setup), Kubernetes (overkill for MVP)

---

# 3. Overall Project Architecture

## Architecture Overview
```
                    VendSway


                       USERS

        Admin        Seller        Customer


                         |
                         |

                  React Frontend
                  (Demo Role Selection)


                         |
                         |

                  Express Backend
                  (REST API)


        ---------------------------------

        Regional Intelligence Engine
        Demand Prediction Engine
        Catalog Gap Engine
        Seller Matching Engine
        Personalization Engine
        Recommendation Engine


                         |

                    PostgreSQL


                         |

                 Mock Government Data
                 Mock Platform Catalog
                 Mock Seller Database
                                
```

## Client
**Single Page Application (SPA)**
- React.js with TypeScript
- Client-side routing (React Router)
- Component-based architecture
- State management via React Context
- Demo role selection (Admin/Seller/Customer)

## Server
**Required REST API**
- Node.js with Express
- TypeScript
- RESTful endpoints
- Middleware for validation and error handling
- CORS enabled for frontend communication
- Intelligence engine modules

## Database
**Required PostgreSQL**
- Relational database with Prisma ORM
- Schema defined in Prisma
- Migrations for schema changes
- Seed data for mock data

## Data Flow
```
Frontend (React)
    ↓ (HTTP/Axios)
Express Backend (REST API)
    ↓
Intelligence Engines
    ↓ (Prisma)
PostgreSQL Database
    ↓
Mock Data (Government, Platform, Sellers)
```

## Authentication Flow
**Demo Role Authentication**
- Role selection screen on app load
- Three roles: Admin (Platform Team), Seller, Customer
- Role stored in React Context
- No real authentication (demo purposes only)
- Different UI/experience based on selected role

**Role Experiences**:
- **Admin**: Regional Intelligence → Catalog Gap → Seller Discovery
- **Seller**: Registration → Product Upload → Application Status
- **Customer**: Regional Storefront → Festival Collection → Local Sellers

## API Communication
- RESTful API design
- JSON request/response
- Axios for HTTP requests
- Interceptors for error handling
- Request/response logging

## Intelligence Engines

### Regional Intelligence Engine
- Aggregates regional data (textiles, festivals, clusters)
- Computes regional fashion profiles
- Provides demand signals

### Demand Prediction Engine
- Calculates demand scores based on:
  - Festival demand
  - Regional preferences
  - Catalog availability
  - GI importance
- Outputs opportunity scores

### Catalog Gap Engine
- Compares demand vs available inventory
- Identifies high-priority gaps
- Prioritizes gaps by festival and seasonality

### Seller Matching Engine
- Matches catalog gaps with seller capabilities
- Filters by region, category, capacity
- Ranks sellers by GI-tag, MSME status, rating

### Personalization Engine
- Generates regional storefronts
- Creates festival collections
- Recommends local sellers

### Recommendation Engine
- Suggests products based on user preferences
- Recommends festival-specific collections
- Personalizes by region

## External Data Sources
**Mock Data for MVP**:
- Regional data: JSON files seeded to PostgreSQL
- Seller data: JSON files seeded to PostgreSQL
- Product data: JSON files seeded to PostgreSQL
- Gap data: Calculated by intelligence engines
- Festival data: JSON files seeded to PostgreSQL

**Future Integration Points**:
- Government MSME directory API
- GI-tag registry API
- Handloom database API
- Platform catalog API

---

# 4. Folder Structure

## Frontend Structure
```
fashion-tapestry/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── images/
│       └── placeholders/
├── src/
│   ├── features/
│   │   ├── regional-intelligence/
│   │   │   ├── components/
│   │   │   │   ├── RegionalMap.tsx
│   │   │   │   ├── StateDetailsPanel.tsx
│   │   │   │   └── MapControls.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useRegionalData.ts
│   │   │   ├── services/
│   │   │   │   └── regionalIntelligence.service.ts
│   │   │   ├── types/
│   │   │   │   └── region.types.ts
│   │   │   └── index.ts
│   │   ├── catalog-gap/
│   │   │   ├── components/
│   │   │   │   ├── GapTable.tsx
│   │   │   │   ├── GapSummaryCards.tsx
│   │   │   │   └── GapFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useGapData.ts
│   │   │   ├── services/
│   │   │   │   └── catalogGap.service.ts
│   │   │   ├── types/
│   │   │   │   └── gap.types.ts
│   │   │   └── index.ts
│   │   ├── seller-discovery/
│   │   │   ├── components/
│   │   │   │   ├── SellerList.tsx
│   │   │   │   ├── SellerCard.tsx
│   │   │   │   ├── SellerProfile.tsx
│   │   │   │   └── SellerFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useSellerData.ts
│   │   │   ├── services/
│   │   │   │   └── sellerDiscovery.service.ts
│   │   │   ├── types/
│   │   │   │   └── seller.types.ts
│   │   │   └── index.ts
│   │   ├── seller-onboarding/
│   │   │   ├── components/
│   │   │   │   ├── SellerPortal.tsx
│   │   │   │   ├── RegistrationForm.tsx
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   └── StatusView.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useFormState.ts
│   │   │   ├── services/
│   │   │   │   └── sellerOnboarding.service.ts
│   │   │   ├── types/
│   │   │   │   └── onboarding.types.ts
│   │   │   └── index.ts
│   │   ├── regional-storefront/
│   │   │   ├── components/
│   │   │   │   ├── RegionalStorefront.tsx
│   │   │   │   ├── HeroBanner.tsx
│   │   │   │   ├── FestivalCollection.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   └── LocalSellers.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useProductData.ts
│   │   │   ├── services/
│   │   │   │   └── personalization.service.ts
│   │   │   ├── types/
│   │   │   │   └── storefront.types.ts
│   │   │   └── index.ts
│   │   └── shared/
│   │       ├── components/
│   │       │   ├── LoadingSpinner.tsx
│   │       │   ├── ErrorMessage.tsx
│   │       │   ├── EmptyState.tsx
│   │       │   └── RegionSelector.tsx
│   │       ├── hooks/
│   │       │   └── useNavigation.ts
│   │       └── types/
│   │           └── common.types.ts
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   └── ...
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Sidebar.tsx
│   │       └── Navbar.tsx
│   ├── pages/
│   │   ├── RegionalIntelligence.tsx
│   │   ├── CatalogGap.tsx
│   │   ├── SellerDiscovery.tsx
│   │   ├── SellerOnboarding.tsx
│   │   ├── RegionalStorefront.tsx
│   │   └── Landing.tsx
│   ├── context/
│   │   ├── AppContext.tsx
│   │   └── NavigationContext.tsx
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── validations.ts
│   │   └── constants.ts
│   ├── data/
│   │   ├── mockRegions.ts
│   │   ├── mockSellers.ts
│   │   ├── mockProducts.ts
│   │   ├── mockGaps.ts
│   │   └── mockFestivals.ts
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## Backend Structure
```
backend/
├── src/
│   ├── modules/
│   │   ├── regional-intelligence/
│   │   │   ├── services/
│   │   │   │   └── regional-intelligence.service.ts
│   │   │   ├── controllers/
│   │   │   │   └── intelligence.controller.ts
│   │   │   ├── routes/
│   │   │   │   └── intelligence.routes.ts
│   │   │   └── types/
│   │   │       └── intelligence.types.ts
│   │   ├── demand-engine/
│   │   │   ├── services/
│   │   │   │   └── demand-analysis.service.ts
│   │   │   ├── controllers/
│   │   │   │   └── demand.controller.ts
│   │   │   ├── routes/
│   │   │   │   └── demand.routes.ts
│   │   │   └── types/
│   │   │       └── demand.types.ts
│   │   ├── catalog-gap/
│   │   │   ├── services/
│   │   │   │   └── catalog-gap.service.ts
│   │   │   ├── controllers/
│   │   │   │   └── gap.controller.ts
│   │   │   ├── routes/
│   │   │   │   └── gap.routes.ts
│   │   │   └── types/
│   │   │       └── gap.types.ts
│   │   ├── seller-matching/
│   │   │   ├── services/
│   │   │   │   └── seller-matching.service.ts
│   │   │   ├── controllers/
│   │   │   │   └── seller.controller.ts
│   │   │   ├── routes/
│   │   │   │   └── seller.routes.ts
│   │   │   └── types/
│   │   │       └── seller.types.ts
│   │   ├── personalization/
│   │   │   ├── services/
│   │   │   │   └── personalization.service.ts
│   │   │   ├── controllers/
│   │   │   │   └── storefront.controller.ts
│   │   │   ├── routes/
│   │   │   │   └── storefront.routes.ts
│   │   │   └── types/
│   │   │       └── storefront.types.ts
│   │   ├── recommendation/
│   │   │   ├── services/
│   │   │   │   └── recommendation.service.ts
│   │   │   ├── controllers/
│   │   │   │   └── recommendation.controller.ts
│   │   │   ├── routes/
│   │   │   │   └── recommendation.routes.ts
│   │   │   └── types/
│   │   │       └── recommendation.types.ts
│   │   └── seller-onboarding/
│   │       ├── services/
│   │       │   └── seller-onboarding.service.ts
│   │       ├── controllers/
│   │       │   └── onboarding.controller.ts
│   │       ├── routes/
│   │       │   └── onboarding.routes.ts
│   │       └── types/
│   │           └── onboarding.types.ts
│   ├── middleware/
│   │   ├── validationMiddleware.ts
│   │   ├── errorMiddleware.ts
│   │   └── corsMiddleware.ts
│   ├── models/
│   │   ├── Region.ts
│   │   ├── Seller.ts
│   │   ├── Product.ts
│   │   ├── Gap.ts
│   │   ├── Festival.ts
│   │   └── TextileCluster.ts
│   ├── utils/
│   │   ├── errors.ts
│   │   └── validators.ts
│   ├── types/
│   │   └── index.ts
│   ├── config/
│   │   └── database.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── package.json
├── tsconfig.json
└── .env
```

## Shared
```
shared/
├── types/
│   └── index.ts
└── constants/
    └── index.ts
```

## Assets
```
assets/
├── images/
│   ├── regions/
│   ├── products/
│   └── logos/
└── icons/
```

## Configuration
```
config/
├── env.example
├── tailwind.config.js
└── vite.config.ts
```

## Scripts
```
scripts/
├── setup.sh
├── seed-data.sh
└── deploy.sh
```

---

# 5. Domain Model

## Core Entities

### Region
- **id**: UUID
- **name**: string (e.g., "Andhra Pradesh", "Tamil Nadu", "Rajasthan")
- **code**: string (e.g., "AP", "TN", "RJ")
- **centerLat**: number
- **centerLng**: number
- **description**: string
- **textiles**: Textile[] (relation)
- **festivals**: Festival[] (relation)
- **clusters**: TextileCluster[] (relation)
- **createdAt**: timestamp
- **updatedAt**: timestamp

### Festival
- **id**: UUID
- **name**: string (e.g., "Sankranti", "Pongal", "Teej")
- **regionId**: UUID (foreign key)
- **date**: date
- **description**: string
- **fashionRelevance**: string (e.g., "Traditional sarees", "Festival wear")
- **createdAt**: timestamp
- **updatedAt**: timestamp

### TextileCluster
- **id**: UUID
- **name**: string (e.g., "Pochampally", "Kanchipuram", "Sanganer")
- **regionId**: UUID (foreign key)
- **location**: string
- **specialization**: string (e.g., "Ikat weaving", "Silk sarees")
- **description**: string
- **createdAt**: timestamp
- **updatedAt**: timestamp

### GITag
- **id**: UUID
- **name**: string (e.g., "Pochampally Ikat Sarees", "Kanchipuram Sarees")
- **regionId**: UUID (foreign key)
- **category**: string (e.g., "Textiles", "Handicrafts")
- **description**: string
- **registrationNumber**: string
- **createdAt**: timestamp
- **updatedAt**: timestamp

### FashionCategory
- **id**: UUID
- **name**: string (e.g., "Sarees", "Kurtas", "Lehengas")
- **parentCategoryId**: UUID (nullable, for hierarchy)
- **description**: string
- **createdAt**: timestamp
- **updatedAt**: timestamp

### DemandSignal
- **id**: UUID
- **regionId**: UUID (foreign key)
- **categoryId**: UUID (foreign key)
- **festivalId**: UUID (nullable, foreign key)
- **demandScore**: number (1-100)
- **seasonality**: string (e.g., "High", "Medium", "Low")
- **source**: string (e.g., "Search trends", "Historical data")
- **period**: string (e.g., "Q1 2026")
- **createdAt**: timestamp
- **updatedAt**: timestamp

### CatalogProduct
- **id**: UUID
- **name**: string
- **categoryId**: UUID (foreign key)
- **regionId**: UUID (nullable, foreign key)
- **sellerId**: UUID (foreign key)
- **price**: number
- **giTagged**: boolean
- **description**: string
- **imageUrl**: string
- **available**: boolean
- **stock**: number
- **createdAt**: timestamp
- **updatedAt**: timestamp

### CatalogGap
- **id**: UUID
- **regionId**: UUID (foreign key)
- **categoryId**: UUID (foreign key)
- **festivalId**: UUID (nullable, foreign key)
- **demand**: number
- **available**: number
- **gap**: number (calculated: demand - available)
- **priority**: enum (HIGH, MEDIUM, LOW)
- **identifiedAt**: timestamp
- **resolvedAt**: timestamp (nullable)
- **createdAt**: timestamp
- **updatedAt**: timestamp

### Seller
- **id**: UUID
- **businessName**: string
- **contactPerson**: string
- **email**: string
- **phone**: string
- **location**: string
- **regionId**: UUID (foreign key)
- **giTagged**: boolean
- **msme**: boolean
- **msmeNumber**: string (nullable)
- **categories**: string[] (array)
- **productionCapacity**: number
- **rating**: number (1-5)
- **status**: enum (PENDING, APPROVED, REJECTED)
- **createdAt**: timestamp
- **updatedAt**: timestamp

### SellerApplication
- **id**: UUID
- **sellerId**: UUID (foreign key)
- **status**: enum (SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED)
- **submittedAt**: timestamp
- **reviewedAt**: timestamp (nullable)
- **reviewedBy**: string (nullable)
- **notes**: string (nullable)
- **createdAt**: timestamp
- **updatedAt**: timestamp

### RegionalCollection
- **id**: UUID
- **name**: string (e.g., "Telangana Festival Collection", "Rajasthan Wedding Collection")
- **regionId**: UUID (foreign key)
- **festivalId**: UUID (nullable, foreign key)
- **productIds**: UUID[] (array)
- **description**: string
- **isActive**: boolean
- **createdAt**: timestamp
- **updatedAt**: timestamp

### UserPreference
- **id**: UUID
- **userId**: UUID (foreign key, for future auth)
- **regionId**: UUID (foreign key)
- **categories**: string[] (array)
- **festivals**: string[] (array)
- **priceRange**: string (e.g., "1000-5000")
- **createdAt**: timestamp
- **updatedAt**: timestamp

---

# 6. Environment Variables

## Frontend Environment Variables
```
VITE_APP_TITLE=VendSway
VITE_API_URL=http://localhost:3000/api
VITE_MAP_DEFAULT_CENTER=20.5937,78.9629
VITE_MAP_DEFAULT_ZOOM=5
VITE_APP_VERSION=1.0.0
```

## Backend Environment Variables (If backend used)
```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/vendsway
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=debug
```

## Production Environment Variables
```
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@production-db:5432/vendsway
JWT_SECRET=production-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=info
```

## Environment Variable Purposes

**VITE_APP_TITLE**: Application title used in meta tags and headers
**VITE_API_URL**: Base URL for API calls (if backend used)
**VITE_MAP_DEFAULT_CENTER**: Default center coordinates for India map (lat, lng)
**VITE_MAP_DEFAULT_ZOOM**: Default zoom level for map
**VITE_APP_VERSION**: Application version for display and debugging

**NODE_ENV**: Environment mode (development/production/test)
**PORT**: Server port number
**DATABASE_URL**: PostgreSQL connection string
**JWT_SECRET**: Secret key for JWT token signing
**JWT_EXPIRES_IN**: JWT token expiration time
**CORS_ORIGIN**: Allowed CORS origin for frontend
**LOG_LEVEL**: Logging verbosity level

---

# 6. Coding Standards

## Naming Conventions

### Folder Naming
- **Format**: kebab-case
- **Examples**: `regional-map`, `seller-portal`, `gap-detection`
- **Rule**: Always lowercase, hyphens for separation

### File Naming
- **Components**: PascalCase
  - **Examples**: `RegionalMap.tsx`, `SellerCard.tsx`, `GapTable.tsx`
- **Utilities/Helpers**: camelCase
  - **Examples**: `formatDate.ts`, `calculateGap.ts`, `validateForm.ts`
- **Types**: PascalCase
  - **Examples**: `Region.ts`, `Seller.ts`, `Product.ts`
- **Constants**: UPPER_SNAKE_CASE
  - **Examples**: `API_ENDPOINTS.ts`, `REGION_DATA.ts`
- **Hooks**: camelCase with 'use' prefix
  - **Examples**: `useRegionalData.ts`, `useSellerData.ts`

### React Component Naming
- **Format**: PascalCase
- **Rule**: Descriptive names that indicate purpose
- **Examples**: `RegionalIntelligenceMap`, `CatalogGapDetection`, `SellerDiscoveryList`
- **File name matches component name**

### API Naming
- **Endpoints**: kebab-case
- **Examples**: `/api/regions`, `/api/sellers`, `/api/gaps`
- **HTTP Methods**: RESTful conventions
  - GET: Retrieve data
  - POST: Create data
  - PUT: Update data (full)
  - PATCH: Update data (partial)
  - DELETE: Remove data

### Database Table Naming
- **Format**: snake_case, plural
- **Examples**: `regions`, `sellers`, `products`, `catalog_gaps`
- **Rule**: Always lowercase, underscores for separation, plural form

### Variable Naming
- **Format**: camelCase
- **Examples**: `regionData`, `sellerList`, `gapCalculation`
- **Constants**: UPPER_SNAKE_CASE
- **Booleans**: Prefix with `is`, `has`, `should`
  - **Examples**: `isLoading`, `hasError`, `shouldShow`

### Git Branch Naming
- **Format**: feature/description, fix/description, hotfix/description
- **Examples**: `feature/regional-map`, `fix/gap-calculation`, `hotfix/login-bug`
- **Rule**: Lowercase, hyphens, descriptive

### Commit Message Format
- **Format**: type(scope): description
- **Types**: feat, fix, docs, style, refactor, test, chore
- **Examples**:
  - `feat(screen1): add interactive India map`
  - `fix(screen2): correct gap calculation logic`
  - `docs(readme): update installation instructions`
  - `style(global): apply consistent formatting`
- **Rule**: Conventional Commits specification

---

# 7. Development Principles

## Single Responsibility Principle
- Each component/function should have one reason to change
- Components should focus on a single UI concern
- Services should handle a single business logic concern

## DRY (Don't Repeat Yourself)
- Extract reusable logic into custom hooks
- Create shared components for common UI patterns
- Use utility functions for repeated operations
- Avoid duplicating mock data

## KISS (Keep It Simple, Stupid)
- Prefer simple solutions over complex ones
- Avoid over-engineering for MVP
- Use straightforward state management
- Choose libraries with simple APIs

## Reusable Components
- Build components with props for customization
- Use composition over inheritance
- Create generic components (Button, Card, Input)
- Avoid component duplication

## Feature-First Organization
- Group files by feature/screen, not by type
- Each screen has its own folder
- Shared components go in common folder
- Easier to locate and maintain feature code

## Type Safety
- Use TypeScript for all files
- Avoid `any` type
- Define interfaces for all data structures
- Use type inference where appropriate

## Error Handling
- Use try-catch for async operations
- Display user-friendly error messages
- Log errors for debugging
- Provide error boundaries for React components

## Security
- Validate all user inputs
- Sanitize data before rendering
- Use environment variables for secrets
- Implement CORS properly
- Never expose sensitive data in frontend

## Accessibility
- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Use ARIA labels where needed
- Test with screen readers (if time permits)

## Responsive Design
- Mobile-first approach
- Use Tailwind responsive prefixes
- Test on multiple screen sizes
- Ensure touch targets are adequate (44x44px minimum)

## Performance
- Lazy load components where appropriate
- Optimize images (compress, use WebP)
- Use React.memo for expensive components
- Avoid unnecessary re-renders
- Code splitting for large bundles

---

# 8. Security Decisions

## Authentication
**MVP**: Demo Role Authentication
- Role selection screen on app load
- Three roles: Admin (Platform Team), Seller, Customer
- Role stored in React Context
- No real authentication (demo purposes only)
- Different UI/experience based on selected role
- Simple role-based routing

**Future**: JWT-based authentication
- JWT tokens for stateless authentication
- Tokens stored in httpOnly cookies (more secure than localStorage)
- Token refresh mechanism
- Logout invalidates token server-side

## Password Storage
**MVP**: Not applicable (no real authentication)

**Future**: bcrypt with salt rounds
- Never store plain text passwords
- Use bcrypt with 10+ salt rounds
- Hash passwords before storage
- Compare hashes during authentication

## JWT Strategy
**Future Implementation**:
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (7 days)
- Tokens signed with strong secret key
- Include user ID and role in token payload
- Validate token on every protected route

## Role Management
**MVP**: No role management

**Future**:
- Role-based access control (RBAC)
- Roles stored in database
- Middleware checks role permissions
- Roles: admin, myntra_team, seller, customer

## Input Validation
- Validate all form inputs on client side (Zod)
- Validate all API inputs on server side (if backend used)
- Sanitize data to prevent XSS attacks
- Use parameterized queries to prevent SQL injection
- Validate file uploads (type, size)

## Rate Limiting
**MVP**: Not required

**Future**:
- Implement rate limiting on API endpoints
- Use express-rate-limit middleware
- Limit: 100 requests per minute per IP
- Block abusive IPs temporarily

## CORS
**MVP**: Allow all origins for development

**Future**:
- Restrict to specific origins in production
- Use CORS middleware
- Whitelist frontend domain
- Handle preflight requests

## Helmet
**Future**:
- Use Helmet middleware for Express
- Set security-related HTTP headers
- Protect against well-known web vulnerabilities
- Hide X-Powered-By header

## Environment Variables
- Never commit .env files
- Use .env.example as template
- Load environment variables at startup
- Validate required environment variables
- Use different configs for dev/staging/prod

## Secrets Management
**MVP**: Environment variables only

**Future**:
- Use secret management service (AWS Secrets Manager, HashiCorp Vault)
- Rotate secrets regularly
- Never log secrets
- Encrypt secrets at rest

---

# 9. API Standards

## Response Format
**Success Response**:
```json
{
  "success": true,
  "data": {
    // Response data here
  },
  "message": "Operation successful"
}
```

**Paginated Response**:
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  },
  "message": "Data retrieved successfully"
}
```

## Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

## Pagination
- Query parameters: `page` and `limit`
- Default: page=1, limit=10
- Max limit: 100
- Include pagination metadata in response
- Support cursor-based pagination for large datasets (future)

## Filtering
- Query parameters: `filter[field]=value`
- Example: `?filter[region]=Telangana&filter[category]=Sarees`
- Support multiple filters
- Filter operators: `eq`, `ne`, `gt`, `lt`, `contains`, `startsWith`
- Example: `?filter[price][gt]=1000`

## Sorting
- Query parameter: `sort=field:direction`
- Example: `?sort=price:asc` or `?sort=name:desc`
- Default sort: created_at:desc
- Support multiple sort fields
- Example: `?sort=region:asc,price:desc`

## Status Codes
- `200 OK`: Successful GET, PUT, PATCH
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (duplicate)
- `422 Unprocessable Entity`: Validation error
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error
- `503 Service Unavailable`: Service down

## Versioning
- URL path versioning: `/api/v1/regions`
- Header versioning (alternative): `Accept: application/vnd.api.v1+json`
- Maintain backward compatibility for at least one version
- Deprecate old versions with warning headers

---

# 10. Database Strategy

## Database Type
**PostgreSQL 15+**
- Relational database with ACID compliance
- Support for JSON, arrays, and complex queries
- Excellent for structured data with relationships
- Industry standard with strong community support

## Relationships
- **One-to-Many**: Region → Textiles, Region → Festivals
- **Many-to-Many**: Sellers ↔ Products (through junction table)
- **One-to-One**: Seller → Registration
- Use foreign keys with proper constraints
- Define relationships in Prisma schema

## Primary Keys
- Use UUID for all primary keys
- Format: `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`
- Avoid auto-increment integers (predictable, can be guessed)
- UUIDs are unique across tables (useful for references)

## Indexes
- Index all foreign keys
- Index frequently queried fields (region, category, status)
- Create composite indexes for common query patterns
- Example: `CREATE INDEX idx_region_category ON products(region, category)`
- Use partial indexes for filtered data

## Soft Delete
- Add `deletedAt TIMESTAMP` nullable column
- Set `deletedAt` instead of hard delete
- Query with `WHERE deletedAt IS NULL`
- Allows data recovery
- Maintains data integrity

## Timestamps
- Add `createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- Add `updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- Update `updatedAt` on record modification
- Use triggers for automatic timestamp updates
- Helps with auditing and debugging

## Migration Strategy
- Use Prisma Migrate
- Version-controlled migration files
- Run migrations before starting application
- Rollback capability for failed migrations
- Seed data separate from migrations

## Seed Data
- Use Prisma Seed
- Separate seed files for different environments
- Include mock data for MVP
- Use realistic data for development
- Minimal data for production (if needed)

---

# 11. UI/UX Standards

## Color Palette
**Primary Colors**:
- Primary: `#FF3F6C` (Brand pink/red)
- Secondary: `#F5F5F6` (Light gray)
- Accent: `#282C3F` (Dark blue/black)

**Functional Colors**:
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Error: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

**Neutral Colors**:
- White: `#FFFFFF`
- Gray 50: `#F9FAFB`
- Gray 100: `#F3F4F6`
- Gray 200: `#E5E7EB`
- Gray 300: `#D1D5DB`
- Gray 400: `#9CA3AF`
- Gray 500: `#6B7280`
- Gray 600: `#4B5563`
- Gray 700: `#374151`
- Gray 800: `#1F2937`
- Gray 900: `#111827`

## Typography
**Font Family**: Inter (system font stack fallback)
- Headings: 600-700 weight
- Body: 400 weight
- Small text: 400-500 weight

**Font Sizes**:
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

**Line Heights**:
- Tight: 1.25
- Normal: 1.5
- Relaxed: 1.75

## Spacing
**Scale**: 4px base unit
- 0: 0
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 5: 1.25rem (20px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 10: 2.5rem (40px)
- 12: 3rem (48px)

## Cards
- Border radius: 0.5rem (8px)
- Box shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Padding: 1.5rem (24px)
- Background: White
- Hover shadow: `0 4px 6px rgba(0,0,0,0.1)`
- Transition: 200ms ease

## Tables
- Border collapse: collapse
- Cell padding: 0.75rem (12px)
- Header background: Gray 50
- Header text: Gray 700, 600 weight
- Border bottom: 1px solid Gray 200
- Row hover: Gray 50 background
- Sortable columns: cursor pointer, underline on hover

## Buttons
**Primary Button**:
- Background: Primary color (#FF3F6C)
- Text: White
- Padding: 0.5rem 1rem (8px 16px)
- Border radius: 0.375rem (6px)
- Font weight: 500
- Hover: Darker shade
- Active: Slightly darker
- Disabled Gray 300 background, Gray 500 text

**Secondary Button**:
- Background: White
- Text: Primary color
- Border: 1px solid Primary color
- Padding: 0.5rem 1rem (8px 16px)
- Border radius: 0.375rem (6px)
- Font weight: 500
- Hover: Gray 50 background

**Ghost Button**:
- Background: Transparent
- Text: Gray 700
- Padding: 0.5rem 1rem (8px 16px)
- Border radius: 0.375rem (6px)
- Font weight: 500
- Hover: Gray 100 background

## Forms
- Input height: 2.5rem (40px)
- Border: 1px solid Gray 300
- Border radius: 0.375rem (6px)
- Padding: 0.5rem 0.75rem (8px 12px)
- Focus ring: Primary color, 2px
- Error border: Error color
- Error text: Error color, sm size
- Label: Gray 700, 500 weight, mb-2

## Sidebar
- Width: 16rem (256px)
- Background: White
- Border right: 1px solid Gray 200
- Padding: 1rem (16px)
- Item height: 2.5rem (40px)
- Item padding: 0.5rem 0.75rem (8px 12px)
- Active item: Gray 100 background, Primary color text
- Hover item: Gray 50 background

## Navbar
- Height: 4rem (64px)
- Background: White
- Border bottom: 1px solid Gray 200
- Padding: 0 1.5rem (0 24px)
- Logo: Primary color, 600 weight
- Links: Gray 600, hover Primary color

## Dark Mode
**Future Implementation**:
- Background: Gray 900
- Text: Gray 100
- Cards: Gray 800
- Borders: Gray 700
- Invert colors appropriately
- Maintain contrast ratios

## Responsive Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

**Mobile-first approach**:
- Default styles: Mobile (0-640px)
- sm: Small tablets (640px+)
- md: Tablets (768px+)
- lg: Laptops (1024px+)
- xl: Desktops (1280px+)

## Loading States
- Skeleton screens for lists
- Spinner for single items
- Progress bar for uploads
- Disable buttons during loading
- Show loading text or indicator

## Empty States
- Illustration or icon
- Descriptive message
- Action button (if applicable)
- Consistent spacing
- Friendly tone

## Error States
- Error icon or illustration
- Clear error message
- Retry button (if applicable)
- Support contact link
- Consistent styling

---

# 12. Third-party Services

## Services Used in MVP

### Leaflet + OpenStreetMap
**Purpose**: Interactive India map for regional intelligence
**Why Needed**: Visual representation of regions, state selection
**Mock Data**: No - using real map tiles from OpenStreetMap (free)
**API Key**: Not required
**Cost**: Free

### Placeholder Image Services
**Purpose**: Product and region images for demo
**Why Needed**: Visual content without actual image assets
**Mock Data**: Yes - using placeholder services like unsplash.it or placehold.co
**API Key**: Not required
**Cost**: Free

## Services for Future Integration

### Government MSME Directory API
**Purpose**: Real seller data from government databases
**Why Needed**: Authentic seller information for production
**Mock Data**: Yes for MVP
**API Key**: May require registration
**Cost**: Free (government service)

### GI-Tag Registry API
**Purpose**: Real GI-tag product information
**Why Needed**: Accurate regional product data
**Mock Data**: Yes for MVP
**API Key**: May require registration
**Cost**: Free (government service)

### Platform Catalog API
**Purpose**: Real catalog data for gap analysis
**Why Needed**: Accurate gap detection in production
**Mock Data**: Yes for MVP
**API Key**: Requires partnership with platform
**Cost**: N/A (internal API)

---

# 13. Development Roadmap

## Milestone 1: Project Setup (Hours 0-2)
- Initialize React + Vite + TypeScript project
- Configure TailwindCSS
- Install shadcn/ui components
- Set up ESLint and Prettier
- Configure Git repository
- Create feature-based folder structure
- Set up environment variables
- Set up Docker configuration

## Milestone 2: Data Layer (Hours 2-6)
- Define TypeScript interfaces for all domain entities
- Create mock regional data (3 states)
- Create mock seller data (15-20 sellers)
- Create mock product data (15-20 products)
- Create mock gap data (8-10 gaps per region)
- Create mock festival data
- Set up data loading utilities
- Set up PostgreSQL + Prisma (if using database)
- Create seed data script

## Milestone 3: Regional Intelligence Engine (Hours 6-10)
- Implement regional-intelligence.service.ts
- Create discoverRegionalDemand() function
- Build regional data aggregation logic
- Implement interactive India map (Leaflet)
- Create state selection logic
- Build regional details panel
- Add filter controls
- Add loading and error states
- Style with TailwindCSS
- Test intelligence engine

## Milestone 4: Catalog Gap Engine (Hours 10-14)
- Implement catalog-gap.service.ts
- Create identifyCatalogGaps() function
- Build gap calculation logic (demand - available)
- Implement priority scoring algorithm
- Create gap table component
- Build summary cards
- Add filter controls
- Implement sorting
- Add color coding for priority
- Style with TailwindCSS
- Test gap engine

## Milestone 5: Seller Discovery Engine (Hours 14-18)
- Implement seller-matching.service.ts
- Create discoverRegionalSellers() function
- Build seller matching logic (by category, region, capacity)
- Create seller list component
- Build seller card component
- Implement seller profile view
- Add filter controls (region, category, GI-tag, MSME)
- Implement contact modal
- Add gap context banner
- Style with TailwindCSS
- Test seller matching

## Milestone 6: Seller Onboarding (Hours 18-22)
- Implement seller-onboarding.service.ts
- Create seller registration workflow
- Build registration form (React Hook Form + Zod)
- Build product addition form
- Create status view component
- Implement form validation
- Add success/error states
- Style with TailwindCSS
- Test onboarding flow

## Milestone 7: Regional Storefront (Hours 22-26)
- Implement personalization.service.ts
- Create generateRegionalStorefront() function
- Create recommendFestivalCollections() function
- Build region selector
- Create dynamic hero banner
- Implement festival collection section
- Create product grid and cards
- Build local sellers section
- Add regional categories sidebar
- Implement region-based content switching
- Style with TailwindCSS
- Test personalization engine

## Milestone 8: Navigation and Routing (Hours 26-28)
- Implement React Router
- Create navigation components
- Add context passing between features
- Implement back navigation
- Test complete user journey
- Fix navigation issues

## Milestone 9: Polish and Animations (Hours 28-32)
- Add Framer Motion animations
- Implement page transitions
- Add loading states
- Improve error handling
- Add toast notifications
- Refine styling and spacing
- Add hover states
- Improve accessibility
- Performance optimization

## Milestone 10: Testing and Bug Fixes (Hours 32-36)
- Test complete user journey
- Fix identified bugs
- Test responsive design
- Cross-browser testing
- Code cleanup
- Remove console logs
- Docker build testing

## Milestone 11: Demo Preparation (Hours 36-38)
- Prepare demo script
- Rehearse demo flow
- Prepare backup screenshots
- Test demo on presentation laptop
- Prepare talking points
- Time the demo

## Milestone 12: Deployment (Hours 38-40)
- Create Dockerfile for frontend
- Create Dockerfile for backend
- Create docker-compose.yml
- Test Docker build locally
- Set up environment variables for Docker
- Deploy to chosen cloud provider or self-host
- Test deployed application
- Fix any deployment issues
- Prepare README
- Document Docker setup instructions
- Code cleanup
- Remove console logs

## Milestone 11: Demo Preparation (Hours 34-36)
- Prepare demo script
- Rehearse demo flow
- Prepare backup screenshots
- Test demo on presentation laptop
- Prepare talking points
- Time the demo

## Milestone 12: Deployment (Hours 36-38)
- Create Dockerfile for frontend
- Create Dockerfile for backend (if used)
- Create docker-compose.yml
- Test Docker build locally
- Set up environment variables for Docker
- Deploy to chosen cloud provider or self-host
- Test deployed application
- Fix any deployment issues
- Prepare README
- Document Docker setup instructions

## Milestone 13: Final Review (Hours 38-40)
- Final testing of deployed app
- Code review
- Documentation review
- Backup preparation
- Submit project

---

# 14. Risks & Mitigations

## Technical Risks

### Risk: Map Integration Complexity
**Likelihood**: Medium
**Impact**: High
**Mitigation**: 
- Use Leaflet (simpler than Google Maps)
- Pre-configure map with correct center and zoom
- Have fallback static map image
- Test map on multiple browsers

### Risk: State Management Complexity
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**:
- Use React Context (simpler than Redux)
- Keep state minimal
- Use local component state where possible
- Document state flow

### Risk: Performance Issues
**Likelihood**: Low
**Impact**: Medium
**Mitigation**:
- Lazy load components
- Optimize images
- Use React.memo for expensive components
- Test on low-end devices

### Risk: Responsive Design Issues
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**:
- Use Tailwind responsive prefixes
- Test on multiple screen sizes
- Mobile-first approach
- Use relative units

## API Limitations

### Risk: No Real API Access
**Likelihood**: High
**Impact**: Low (acceptable for MVP)
**Mitigation**:
- Use mock data from start
- Structure code for easy API integration later
- Document API integration points
- Clearly communicate mock data usage

### Risk: Map API Rate Limits
**Likelihood**: Low
**Impact**: Medium
**Mitigation**:
- Use OpenStreetMap (no rate limits)
- Cache map tiles if possible
- Have offline fallback

## Performance Risks

### Risk: Large Bundle Size
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**:
- Code splitting
- Lazy loading
- Tree shaking
- Optimize dependencies

### Risk: Slow Initial Load
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**:
- Lazy load screens
- Show loading states
- Optimize images
- Use CDN for assets

## Hackathon Constraints

### Risk: Time Constraints
**Likelihood**: High
**Impact**: High
**Mitigation**:
- Prioritize core screens (1, 2, 5)
- Have minimum viable version of each screen
- Cut features if needed
- Use component library (shadcn/ui)

### Risk: Team Size Limitations
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**:
- Keep architecture simple
- Avoid complex state management
- Use established patterns
- Document decisions

### Risk: Demo Failure
**Likelihood**: Low
**Impact**: High
**Mitigation**:
- Rehearse demo multiple times
- Have backup screenshots
- Test on presentation laptop
- Prepare offline version

## Scalability Concerns

### Risk: Frontend-Only Approach Not Scalable
**Likelihood**: Medium
**Impact**: Low (acceptable for MVP)
**Mitigation**:
- Design for future backend integration
- Keep data access abstracted
- Document API contracts
- Use TypeScript interfaces

### Risk: Mock Data Not Realistic
**Likelihood**: Medium
**Impact**: Low
**Mitigation**:
- Research real regional data
- Use realistic numbers
- Include diverse examples
- Get domain expert review if possible

---

# 15. Final Technology Freeze

## Technology Summary Table

| Technology | Purpose | Final Decision |
|------------|---------|----------------|
| Frontend Framework | UI Framework | React.js 18.2+ |
| Language | Type Safety | TypeScript 5.0+ |
| Build Tool | Development Server | Vite 4.4+ |
| Styling | CSS Framework | TailwindCSS 3.3+ |
| UI Components | Component Library | shadcn/ui |
| State Management | Application State | React Context API |
| Forms | Form Handling | React Hook Form 7.45+ |
| Validation | Schema Validation | Zod 3.22+ |
| Maps | Interactive Maps | Leaflet 1.9+ |
| Charts | Data Visualization | Recharts 2.8+ |
| Icons | Icon Library | Lucide React 0.292+ |
| Animations | UI Animations | Framer Motion 10.16+ |
| HTTP Client | API Requests | Axios 1.5+ |
| Notifications | Toast Notifications | React Hot Toast 2.4+ |
| Backend Framework | Server Framework | Node.js + Express 4.18+ |
| Database | Data Storage | PostgreSQL 15+ |
| ORM | Database Access | Prisma 5.0+ |
| Authentication | User Authentication | Mock (MVP), JWT (Future) |
| Deployment | Container Platform | Docker + Docker Compose |
| Hosting | Cloud Provider | Self-hosted / AWS / GCP / Azure / DigitalOcean |
| Version Control | Code Versioning | Git |
| Package Manager | Dependency Management | npm 9+ or pnpm 8+ |
| Linting | Code Quality | ESLint 8.50+ |
| Formatting | Code Formatting | Prettier 3.0+ |
| Testing | Unit Testing | Vitest (Optional) |
| Testing | E2E Testing | Playwright (Optional) |

## Architecture Decision Record

**Decision**: Full-stack approach with required backend
**Rationale**: Intelligence engines need backend logic, not just UI dashboard, demonstrates real value proposition
**Consequence**: More complex setup but stronger demo

**Decision**: shadcn/ui over full component library
**Rationale**: Full ownership of components, no runtime overhead, highly customizable
**Consequence**: Manual component installation required

**Decision**: Leaflet over Google Maps
**Rationale**: No API key required, free, sufficient for MVP needs
**Consequence**: Less polished than Google Maps, limited features

**Decision**: React Context over Redux
**Rationale**: Simpler setup, sufficient for MVP state needs, built into React
**Consequence**: May need Redux for complex state in future

**Decision**: TypeScript over JavaScript
**Rationale**: Type safety prevents bugs, better developer experience, industry standard
**Consequence**: Slight learning curve, build time overhead

**Decision**: Docker for deployment
**Rationale**: Containerized deployment, consistent environments, portable across providers, self-hosting option
**Consequence**: Requires Docker knowledge, larger image sizes, need to manage infrastructure

## Sign-Off

This Technical Blueprint is **FINAL**. All technology decisions are frozen and should not change during implementation without explicit instruction from the project lead.

**Approved By**: Project Technical Lead
**Date**: July 15, 2026
**Version**: 1.0

All future implementation phases must strictly follow this blueprint.
