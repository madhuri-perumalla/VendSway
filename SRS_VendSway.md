# VendSway - Hackathon MVP Specification

## 1. Document Information

- **Project Name**: VendSway
- **Document Version**: 2.0 (Hackathon Edition)
- **Date**: July 15, 2026
- **Purpose**: Define 5-screen MVP for hackathon demo
- **Target Audience**: Hackathon judges, development team

---

## 2. Problem Statement

### 2.1 Current Situation
VendSway, a regional commerce intelligence platform, addresses three critical challenges in expanding across Bharat (Tier 2 and Tier 3 cities):

1. **Customer Mismatch**: Customers in regional markets don't find products that align with their local cultural preferences, festival needs, and regional fashion traditions.

2. **Catalog Blind Spots**: The platform lacks visibility into which regional products are missing from its catalog. The platform doesn't systematically track regional demand patterns or identify gaps in regional product offerings.

3. **Seller Disconnect**: Thousands of local artisans, MSMEs, handloom weavers, and textile businesses across India are not connected to the marketplace, creating a supply-demand disconnect.

### 2.2 Impact
- **Revenue Loss**: Missed opportunities in high-growth Tier 2/3 markets
- **Customer Churn**: Regional customers leave due to irrelevant product recommendations
- **Market Share**: Competitors with better regional understanding capture these markets
- **Social Impact**: Local artisans and MSMEs lack access to national market exposure

### 2.3 Root Cause
The current approach is:
- Centralized and generic, not region-specific
- Lacks systematic regional fashion intelligence
- No automated regional demand analysis
- Manual seller discovery process
- One-size-fits-all storefront experience

---

## 3. Users

### 3.1 Primary Users
1. **Platform Team**: Category managers, regional expansion leads
2. **Sellers**: Local artisans, MSME owners, handloom cooperatives
3. **Customers**: Shoppers from Tier 2/3 cities across India

---

## 4. User Roles

### 4.1 Platform Team
- **Responsibilities**: View regional intelligence, identify catalog gaps, discover sellers
- **Key Goals**: Expand regional catalog, onboard local sellers

### 4.2 Seller
- **Responsibilities**: Register business, add products, view status
- **Key Goals**: List products on the platform, reach national customers

### 4.3 Customer
- **Responsibilities**: Browse products, discover regional fashion
- **Key Goals**: Find culturally relevant products, discover local sellers

---

## 5. Five-Screen MVP Specification

### Screen 1: Regional Intelligence Map (Platform Team)

**Purpose**: Understand regional fashion landscape

**Features**:
- Interactive India map
- Clickable states: Andhra Pradesh, Tamil Nadu, Rajasthan
- When state is selected, display:
  - Regional textiles (e.g., Pochampally Ikat, Kanchipuram Sarees, Bandhani)
  - GI-tag products
  - Major festivals
  - Textile clusters
  - Demand indicators

**Data**: Pre-loaded mock data for 3 states

### Screen 2: Catalog Gap Detection (Platform Team)

**Purpose**: Identify missing products by region

**Features**:
- Simple table showing:
  - Product category (e.g., Ikat Saree)
  - Demand (e.g., 450)
  - Available in catalog (e.g., 120)
  - Gap (e.g., 330)
- Filter by region
- Color-coded gaps (red = high priority, yellow = medium)

**Data**: Mock catalog data (50-100 products), mock demand calculation

### Screen 3: Seller Discovery (Platform Team)

**Purpose**: Find local sellers for identified gaps

**Features**:
- List of sellers with:
  - Business name (e.g., Pochampally Weavers)
  - Distance from region
  - GI-tagged status (yes/no)
  - MSME status (yes/no)
  - Product categories
  - Contact button
- Filter by region and category
- Click to view seller profile

**Data**: Pre-loaded seller database (15-20 sellers)

### Screen 4: Seller Portal (Seller)

**Purpose**: Register sellers and add products

**Features**:
- **Registration Form**:
  - Business name
  - Contact person
  - Email
  - Phone
  - Location
  - Product categories
- **Add Product Form**:
  - Product name
  - Category
  - Price
  - Regional tags
  - Image upload
- **Status View**:
  - Registration status (Pending/Approved)
  - Product count
  - Simple checklist

**Data**: Form data stored in local state/database

### Screen 5: Regional Storefront (Customer)

**Purpose**: Personalized shopping experience by region

**Features**:
- **Region Selection**: Dropdown to select city (e.g., Hyderabad, Chennai, Jaipur)
- **Dynamic Homepage** (changes based on selection):
  - Regional banner (e.g., "Telangana's Finest Handlooms")
  - Festival collection section
  - Regional products with badges
  - Local sellers section
- **Product Cards** show:
  - Product image
  - Name
  - Price
  - Regional origin
  - Seller name

**Data**: Pre-loaded product catalog with regional tags

---

## 6. Non-Functional Requirements (Simplified)

### 6.1 Performance
- Screens load within 3 seconds
- Smooth transitions between screens

### 6.2 Usability
- Intuitive UI with minimal clicks
- Clear navigation between 5 screens
- Mobile-responsive design

### 6.3 Compatibility
- Works on modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive for desktop and tablet viewing

---

## 7. User Journeys (Simplified)

### Journey 1: Platform Team - Regional Intelligence
1. Open Screen 1 (Regional Intelligence Map)
2. Click on "Rajasthan"
3. View textiles, GI-tags, festivals, clusters
4. Navigate to Screen 2 (Catalog Gaps)

### Journey 2: Platform Team - Gap Detection
1. Open Screen 2 (Catalog Gap Detection)
2. Select region
3. View gap table (Demand vs Available)
4. Navigate to Screen 3 (Seller Discovery)

### Journey 3: Platform Team - Seller Discovery
1. Open Screen 3 (Seller Discovery)
2. Filter by region and category
3. View seller list
4. Click "Contact" on relevant seller

### Journey 4: Seller - Registration
1. Open Screen 4 (Seller Portal)
2. Fill registration form
3. Submit
4. View status: "Pending"
5. Add first product

### Journey 5: Customer - Regional Storefront
1. Open Screen 5 (Regional Storefront)
2. Select "Hyderabad" from dropdown
3. Homepage changes to Telangana theme
4. Browse regional products
5. View local sellers

---

## 8. MVP Scope

### In Scope (5 Screens Only)
1. **Screen 1**: Regional Intelligence Map with 3 states
2. **Screen 2**: Catalog Gap Detection table
3. **Screen 3**: Seller Discovery list
4. **Screen 4**: Seller Portal (registration + add product + status)
5. **Screen 5**: Regional Storefront with 3 city options

### Out of Scope
- Real API integrations
- Authentication/login
- Database persistence (use local state/mock data)
- Bulk upload
- Analytics dashboards
- Export reports
- Notifications
- Document verification
- Approval workflows
- Multi-language
- Mobile app
- Payments
- Order management

---

## 9. Future Scope

### Phase 2
- Real API integrations
- Database persistence
- Authentication
- More states and regions
- Advanced filtering

### Phase 3
- Mobile apps
- Analytics dashboards
- Bulk upload
- Notifications
- Multi-language support

---

## 10. Assumptions

- Mock data is acceptable for demo
- No real API integrations needed
- Judges evaluate based on concept and UX
- 48-hour hackathon timeline
- Single developer or small team

---

## 11. Success Metrics

### Demo Success
- Judges understand value proposition in 2 minutes
- All 5 screens work without bugs
- Beautiful and intuitive UI
- Complete user journey demonstrated

### Technical
- Pages load within 3 seconds
- Responsive design
- No console errors

---

## 12. Risks

| Risk | Mitigation |
|------|------------|
| Scope creep | Stick to 5 screens only |
| Demo fails | Rehearse, have backup |
| UI not polished | Use component library (shadcn/ui) |
| Can't finish in time | Prioritize core screens first |

---

## 13. Final Feature List (5 Screens)

### Screen 1: Regional Intelligence Map
- Interactive India map
- 3 clickable states
- Regional data display

### Screen 2: Catalog Gap Detection
- Gap table
- Region filter
- Color coding

### Screen 3: Seller Discovery
- Seller list
- Basic filters
- Contact button

### Screen 4: Seller Portal
- Registration form
- Add product form
- Status view

### Screen 5: Regional Storefront
- Region dropdown
- Dynamic homepage
- Product cards

---

## 14. Technical Architecture (Simplified)

### Frontend
- **Framework**: React.js
- **UI Library**: shadcn/ui + TailwindCSS
- **Maps**: Simple SVG or Leaflet
- **State**: React Context

### Backend (Optional for MVP)
- **Framework**: Node.js with Express (or use mock data in frontend)
- **Database**: JSON files or PostgreSQL

### Data Storage
- Mock data in JSON files
- Local state for forms

### Deployment
- **Hosting**: Vercel (frontend only)
- **Backend**: Optional - can be frontend-only for MVP

---

## 15. Data Models (Simplified)

### Region
```json
{
  "id": "1",
  "name": "Andhra Pradesh",
  "textiles": ["Pochampally Ikat", "Kalamkari"],
  "festivals": ["Sankranti", "Ugadi"],
  "giTags": ["Pochampally Ikat Sarees"]
}
```

### Seller
```json
{
  "id": "1",
  "businessName": "Pochampally Weavers",
  "location": "Telangana",
  "isGiTagged": true,
  "isMsme": true,
  "categories": ["Sarees", "Handloom"]
}
```

### Product
```json
{
  "id": "1",
  "name": "Pochampally Ikat Silk Saree",
  "category": "Sarees",
  "region": "Telangana",
  "price": 8500,
  "seller": "Pochampally Weavers"
}
```

### Gap
```json
{
  "category": "Ikat Saree",
  "demand": 450,
  "available": 120,
  "gap": 330
}
```

---

## 16. Appendix

### Glossary
- **GI-tag**: Geographical Indication - products with specific geographical origin
- **MSME**: Micro, Small and Medium Enterprises
- **Bharat**: Non-metro India, regional markets

### Version History
- v1.0: Enterprise SRS (too complex)
- v2.0: Hackathon MVP (5 screens)

---

## 17. Sign-Off

**MVP Commitment**: 5 screens that tell the complete story:
1. Regional Intelligence Map - understand Bharat
2. Catalog Gap Detection - find what's missing
3. Seller Discovery - find local businesses
4. Seller Portal - register products
5. Regional Storefront - personalized customer experience

**Goal**: Judges understand the product in 2 minutes through a beautiful demo.
