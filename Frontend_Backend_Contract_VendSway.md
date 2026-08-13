# VendSway - Frontend-Backend Development Contract

## Document Information

- **Project Name**: VendSway
- **Document Version**: 1.0
- **Date**: July 15, 2026
- **Purpose**: Development coordination contract for two-person team
- **Status**: FINAL - Official development agreement

---

# 1. Frontend Responsibilities

## Pages Frontend Must Build

### Authentication
- Role Selection Page (Demo: Admin/Seller/Customer)

### Admin Dashboard
- Regional Intelligence Dashboard
- Catalog Gap Detection Dashboard
- Seller Discovery Dashboard
- Analytics Dashboard

### Seller Portal
- Registration Page
- Product Management Page
- Application Status Page

### Regional Storefront
- Region Selection Page
- Regional Storefront Page
- Festival Collection Page
- Product Detail Page

## Components Frontend Owns

### UI Components
- Role Selection Component
- Regional Map Component (Leaflet integration)
- State Details Panel Component
- Gap Table Component
- Gap Summary Cards Component
- Seller List Component
- Seller Card Component
- Seller Profile Component
- Registration Form Component
- Product Form Component
- Status View Component
- Region Selector Component
- Hero Banner Component
- Festival Collection Component
- Product Grid Component
- Product Card Component
- Local Sellers Component

### Shared Components
- Button
- Card
- Input
- Select
- Modal
- Table
- Badge
- Spinner
- EmptyState
- ErrorMessage

## State Management Responsibility

### Global State (Zustand)
- User role state
- Selected region state
- Navigation state

### Server State (React Query)
- Regional data
- Festival data
- Product data
- Seller data
- Catalog gap data
- Analytics data

### Local State (useState)
- Form inputs
- Modal states
- Loading states
- Error states

## UI Logic
- Role-based routing
- Page navigation
- Modal open/close
- Form validation (UI level)
- Empty state display
- Loading state display
- Error state display

## Validation Responsibility
- Frontend form validation (Zod schemas)
- Required field validation
- Format validation (email, phone)
- Display validation errors

## Data Display Responsibility
- Regional data visualization (maps, charts)
- Gap data display (tables, cards)
- Seller data display (lists, profiles)
- Product data display (grids, cards)
- Analytics visualization (charts)
- Empty state handling
- Loading state handling
- Error state handling

---

# 2. Backend Responsibilities

## API Responsibility
- RESTful API design and implementation
- Request validation (Zod schemas)
- Response formatting
- Error handling
- CORS configuration

## Database Responsibility
- Prisma schema design
- Database migrations
- Seed data management
- Query optimization
- Relationship management

## Business Logic
- Intelligence Service implementation:
  - Regional Analysis Module
  - Demand Scoring Module
  - Catalog Gap Module
  - Seller Matching Module
- Storefront Service implementation:
  - Regional Personalization Module
  - Recommendation Logic Module

## Authentication
- Demo role selection API
- Role validation
- Role-based access control (RBAC)

## Authorization
- Protected route implementation
- Role-based permission checks
- API endpoint protection

## Data Processing
- Regional data aggregation
- Demand score calculation
- Gap detection and prioritization
- Seller matching and ranking
- Regional storefront generation
- Recommendation logic

## External Data Handling
- Mock data import (JSON files)
- Data normalization
- Data seeding
- Future: API integration (government services, Myntra catalog)

---

# 3. Complete API Contract

## Authentication

### Role Selection
**API Purpose**: Select demo role for session

**HTTP Method**: POST

**Endpoint**: `/api/auth/select-role`

**Authentication Required**: No

**Request Data**:
```json
{
  "role": "ADMIN" | "SELLER" | "CUSTOMER"
}
```

**Response Data**:
```json
{
  "status": "success",
  "message": "Role selected successfully",
  "data": {
    "role": "ADMIN",
    "isAuthenticated": true
  }
}
```

**Possible Errors**:
- 400: Invalid role value
- 500: Server error

### Get Current Role
**API Purpose**: Get current selected role

**HTTP Method**: GET

**Endpoint**: `/api/auth/current-role`

**Authentication Required**: No

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Current role retrieved",
  "data": {
    "role": "ADMIN",
    "isAuthenticated": true
  }
}
```

**Possible Errors**:
- 401: No role selected
- 500: Server error

### Logout
**API Purpose**: Clear selected role

**HTTP Method**: POST

**Endpoint**: `/api/auth/logout`

**Authentication Required**: No

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Logged out successfully",
  "data": {
    "role": null,
    "isAuthenticated": false
  }
}
```

**Possible Errors**:
- 500: Server error

---

## Users

### Get User Profile
**API Purpose**: Get current user profile

**HTTP Method**: GET

**Endpoint**: `/api/users/profile`

**Authentication Required**: Yes (Demo role)

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "User profile retrieved",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "ADMIN",
    "name": "John Doe",
    "createdAt": "2026-07-15T00:00:00Z",
    "updatedAt": "2026-07-15T00:00:00Z"
  }
}
```

**Possible Errors**:
- 401: Unauthorized
- 404: User not found
- 500: Server error

### Update User Profile
**API Purpose**: Update user profile

**HTTP Method**: PUT

**Endpoint**: `/api/users/profile`

**Authentication Required**: Yes (Demo role)

**Request Data**:
```json
{
  "name": "John Doe",
  "email": "user@example.com"
}
```

**Response Data**:
```json
{
  "status": "success",
  "message": "User profile updated",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "ADMIN",
    "name": "John Doe",
    "createdAt": "2026-07-15T00:00:00Z",
    "updatedAt": "2026-07-15T00:00:00Z"
  }
}
```

**Possible Errors**:
- 400: Validation error
- 401: Unauthorized
- 404: User not found
- 500: Server error

---

## Regional Intelligence

### Get All Regions
**API Purpose**: Get all regions for map display

**HTTP Method**: GET

**Endpoint**: `/api/intelligence/regions`

**Authentication Required**: No

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Regions retrieved",
  "data": [
    {
      "id": "uuid",
      "name": "Andhra Pradesh",
      "code": "AP",
      "centerLat": 15.9129,
      "centerLng": 79.7400,
      "description": "Southern state known for textiles"
    }
  ]
}
```

**Possible Errors**:
- 500: Server error

### Get Region Details
**API Purpose**: Get detailed information about a region

**HTTP Method**: GET

**Endpoint**: `/api/intelligence/regions/:id`

**Authentication Required**: No

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Region details retrieved",
  "data": {
    "id": "uuid",
    "name": "Andhra Pradesh",
    "code": "AP",
    "centerLat": 15.9129,
    "centerLng": 79.7400,
    "description": "Southern state known for textiles",
    "textiles": [
      {
        "id": "uuid",
        "name": "Pochampally Ikat",
        "giTagged": true
      }
    ],
    "festivals": [
      {
        "id": "uuid",
        "name": "Sankranti",
        "date": "2026-01-14",
        "fashionRelevance": "High"
      }
    ]
  }
}
```

**Possible Errors**:
- 404: Region not found
- 500: Server error

### Get Regional Textiles
**API Purpose**: Get textiles for a specific region

**HTTP Method**: GET

**Endpoint**: `/api/intelligence/regions/:id/textiles`

**Authentication Required**: No

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Regional textiles retrieved",
  "data": [
    {
      "id": "uuid",
      "name": "Pochampally Ikat",
      "regionId": "uuid",
      "description": "Traditional ikat weaving",
      "giTagged": true
    }
  ]
}
```

**Possible Errors**:
- 404: Region not found
- 500: Server error

### Get Regional Festivals
**API Purpose**: Get festivals for a specific region

**HTTP Method**: GET

**Endpoint**: `/api/intelligence/regions/:id/festivals`

**Authentication Required**: No

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Regional festivals retrieved",
  "data": [
    {
      "id": "uuid",
      "name": "Sankranti",
      "regionId": "uuid",
      "date": "2026-01-14",
      "description": "Harvest festival",
      "fashionRelevance": "High"
    }
  ]
}
```

**Possible Errors**:
- 404: Region not found
- 500: Server error

### Get Demand Signals
**API Purpose**: Get demand signals for regions

**HTTP Method**: GET

**Endpoint**: `/api/intelligence/demand-signals`

**Authentication Required**: No

**Request Data**: Query parameters:
- `regionId` (optional): Filter by region
- `category` (optional): Filter by category
- `festivalId` (optional): Filter by festival

**Response Data**:
```json
{
  "status": "success",
  "message": "Demand signals retrieved",
  "data": [
    {
      "id": "uuid",
      "regionId": "uuid",
      "category": "Sarees",
      "festivalId": "uuid",
      "demandScore": 85,
      "seasonality": "HIGH",
      "source": "Historical data",
      "period": "Q1 2026"
    }
  ]
}
```

**Possible Errors**:
- 400: Invalid query parameters
- 500: Server error

---

## Catalog Gap Detection

### Get Catalog Gaps
**API Purpose**: Get catalog gaps

**HTTP Method**: GET

**Endpoint**: `/api/gaps`

**Authentication Required**: Yes (Admin role)

**Request Data**: Query parameters:
- `regionId` (optional): Filter by region
- `category` (optional): Filter by category
- `festivalId` (optional): Filter by festival
- `priority` (optional): Filter by priority (HIGH, MEDIUM, LOW)

**Response Data**:
```json
{
  "status": "success",
  "message": "Catalog gaps retrieved",
  "data": [
    {
      "id": "uuid",
      "regionId": "uuid",
      "category": "Sarees",
      "festivalId": "uuid",
      "productId": null,
      "demand": 450,
      "available": 120,
      "gap": 330,
      "priority": "HIGH",
      "identifiedAt": "2026-07-15T00:00:00Z",
      "resolvedAt": null
    }
  ]
}
```

**Possible Errors**:
- 400: Invalid query parameters
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 500: Server error

### Get Gap Details
**API Purpose**: Get detailed information about a specific gap

**HTTP Method**: GET

**Endpoint**: `/api/gaps/:id`

**Authentication Required**: Yes (Admin role)

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Gap details retrieved",
  "data": {
    "id": "uuid",
    "regionId": "uuid",
    "category": "Sarees",
    "festivalId": "uuid",
    "productId": null,
    "demand": 450,
    "available": 120,
    "gap": 330,
    "priority": "HIGH",
    "identifiedAt": "2026-07-15T00:00:00Z",
    "resolvedAt": null
  }
}
```

**Possible Errors**:
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 404: Gap not found
- 500: Server error

### Calculate Gaps
**API Purpose**: Trigger gap calculation

**HTTP Method**: POST

**Endpoint**: `/api/gaps/calculate`

**Authentication Required**: Yes (Admin role)

**Request Data**:
```json
{
  "regionId": "uuid",
  "category": "Sarees"
}
```

**Response Data**:
```json
{
  "status": "success",
  "message": "Gap calculation initiated",
  "data": {
    "gapsCalculated": 5
  }
}
```

**Possible Errors**:
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 500: Server error

---

## Seller Discovery

### Get All Sellers
**API Purpose**: Get all sellers

**HTTP Method**: GET

**Endpoint**: `/api/sellers`

**Authentication Required**: Yes (Admin role)

**Request Data**: Query parameters:
- `regionId` (optional): Filter by region
- `category` (optional): Filter by category
- `giTagged` (optional): Filter by GI-tagged (true/false)
- `msme` (optional): Filter by MSME (true/false)

**Response Data**:
```json
{
  "status": "success",
  "message": "Sellers retrieved",
  "data": [
    {
      "id": "uuid",
      "businessName": "Pochampally Weavers",
      "contactPerson": "Ramesh Kumar",
      "email": "ramesh@example.com",
      "phone": "+91-9876543210",
      "location": "Pochampally",
      "regionId": "uuid",
      "giTagged": true,
      "msme": true,
      "msmeNumber": "MSME12345",
      "categories": ["Sarees", "Fabrics"],
      "productionCapacity": 100,
      "rating": 4.8,
      "status": "APPROVED"
    }
  ]
}
```

**Possible Errors**:
- 400: Invalid query parameters
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 500: Server error

### Get Seller Details
**API Purpose**: Get detailed information about a seller

**HTTP Method**: GET

**Endpoint**: `/api/sellers/:id`

**Authentication Required**: Yes (Admin role)

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Seller details retrieved",
  "data": {
    "id": "uuid",
    "businessName": "Pochampally Weavers",
    "contactPerson": "Ramesh Kumar",
    "email": "ramesh@example.com",
    "phone": "+91-9876543210",
    "location": "Pochampally",
    "regionId": "uuid",
    "giTagged": true,
    "msme": true,
    "msmeNumber": "MSME12345",
    "categories": ["Sarees", "Fabrics"],
    "productionCapacity": 100,
    "rating": 4.8,
    "status": "APPROVED",
    "products": [
      {
        "id": "uuid",
        "name": "Pochampally Ikat Saree",
        "price": 5000,
        "stock": 50
      }
    ]
  }
}
```

**Possible Errors**:
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 404: Seller not found
- 500: Server error

### Match Sellers to Gap
**API Purpose**: Get sellers matching a specific catalog gap

**HTTP Method**: GET

**Endpoint**: `/api/sellers/match/:gapId`

**Authentication Required**: Yes (Admin role)

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Matching sellers retrieved",
  "data": [
    {
      "seller": {
        "id": "uuid",
        "businessName": "Pochampally Weavers",
        "location": "Pochampally",
        "giTagged": true,
        "msme": true,
        "rating": 4.8
      },
      "matchScore": 95,
      "matchReason": "GI-tagged, MSME, high rating"
    }
  ]
}
```

**Possible Errors**:
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 404: Gap not found
- 500: Server error

---

## Seller Registration

### Register Seller
**API Purpose**: Register a new seller

**HTTP Method**: POST

**Endpoint**: `/api/sellers/register`

**Authentication Required**: No (Demo registration)

**Request Data**:
```json
{
  "businessName": "Pochampally Weavers",
  "contactPerson": "Ramesh Kumar",
  "email": "ramesh@example.com",
  "phone": "+91-9876543210",
  "location": "Pochampally",
  "regionId": "uuid",
  "giTagged": true,
  "msme": true,
  "msmeNumber": "MSME12345",
  "categories": ["Sarees", "Fabrics"],
  "productionCapacity": 100
}
```

**Response Data**:
```json
{
  "status": "success",
  "message": "Seller registered successfully",
  "data": {
    "id": "uuid",
    "businessName": "Pochampally Weavers",
    "status": "PENDING",
    "applicationId": "uuid"
  }
}
```

**Possible Errors**:
- 400: Validation error
- 409: Duplicate email
- 500: Server error

### Get Seller Application Status
**API Purpose**: Get seller application status

**HTTP Method**: GET

**Endpoint**: `/api/sellers/application/:id`

**Authentication Required**: Yes (Seller role)

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Application status retrieved",
  "data": {
    "id": "uuid",
    "sellerId": "uuid",
    "status": "UNDER_REVIEW",
    "submittedAt": "2026-07-15T00:00:00Z",
    "reviewedAt": null,
    "reviewedBy": null,
    "notes": null
  }
}
```

**Possible Errors**:
- 401: Unauthorized
- 403: Forbidden (Seller only)
- 404: Application not found
- 500: Server error

---

## Seller Products

### Add Product
**API Purpose**: Add a product for a seller

**HTTP Method**: POST

**Endpoint**: `/api/sellers/products`

**Authentication Required**: Yes (Seller role)

**Request Data**:
```json
{
  "sellerId": "uuid",
  "name": "Pochampally Ikat Saree",
  "category": "Sarees",
  "regionId": "uuid",
  "textileIds": ["uuid"],
  "price": 5000,
  "giTagged": true,
  "description": "Traditional ikat saree",
  "imageUrl": "https://example.com/image.jpg",
  "stock": 50
}
```

**Response Data**:
```json
{
  "status": "success",
  "message": "Product added successfully",
  "data": {
    "id": "uuid",
    "name": "Pochampally Ikat Saree",
    "status": "AVAILABLE"
  }
}
```

**Possible Errors**:
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden (Seller only)
- 500: Server error

### Get Seller Products
**API Purpose**: Get products for a seller

**HTTP Method**: GET

**Endpoint**: `/api/sellers/:id/products`

**Authentication Required**: Yes (Seller role)

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Seller products retrieved",
  "data": [
    {
      "id": "uuid",
      "name": "Pochampally Ikat Saree",
      "category": "Sarees",
      "price": 5000,
      "giTagged": true,
      "imageUrl": "https://example.com/image.jpg",
      "stock": 50,
      "available": true
    }
  ]
}
```

**Possible Errors**:
- 401: Unauthorized
- 403: Forbidden (Seller only)
- 404: Seller not found
- 500: Server error

### Update Product
**API Purpose**: Update a product

**HTTP Method**: PUT

**Endpoint**: `/api/sellers/products/:id`

**Authentication Required**: Yes (Seller role)

**Request Data**:
```json
{
  "name": "Pochampally Ikat Saree",
  "price": 5500,
  "stock": 45
}
```

**Response Data**:
```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "id": "uuid",
    "name": "Pochampally Ikat Saree",
    "price": 5500,
    "stock": 45
  }
}
```

**Possible Errors**:
- 400: Validation error
- 401: Unauthorized
- 403: Forbidden (Seller only)
- 404: Product not found
- 500: Server error

---

## Storefront

### Get Regional Storefront
**API Purpose**: Get personalized storefront for a region

**HTTP Method**: GET

**Endpoint**: `/api/storefront/region/:regionId`

**Authentication Required**: No

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Regional storefront retrieved",
  "data": {
    "region": {
      "id": "uuid",
      "name": "Andhra Pradesh"
    },
    "heroBanner": {
      "title": "Andhra Pradesh Fashion",
      "subtitle": "Discover regional textiles and artisans"
    },
    "festivalCollections": [
      {
        "id": "uuid",
        "name": "Sankranti Special",
        "festivalId": "uuid",
        "products": [
          {
            "id": "uuid",
            "name": "Pochampally Ikat Saree",
            "price": 5000,
            "imageUrl": "https://example.com/image.jpg"
          }
        ]
      }
    ],
    "localSellers": [
      {
        "id": "uuid",
        "businessName": "Pochampally Weavers",
        "rating": 4.8,
        "location": "Pochampally"
      }
    ]
  }
}
```

**Possible Errors**:
- 404: Region not found
- 500: Server error

### Get Festival Collection
**API Purpose**: Get festival-specific collection

**HTTP Method**: GET

**Endpoint**: `/api/storefront/festival/:festivalId`

**Authentication Required**: No

**Request Data**: Query parameters:
- `regionId` (optional): Filter by region

**Response Data**:
```json
{
  "status": "success",
  "message": "Festival collection retrieved",
  "data": {
    "id": "uuid",
    "name": "Sankranti Special",
    "festival": {
      "id": "uuid",
      "name": "Sankranti",
      "date": "2026-01-14"
    },
    "products": [
      {
        "id": "uuid",
        "name": "Pochampally Ikat Saree",
        "price": 5000,
        "imageUrl": "https://example.com/image.jpg"
      }
    ]
  }
}
```

**Possible Errors**:
- 404: Festival not found
- 500: Server error

### Get Local Sellers
**API Purpose**: Get local sellers for a region

**HTTP Method**: GET

**Endpoint**: `/api/storefront/local-sellers/:regionId`

**Authentication Required**: No

**Request Data**: None

**Response Data**:
```json
{
  "status": "success",
  "message": "Local sellers retrieved",
  "data": [
    {
      "id": "uuid",
      "businessName": "Pochampally Weavers",
      "contactPerson": "Ramesh Kumar",
      "location": "Pochampally",
      "giTagged": true,
      "msme": true,
      "rating": 4.8,
      "categories": ["Sarees", "Fabrics"]
    }
  ]
}
```

**Possible Errors**:
- 404: Region not found
- 500: Server error

---

## Analytics

### Get Demand Analytics
**API Purpose**: Get demand analytics data

**HTTP Method**: GET

**Endpoint**: `/api/analytics/demand`

**Authentication Required**: Yes (Admin role)

**Request Data**: Query parameters:
- `regionId` (optional): Filter by region
- `period` (optional): Filter by period (week, month, quarter)

**Response Data**:
```json
{
  "status": "success",
  "message": "Demand analytics retrieved",
  "data": {
    "totalDemand": 1500,
    "byRegion": [
      {
        "regionId": "uuid",
        "regionName": "Andhra Pradesh",
        "demandScore": 85
      }
    ],
    "byCategory": [
      {
        "category": "Sarees",
        "demandScore": 90
      }
    ],
    "trend": "increasing"
  }
}
```

**Possible Errors**:
- 400: Invalid query parameters
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 500: Server error

### Get Gap Analytics
**API Purpose**: Get catalog gap analytics

**HTTP Method**: GET

**Endpoint**: `/api/analytics/gaps`

**Authentication Required**: Yes (Admin role)

**Request Data**: Query parameters:
- `regionId` (optional): Filter by region
- `priority` (optional): Filter by priority

**Response Data**:
```json
{
  "status": "success",
  "message": "Gap analytics retrieved",
  "data": {
    "totalGaps": 25,
    "byPriority": {
      "HIGH": 10,
      "MEDIUM": 10,
      "LOW": 5
    },
    "resolvedGaps": 15,
    "pendingGaps": 10
  }
}
```

**Possible Errors**:
- 400: Invalid query parameters
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 500: Server error

### Get Seller Analytics
**API Purpose**: Get seller analytics

**HTTP Method**: GET

**Endpoint**: `/api/analytics/sellers`

**Authentication Required**: Yes (Admin role)

**Request Data**: Query parameters:
- `regionId` (optional): Filter by region

**Response Data**:
```json
{
  "status": "success",
  "message": "Seller analytics retrieved",
  "data": {
    "totalSellers": 50,
    "approvedSellers": 40,
    "pendingSellers": 8,
    "rejectedSellers": 2,
    "byRegion": [
      {
        "regionId": "uuid",
        "regionName": "Andhra Pradesh",
        "sellerCount": 15
      }
    ]
  }
}
```

**Possible Errors**:
- 400: Invalid query parameters
- 401: Unauthorized
- 403: Forbidden (Admin only)
- 500: Server error

---

# 4. Data Models Shared Between Frontend And Backend

## User Object
```typescript
{
  id: string;              // UUID
  email: string;           // Required, unique
  role: "ADMIN" | "SELLER" | "CUSTOMER";  // Required
  name: string;            // Required
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## Region Object
```typescript
{
  id: string;              // UUID
  name: string;            // Required, e.g., "Andhra Pradesh"
  code: string;            // Required, e.g., "AP"
  centerLat: number;       // Required, latitude
  centerLng: number;       // Required, longitude
  description: string;    // Optional
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## Festival Object
```typescript
{
  id: string;              // UUID
  name: string;            // Required, e.g., "Sankranti"
  regionId: string;        // Required, UUID
  date: string;            // Required, ISO 8601 date
  description: string;     // Optional
  fashionRelevance: string; // Optional, e.g., "High"
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## Textile Object
```typescript
{
  id: string;              // UUID
  name: string;            // Required, e.g., "Pochampally Ikat"
  regionId: string;        // Required, UUID
  description: string;     // Optional
  giTagged: boolean;       // Required
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## Product Object
```typescript
{
  id: string;              // UUID
  name: string;            // Required
  category: string;        // Required
  regionId: string;        // Optional, UUID
  sellerId: string;         // Required, UUID
  textileIds: string[];    // Array of UUIDs
  price: number;           // Required
  giTagged: boolean;       // Required
  description: string;     // Optional
  imageUrl: string;        // Optional
  available: boolean;      // Required
  stock: number;           // Required
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## Seller Object
```typescript
{
  id: string;              // UUID
  userId: string;          // Required, UUID
  businessName: string;    // Required
  contactPerson: string;   // Required
  email: string;           // Required
  phone: string;           // Required
  location: string;        // Required
  regionId: string;        // Required, UUID
  giTagged: boolean;       // Required
  msme: boolean;           // Required
  msmeNumber: string;      // Optional
  categories: string[];    // Required, array of strings
  productionCapacity: number; // Required
  rating: number;          // Required, 1-5
  status: "PENDING" | "APPROVED" | "REJECTED"; // Required
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## DemandSignal Object
```typescript
{
  id: string;              // UUID
  regionId: string;        // Required, UUID
  category: string;        // Required
  festivalId: string;      // Optional, UUID
  demandScore: number;      // Required, 1-100
  seasonality: "HIGH" | "MEDIUM" | "LOW"; // Required
  source: string;          // Required
  period: string;          // Required
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## CatalogGap Object
```typescript
{
  id: string;              // UUID
  regionId: string;        // Required, UUID
  category: string;        // Required
  festivalId: string;      // Optional, UUID
  productId: string;       // Optional, UUID
  demand: number;          // Required
  available: number;       // Required
  gap: number;             // Required
  priority: "HIGH" | "MEDIUM" | "LOW"; // Required
  identifiedAt: string;    // ISO 8601 timestamp
  resolvedAt: string;     // Optional, ISO 8601 timestamp
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## SellerApplication Object
```typescript
{
  id: string;              // UUID
  sellerId: string;        // Required, UUID
  status: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED"; // Required
  submittedAt: string;     // ISO 8601 timestamp
  reviewedAt: string;      // Optional, ISO 8601 timestamp
  reviewedBy: string;      // Optional
  notes: string;           // Optional
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

## RegionalCollection Object
```typescript
{
  id: string;              // UUID
  name: string;            // Required
  regionId: string;        // Required, UUID
  festivalId: string;      // Optional, UUID
  productIds: string[];    // Required, array of UUIDs
  description: string;     // Optional
  isActive: boolean;       // Required
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}
```

---

# 5. Authentication Contract

## Login Flow (Demo)
1. User loads application
2. Frontend displays role selection screen
3. User selects role (Admin/Seller/Customer)
4. Frontend calls POST `/api/auth/select-role`
5. Backend validates role and returns success
6. Frontend stores role in Zustand store
7. Frontend stores role in localStorage (persistence)
8. Frontend redirects to role-specific dashboard

## Registration Flow (Demo)
1. User navigates to seller registration
2. User fills registration form
3. Frontend validates form (Zod schemas)
4. Frontend calls POST `/api/sellers/register`
5. Backend validates and creates seller record
6. Backend returns seller ID and application ID
7. Frontend displays success message
8. User can view application status

## Token Storage
**MVP**: No real tokens
- Role stored in Zustand store
- Role persisted in localStorage
- No JWT tokens for MVP

**Future**: JWT implementation
- JWT tokens stored in httpOnly cookies
- Access token: 7 days expiration
- Refresh token: 30 days expiration
- Token refresh mechanism

## Token Refresh
**MVP**: Not applicable (no tokens)

**Future**: JWT refresh
- Refresh token endpoint: POST `/api/auth/refresh`
- New access token returned
- Old access token invalidated

## Protected Pages
**Admin Pages**:
- `/admin/*` - All admin features
- `/admin/regional-intelligence`
- `/admin/catalog-gap`
- `/admin/seller-discovery`
- `/admin/analytics`

**Seller Pages**:
- `/seller/*` - All seller features
- `/seller/registration`
- `/seller/products`
- `/seller/status`

**Customer Pages**:
- `/storefront/*` - Storefront features
- `/storefront/region/:id`

**Public Pages**:
- `/` - Landing page
- `/role-selection` - Role selection

## Protected APIs
**Admin APIs**:
- `/api/gaps/*` - Gap management
- `/api/sellers/match/*` - Seller matching
- `/api/analytics/*` - Analytics

**Seller APIs**:
- `/api/sellers/products` - Product management
- `/api/sellers/application/*` - Application status

**Public APIs**:
- `/api/auth/select-role` - Role selection
- `/api/intelligence/regions` - Regional data
- `/api/storefront/*` - Storefront data

## Roles

### Admin
- Full access to all features
- Can manage sellers and regional data
- Can view analytics
- Can approve/reject seller applications

### Seller
- Access to seller portal
- Can manage products
- Can view application status
- Cannot access admin features

### Customer
- Access to storefront
- Can browse products
- Can view local sellers
- Cannot access admin or seller features

### Myntra Analyst (Future)
- Access to analytics and insights
- Cannot manage sellers
- Cannot approve applications

---

# 6. Frontend API Integration Rules

## How Frontend Calls APIs
- Use Axios for HTTP requests
- Base URL configured in environment variables
- All API calls wrapped in React Query hooks
- Request interceptors for common headers
- Response interceptors for error handling

## Loading Handling
- Use React Query loading states
- Display spinner during API calls
- Disable buttons during form submission
- Show skeleton screens for data loading

## Error Handling
- Use React Query error states
- Display user-friendly error messages
- Log errors to console (development)
- Show retry option for recoverable errors
- Redirect to error page for critical errors

## Empty States
- Display empty state component when no data
- Provide clear message for empty state
- Offer action to add data (if applicable)
- Use appropriate empty state illustrations

## Retry Behavior
- React Query automatic retry (3 attempts)
- Exponential backoff for retries
- Manual retry button for user-initiated retry
- No retry for validation errors (400)

## Pagination Handling
- Use cursor-based pagination
- Fetch next page on scroll or button click
- Display loading indicator for next page
- Cache paginated data in React Query

---

# 7. Backend API Standards

## Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errorCode": "VALIDATION_ERROR",
  "details": {
    // Additional error details
  }
}
```

## HTTP Status Usage

### Success Codes
- `200 OK`: Successful GET, PUT, DELETE
- `201 Created`: Successful POST
- `204 No Content`: Successful DELETE with no response body

### Client Error Codes
- `400 Bad Request`: Validation error, invalid input
- `401 Unauthorized`: Authentication required/failed
- `403 Forbidden`: Authorization failed (wrong role)
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource (e.g., duplicate email)
- `422 Unprocessable Entity`: Semantic error
- `429 Too Many Requests`: Rate limit exceeded

### Server Error Codes
- `500 Internal Server Error`: Unexpected server error
- `503 Service Unavailable`: Service temporarily unavailable

## Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Authentication failed
- `AUTHORIZATION_ERROR`: Authorization failed
- `NOT_FOUND_ERROR`: Resource not found
- `DUPLICATE_ERROR`: Duplicate resource
- `SERVER_ERROR`: Unexpected server error

---

# 8. File Upload Contract

## Seller Product Image Upload Flow
1. Seller selects image from device
2. Frontend validates image format and size
3. Frontend uploads image to placeholder service (MVP)
4. Placeholder service returns image URL
5. Frontend includes image URL in product data
6. Backend stores image URL in database

## Allowed Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

## Size Limits
- Maximum file size: 5MB
- Recommended dimensions: 800x800px
- Minimum dimensions: 400x400px

## Storage Approach
**MVP**: Placeholder services
- Use unsplash.it or placehold.co for demo
- Store image URL in database
- No actual file storage

**Future**: Cloud storage
- Upload to Cloudinary
- Store Cloudinary URL in database
- Automatic image optimization

## Response Format
```json
{
  "status": "success",
  "message": "Image uploaded successfully",
  "data": {
    "imageUrl": "https://example.com/image.jpg",
    "publicId": "image_id"
  }
}
```

---

# 9. Development Ownership Matrix

| Feature | Frontend Owner | Backend Owner |
|---------|---------------|---------------|
| **Authentication** | Role selection UI, Role store, Routing guards | Role selection API, Role validation |
| **Regional Intelligence** | Regional map, State details panel, Charts | Regional data API, Demand scoring API |
| **Catalog Gap Detection** | Gap table, Gap cards, Gap filters | Gap calculation API, Gap API |
| **Seller Discovery** | Seller list, Seller cards, Seller profiles | Seller matching API, Seller API |
| **Seller Registration** | Registration form, Form validation | Seller registration API, Seller creation |
| **Seller Products** | Product form, Product list, Product cards | Product API, Product CRUD operations |
| **Application Status** | Status view, Status timeline | Application status API, Status updates |
| **Regional Storefront** | Region selector, Hero banner, Product grid | Storefront API, Personalization logic |
| **Festival Collections** | Festival collection display | Festival collection API, Collection generation |
| **Local Sellers** | Local sellers list, Seller cards | Local sellers API, Seller filtering |
| **Analytics** | Analytics dashboard, Charts | Analytics API, Data aggregation |
| **Data Models** | TypeScript interfaces | Prisma schema, Database tables |

---

# 10. Integration Milestones

## Milestone 1: Authentication Complete
**Frontend**:
- Role selection page
- Role store (Zustand)
- Role-based routing

**Backend**:
- Role selection API
- Role validation
- Protected route middleware

**Integration**:
- Frontend calls role selection API
- Role stored and persisted
- Routing based on role

**Timeline**: Day 1-2

## Milestone 2: Regional Data API Connected
**Frontend**:
- Regional map component
- State details panel
- Regional data hooks

**Backend**:
- Regional data API
- Festival data API
- Textile data API

**Integration**:
- Frontend fetches regional data
- Map displays regions
- Details panel shows region info

**Timeline**: Day 3-4

## Milestone 3: Catalog Gap Connected
**Frontend**:
- Gap table component
- Gap summary cards
- Gap filters

**Backend**:
- Gap calculation API
- Gap API
- Demand scoring logic

**Integration**:
- Frontend fetches gap data
- Gap calculation triggered
- Gaps displayed in table

**Timeline**: Day 5-6

## Milestone 4: Seller Discovery Connected
**Frontend**:
- Seller list component
- Seller cards
- Seller profiles

**Backend**:
- Seller matching API
- Seller API
- Matching logic

**Integration**:
- Frontend fetches seller data
- Seller matching displayed
- Seller profiles shown

**Timeline**: Day 7-8

## Milestone 5: Seller Onboarding Connected
**Frontend**:
- Registration form
- Product form
- Status view

**Backend**:
- Seller registration API
- Product API
- Application status API

**Integration**:
- Seller registration flow
- Product addition flow
- Status tracking

**Timeline**: Day 9-10

## Milestone 6: Storefront Connected
**Frontend**:
- Region selector
- Storefront page
- Festival collections
- Local sellers

**Backend**:
- Storefront API
- Personalization logic
- Recommendation logic

**Integration**:
- Regional storefront displayed
- Festival collections shown
- Local sellers listed

**Timeline**: Day 11-12

## Milestone 7: Analytics Connected
**Frontend**:
- Analytics dashboard
- Charts (Recharts)
- Analytics filters

**Backend**:
- Analytics API
- Data aggregation
- Analytics calculations

**Integration**:
- Analytics data fetched
- Charts displayed
- Filters applied

**Timeline**: Day 13-14

## Milestone 8: Complete Integration
**Frontend**:
- All pages connected
- All components working
- Error handling complete

**Backend**:
- All APIs working
- All business logic complete
- Database seeded

**Integration**:
- End-to-end testing
- Demo flow testing
- Bug fixes

**Timeline**: Day 15-16

---

# 11. Naming Convention Agreement

## API Naming
- **Endpoints**: kebab-case
  - Example: `/api/regional-intelligence`, `/api/seller-matching`
- **HTTP Methods**: RESTful conventions
  - GET: Retrieve data
  - POST: Create data
  - PUT: Update data (full)
  - PATCH: Update data (partial)
  - DELETE: Remove data

## JSON Field Naming
- **Fields**: camelCase
  - Example: `businessName`, `contactPerson`, `regionId`
- **Booleans**: Prefix with `is`, `has`, `should`
  - Example: `isAuthenticated`, `giTagged`, `msme`
- **Arrays**: Plural form
  - Example: `categories`, `textileIds`, `productIds`
- **IDs**: camelCase with "Id" suffix
  - Example: `regionId`, `sellerId`, `productId`

## Database Naming
- **Tables**: snake_case, plural
  - Example: `regions`, `sellers`, `products`, `catalog_gaps`
- **Columns**: snake_case
  - Example: `business_name`, `contact_person`, `region_id`
- **Foreign Keys**: snake_case with `_id` suffix
  - Example: `region_id`, `seller_id`, `product_id`

## Frontend Variable Naming
- **Variables**: camelCase
  - Example: `regionData`, `sellerList`, `gapCalculation`
- **Constants**: UPPER_SNAKE_CASE
  - Example: `API_BASE_URL`, `MAX_FILE_SIZE`
- **Components**: PascalCase
  - Example: `RegionalMap`, `SellerCard`, `GapTable`
- **Hooks**: camelCase with 'use' prefix
  - Example: `useRegionalData`, `useSellerData`
- **Types/Interfaces**: PascalCase
  - Example: `Region`, `Seller`, `Product`

## Backend Variable Naming
- **Variables**: camelCase
  - Example: `regionData`, `sellerList`, `gapCalculation`
- **Constants**: UPPER_SNAKE_CASE
  - Example: `API_BASE_URL`, `MAX_FILE_SIZE`
- **Functions**: camelCase
  - Example: `calculateDemandScore`, `matchSellers`
- **Classes/Services**: PascalCase
  - Example: `IntelligenceService`, `StorefrontService`

---

# 12. Final Collaboration Rules

## Communication of Changes
- **API Changes**: Backend developer must notify frontend developer before breaking changes
- **Data Model Changes**: Both developers must agree on shared data model changes
- **Feature Changes**: Discuss in team meeting before implementation
- **Bug Fixes**: Communicate fix in team chat

## API Change Handling
- **Breaking Changes**: Require team discussion and approval
- **Non-Breaking Changes**: Notify frontend developer, update API contract
- **Versioning**: Use URL path versioning if needed (e.g., `/api/v1/regions`)
- **Deprecation**: Provide warning headers for deprecated endpoints

## Version Control Workflow
- **Branch Strategy**: Feature branches for each feature
- **Branch Naming**: `feature/description`, `fix/description`
- **Pull Requests**: Required for all changes
- **Code Review**: Both developers review each other's code
- **Merge**: Merge to main after approval

## Breaking Change Prevention
- **API Contract**: Follow this contract strictly
- **Data Models**: Do not change shared data models without discussion
- **Validation**: Validate all inputs on both frontend and backend
- **Testing**: Test API changes before merging
- **Documentation**: Update API contract for any changes

## Daily Standup
- **Time**: 15 minutes daily
- **Topics**: What was done, what's planned, blockers
- **Format**: Quick updates, no deep technical discussions

## Weekly Planning
- **Time**: 30 minutes weekly
- **Topics**: Sprint planning, milestone review, upcoming work
- **Output**: Updated task list and timeline

## Issue Resolution
- **Blockers**: Communicate immediately in team chat
- **Conflicts**: Discuss in team meeting
- **Decisions**: Document decisions in this contract

## Documentation Updates
- **API Changes**: Update API contract immediately
- **Data Model Changes**: Update shared data models immediately
- **Architecture Changes**: Update architecture document
- **Process Changes**: Update this contract

---

## Sign-Off

This Frontend-Backend Development Contract is **FINAL**. Both developers must follow this contract to ensure smooth collaboration and avoid integration conflicts.

**Frontend Developer**: ___________________
**Backend Developer**: ___________________
**Date**: July 15, 2026
**Version**: 1.0
