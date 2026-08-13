# VendSway - Hackathon MVP Software Specification

## Document Information

- **Project Name**: VendSway
- **Document Version**: 1.0
- **Date**: July 15, 2026
- **Purpose**: Complete Hackathon MVP Software Specification
- **Target Audience**: Hackathon judges, development team

---

## 1. Problem Statement

### 1.1 Current Situation

VendSway, a regional commerce intelligence platform, addresses three critical challenges in expanding across Bharat (Tier 2 and Tier 3 cities):

**Challenge 1: Customer Mismatch**
Customers in regional markets cannot easily discover products that match their local culture, festivals, and traditions. The current generic homepage shows the same products to a customer in Hyderabad as to a customer in Mumbai, missing regional preferences.

**Challenge 2: Catalog Blind Spots**
The platform lacks visibility into which regional products are missing from its catalog. The platform cannot systematically identify gaps in regional product offerings or understand regional demand patterns.

**Challenge 3: Seller Disconnect**
Thousands of local artisans, MSMEs, handloom weavers, and textile businesses across India are not connected to the marketplace. These sellers have the products regional customers want, but no way to reach them.

### 1.2 Impact

- **Revenue Loss**: Missed opportunities in high-growth Tier 2/3 markets
- **Customer Churn**: Regional customers leave due to irrelevant product recommendations
- **Market Share**: Competitors with better regional understanding capture these markets
- **Social Impact**: Local artisans and MSMEs lack access to national market exposure

### 1.3 Root Cause

The current approach is centralized and generic, not region-specific. It lacks:
- Systematic regional fashion intelligence
- Automated regional demand analysis
- Efficient seller discovery process
- Personalized storefront experiences

---

## 2. Proposed Solution

VendSway is a regional commerce intelligence platform that connects regional fashion demand with local sellers.

### 2.1 Solution Overview

The platform creates a data-driven understanding of each region's fashion identity and uses this intelligence to:

1. **Understand Regional Fashion**: Map textiles, festivals, GI-tag products, and traditions by region
2. **Identify Catalog Gaps**: Compare regional demand against current catalog to find missing products
3. **Discover Local Sellers**: Match identified gaps with local artisans, MSMEs, and handloom businesses
4. **Onboard Sellers**: Provide simple registration for sellers to list their products
5. **Personalize Storefront**: Show customers region-specific products, festivals, and local sellers

### 2.2 Product Flow

```
Regional Intelligence Data
           ↓
Demand & Catalog Analysis
           ↓
Catalog Gap Detection
           ↓
Seller Discovery
           ↓
Seller Onboarding
           ↓
Regional Personalized Storefront
```

### 2.3 Key Differentiator

Unlike generic e-commerce platforms, VendSway understands regional identity. It doesn't just show products—it shows the right products for the right region, from the right local sellers.

---

## 3. Value Proposition

### 3.1 For the Platform

- **Expand Regional Reach**: Access high-growth Tier 2/3 markets with relevant products
- **Data-Driven Expansion**: Make informed decisions about which regions and categories to prioritize
- **Seller Network**: Build a pipeline of verified local sellers with regional expertise
- **Competitive Advantage**: First-mover advantage in regional personalization

### 3.2 For Sellers

- **National Visibility**: Reach millions of customers across India
- **Simplified Onboarding**: Easy registration process without complex requirements
- **Regional Targeting**: Products shown to customers who value regional craftsmanship
- **Fair Opportunity**: MSMEs and artisans compete on quality, not marketing budgets

### 3.3 For Customers

- **Cultural Relevance**: Discover products that match local traditions and festivals
- **Local Discovery**: Find authentic regional products from local sellers
- **Personalized Experience**: Homepage tailored to regional preferences
- **Trust**: Know product origins and support local artisans

---

## 4. Primary Users

### 4.1 Platform Team

**Who**: Category managers, regional expansion leads, merchandising teams

**Responsibilities**:
- Understand regional fashion landscapes
- Identify catalog gaps by region
- Discover and connect with local sellers
- Track seller onboarding progress

**Key Motivation**: Expand regional catalog and increase sales in Tier 2/3 markets

### 4.2 Sellers

**Who**: Local artisans, MSME owners, handloom cooperatives, textile businesses

**Responsibilities**:
- Register their business on the platform
- Add products with regional information
- Manage their product catalog
- Track onboarding status

**Key Motivation**: Reach national customers and grow their business

### 4.3 Customers

**Who**: Shoppers from Tier 2/3 cities across India

**Responsibilities**:
- Browse personalized regional storefront
- Discover regional products and local sellers
- Make purchases

**Key Motivation**: Find culturally relevant products and support local artisans

---

## 5. User Goals

### 5.1 Platform Team Goals

- Quickly understand the fashion landscape of any region
- Identify which products are missing from the catalog
- Find sellers who can fill those gaps
- Track seller onboarding progress
- Make data-driven expansion decisions

### 5.2 Seller Goals

- Register their business in under 10 minutes
- List products with regional context
- Get visibility on the platform
- Reach customers across India
- Grow their business through national exposure

### 5.3 Customer Goals

- Find products that match their local culture and festivals
- Discover authentic regional products
- Support local artisans and businesses
- Have a personalized shopping experience

---

## 6. Five-Screen MVP

### Screen 1: Regional Intelligence Map

**Purpose**: Provide Platform Team with a visual understanding of regional fashion landscapes across India

**Target User**: Platform Team

**UI Sections**:
- Header: "VendSway - Regional Intelligence"
- Main Content: Interactive India map
- Sidebar/Panel: Regional details panel
- Footer: Quick navigation to other screens

**Main Components**:
- **Interactive India Map**: SVG-based map with clickable states
- **State Highlighting**: Visual indication of selected state
- **Regional Details Panel**: Shows when a state is selected
  - State name and brief description
  - Regional textiles list
  - GI-tag products
  - Major festivals
  - Textile clusters
  - Demand indicators
- **Filter Controls**: Filter by textile type, festival, or GI-tag status
- **Navigation Buttons**: "View Catalog Gaps" button

**User Interactions**:
- Click on a state to select it
- Regional details panel updates with state-specific information
- Use filters to narrow down textiles or festivals
- Click "View Catalog Gaps" to navigate to Screen 2
- Click different states to compare regions

**Mock Data Required**:
- 3 states: Andhra Pradesh, Tamil Nadu, Rajasthan
- 6-8 regional textiles (2-3 per state)
- 5-6 GI-tag products
- 5-6 major festivals
- 3-4 textile clusters
- Demand indicators (high/medium/low)

**Navigation**:
- From: Landing page / Home
- To: Screen 2 (Catalog Gap Detection) via "View Catalog Gaps" button

**Acceptance Criteria**:
- Map displays 3 clickable states
- Clicking a state shows regional details
- Details include textiles, GI-tags, festivals, clusters
- Filters work correctly
- Navigation to Screen 2 functions
- All data loads within 2 seconds

---

### Screen 2: Catalog Gap Detection

**Purpose**: Show Platform Team which products are missing from the catalog by region

**Target User**: Platform Team

**UI Sections**:
- Header: "Catalog Gap Detection" with region selector
- Main Content: Gap analysis table
- Summary Cards: Quick stats at top
- Footer: Navigation controls

**Main Components**:
- **Region Selector**: Dropdown to select region (pre-filled from Screen 1 selection)
- **Summary Cards**:
  - Total catalog coverage percentage
  - Number of high-priority gaps
  - Total demand vs available
- **Gap Table**: Columns:
  - Product Category
  - Demand (number)
  - Available in Catalog (number)
  - Gap (number)
  - Priority (color-coded: red=high, yellow=medium, green=low)
  - Festival Relevance (icon/text)
- **Filter Controls**: Filter by priority, category, festival
- **Action Button**: "Find Sellers for This Gap" on each row
- **Navigation**: "Back to Map" and "View Seller Discovery" buttons

**User Interactions**:
- Change region from dropdown to see different gaps
- Click table headers to sort
- Use filters to narrow down gaps
- Click "Find Sellers for This Gap" to navigate to Screen 3 with context
- View summary cards for quick overview
- Click "Back to Map" to return to Screen 1

**Mock Data Required**:
- 8-10 gap records per region
- Demand numbers (e.g., 450, 320, 200)
- Available numbers (e.g., 120, 80, 50)
- Gap calculations (demand - available)
- Priority levels (high/medium/low)
- Festival associations

**Navigation**:
- From: Screen 1 (Regional Intelligence Map)
- To: Screen 3 (Seller Discovery) via "Find Sellers" button
- Back to: Screen 1 via "Back to Map" button

**Acceptance Criteria**:
- Table displays gap data correctly
- Region selector updates table
- Filters work (priority, category, festival)
- Gap calculations are accurate
- Color coding indicates priority correctly
- "Find Sellers" button navigates to Screen 3 with gap context
- Summary cards show accurate totals

---

### Screen 3: Seller Discovery

**Purpose**: Help Platform Team find local sellers who can fill identified catalog gaps

**Target User**: Platform Team

**UI Sections**:
- Header: "Seller Discovery" with gap context
- Main Content: Seller list/grid
- Filter Panel: Sidebar with filters
- Footer: Navigation controls

**Main Components**:
- **Gap Context Banner**: Shows selected gap (e.g., "Finding sellers for: Ikat Saree - Gap: 330")
- **Filter Panel**:
  - Region filter
  - Category filter
  - GI-tagged toggle
  - MSME toggle
  - Distance range
- **Seller List/Grid**: Each seller card shows:
  - Business name
  - Location
  - Distance from target region
  - GI-tagged status (badge)
  - MSME status (badge)
  - Product categories
  - Production capacity
  - Rating/review (if available)
- **Contact Button**: On each seller card
- **View Profile Button**: On each seller card
- **Navigation**: "Back to Gaps" and "View Seller Portal" buttons

**User Interactions**:
- Apply filters to narrow down seller list
- Click seller card to view detailed profile
- Click "Contact" to show contact information modal
- Sort by distance, rating, or capacity
- Change gap context to see different sellers
- Navigate back to Screen 2 or forward to Screen 4

**Mock Data Required**:
- 15-20 seller records
- Business names, locations, contact info
- GI-tag and MSME status
- Product categories
- Production capacity
- Distance calculations
- Ratings

**Navigation**:
- From: Screen 2 (Catalog Gap Detection)
- To: Screen 4 (Seller Portal) via "View Seller Portal" button
- Back to: Screen 2 via "Back to Gaps" button

**Acceptance Criteria**:
- Seller list displays correctly
- Filters work (region, category, GI-tag, MSME, distance)
- Gap context banner shows correct information
- Contact button shows seller contact info
- Profile view shows detailed seller information
- Sorting works correctly

---

### Screen 4: Seller Portal

**Purpose**: Allow sellers to register their business and add products to the platform

**Target User**: Sellers

**UI Sections**:
- Header: "Seller Portal" with status indicator
- Tab Navigation: Registration | Add Product | Status
- Main Content: Form based on selected tab
- Footer: Help and navigation

**Main Components**:

**Registration Tab**:
- Business name field
- Contact person field
- Email field
- Phone field
- Location field (dropdown)
- Product categories (multi-select)
- Submit button
- Form validation indicators

**Add Product Tab**:
- Product name field
- Category dropdown
- Price field
- Regional tags (multi-select)
- Image upload area
- Description field
- Submit button
- Product list preview

**Status Tab**:
- Registration status (Pending/Approved)
- Onboarding checklist
- Product count
- Last updated timestamp
- Next steps guidance

**User Interactions**:
- Switch between tabs using tab navigation
- Fill registration form and submit
- Fill product form and submit
- View registration status
- See onboarding progress
- Add multiple products
- Navigate to Screen 5 to see how products appear

**Mock Data Required**:
- Form validation rules
- Registration status states
- Onboarding checklist items
- Sample product data for preview

**Navigation**:
- From: Screen 3 (Seller Discovery)
- To: Screen 5 (Regional Storefront) via "Preview Storefront" button
- Independent entry point for sellers

**Acceptance Criteria**:
- Registration form validates all required fields
- Product form validates all required fields
- Submit shows success message
- Status tab updates after submission
- Tab navigation works smoothly
- Form data persists within session

---

### Screen 5: Regional Storefront

**Purpose**: Demonstrate personalized shopping experience for customers based on their region

**Target User**: Customers

**UI Sections**:
- Header: VendSway branding with region selector
- Hero Section: Regional banner
- Main Content: Product sections
- Sidebar: Regional categories
- Footer: Navigation

**Main Components**:
- **Region Selector**: Dropdown to select city (Hyderabad, Chennai, Jaipur)
- **Dynamic Hero Banner**: Changes based on selected region
  - Region-specific imagery
  - Region-specific headline (e.g., "Telangana's Finest Handlooms")
  - Festival-specific callout
- **Festival Collection Section**:
  - Festival name and date
  - Curated products for that festival
  - "Shop Festival Collection" button
- **Regional Products Section**:
  - Product grid with regional badges
  - Each product card shows:
    - Product image
    - Product name
    - Price
    - Regional origin badge
    - Seller name
    - GI-tag badge (if applicable)
- **Local Sellers Section**:
  - Seller profiles
  - "Shop from [Seller Name]" buttons
- **Regional Categories Sidebar**:
  - Region-specific categories
  - Textile types
  - Festival categories

**User Interactions**:
- Select different region from dropdown
- Homepage dynamically updates with new region
- Browse festival collection
- Click product to view details
- Click seller to see seller profile
- Navigate regional categories
- Add products to cart (visual only)

**Mock Data Required**:
- 3 city configurations (Hyderabad, Chennai, Jaipur)
- 15-20 products with regional tags
- 5-6 sellers with regional associations
- Festival collections for each region
- Regional category hierarchies
- Hero banner content for each region

**Navigation**:
- From: Screen 4 (Seller Portal) via "Preview Storefront"
- Independent entry point for customers
- Can be accessed directly from landing page

**Acceptance Criteria**:
- Region selector changes entire homepage
- Hero banner updates with region-specific content
- Products show correct regional badges
- Festival collections are region-appropriate
- Local sellers section shows sellers from selected region
- All transitions are smooth
- Product cards display all required information

---

## 7. Complete User Journey

### Journey Overview

The demo tells a cohesive story from problem identification to solution demonstration:

**Act 1: Understanding the Problem (Screens 1-2)**
Platform Team discovers regional fashion intelligence and identifies catalog gaps

**Act 2: Finding the Solution (Screens 3-4)**
Platform Team discovers local sellers and demonstrates seller onboarding

**Act 3: Customer Experience (Screen 5)**
Customers experience personalized regional shopping

### Detailed Journey Flow

**Step 1: Regional Intelligence**
- Presenter opens Screen 1
- Clicks on "Rajasthan" on the map
- Panel shows: Bandhani, Kota Doria, Leheriya textiles; Teej, Gangaur festivals; GI-tag products
- Presenter explains: "This is what Rajasthan's fashion landscape looks like"

**Step 2: Gap Detection**
- Presenter clicks "View Catalog Gaps" → navigates to Screen 2
- Table shows gaps for Rajasthan
- Highlight: "Ikat Saree - Demand: 450, Available: 120, Gap: 330"
- Presenter explains: "We're missing 330 Ikat Sarees that customers want"

**Step 3: Seller Discovery**
- Presenter clicks "Find Sellers for This Gap" → navigates to Screen 3
- Shows list of sellers who produce Ikat Sarees
- Highlight: "Pochampally Weavers - GI-tagged, MSME, 15km away"
- Presenter explains: "Here are local sellers who can fill this gap"

**Step 4: Seller Onboarding**
- Presenter clicks "View Seller Portal" → navigates to Screen 4
- Demonstrates registration form (fills sample data)
- Demonstrates adding a product
- Shows status tab with "Pending" status
- Presenter explains: "Sellers can easily register and add products"

**Step 5: Customer Experience**
- Presenter clicks "Preview Storefront" → navigates to Screen 5
- Selects "Hyderabad" from dropdown
- Homepage transforms to Telangana theme
- Shows festival collection, regional products, local sellers
- Presenter explains: "Customers see a personalized experience"

**Step 6: Region Comparison**
- Presenter changes region to "Chennai"
- Homepage transforms to Tamil Nadu theme
- Shows different products, festivals, sellers
- Presenter explains: "Each region gets a unique experience"

---

## 8. Functional Requirements

### Screen 1: Regional Intelligence Map

**FR-1.1**: System shall display an interactive India map with 3 clickable states
**FR-1.2**: System shall show regional details when a state is selected
**FR-1.3**: System shall display regional textiles for selected state
**FR-1.4**: System shall display GI-tag products for selected state
**FR-1.5**: System shall display major festivals for selected state
**FR-1.6**: System shall display textile clusters for selected state
**FR-1.7**: System shall allow filtering by textile type
**FR-1.8**: System shall allow filtering by festival
**FR-1.9**: System shall navigate to Screen 2 when "View Catalog Gaps" is clicked
**FR-1.10**: System shall pass selected state context to Screen 2

### Screen 2: Catalog Gap Detection

**FR-2.1**: System shall display a gap table with Demand, Available, and Gap columns
**FR-2.2**: System shall calculate Gap as Demand minus Available
**FR-2.3**: System shall color-code gaps by priority (red=high, yellow=medium, green=low)
**FR-2.4**: System shall allow region selection via dropdown
**FR-2.5**: System shall update gap table when region is changed
**FR-2.6**: System shall display summary cards with coverage percentage and gap counts
**FR-2.7**: System shall allow filtering by priority
**FR-2.8**: System shall allow filtering by category
**FR-2.9**: System shall allow filtering by festival
**FR-2.10**: System shall navigate to Screen 3 when "Find Sellers" is clicked
**FR-2.11**: System shall pass selected gap context to Screen 3
**FR-2.12**: System shall navigate back to Screen 1 when "Back to Map" is clicked

### Screen 3: Seller Discovery

**FR-3.1**: System shall display a list of sellers
**FR-3.2**: System shall show seller business name, location, and distance
**FR-3.3**: System shall display GI-tagged status as a badge
**FR-3.4**: System shall display MSME status as a badge
**FR-3.5**: System shall show product categories for each seller
**FR-3.6**: System shall allow filtering by region
**FR-3.7**: System shall allow filtering by category
**FR-3.8**: System shall allow filtering by GI-tagged status
**FR-3.9**: System shall allow filtering by MSME status
**FR-3.10**: System shall allow filtering by distance range
**FR-3.11**: System shall display gap context in banner
**FR-3.12**: System shall show contact information when "Contact" is clicked
**FR-3.13**: System shall show detailed profile when "View Profile" is clicked
**FR-3.14**: System shall navigate to Screen 4 when "View Seller Portal" is clicked
**FR-3.15**: System shall navigate back to Screen 2 when "Back to Gaps" is clicked

### Screen 4: Seller Portal

**FR-4.1**: System shall provide tab navigation (Registration, Add Product, Status)
**FR-4.2**: System shall display registration form with required fields
**FR-4.3**: System shall validate all required fields in registration form
**FR-4.4**: System shall show success message when registration is submitted
**FR-4.5**: System shall display product addition form with required fields
**FR-4.6**: System shall validate all required fields in product form
**FR-4.7**: System shall show success message when product is added
**FR-4.8**: System shall display registration status in Status tab
**FR-4.9**: System shall display onboarding checklist in Status tab
**FR-4.10**: System shall display product count in Status tab
**FR-4.11**: System shall persist form data within session
**FR-4.12**: System shall navigate to Screen 5 when "Preview Storefront" is clicked

### Screen 5: Regional Storefront

**FR-5.1**: System shall provide region selector dropdown
**FR-5.2**: System shall update entire homepage when region is changed
**FR-5.3**: System shall display region-specific hero banner
**FR-5.4**: System shall display festival collection section
**FR-5.5**: System shall display regional products section
**FR-5.6**: System shall display local sellers section
**FR-5.7**: System shall show regional badges on products
**FR-5.8**: System shall show GI-tag badges on applicable products
**FR-5.9**: System shall show seller name on product cards
**FR-5.10**: System shall display regional categories in sidebar
**FR-5.11**: System shall allow browsing by regional category
**FR-5.12**: System shall allow browsing by festival
**FR-5.13**: System shall show product details when product is clicked

---

## 9. Non-Functional Requirements

### NFR-1: Performance
- All screens shall load within 3 seconds
- Transitions between screens shall complete within 1 second
- Map interactions shall respond within 500ms
- Filter operations shall complete within 1 second

### NFR-2: Usability
- UI shall be intuitive with minimal learning curve
- Navigation shall be consistent across all screens
- All actions shall have clear visual feedback
- Text shall be readable with appropriate contrast
- Touch targets shall be at least 44x44 pixels

### NFR-3: Compatibility
- Application shall work on Chrome, Firefox, Safari, and Edge
- Application shall be responsive for desktop (1920x1080) and tablet (768x1024)
- Application shall not require any browser plugins

### NFR-4: Reliability
- Application shall not crash during normal demo flow
- Application shall handle errors gracefully with user-friendly messages
- Mock data shall load reliably without network dependencies

### NFR-5: Visual Quality
- UI shall use consistent color scheme and typography
- UI shall include appropriate spacing and visual hierarchy
- UI shall include hover states and transitions
- UI shall be visually polished and professional

---

## 10. MVP Scope

### Included in MVP

**Screens**:
- Screen 1: Regional Intelligence Map
- Screen 2: Catalog Gap Detection
- Screen 3: Seller Discovery
- Screen 4: Seller Portal
- Screen 5: Regional Storefront

**Features**:
- Interactive India map with 3 states
- Regional data display (textiles, GI-tags, festivals, clusters)
- Gap analysis table with calculations
- Seller list with filters
- Seller registration form
- Product addition form
- Status tracking
- Region-specific storefront
- Dynamic homepage based on region selection

**Data**:
- Mock data for 3 states
- Mock catalog data
- Mock seller database
- Mock product catalog

### Excluded from MVP

**Authentication**:
- Login/logout functionality
- User authentication
- Session management

**Data Persistence**:
- Database integration
- API integrations
- Real data feeds
- Data storage beyond session

**Advanced Features**:
- Bulk product upload
- Document verification
- Approval workflows
- Notifications
- Email verification
- Payment integration
- Order management
- Shopping cart
- Checkout process
- User reviews
- Analytics dashboards
- Export functionality
- Advanced search
- Multi-language support
- Mobile app

**Enterprise Features**:
- Role-based permissions
- Audit logs
- Security compliance
- CI/CD pipelines
- Microservices architecture

---

## 11. Assumptions

### Data Assumptions
- Mock data is acceptable for demo purposes
- Regional fashion data can be researched and compiled manually
- Festival calendar data is publicly available
- GI-tag information is publicly available
- MSME directory information is publicly available

### Technical Assumptions
- Modern web browsers are available to judges
- Internet connectivity is available during demo
- No backend server is required (frontend-only with mock data)
- No database is required (JSON files or in-memory data)
- No external API integrations are required

### Business Assumptions
- Judges will evaluate based on concept and user experience
- Real data accuracy is not critical for MVP
- Simplified workflows are acceptable for demo
- Story and visual appeal are more important than technical complexity

### Demo Assumptions
- Demo will be presented live by a team member
- Demo will follow the scripted user journey
- Demo will last approximately 3 minutes
- Judges will have attention span of 2-3 minutes

---

## 12. Risks

### Risk 1: Scope Creep
**Likelihood**: High
**Impact**: High
**Mitigation**: Strict adherence to 5-screen scope. Any additional features must replace existing features, not add to them.

### Risk 2: Demo Failure
**Likelihood**: Medium
**Impact**: High
**Mitigation**: Rehearse demo multiple times. Have backup screenshots ready. Ensure mock data loads reliably.

### Risk 3: UI Not Polished
**Likelihood**: Medium
**Impact**: Medium
**Mitigation**: Use established UI component library. Allocate sufficient time for visual design and styling.

### Risk 4: Cannot Finish in Time
**Likelihood**: Medium
**Impact**: High
**Mitigation**: Prioritize core screens first (1, 2, 5). Have minimum viable version of each screen. Cut features if needed.

### Risk 5: Story Not Clear
**Likelihood**: Low
**Impact**: High
**Mitigation**: Script the demo narrative. Practice the pitch. Ensure each screen connects logically to the next.

### Risk 6: Technical Complexity
**Likelihood**: Low
**Impact**: Medium
**Mitigation**: Keep architecture simple. Use frontend-only approach. Avoid complex state management.

---

## 13. Success Criteria

### Demo Success Criteria
- Judges understand the value proposition within 2 minutes
- All 5 screens are demonstrated without errors
- User journey flows logically from problem to solution
- UI is visually polished and professional
- Demo completes within 3 minutes
- Story is clear and compelling

### Technical Success Criteria
- All screens load within 3 seconds
- No console errors during demo
- Responsive design works on demo laptop
- All interactions respond within 1 second
- Mock data loads reliably

### Product Success Criteria
- Regional intelligence is clearly demonstrated
- Catalog gap detection shows meaningful data
- Seller discovery provides actionable results
- Seller onboarding appears simple and achievable
- Regional storefront shows clear personalization

### User Experience Success Criteria
- Navigation is intuitive
- Visual hierarchy is clear
- Color coding is consistent
- Transitions are smooth
- Text is readable

---

## 14. Mock Data Requirements

### 14.1 Regions

**States (3)**:
- Andhra Pradesh
- Tamil Nadu
- Rajasthan

**Cities (3)**:
- Hyderabad (Andhra Pradesh/Telangana)
- Chennai (Tamil Nadu)
- Jaipur (Rajasthan)

### 14.2 Regional Textiles

**Andhra Pradesh/Telangana**:
- Pochampally Ikat
- Kalamkari
- Mangalagiri Sarees
- Gadwal Sarees

**Tamil Nadu**:
- Kanchipuram Sarees
- Madurai Sungudi
- Coimbatore Cotton
- Thanjavur Paintings

**Rajasthan**:
- Bandhani
- Kota Doria
- Leheriya
- Sanganeri Prints

### 14.3 GI-Tag Products

- Pochampally Ikat Sarees
- Kanchipuram Sarees
- Kota Doria Sarees
- Bandhani Textiles
- Kalamkari Textiles

### 14.4 Festivals

**Andhra Pradesh/Telangana**:
- Sankranti (January)
- Ugadi (March/April)
- Bonalu (July/August)

**Tamil Nadu**:
- Pongal (January)
- Tamil New Year (April)
- Navaratri (September/October)

**Rajasthan**:
- Teej (July/August)
- Gangaur (March/April)
- Diwali (October/November)

### 14.5 Textile Clusters

- Pochampally (Telangana)
- Kanchipuram (Tamil Nadu)
- Sanganer (Rajasthan)
- Jaipur (Rajasthan)
- Coimbatore (Tamil Nadu)

### 14.6 Catalog Gaps

**Per Region (8-10 records)**:
- Product category
- Demand (number: 200-500)
- Available (number: 50-150)
- Gap (calculated)
- Priority (high/medium/low)
- Festival association

**Example**:
```
Category: Ikat Saree
Demand: 450
Available: 120
Gap: 330
Priority: High
Festival: Sankranti
```

### 14.7 Sellers

**15-20 seller records**:
- Business name
- Contact person
- Email
- Phone
- Location
- Distance from target region
- GI-tagged status (boolean)
- MSME status (boolean)
- Product categories (array)
- Production capacity
- Rating (1-5)

**Example**:
```
Business Name: Pochampally Weavers Cooperative
Contact Person: Ramesh Kumar
Location: Pochampally, Telangana
Distance: 15 km
GI-Tagged: Yes
MSME: Yes
Categories: [Sarees, Handloom, Ikat]
Capacity: 500 pieces/month
Rating: 4.5
```

### 14.8 Products

**15-20 product records**:
- Product name
- Category
- Region
- Price
- Seller
- GI-tagged (boolean)
- Regional tags (array)
- Image URL
- Description

**Example**:
```
Name: Pochampally Ikat Silk Saree
Category: Sarees
Region: Telangana
Price: 8500
Seller: Pochampally Weavers
GI-Tagged: Yes
Tags: [Ikat, Handloom, Festival Wear, Traditional]
Image: [URL]
Description: Handwoven traditional Ikat saree
```

### 14.9 MSME Records

Integrated into seller data as MSME status flag.

---

## 15. Screen Navigation Flow

### Primary Navigation Flow

```
Screen 1 (Regional Intelligence Map)
    ↓ [View Catalog Gaps]
Screen 2 (Catalog Gap Detection)
    ↓ [Find Sellers for Gap]
Screen 3 (Seller Discovery)
    ↓ [View Seller Portal]
Screen 4 (Seller Portal)
    ↓ [Preview Storefront]
Screen 5 (Regional Storefront)
```

### Secondary Navigation

**Screen 1**:
- No incoming navigation (entry point)
- Outgoing: Screen 2

**Screen 2**:
- Incoming: Screen 1
- Outgoing: Screen 3, back to Screen 1

**Screen 3**:
- Incoming: Screen 2
- Outgoing: Screen 4, back to Screen 2

**Screen 4**:
- Incoming: Screen 3, or direct entry
- Outgoing: Screen 5

**Screen 5**:
- Incoming: Screen 4, or direct entry
- No outgoing navigation (end of journey)

### Context Passing

**Screen 1 → Screen 2**:
- Pass selected state

**Screen 2 → Screen 3**:
- Pass selected gap (category, demand, available, priority)

**Screen 3 → Screen 4**:
- Pass selected seller (optional, for pre-fill)

**Screen 4 → Screen 5**:
- Pass region (for pre-selection)

### Independent Entry Points

- Screen 1: Default landing page
- Screen 4: Direct seller portal access
- Screen 5: Direct customer storefront access

---

## 16. Demo Script

### Demo Script (3 Minutes)

**[0:00-0:30] Introduction and Problem**

**Presenter**: "VendSway helps expand across Bharat by connecting regional fashion demand with local sellers. Let me show you the problem we're solving."

**Action**: Open Screen 1 (Regional Intelligence Map)

**Presenter**: "The platform wants to expand into Tier 2 and Tier 3 cities, but they don't understand regional fashion landscapes. For example, what does Rajasthan's fashion identity look like?"

**Action**: Click on "Rajasthan" on the map

**Presenter**: "Here we can see Rajasthan has Bandhani, Kota Doria, Leheriya textiles. Major festivals like Teej and Gangaur. And GI-tag products. This is the regional intelligence the platform needs."

---

**[0:30-1:00] Catalog Gap Detection**

**Presenter**: "But understanding the region isn't enough. The platform needs to know what's missing from their catalog."

**Action**: Click "View Catalog Gaps" → navigate to Screen 2

**Presenter**: "This screen shows catalog gaps by region. For Rajasthan, we can see Ikat Sarees have a demand of 450, but only 120 are available. That's a gap of 330 units."

**Action**: Point to red-highlighted gap row

**Presenter**: "These red gaps are high priority. The platform is missing products that customers actively want."

---

**[1:00-1:45] Seller Discovery**

**Presenter**: "So the platform needs to find sellers who can fill these gaps. Let's find sellers for Ikat Sarees."

**Action**: Click "Find Sellers for This Gap" → navigate to Screen 3

**Presenter**: "Here are local sellers who produce Ikat Sarees. Pochampally Weavers is GI-tagged, an MSME, and only 15km away. They're perfect for filling this gap."

**Action**: Click on seller card to show profile

**Presenter**: "We can see their details, contact information, and product categories. The platform can now reach out and onboard them."

---

**[1:45-2:15] Seller Onboarding**

**Presenter**: "But how do these sellers actually get on the platform? Let me show you the seller portal."

**Action**: Click "View Seller Portal" → navigate to Screen 4

**Presenter**: "Registration is simple. Business name, contact info, location, product categories. That's it."

**Action**: Fill in sample registration data and click Submit

**Presenter**: "Once registered, sellers can add products with regional context—price, category, regional tags."

**Action**: Switch to Add Product tab, fill sample data, click Submit

**Presenter**: "And they can track their onboarding status right here. No complex workflows, just simple registration."

---

**[2:15-3:00] Customer Experience**

**Presenter**: "Finally, let me show you what the customer experience looks like."

**Action**: Click "Preview Storefront" → navigate to Screen 5

**Presenter**: "When a customer from Hyderabad visits, they see this—Telangana's finest handlooms, festival collections for Sankranti, regional products from local sellers."

**Action**: Point to regional badges on products

**Presenter**: "Each product shows its regional origin. Customers know they're buying authentic local products."

**Action**: Change region to "Chennai"

**Presenter**: "If I change to Chennai, the entire homepage transforms to Tamil Nadu—Kanchipuram sarees, Pongal collection, local Tamil sellers."

**Action**: Change region to "Jaipur"

**Presenter**: "And Jaipur gets Rajasthan's Bandhani and Teej collections. Each region gets a personalized experience built around its unique identity."

**Presenter**: "VendSway connects regional demand with regional supply, helping expand across Bharat while supporting local artisans. Thank you."

---

### Demo Notes for Presenter

**Timing Tips**:
- Don't rush the map interaction—let judges absorb the regional data
- Emphasize the gap numbers—they make the problem concrete
- Highlight GI-tag and MSME badges—they add credibility
- Keep form filling quick—don't actually type everything
- Spend time on the storefront transformation—it's the visual payoff

**Key Phrases to Use**:
- "Regional fashion intelligence"
- "Catalog gaps"
- "High priority gaps"
- "GI-tagged, MSME-certified"
- "Personalized experience"
- "Regional identity"

**Common Questions to Anticipate**:
- "Is this real data?" → "This is mock data for the demo, but the concept works with real data"
- "How do you get the data?" → "From government directories, MSME databases, GI-tag registries"
- "Is this scalable?" → "Yes, the architecture supports adding more states and regions"
- "What's the business value?" → "Expand into Tier 2/3 markets, increase regional sales, onboard local sellers"

**Backup Plans**:
- If map doesn't load: Skip to Screen 2, explain the concept verbally
- If filters don't work: Don't use them, show the full list
- If forms don't submit: Explain the workflow without demonstrating
- If storefront doesn't update: Explain the concept, show one region only

---

## Sign-Off

This MVP Specification defines a complete, achievable 5-screen hackathon MVP for VendSway. The specification is implementation-ready and can be directly used to build the application without ambiguity.

**MVP Commitment**: 5 screens that tell a complete story in 3 minutes, demonstrating regional intelligence, gap detection, seller discovery, seller onboarding, and personalized customer experience.

**Success Metric": Judges understand the value proposition within 2 minutes and see a polished, professional demo.
