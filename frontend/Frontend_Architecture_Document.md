# VendSway - Frontend Architecture Document

## Document Information

- **Project Name**: VendSway
- **Document Version**: 1.0
- **Date**: July 15, 2026
- **Purpose**: Complete frontend architecture reference for implementation
- **Status**: FINAL - Implementation reference document
- **Author**: Senior Frontend Solution Architect

---

# 1. Overall Frontend Architecture

## Architecture Overview

VendSway frontend is a single-page application (SPA) built with React.js and TypeScript, following a feature-based modular architecture. The application serves three distinct user roles (Admin, Seller, Customer) through role-based UI experiences, with five core screens that tell a cohesive story from problem identification to solution demonstration.

## Architectural Principles

- **Feature-First Organization**: Modules organized by business capability, not by technical layer
- **Component Composition**: Small, reusable components composed into larger feature components
- **Separation of Concerns**: Clear boundaries between UI, business logic, and data fetching
- **Type Safety**: TypeScript throughout for compile-time error prevention
- **Performance-First**: Lazy loading, code splitting, and optimized rendering
- **Accessibility-First**: WCAG 2.1 AA compliance with semantic HTML and ARIA

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        APPLICATION LAYER                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  React SPA + TypeScript                                    │  │
│  │  - Role Selection (Admin/Seller/Customer)                 │  │
│  │  - Client-Side Routing (React Router)                     │  │
│  │  - Global State (React Context)                           │  │
│  └───────────────────────┬───────────────────────────────────┘  │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    FEATURE MODULES LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Regional     │  │ Catalog Gap  │  │ Seller       │          │
│  │ Intelligence │  │ Detection    │  │ Discovery    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐                            │
│  │ Seller       │  │ Regional     │                            │
│  │ Onboarding   │  │ Storefront   │                            │
│  └──────────────┘  └──────────────┘                            │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    SHARED COMPONENTS LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ UI Components│  │ Layout       │  │ Common       │          │
│  │ (shadcn/ui)  │  │ Components   │  │ Components   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    DATA & STATE LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ React Query  │  │ React        │  │ Custom       │          │
│  │ (Server      │  │ Context      │  │ Hooks        │          │
│  │ State)       │  │ (Client      │  │ (Business    │          │
│  │              │  │ State)       │  │ Logic)       │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────┼───────────────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    SERVICES LAYER                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ API Services  │  │ Mock Data    │  │ Utility      │          │
│  │ (Axios)       │  │ Services     │  │ Services     │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└───────────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### Application Layer
- **Responsibility**: Application bootstrap, routing, global configuration
- **Components**: App.tsx, main.tsx, Router configuration, Theme provider
- **State**: Global app state (role, navigation context)

### Feature Modules Layer
- **Responsibility**: Business logic and UI for specific features
- **Modules**: Regional Intelligence, Catalog Gap, Seller Discovery, Seller Onboarding, Regional Storefront
- **Components**: Feature-specific components, hooks, services
- **State**: Feature-specific state managed via React Query and Context

### Shared Components Layer
- **Responsibility**: Reusable UI components and layout structures
- **Components**: shadcn/ui primitives, layout components (Header, Footer), common components
- **State**: Minimal component-level state

### Data & State Layer
- **Responsibility**: Data fetching, caching, state management
- **Technologies**: React Query for server state, React Context for client state, custom hooks for business logic
- **State**: Server state (API data), client state (UI state), derived state

### Services Layer
- **Responsibility**: External communication and data transformation
- **Services**: API services (HTTP calls), mock data services, utility functions
- **Data**: API responses, mock data, transformed data

---

# 2. Feature-Based Module Organization

## Module Philosophy

Each feature is a self-contained module with its own components, hooks, services, and types. This promotes:

- **High Cohesion**: Related code lives together
- **Low Coupling**: Modules are independent and can be developed in parallel
- **Easy Navigation**: Developers can quickly locate feature-specific code
- **Scalability**: New features can be added without affecting existing modules

## Feature Modules

### Module 1: Regional Intelligence

**Purpose**: Provide Myntra Team with visual understanding of regional fashion landscapes across India

**Responsibilities**:
- Display interactive India map with clickable states
- Show regional details (textiles, GI-tags, festivals, clusters)
- Provide filtering capabilities (textile type, festival, GI-tag)
- Navigate to Catalog Gap Detection with selected region context

**Components**:
- RegionalMap (interactive map component)
- StateDetailsPanel (shows selected state information)
- MapControls (filter controls)
- RegionalIntelligencePage (page container)

**Hooks**:
- useRegionalData (fetches and manages regional data)
- useMapInteraction (handles map selection and interaction)
- useRegionFilters (manages filter state)

**Services**:
- regionalIntelligence.service (API calls for regional data)
- mockRegionalData.service (mock data fallback)

**Types**:
- Region (region entity)
- Textile (textile entity)
- Festival (festival entity)
- TextileCluster (cluster entity)
- RegionalFilters (filter state)

---

### Module 2: Catalog Gap Detection

**Purpose**: Show Myntra Team which products are missing from the catalog by region

**Responsibilities**:
- Display gap analysis table with demand vs available
- Calculate and display gap values
- Color-code gaps by priority (high/medium/low)
- Provide filtering (priority, category, festival)
- Navigate to Seller Discovery with selected gap context

**Components**:
- GapTable (table showing gap analysis)
- GapSummaryCards (quick stats at top)
- GapFilters (filter controls)
- CatalogGapPage (page container)

**Hooks**:
- useGapData (fetches and manages gap data)
- useGapCalculations (performs gap calculations)
- useGapFilters (manages filter state)

**Services**:
- catalogGap.service (API calls for gap data)
- gapCalculation.service (business logic for gap calculations)
- mockGapData.service (mock data fallback)

**Types**:
- CatalogGap (gap entity)
- GapSummary (summary statistics)
- GapFilters (filter state)
- GapPriority (priority enum)

---

### Module 3: Seller Discovery

**Purpose**: Help Myntra Team find local sellers who can fill identified catalog gaps

**Responsibilities**:
- Display seller list with relevant information
- Filter sellers by region, category, GI-tag, MSME, distance
- Show seller profiles with detailed information
- Provide contact information
- Navigate to Seller Portal

**Components**:
- SellerList (grid/list of sellers)
- SellerCard (individual seller card)
- SellerProfile (detailed seller profile modal)
- SellerFilters (filter controls)
- SellerDiscoveryPage (page container)

**Hooks**:
- useSellerData (fetches and manages seller data)
- useSellerMatching (matches sellers to gaps)
- useSellerFilters (manages filter state)

**Services**:
- sellerDiscovery.service (API calls for seller data)
- sellerMatching.service (business logic for seller matching)
- mockSellerData.service (mock data fallback)

**Types**:
- Seller (seller entity)
- SellerMatch (seller match result)
- SellerFilters (filter state)
- SellerProfile (detailed profile)

---

### Module 4: Seller Onboarding

**Purpose**: Allow sellers to register their business and add products to the platform

**Responsibilities**:
- Provide seller registration form
- Allow product addition with regional tags
- Track application status
- Show onboarding progress
- Navigate to Regional Storefront preview

**Components**:
- SellerPortal (main portal container)
- RegistrationForm (seller registration form)
- ProductForm (product addition form)
- StatusView (application status and progress)
- SellerOnboardingPage (page container)

**Hooks**:
- useRegistration (manages registration form state)
- useProductUpload (manages product addition)
- useApplicationStatus (tracks application status)
- useFormState (common form state management)

**Services**:
- sellerOnboarding.service (API calls for onboarding)
- formValidation.service (form validation logic)
- mockOnboardingData.service (mock data fallback)

**Types**:
- SellerRegistration (registration form data)
- ProductUpload (product form data)
- ApplicationStatus (status entity)
- OnboardingProgress (progress tracking)

---

### Module 5: Regional Storefront

**Purpose**: Demonstrate personalized shopping experience for customers based on their region

**Responsibilities**:
- Provide region selector for customers
- Display region-specific hero banner
- Show festival collections
- Display regional products with badges
- Show local sellers section
- Provide regional categories navigation

**Components**:
- RegionalStorefront (main storefront container)
- HeroBanner (region-specific banner)
- FestivalCollection (festival-specific products)
- ProductGrid (grid of regional products)
- ProductCard (individual product card)
- LocalSellers (local sellers section)
- RegionalCategories (category navigation)
- RegionSelector (dropdown for region selection)
- RegionalStorefrontPage (page container)

**Hooks**:
- useProductData (fetches and manages product data)
- useRegionalContent (manages region-specific content)
- useFestivalCollections (manages festival collections)
- useRegionSelector (manages region selection)

**Services**:
- personalization.service (API calls for personalized content)
- recommendation.service (product recommendations)
- mockProductData.service (mock data fallback)

**Types**:
- Product (product entity)
- RegionalCollection (curated collection)
- FestivalCollection (festival-specific collection)
- RegionalContent (region-specific content)
- StorefrontFilters (filter state)

---

### Module 6: Shared/Common

**Purpose**: Provide shared components and utilities used across multiple features

**Responsibilities**:
- Provide reusable UI components
- Provide layout components
- Provide common hooks and utilities
- Provide shared types and constants

**Components**:
- LoadingSpinner (loading indicator)
- ErrorMessage (error display)
- EmptyState (empty data display)
- RegionSelector (shared region selector)
- Button (shadcn/ui button)
- Card (shadcn/ui card)
- Input (shadcn/ui input)
- Select (shadcn/ui select)

**Hooks**:
- useNavigation (navigation utilities)
- useDebounce (debounce utility)
- useLocalStorage (local storage utility)
- useMediaQuery (responsive design utility)

**Services**:
- validation.service (common validation logic)
- format.service (data formatting utilities)
- constants.service (application constants)

**Types**:
- CommonTypes (shared type definitions)
- ApiResponse (API response structure)
- Pagination (pagination metadata)

---

# 3. Page Hierarchy

## Page Structure

VendSway follows a hierarchical page structure with role-based routing:

```
App (Root)
├── Landing Page (Role Selection)
│   ├── Admin Role Selection
│   ├── Seller Role Selection
│   └── Customer Role Selection
│
├── Admin Flow (Myntra Team)
│   ├── Regional Intelligence Page (Screen 1)
│   ├── Catalog Gap Detection Page (Screen 2)
│   └── Seller Discovery Page (Screen 3)
│
├── Seller Flow
│   └── Seller Onboarding Page (Screen 4)
│
└── Customer Flow
    └── Regional Storefront Page (Screen 5)
```

## Page Definitions

### Landing Page
- **Route**: `/`
- **Purpose**: Entry point for demo, allows role selection
- **Components**: RoleSelectionCard, AppDescription
- **Navigation**: Routes to role-specific flows based on selection

### Regional Intelligence Page
- **Route**: `/admin/regional-intelligence`
- **Purpose**: Screen 1 - Display regional fashion intelligence
- **Components**: RegionalMap, StateDetailsPanel, MapControls
- **Navigation**: To Catalog Gap Detection with region context

### Catalog Gap Detection Page
- **Route**: `/admin/catalog-gap`
- **Purpose**: Screen 2 - Display catalog gaps analysis
- **Components**: GapTable, GapSummaryCards, GapFilters
- **Navigation**: To Seller Discovery with gap context, back to Regional Intelligence

### Seller Discovery Page
- **Route**: `/admin/seller-discovery`
- **Purpose**: Screen 3 - Display seller discovery results
- **Components**: SellerList, SellerCard, SellerFilters
- **Navigation**: To Seller Portal, back to Catalog Gap Detection

### Seller Onboarding Page
- **Route**: `/seller/onboarding`
- **Purpose**: Screen 4 - Seller registration and product management
- **Components**: SellerPortal, RegistrationForm, ProductForm, StatusView
- **Navigation**: To Regional Storefront preview

### Regional Storefront Page
- **Route**: `/customer/storefront`
- **Purpose**: Screen 5 - Personalized regional shopping experience
- **Components**: RegionalStorefront, HeroBanner, FestivalCollection, ProductGrid
- **Navigation**: Independent entry point, can be accessed directly

## Page Navigation Flow

### Admin Flow (Myntra Team)
```
Landing → Regional Intelligence → Catalog Gap Detection → Seller Discovery
         ← (back)                  ← (back)                ← (back)
```

### Seller Flow
```
Landing → Seller Onboarding → Regional Storefront (preview)
```

### Customer Flow
```
Landing → Regional Storefront
```

### Direct Access
- Regional Storefront can be accessed directly for customer demo
- Seller Onboarding can be accessed directly for seller demo

---

# 4. Component Hierarchy

## Component Philosophy

Components are organized in a hierarchical structure following the composition pattern:

- **Page Components**: Top-level containers for each screen
- **Feature Components**: Business logic components specific to features
- **UI Components**: Reusable presentational components
- **Primitive Components**: Basic building blocks (shadcn/ui)

## Component Hierarchy Tree

```
App
├── LandingPage
│   ├── RoleSelectionCard
│   │   ├── RoleButton
│   │   └── RoleDescription
│   └── AppDescription
│
├── RegionalIntelligencePage
│   ├── PageHeader
│   ├── RegionalMap
│   │   ├── MapContainer (Leaflet)
│   │   ├── StateMarker
│   │   └── MapTooltip
│   ├── StateDetailsPanel
│   │   ├── TextileList
│   │   ├── FestivalList
│   │   ├── GITagList
│   │   └── ClusterList
│   └── MapControls
│       ├── FilterDropdown
│       └── ActionButton
│
├── CatalogGapPage
│   ├── PageHeader
│   ├── GapSummaryCards
│   │   ├── SummaryCard
│   │   └── MetricDisplay
│   ├── GapFilters
│   │   ├── FilterDropdown
│   │   ├── PriorityFilter
│   │   └── CategoryFilter
│   └── GapTable
│       ├── TableHeader
│       ├── TableRow
│       │   ├── GapCell
│       │   ├── PriorityBadge
│       │   └── ActionButton
│       └── TableFooter
│
├── SellerDiscoveryPage
│   ├── PageHeader
│   ├── GapContextBanner
│   ├── SellerFilters
│   │   ├── FilterDropdown
│   │   ├── GISwitch
│   │   ├── MSMESwitch
│   │   └── DistanceSlider
│   └── SellerList
│       ├── SellerCard
│       │   ├── SellerInfo
│       │   ├── BadgeContainer
│       │   ├── RatingDisplay
│       │   └── ActionButtons
│       └── SellerProfile (Modal)
│           ├── ProfileHeader
│           ├── ContactInfo
│           ├── ProductCategories
│           └── CapacityInfo
│
├── SellerOnboardingPage
│   ├── PageHeader
│   ├── TabNavigation
│   ├── RegistrationForm
│   │   ├── FormField
│   │   ├── FormSelect
│   │   ├── FormMultiSelect
│   │   └── SubmitButton
│   ├── ProductForm
│   │   ├── FormField
│   │   ├── FormSelect
│   │   ├── ImageUpload
│   │   └── SubmitButton
│   └── StatusView
│       ├── StatusIndicator
│       ├── OnboardingChecklist
│       └── NextSteps
│
└── RegionalStorefrontPage
    ├── PageHeader
    ├── RegionSelector
    ├── HeroBanner
    │   ├── BannerImage
    │   ├── BannerContent
    │   └── FestivalCallout
    ├── FestivalCollection
    │   ├── CollectionHeader
    │   └── ProductGrid
    ├── RegionalProducts
    │   ├── SectionHeader
    │   └── ProductGrid
    │       └── ProductCard
    │           ├── ProductImage
    │           ├── ProductInfo
    │           ├── RegionalBadge
    │           ├── GIBadge
    │           ├── SellerInfo
    │           └── PriceDisplay
    ├── LocalSellers
    │   ├── SectionHeader
    │   └── SellerGrid
    └── RegionalCategories
        ├── CategoryList
        └── CategoryItem
```

## Component Categories

### Page Components
- **Purpose**: Top-level containers for each screen
- **Responsibilities**: Layout, data fetching, state management for the page
- **Examples**: RegionalIntelligencePage, CatalogGapPage, SellerDiscoveryPage
- **Characteristics**: Connected to data sources, manage page-level state

### Feature Components
- **Purpose**: Implement specific business logic within a feature
- **Responsibilities**: Business logic, feature-specific UI
- **Examples**: RegionalMap, GapTable, SellerList, SellerPortal
- **Characteristics**: Reusable within feature, may have internal state

### UI Components
- **Purpose**: Reusable presentational components
- **Responsibilities**: Display data, handle user interactions
- **Examples**: Card, Button, Input, Select, Modal
- **Characteristics**: Stateless or minimal state, highly reusable

### Primitive Components
- **Purpose**: Basic building blocks from shadcn/ui
- **Responsibilities**: Low-level UI primitives
- **Examples**: Button, Input, Select from shadcn/ui
- **Characteristics**: No business logic, pure UI components

---

# 5. Shared Component Strategy

## Shared Component Philosophy

Shared components are designed to be highly reusable, composable, and consistent across the application. They follow the principles of:

- **Composition over Inheritance**: Components are composed together rather than extended
- **Props-Driven Configuration**: Behavior configured via props, not internal state
- **Single Responsibility**: Each component has one clear purpose
- **Accessibility First**: Built with accessibility in mind from the start

## Shared Component Categories

### Layout Components

#### Header
- **Purpose**: Application-wide header with navigation
- **Props**: title, navigation items, user role
- **Responsibilities**: Display app branding, navigation links, role-based menu
- **Usage**: Used across all pages except landing

#### Footer
- **Purpose**: Application-wide footer with links and information
- **Props**: links, copyright text
- **Responsibilities**: Display footer links, copyright, additional information
- **Usage**: Used across all pages

#### Sidebar
- **Purpose**: Navigation sidebar for admin flow
- **Props**: navigation items, active route
- **Responsibilities**: Display navigation menu, highlight active route
- **Usage**: Used in admin flow pages

### UI Components (shadcn/ui)

#### Button
- **Purpose**: Reusable button component
- **Props**: variant (default, destructive, outline, ghost, link), size, disabled, loading
- **Responsibilities**: Handle click events, show loading state
- **Usage**: Throughout application for actions

#### Card
- **Purpose**: Container component with consistent styling
- **Props**: title, description, children, footer
- **Responsibilities**: Provide consistent card layout and styling
- **Usage**: For grouping related content

#### Input
- **Purpose**: Text input component with validation
- **Props**: label, placeholder, error, disabled
- **Responsibilities**: Handle input, display validation errors
- **Usage**: In forms throughout application

#### Select
- **Purpose**: Dropdown select component
- **Props**: options, label, placeholder, error
- **Responsibilities**: Handle selection, display selected value
- **Usage**: For dropdown selections

#### Modal
- **Purpose**: Modal dialog for overlays
- **Props**: open, onClose, title, children
- **Responsibilities**: Display overlay, handle close actions
- **Usage**: For detailed views, confirmations

#### Badge
- **Purpose**: Small status or label indicator
- **Props**: variant (default, secondary, destructive, outline), content
- **Responsibilities**: Display status or category labels
- **Usage**: For status indicators, tags

### Common Components

#### LoadingSpinner
- **Purpose**: Loading indicator for async operations
- **Props**: size, color, message
- **Responsibilities**: Display loading state, show optional message
- **Usage**: During data fetching, form submissions

#### ErrorMessage
- **Purpose**: Display error messages to users
- **Props**: error, onRetry, dismissible
- **Responsibilities**: Display error, provide retry option
- **Usage**: When API calls fail, validation errors

#### EmptyState
- **Purpose**: Display empty data state
- **Props**: message, icon, action
- **Responsibilities**: Show friendly empty state, provide action if applicable
- **Usage**: When no data is available

#### RegionSelector
- **Purpose**: Shared region selection dropdown
- **Props**: selectedRegion, onRegionChange, regions
- **Responsibilities**: Display regions, handle selection
- **Usage**: In multiple features for region selection

## Component Composition Strategy

### Atomic Design Principles

- **Atoms**: Basic UI elements (Button, Input, Badge)
- **Molecules**: Groups of atoms (FormField, Card with content)
- **Organisms**: Complex UI sections (SellerCard, GapTableRow)
- **Templates**: Page structure (Page layout with header/footer)
- **Pages**: Specific page instances (RegionalIntelligencePage)

### Component Reusability Guidelines

1. **Keep Components Small**: Single responsibility, easy to reuse
2. **Use Composition**: Compose small components into larger ones
3. **Props-Driven**: Configure via props, avoid hardcoding
4. **Avoid Business Logic**: Keep components presentational
5. **Type Safety**: Define clear prop types with TypeScript

---

# 6. State Management Strategy

## State Management Philosophy

VendSway uses a hybrid state management approach combining:

- **React Query**: For server state (API data, caching, synchronization)
- **React Context**: For global client state (user role, navigation)
- **Component State**: For local UI state (form inputs, modal visibility)
- **Custom Hooks**: For business logic state (calculations, derived state)

## State Categories

### Server State (React Query)

**Responsibilities**: Data fetching, caching, synchronization, background updates

**Managed By**: React Query (TanStack Query)

**Examples**:
- Regional data (textiles, festivals, clusters)
- Catalog gap data
- Seller data
- Product data
- Application status

**Key Features**:
- Automatic caching and deduplication
- Background refetching
- Optimistic updates
- Loading and error states
- Pagination support

**Query Keys Structure**:
```
regions
regions/{id}
regions/{id}/textiles
regions/{id}/festivals
gaps
gaps/region/{regionId}
sellers
sellers/region/{regionId}
products
products/region/{regionId}
```

### Client State (React Context)

**Responsibilities**: Global application state that doesn't come from server

**Managed By**: React Context API

**Examples**:
- User role (Admin/Seller/Customer)
- Navigation context (current screen, navigation history)
- Theme preferences (light/dark mode)
- Filter state (shared across screens)

**Context Structure**:
```
AppContext
  - userRole: 'admin' | 'seller' | 'customer'
  - theme: 'light' | 'dark'

NavigationContext
  - currentScreen: string
  - navigationHistory: string[]
  - navigateTo: (screen: string) => void
```

### Component State (useState)

**Responsibilities**: Local UI state that doesn't need to be shared

**Managed By**: React useState hook

**Examples**:
- Form input values
- Modal open/close state
- Dropdown open/close state
- Local filter state
- Tab selection state

**Usage Guidelines**:
- Use for ephemeral UI state
- Keep as local as possible
- Lift state only when needed by parent/children

### Derived State (useMemo)

**Responsibilities**: Computed values derived from other state

**Managed By**: React useMemo hook

**Examples**:
- Filtered lists based on filter criteria
- Calculated values (gap = demand - available)
- Sorted arrays
- Formatted data

**Usage Guidelines**:
- Use for expensive computations
- Memoize to prevent unnecessary recalculations
- Keep dependencies accurate

## State Management Patterns

### Server State Pattern (React Query)

```typescript
// Query hook
const useRegionalData = (regionId: string) => {
  return useQuery({
    queryKey: ['regions', regionId],
    queryFn: () => regionalService.getRegion(regionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation hook
const useUpdateSeller = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (sellerData: SellerUpdate) => sellerService.updateSeller(sellerData),
    onSuccess: () => {
      queryClient.invalidateQueries(['sellers']);
    },
  });
};
```

### Context Pattern (React Context)

```typescript
// Context creation
const AppContext = createContext<AppContextValue | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  
  const value = {
    userRole,
    setUserRole,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for consuming context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
```

### Custom Hook Pattern (Business Logic)

```typescript
// Custom hook for business logic
const useGapCalculations = (gaps: CatalogGap[]) => {
  const highPriorityGaps = useMemo(() => 
    gaps.filter(gap => gap.priority === 'HIGH'), 
    [gaps]
  );
  
  const totalGap = useMemo(() => 
    gaps.reduce((sum, gap) => sum + gap.gap, 0), 
    [gaps]
  );
  
  return {
    highPriorityGaps,
    totalGap,
  };
};
```

## State Synchronization

### Server-Client Synchronization
- React Query handles server state synchronization
- Automatic refetching on window focus
- Manual refetch triggers for user actions
- Optimistic updates for better UX

### Client-Client Synchronization
- React Context for global state
- Props drilling for local state
- Custom hooks for shared business logic

### State Updates Flow
```
User Action → Component State → Custom Hook → React Query Mutation → Server
                                              ↓
                                        React Query Cache Update
                                              ↓
                                        Component Re-render
```

---

# 7. React Query Strategy

## React Query Philosophy

React Query is used for all server state management, providing:

- **Automatic Caching**: Reduces unnecessary API calls
- **Background Refetching**: Keeps data fresh
- **Optimistic Updates**: Improves perceived performance
- **Loading/Error States**: Built-in state management
- **Deduplication**: Prevents duplicate requests

## Query Organization

### Query Keys Structure

Query keys are organized hierarchically to enable efficient cache management:

```
// Global keys
['regions'] - All regions
['sellers'] - All sellers
['products'] - All products
['gaps'] - All gaps

// Specific keys
['regions', id] - Specific region
['sellers', id] - Specific seller
['products', id] - Specific product
['gaps', id] - Specific gap

// Nested keys
['regions', id, 'textiles'] - Region's textiles
['regions', id, 'festivals'] - Region's festivals
['sellers', id, 'products'] - Seller's products
['gaps', 'region', regionId] - Gaps by region
```

### Query Configuration

### Standard Query Configuration

```typescript
// Standard query with sensible defaults
const useQuery = (key: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey: key,
    queryFn: queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
```

### Real-time Query Configuration

```typescript
// Real-time query for frequently changing data
const useRealTimeQuery = (key: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey: key,
    queryFn: queryFn,
    staleTime: 0, // Always stale
    cacheTime: 0, // Don't cache
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
};
```

### Background Query Configuration

```typescript
// Background query for data that can be stale
const useBackgroundQuery = (key: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey: key,
    queryFn: queryFn,
    staleTime: 30 * 60 * 1000, // 30 minutes
    cacheTime: 60 * 60 * 1000, // 1 hour
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};
```

## Mutation Strategy

### Mutation Configuration

```typescript
// Standard mutation with cache invalidation
const useMutation = (mutationFn: (data: any) => Promise<any>, invalidateKeys: string[][]) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: mutationFn,
    onMutate: async (data) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(invalidateKeys);
      
      // Snapshot previous value
      const previousData = queryClient.getQueryData(invalidateKeys);
      
      // Optimistically update
      queryClient.setQueryData(invalidateKeys, data);
      
      return { previousData };
    },
    onError: (err, data, context) => {
      // Rollback on error
      queryClient.setQueryData(invalidateKeys, context.previousData);
    },
    onSuccess: () => {
      // Invalidate and refetch
      invalidateKeys.forEach(key => queryClient.invalidateQueries(key));
    },
  });
};
```

## Query Hooks by Feature

### Regional Intelligence Queries

```typescript
useRegions() - Fetch all regions
useRegion(id) - Fetch specific region
useRegionTextiles(id) - Fetch region's textiles
useRegionFestivals(id) - Fetch region's festivals
useRegionClusters(id) - Fetch region's clusters
useRegionGIProducts(id) - Fetch region's GI products
```

### Catalog Gap Queries

```typescript
useGaps() - Fetch all gaps
useRegionGaps(regionId) - Fetch gaps by region
useGap(id) - Fetch specific gap
useGapSummary(regionId) - Fetch gap summary statistics
```

### Seller Discovery Queries

```typescript
useSellers() - Fetch all sellers
useRegionSellers(regionId) - Fetch sellers by region
useSeller(id) - Fetch specific seller
useSellersForGap(gapId) - Fetch sellers matching a gap
```

### Seller Onboarding Queries

```typescript
useSellerApplication(sellerId) - Fetch seller application status
useSellerProducts(sellerId) - Fetch seller's products
```

### Regional Storefront Queries

```typescript
useProducts() - Fetch all products
useRegionProducts(regionId) - Fetch products by region
useFestivalCollection(regionId, festivalId) - Fetch festival collection
useRegionalCollection(regionId) - Fetch regional collection
```

## Cache Management

### Cache Invalidation Strategy

- **Automatic Invalidation**: After mutations
- **Manual Invalidation**: For user-triggered refreshes
- **Time-based Invalidation**: Based on staleTime
- **Event-based Invalidation**: On specific events (role change, region change)

### Cache Persistence

- **Session-based**: Cache persists during session
- **No Persistence**: Cache cleared on page refresh (MVP approach)
- **Future**: Consider localStorage persistence for offline support

---

# 8. Routing Strategy

## Routing Philosophy

VendSway uses React Router for client-side routing with:

- **Role-Based Routing**: Different routes for different user roles
- **Protected Routes**: Routes accessible only to specific roles
- **Nested Routes**: For complex page structures
- **Route Parameters**: For dynamic content (region ID, seller ID)
- **Programmatic Navigation**: For navigation based on user actions

## Route Structure

### Route Definitions

```typescript
// Public routes
/ - Landing page (role selection)

// Admin routes (protected)
/admin/regional-intelligence - Screen 1
/admin/catalog-gap - Screen 2
/admin/seller-discovery - Screen 3

// Seller routes (protected)
/seller/onboarding - Screen 4

// Customer routes (protected)
/customer/storefront - Screen 5

// Dynamic routes
/admin/catalog-gap/:regionId - Gap detection for specific region
/admin/seller-discovery/:gapId - Seller discovery for specific gap
/customer/storefront/:regionId - Storefront for specific region
```

### Route Hierarchy

```
App
├── / (Landing)
│   ├── RoleSelection
│   └── AppDescription
│
├── /admin/* (Admin Flow)
│   ├── /admin/regional-intelligence
│   │   ├── RegionalMap
│   │   └── StateDetailsPanel
│   ├── /admin/catalog-gap
│   │   ├── GapTable
│   │   └── GapFilters
│   └── /admin/seller-discovery
│       ├── SellerList
│       └── SellerFilters
│
├── /seller/* (Seller Flow)
│   └── /seller/onboarding
│       ├── RegistrationForm
│       ├── ProductForm
│       └── StatusView
│
└── /customer/* (Customer Flow)
    └── /customer/storefront
        └── RegionalStorefront
```

## Route Protection

### Role-Based Route Protection

```typescript
// Protected route component
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRoles: UserRole[] 
}> = ({ children, allowedRoles }) => {
  const { userRole } = useApp();
  
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Usage in route configuration
<Route 
  path="/admin/regional-intelligence" 
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <RegionalIntelligencePage />
    </ProtectedRoute>
  } 
/>
```

### Navigation Guards

```typescript
// Navigation guard for role-based access
const useRoleGuard = (requiredRole: UserRole) => {
  const { userRole } = useApp();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (userRole !== requiredRole) {
      navigate('/');
    }
  }, [userRole, requiredRole, navigate]);
};
```

## Navigation Strategy

### Programmatic Navigation

```typescript
// Navigation with context
const navigateToGapDetection = (regionId: string) => {
  navigate(`/admin/catalog-gap`, { state: { regionId } });
};

// Navigation with parameters
const navigateToSellerDiscovery = (gapId: string) => {
  navigate(`/admin/seller-discovery/${gapId}`);
};

// Navigation with replacement (no history)
const navigateToStorefront = (regionId: string) => {
  navigate(`/customer/storefront/${regionId}`, { replace: true });
};
```

### Navigation State

```typescript
// Pass state between routes
navigate('/admin/seller-discovery', { 
  state: { 
    gapId: selectedGap.id,
    gapCategory: selectedGap.category 
  } 
});

// Access state in target route
const location = useLocation();
const { gapId, gapCategory } = location.state;
```

### Back Navigation

```typescript
// Back navigation with fallback
const goBack = () => {
  if (window.history.length > 1) {
    navigate(-1);
  } else {
    navigate('/admin/regional-intelligence');
  }
};
```

## Route Configuration

### Main Router Setup

```typescript
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'regional-intelligence',
        element: <RegionalIntelligencePage />,
      },
      {
        path: 'catalog-gap',
        element: <CatalogGapPage />,
      },
      {
        path: 'seller-discovery',
        element: <SellerDiscoveryPage />,
      },
    ],
  },
  {
    path: '/seller',
    element: <SellerLayout />,
    children: [
      {
        path: 'onboarding',
        element: <SellerOnboardingPage />,
      },
    ],
  },
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      {
        path: 'storefront',
        element: <RegionalStorefrontPage />,
      },
    ],
  },
]);
```

## URL Strategy

### URL Design Principles

- **Descriptive**: URLs should describe the content
- **Hierarchical**: Reflect the application structure
- **RESTful**: Follow REST conventions for resources
- **Bookmarkable**: Important pages should be bookmarkable
- **Shareable**: URLs should be shareable (for demo purposes)

### URL Examples

```
/ - Landing page
/admin/regional-intelligence - Regional intelligence screen
/admin/catalog-gap?region=ap - Catalog gap with region filter
/admin/seller-discovery?gap=123 - Seller discovery with gap context
/seller/onboarding - Seller onboarding portal
/customer/storefront?region=hyderabad - Regional storefront
```

---

# 9. Folder Organization

## Folder Structure Philosophy

VendSway follows a feature-based folder organization, where code is grouped by business feature rather than technical layer. This promotes:

- **High Cohesion**: Related code lives together
- **Easy Navigation**: Developers can quickly locate feature code
- **Parallel Development**: Features can be developed independently
- **Scalability**: New features can be added without restructuring

## Complete Folder Structure

```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── images/
│       ├── placeholders/
│       │   ├── product-placeholder.png
│       │   ├── seller-placeholder.png
│       │   └── region-placeholder.png
│       └── logos/
│           └── myntra-logo.png
│
├── src/
│   ├── features/                          # Feature modules
│   │   ├── regional-intelligence/         # Feature 1
│   │   │   ├── components/
│   │   │   │   ├── RegionalMap.tsx
│   │   │   │   ├── StateDetailsPanel.tsx
│   │   │   │   └── MapControls.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useRegionalData.ts
│   │   │   │   ├── useMapInteraction.ts
│   │   │   │   └── useRegionFilters.ts
│   │   │   ├── services/
│   │   │   │   ├── regionalIntelligence.service.ts
│   │   │   │   └── mockRegionalData.service.ts
│   │   │   ├── types/
│   │   │   │   ├── region.types.ts
│   │   │   │   ├── textile.types.ts
│   │   │   │   └── festival.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── catalog-gap/                   # Feature 2
│   │   │   ├── components/
│   │   │   │   ├── GapTable.tsx
│   │   │   │   ├── GapSummaryCards.tsx
│   │   │   │   └── GapFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useGapData.ts
│   │   │   │   ├── useGapCalculations.ts
│   │   │   │   └── useGapFilters.ts
│   │   │   ├── services/
│   │   │   │   ├── catalogGap.service.ts
│   │   │   │   ├── gapCalculation.service.ts
│   │   │   │   └── mockGapData.service.ts
│   │   │   ├── types/
│   │   │   │   ├── gap.types.ts
│   │   │   │   └── priority.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── seller-discovery/              # Feature 3
│   │   │   ├── components/
│   │   │   │   ├── SellerList.tsx
│   │   │   │   ├── SellerCard.tsx
│   │   │   │   ├── SellerProfile.tsx
│   │   │   │   └── SellerFilters.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useSellerData.ts
│   │   │   │   ├── useSellerMatching.ts
│   │   │   │   └── useSellerFilters.ts
│   │   │   ├── services/
│   │   │   │   ├── sellerDiscovery.service.ts
│   │   │   │   ├── sellerMatching.service.ts
│   │   │   │   └── mockSellerData.service.ts
│   │   │   ├── types/
│   │   │   │   ├── seller.types.ts
│   │   │   │   └── match.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── seller-onboarding/            # Feature 4
│   │   │   ├── components/
│   │   │   │   ├── SellerPortal.tsx
│   │   │   │   ├── RegistrationForm.tsx
│   │   │   │   ├── ProductForm.tsx
│   │   │   │   └── StatusView.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useRegistration.ts
│   │   │   │   ├── useProductUpload.ts
│   │   │   │   ├── useApplicationStatus.ts
│   │   │   │   └── useFormState.ts
│   │   │   ├── services/
│   │   │   │   ├── sellerOnboarding.service.ts
│   │   │   │   ├── formValidation.service.ts
│   │   │   │   └── mockOnboardingData.service.ts
│   │   │   ├── types/
│   │   │   │   ├── registration.types.ts
│   │   │   │   ├── product.types.ts
│   │   │   │   └── status.types.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── regional-storefront/          # Feature 5
│   │   │   ├── components/
│   │   │   │   ├── RegionalStorefront.tsx
│   │   │   │   ├── HeroBanner.tsx
│   │   │   │   ├── FestivalCollection.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── LocalSellers.tsx
│   │   │   │   └── RegionSelector.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useProductData.ts
│   │   │   │   ├── useRegionalContent.ts
│   │   │   │   ├── useFestivalCollections.ts
│   │   │   │   └── useRegionSelector.ts
│   │   │   ├── services/
│   │   │   │   ├── personalization.service.ts
│   │   │   │   ├── recommendation.service.ts
│   │   │   │   └── mockProductData.service.ts
│   │   │   ├── types/
│   │   │   │   ├── product.types.ts
│   │   │   │   ├── collection.types.ts
│   │   │   │   └── storefront.types.ts
│   │   │   └── index.ts
│   │   │
│   │   └── shared/                       # Shared feature components
│   │       ├── components/
│   │       │   ├── LoadingSpinner.tsx
│   │       │   ├── ErrorMessage.tsx
│   │       │   ├── EmptyState.tsx
│   │       │   └── RegionSelector.tsx
│   │       ├── hooks/
│   │       │   ├── useNavigation.ts
│   │       │   ├── useDebounce.ts
│   │       │   └── useLocalStorage.ts
│   │       └── index.ts
│   │
│   ├── components/                        # Shared UI components
│   │   ├── ui/                           # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   └── layout/                       # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       ├── Sidebar.tsx
│   │       └── Navbar.tsx
│   │
│   ├── pages/                             # Page components
│   │   ├── Landing.tsx
│   │   ├── RegionalIntelligence.tsx
│   │   ├── CatalogGap.tsx
│   │   ├── SellerDiscovery.tsx
│   │   ├── SellerOnboarding.tsx
│   │   └── RegionalStorefront.tsx
│   │
│   ├── context/                           # React Context providers
│   │   ├── AppContext.tsx
│   │   ├── NavigationContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── lib/                               # Utilities and helpers
│   │   ├── utils.ts                       # General utilities
│   │   ├── validations.ts                # Validation functions
│   │   ├── constants.ts                   # Application constants
│   │   └── api.ts                         # API client configuration
│   │
│   ├── data/                              # Mock data
│   │   ├── mockRegions.ts
│   │   ├── mockSellers.ts
│   │   ├── mockProducts.ts
│   │   ├── mockGaps.ts
│   │   └── mockFestivals.ts
│   │
│   ├── hooks/                             # Global custom hooks
│   │   ├── useBreakpoint.ts
│   │   ├── useMediaQuery.ts
│   │   └── useScroll.ts
│   │
│   ├── types/                             # Global type definitions
│   │   ├── index.ts
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   │
│   ├── styles/                            # Global styles
│   │   └── globals.css
│   │
│   ├── App.tsx                            # Root component
│   ├── main.tsx                           # Entry point
│   └── vite-env.d.ts                      # Vite type definitions
│
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── .eslintrc.json
├── .prettierrc
└── README.md
```

## Folder Naming Conventions

- **Feature Folders**: kebab-case (e.g., `regional-intelligence`, `catalog-gap`)
- **Component Files**: PascalCase (e.g., `RegionalMap.tsx`, `SellerCard.tsx`)
- **Hook Files**: camelCase with `use` prefix (e.g., `useRegionalData.ts`)
- **Service Files**: camelCase with `.service` suffix (e.g., `regionalIntelligence.service.ts`)
- **Type Files**: PascalCase with `.types` suffix (e.g., `region.types.ts`)
- **Utility Files**: camelCase (e.g., `utils.ts`, `validations.ts`)

## File Organization Rules

1. **Feature-Based**: Group files by feature, not by type
2. **Index Files**: Export from feature folders for clean imports
3. **Barrel Exports**: Use index.ts to export public API
4. **Co-location**: Keep related files close together
5. **Deep Nesting**: Avoid excessive nesting (max 3-4 levels)

---

# 10. Theme Strategy

## Theme Philosophy

VendSway uses a modern, professional theme with:

- **TailwindCSS**: Utility-first CSS framework for rapid development
- **shadcn/ui**: Beautiful, accessible components built on Radix UI
- **Consistent Design System**: Unified colors, typography, and spacing
- **Dark Mode Support**: Future-ready for dark mode implementation
- **Brand Alignment**: Aligned with Myntra's brand identity

## Color System

### Primary Colors

```typescript
// Brand colors (Myntra-inspired)
primary: {
  50: '#fef2f2',  // Light pink
  100: '#fee2e2',
  200: '#fecaca',
  300: '#fca5a5',
  400: '#f87171',
  500: '#ef4444',  // Primary brand color (red/pink)
  600: '#dc2626',
  700: '#b91c1c',
  800: '#991b1b',
  900: '#7f1d1d',
}
```

### Secondary Colors

```typescript
// Secondary colors
secondary: {
  50: '#f0f9ff',
  100: '#e0f2fe',
  200: '#bae6fd',
  300: '#7dd3fc',
  400: '#38bdf8',
  500: '#0ea5e9',  // Secondary brand color (blue)
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
}
```

### Neutral Colors

```typescript
// Neutral colors for text and backgrounds
neutral: {
  50: '#fafafa',
  100: '#f5f5f5',
  200: '#e5e5e5',
  300: '#d4d4d4',
  400: '#a3a3a3',
  500: '#737373',
  600: '#525252',
  700: '#404040',
  800: '#262626',
  900: '#171717',
}
```

### Semantic Colors

```typescript
// Semantic colors for status and feedback
success: {
  light: '#dcfce7',
  DEFAULT: '#22c55e',
  dark: '#16a34a',
}

warning: {
  light: '#fef9c3',
  DEFAULT: '#eab308',
  dark: '#ca8a04',
}

error: {
  light: '#fee2e2',
  DEFAULT: '#ef4444',
  dark: '#dc2626',
}

info: {
  light: '#dbeafe',
  DEFAULT: '#3b82f6',
  dark: '#2563eb',
}
```

## Typography System

### Font Families

```typescript
// Font families
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  heading: ['Poppins', 'system-ui', 'sans-serif'],
  mono: ['Fira Code', 'monospace'],
}
```

### Font Sizes

```typescript
// Font sizes (Tailwind scale)
fontSize: {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
}
```

### Font Weights

```typescript
// Font weights
fontWeight: {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}
```

## Spacing System

```typescript
// Spacing scale (Tailwind default)
spacing: {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
}
```

## Border Radius

```typescript
// Border radius
borderRadius: {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
}
```

## Shadows

```typescript
// Shadows
shadow: {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
}
```

## Theme Configuration

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef2f2',
          // ... primary colors
        },
        secondary: {
          50: '#f0f9ff',
          // ... secondary colors
        },
        // ... other color definitions
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
```

### Theme Provider

```typescript
// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Component Theming

### shadcn/ui Theming

shadcn/ui components use CSS variables for theming, allowing for easy customization:

```css
/* globals.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 0 84.2% 60.2%;
    --primary-foreground: 210 40% 98%;
    /* ... other CSS variables */
  }
  
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 0 84.2% 60.2%;
    --primary-foreground: 222.2 47.4% 11.2%;
    /* ... other CSS variables */
  }
}
```

---

# 11. Error Handling Strategy

## Error Handling Philosophy

VendSway implements a comprehensive error handling strategy with:

- **User-Friendly Messages**: Clear, actionable error messages
- **Graceful Degradation**: Fallback UI when features fail
- **Error Boundaries**: Catch React component errors
- **API Error Handling**: Centralized API error management
- **Validation Errors**: Form validation with clear feedback
- **Logging**: Console logging for debugging

## Error Categories

### API Errors

**Responsibilities**: Handle HTTP errors from API calls

**Types**:
- Network errors (no connection)
- Server errors (500, 502, 503)
- Client errors (400, 401, 403, 404)
- Timeout errors

**Handling Strategy**:
```typescript
// API error handling with React Query
const useRegionalData = (regionId: string) => {
  return useQuery({
    queryKey: ['regions', regionId],
    queryFn: () => regionalService.getRegion(regionId),
    onError: (error) => {
      if (error instanceof NetworkError) {
        toast.error('Network error. Please check your connection.');
      } else if (error instanceof ServerError) {
        toast.error('Server error. Please try again later.');
      } else if (error instanceof NotFoundError) {
        toast.error('Region not found.');
      }
    },
    retry: (failureCount, error) => {
      if (error instanceof ClientError) {
        return false; // Don't retry client errors
      }
      return failureCount < 3;
    },
  });
};
```

### Validation Errors

**Responsibilities**: Handle form validation errors

**Types**:
- Required field errors
- Format errors (email, phone)
- Length errors
- Custom validation errors

**Handling Strategy**:
```typescript
// Form validation with Zod
const registrationSchema = z.object({
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Invalid phone number'),
});

// Form component with validation
const RegistrationForm = () => {
  const form = useForm({
    resolver: zodResolver(registrationSchema),
  });
  
  const onSubmit = async (data) => {
    try {
      await sellerService.register(data);
      toast.success('Registration successful');
    } catch (error) {
      if (error instanceof ValidationError) {
        form.setError('email', { message: error.message });
      }
    }
  };
};
```

### Component Errors

**Responsibilities**: Handle React component errors

**Types**:
- Rendering errors
- Null reference errors
- Prop type errors

**Handling Strategy**:
```typescript
// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorMessage error={this.state.error} />;
    }
    return this.props.children;
  }
}

// Wrap app with error boundary
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## Error Display Strategy

### Error Message Component

```typescript
// Error message component
interface ErrorMessageProps {
  error: Error | string;
  onRetry?: () => void;
  dismissible?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error, 
  onRetry, 
  dismissible 
}) => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <div className="error-message">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" size="sm">
            Retry
          </Button>
        )}
        {dismissible && (
          <Button onClick={() => setDismissed(true)} variant="ghost" size="sm">
            Dismiss
          </Button>
        )}
      </Alert>
    </div>
  );
};
```

### Loading Error State

```typescript
// Combined loading and error state
const DataComponent = () => {
  const { data, isLoading, error, refetch } = useRegionalData('region-1');
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <ErrorMessage 
        error={error} 
        onRetry={() => refetch()} 
        dismissible 
      />
    );
  }
  
  return <RegionalData data={data} />;
};
```

## Error Logging Strategy

### Console Logging

```typescript
// Structured error logging
const logError = (error: Error, context?: Record<string, any>) => {
  console.error({
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

// Usage
try {
  await someOperation();
} catch (error) {
  logError(error as Error, { component: 'RegionalMap', action: 'fetchData' });
}
```

## Error Recovery Strategy

### Automatic Recovery

```typescript
// Automatic retry with exponential backoff
const useRetryableQuery = (key: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey: key,
    queryFn: queryFn,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
```

### Manual Recovery

```typescript
// Manual retry with user trigger
const ErrorWithRetry = ({ error, onRetry }) => (
  <div className="error-container">
    <p>{error.message}</p>
    <Button onClick={onRetry}>Retry</Button>
  </div>
);
```

### Fallback UI

```typescript
// Fallback UI when data is unavailable
const FallbackUI = () => (
  <EmptyState
    icon={<AlertTriangle />}
    title="Data unavailable"
    description="We couldn't load the data. Please try again later."
    action={
      <Button onClick={() => window.location.reload()}>
        Refresh Page
      </Button>
    }
  />
);
```

---

# 12. Loading State Strategy

## Loading State Philosophy

VendSway implements a comprehensive loading state strategy with:

- **Visual Feedback**: Clear loading indicators for async operations
- **Skeleton Screens**: Placeholder UI while content loads
- **Progressive Loading**: Load content progressively for better UX
- **Optimistic UI**: Show optimistic updates for better perceived performance
- **Loading States**: Different loading states for different operations

## Loading State Categories

### Initial Loading

**Purpose**: Show loading state when data is first fetched

**Implementation**:
```typescript
const RegionalData = () => {
  const { data, isLoading } = useRegionalData('region-1');
  
  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading regional data..." />;
  }
  
  return <RegionalContent data={data} />;
};
```

### Background Loading

**Purpose**: Load data in background without blocking UI

**Implementation**:
```typescript
const useBackgroundData = (key: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey: key,
    queryFn: queryFn,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
```

### Optimistic Loading

**Purpose**: Show optimistic updates before server confirmation

**Implementation**:
```typescript
const useOptimisticUpdate = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateData,
    onMutate: async (newData) => {
      await queryClient.cancelQueries(['data']);
      const previousData = queryClient.getQueryData(['data']);
      queryClient.setQueryData(['data'], newData);
      return { previousData };
    },
    onError: (err, newData, context) => {
      queryClient.setQueryData(['data'], context.previousData);
    },
  });
};
```

## Loading UI Components

### Loading Spinner

```typescript
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  message 
}) => {
  return (
    <div className="loading-container">
      <Spinner className={size} />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};
```

### Skeleton Screen

```typescript
const SkeletonCard = () => (
  <Card>
    <Skeleton className="h-48 w-full" />
    <CardHeader>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardContent>
  </Card>
);

const SkeletonGrid = () => (
  <div className="grid grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
```

### Progress Indicator

```typescript
interface ProgressProps {
  progress: number;
  message?: string;
}

const ProgressIndicator: React.FC<ProgressProps> = ({ progress, message }) => (
  <div className="progress-container">
    <Progress value={progress} />
    {message && <p className="progress-message">{message}</p>}
  </div>
);
```

## Loading State Management

### React Query Loading States

```typescript
const useDataWithLoading = (key: string[], queryFn: () => Promise<any>) => {
  return useQuery({
    queryKey: key,
    queryFn: queryFn,
    onLoading: () => {
      // Show loading indicator
    },
    onSuccess: () => {
      // Hide loading indicator
    },
    onError: () => {
      // Hide loading indicator, show error
    },
  });
};
```

### Global Loading State

```typescript
// Global loading context
const LoadingContext = createContext<{
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}>({
  isLoading: false,
  setLoading: () => {},
});

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      {isLoading && <GlobalLoadingSpinner />}
    </LoadingContext.Provider>
  );
};
```

## Loading Best Practices

1. **Show Loading Immediately**: Display loading state as soon as async operation starts
2. **Use Skeleton Screens**: Show placeholder UI for better perceived performance
3. **Provide Context**: Show what is being loaded
4. **Avoid Blocking**: Use background loading when possible
5. **Handle Errors**: Show error state if loading fails
6. **Optimistic Updates**: Show optimistic updates for better UX

---

# 13. Accessibility Strategy

## Accessibility Philosophy

VendSway is committed to accessibility with:

- **WCAG 2.1 AA Compliance**: Meet WCAG 2.1 Level AA standards
- **Semantic HTML**: Use proper HTML elements for structure
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Compatible with screen readers
- **ARIA Labels**: Proper ARIA attributes for dynamic content
- **Focus Management**: Clear focus indicators and management
- **Color Contrast**: Sufficient color contrast for readability

## Semantic HTML

### Proper Element Usage

```typescript
// Use semantic HTML elements
<header>
  <nav>
    <ul>
      <li><a href="/admin">Admin</a></li>
      <li><a href="/seller">Seller</a></li>
      <li><a href="/customer">Customer</a></li>
    </ul>
  </nav>
</header>

<main>
  <section aria-labelledby="regional-intelligence">
    <h1 id="regional-intelligence">Regional Intelligence</h1>
    <!-- Content -->
  </section>
</main>

<footer>
  <p>&copy; 2026 VendSway</p>
</footer>
```

### Heading Hierarchy

```typescript
// Proper heading hierarchy
<h1>Regional Intelligence</h1>
  <h2>State Details</h2>
    <h3>Textiles</h3>
    <h3>Festivals</h3>
  <h2>Map Controls</h2>
```

## Keyboard Navigation

### Keyboard Support

```typescript
// Keyboard-accessible buttons
<button 
  type="button"
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Click me
</button>

// Keyboard-accessible dropdowns
<select 
  onChange={handleChange}
  onKeyDown={(e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    }
  }}
>
  <option value="">Select region</option>
  <option value="ap">Andhra Pradesh</option>
  <option value="tn">Tamil Nadu</option>
</select>
```

### Focus Management

```typescript
// Focus trap in modals
const useFocusTrap = (containerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };
    
    container.addEventListener('keydown', handleTab);
    firstElement.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }, [containerRef]);
};
```

## ARIA Attributes

### ARIA Labels

```typescript
// ARIA labels for screen readers
<button aria-label="Close modal" onClick={onClose}>
  <X />
</button>

<img 
  src="/images/region.jpg" 
  alt="Map of India showing regional fashion data"
/>

<div role="status" aria-live="polite">
  Loading regional data...
</div>
```

### ARIA Roles

```typescript
// ARIA roles for dynamic content
<div role="tabpanel" aria-labelledby="tab-1">
  <!-- Tab content -->
</div>

<div role="list" aria-label="Seller list">
  {sellers.map(seller => (
    <div role="listitem" key={seller.id}>
      {seller.name}
    </div>
  ))}
</div>
```

### ARIA States

```typescript
// ARIA states for interactive elements
<button 
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={toggleDropdown}
>
  Options
</button>

<div 
  id="dropdown-menu"
  role="menu"
  aria-hidden={!isOpen}
>
  {/* Menu items */}
</div>
```

## Screen Reader Support

### Screen Reader Announcements

```typescript
// Announce dynamic content changes
const useAnnouncement = () => {
  const announce = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };
  
  return { announce };
};

// Usage
const { announce } = useAnnouncement();
announce('Region data loaded successfully');
```

### Skip Links

```typescript
// Skip to main content link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

<main id="main-content">
  {/* Main content */}
</main>
```

## Color Contrast

### Contrast Requirements

- **Normal Text**: 4.5:1 contrast ratio
- **Large Text**: 3:1 contrast ratio
- **UI Components**: 3:1 contrast ratio

### Color Palette

```typescript
// High contrast color palette
const colors = {
  text: '#171717',      // Dark gray for text
  background: '#ffffff', // White background
  primary: '#dc2626',    // Dark red for primary actions
  secondary: '#2563eb',  // Dark blue for secondary actions
  error: '#dc2626',      // Dark red for errors
  success: '#16a34a',    // Dark green for success
};
```

## Focus Indicators

### Visible Focus

```typescript
// Clear focus indicators
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

a:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

## Accessibility Testing

### Testing Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] ARIA labels are provided for screen readers
- [ ] Color contrast meets WCAG standards
- [ ] Form fields have associated labels
- [ ] Images have alt text
- [ ] Dynamic content changes are announced
- [ ] Skip links are provided
- [ ] Heading hierarchy is correct
- [ ] Semantic HTML is used

---

# 14. Responsive Design Strategy

## Responsive Design Philosophy

VendSway implements a mobile-first responsive design strategy with:

- **Mobile-First Approach**: Design for mobile screens first, then scale up
- **Breakpoint System**: Consistent breakpoints for different screen sizes
- **Fluid Layouts**: Use flexible layouts that adapt to screen size
- **Responsive Images**: Optimize images for different screen sizes
- **Touch-Friendly**: Ensure touch targets are adequate for mobile
- **Progressive Enhancement**: Enhance experience for larger screens

## Breakpoint System

### Breakpoint Definitions

```typescript
// Tailwind default breakpoints
const breakpoints = {
  sm: '640px',   // Small screens (landscape phones)
  md: '768px',   // Medium screens (tablets)
  lg: '1024px',  // Large screens (laptops)
  xl: '1280px',  // Extra large screens (desktops)
  '2xl': '1536px', // 2X large screens (large desktops)
};
```

### Breakpoint Usage

```typescript
// Responsive utilities
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid adapts to screen size */}
</div>

<div className="text-sm md:text-base lg:text-lg">
  {/* Text size adapts to screen size */}
</div>
```

## Layout Strategies

### Mobile-First Grid

```typescript
// Mobile-first grid layout
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>

// Mobile: 1 column
// Tablet: 2 columns
// Desktop: 3 columns
```

### Flexible Containers

```typescript
// Flexible container with max-width
<div className="container mx-auto px-4 max-w-7xl">
  {/* Content */}
</div>
```

### Responsive Spacing

```typescript
// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">
  {/* Padding increases with screen size */}
</div>
```

## Responsive Components

### Responsive Navigation

```typescript
// Mobile hamburger menu, desktop horizontal menu
const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav>
      {/* Desktop navigation */}
      <div className="hidden md:flex space-x-4">
        <NavLink to="/admin">Admin</NavLink>
        <NavLink to="/seller">Seller</NavLink>
        <NavLink to="/customer">Customer</NavLink>
      </div>
      
      {/* Mobile hamburger menu */}
      <div className="md:hidden">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu />
        </button>
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            <NavLink to="/admin">Admin</NavLink>
            <NavLink to="/seller">Seller</NavLink>
            <NavLink to="/customer">Customer</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};
```

### Responsive Tables

```typescript
// Responsive table with horizontal scroll on mobile
<div className="overflow-x-auto">
  <table className="min-w-full">
    {/* Table content */}
  </table>
</div>
```

### Responsive Modals

```typescript
// Responsive modal (full screen on mobile, centered on desktop)
const Modal = ({ isOpen, onClose, children }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl">
        {children}
      </DialogContent>
    </Dialog>
  );
};
```

## Touch Targets

### Minimum Touch Target Size

```typescript
// Ensure touch targets are at least 44x44 pixels
<button className="min-h-[44px] min-w-[44px]">
  Click me
</button>

<a href="#" className="inline-block min-h-[44px] min-w-[44px]">
  Link
</a>
```

### Spacing for Touch

```typescript
// Add spacing around touch targets
<div className="space-y-4">
  <button className="w-full py-3">Button 1</button>
  <button className="w-full py-3">Button 2</button>
  <button className="w-full py-3">Button 3</button>
</div>
```

## Responsive Images

### Image Optimization

```typescript
// Responsive image with srcset
<img
  src="/images/product-small.jpg"
  srcSet="
    /images/product-small.jpg 640w,
    /images/product-medium.jpg 1024w,
    /images/product-large.jpg 1280w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Product image"
/>
```

### Lazy Loading

```typescript
// Lazy load images for performance
<img
  src="/images/product.jpg"
  loading="lazy"
  alt="Product image"
/>
```

## Responsive Typography

### Fluid Typography

```typescript
// Typography that scales with screen size
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Heading
</h1>

<p className="text-sm md:text-base lg:text-lg">
  Body text
</p>
```

## Media Queries

### Custom Media Queries

```typescript
// Custom hook for media queries
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);
  
  return matches;
};

// Usage
const isMobile = useMediaQuery('(max-width: 768px)');
const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');
const isDesktop = useMediaQuery('(min-width: 1025px)');
```

---

# 15. Performance Optimization Strategy

## Performance Philosophy

VendSway implements a comprehensive performance optimization strategy with:

- **Code Splitting**: Split code into smaller chunks for faster loading
- **Lazy Loading**: Load components and routes on demand
- **Image Optimization**: Optimize images for faster loading
- **Caching Strategy**: Cache data and assets for faster subsequent loads
- **Bundle Optimization**: Optimize bundle size for faster downloads
- **Rendering Optimization**: Optimize React rendering for better performance

## Code Splitting

### Route-Based Code Splitting

```typescript
// Lazy load routes with React Router
const RegionalIntelligence = lazy(() => import('./pages/RegionalIntelligence'));
const CatalogGap = lazy(() => import('./pages/CatalogGap'));
const SellerDiscovery = lazy(() => import('./pages/SellerDiscovery'));

// Suspense boundary for lazy loading
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin/regional-intelligence" element={<RegionalIntelligence />} />
    <Route path="/admin/catalog-gap" element={<CatalogGap />} />
    <Route path="/admin/seller-discovery" element={<SellerDiscovery />} />
  </Routes>
</Suspense>
```

### Component-Based Code Splitting

```typescript
// Lazy load heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'));

// Usage
<Suspense fallback={<LoadingSkeleton />}>
  {showChart && <HeavyChart data={data} />}
</Suspense>
```

## Lazy Loading

### Lazy Load Components

```typescript
// Lazy load components with intersection observer
const LazyComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref}>
      {isVisible ? <HeavyComponent /> : <LoadingSkeleton />}
    </div>
  );
};
```

### Lazy Load Images

```typescript
// Lazy load images with loading attribute
<img
  src="/images/product.jpg"
  loading="lazy"
  alt="Product image"
/>
```

## Image Optimization

### Image Formats

```typescript
// Use WebP format for better compression
<picture>
  <source srcSet="/images/product.webp" type="image/webp" />
  <source srcSet="/images/product.jpg" type="image/jpeg" />
  <img src="/images/product.jpg" alt="Product image" />
</picture>
```

### Image Compression

```typescript
// Compress images before serving
// Use image optimization service or build tool
// Target: JPEG quality 80, WebP quality 75
```

### Responsive Images

```typescript
// Serve different image sizes for different screens
<img
  src="/images/product-640.jpg"
  srcSet="
    /images/product-640.jpg 640w,
    /images/product-1024.jpg 1024w,
    /images/product-1280.jpg 1280w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt="Product image"
/>
```

## Caching Strategy

### React Query Caching

```typescript
// Configure React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});
```

### Service Worker Caching

```typescript
// Service worker for asset caching
// Cache static assets
// Cache API responses
// Provide offline support
```

## Bundle Optimization

### Tree Shaking

```typescript
// Use ES modules for tree shaking
import { Button } from 'shadcn/ui'; // Only import what's needed
// Instead of
import * as UI from 'shadcn/ui'; // Imports everything
```

### Bundle Analysis

```typescript
// Analyze bundle size
// Use webpack-bundle-analyzer or vite-bundle-visualizer
// Identify large dependencies
// Optimize or replace large dependencies
```

### Minification

```typescript
// Enable minification in build
// Vite does this by default in production
// Terser for JavaScript minification
// CSSNano for CSS minification
```

## Rendering Optimization

### React.memo

```typescript
// Memoize expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering
  return <div>{/* ... */}</div>;
});
```

### useMemo

```typescript
// Memoize expensive calculations
const ExpensiveComponent = ({ data }) => {
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.value - b.value);
  }, [data]);
  
  return <div>{/* Use sortedData */}</div>;
};
```

### useCallback

```typescript
// Memoize callback functions
const ParentComponent = () => {
  const handleClick = useCallback(() => {
    // Handle click
  }, []);
  
  return <ChildComponent onClick={handleClick} />;
};
```

### Virtual Scrolling

```typescript
// Use virtual scrolling for long lists
import { FixedSizeList } from 'react-window';

const VirtualList = ({ items }) => (
  <FixedSizeList
    height={400}
    itemCount={items.length}
    itemSize={100}
    width="100%"
  >
    {({ index, style }) => (
      <div style={style}>
        {items[index].name}
      </div>
    )}
  </FixedSizeList>
);
```

## Performance Monitoring

### Performance Metrics

```typescript
// Monitor performance metrics
const usePerformanceMetrics = () => {
  useEffect(() => {
    // Measure page load time
    const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log('Page load time:', pageLoadTime);
    
    // Measure first contentful paint
    const fcp = performance.getEntriesByName('first-contentful-paint')[0];
    console.log('First contentful paint:', fcp?.startTime);
    
    // Measure largest contentful paint
    const lcp = performance.getEntriesByName('largest-contentful-paint')[0];
    console.log('Largest contentful paint:', lcp?.startTime);
  }, []);
};
```

### Performance Budgets

```typescript
// Set performance budgets
// JavaScript bundle size: < 200KB
// CSS bundle size: < 50KB
// Image size: < 100KB per image
// Page load time: < 3 seconds
// First contentful paint: < 1.5 seconds
// Largest contentful paint: < 2.5 seconds
```

## Performance Best Practices

1. **Code Splitting**: Split code into smaller chunks
2. **Lazy Loading**: Load components and routes on demand
3. **Image Optimization**: Optimize images for faster loading
4. **Caching**: Cache data and assets
5. **Bundle Optimization**: Optimize bundle size
6. **Rendering Optimization**: Optimize React rendering
7. **Performance Monitoring**: Monitor performance metrics
8. **Performance Budgets**: Set and enforce performance budgets

---

# Conclusion

This frontend architecture document provides a comprehensive reference for implementing the VendSway frontend. The architecture is designed to be:

- **Scalable**: Easy to add new features and modules
- **Maintainable**: Clear organization and separation of concerns
- **Performant**: Optimized for fast loading and smooth interactions
- **Accessible**: WCAG 2.1 AA compliant
- **Responsive**: Mobile-first responsive design
- **Type-Safe**: TypeScript throughout for compile-time error prevention

The architecture follows modern React best practices and provides a solid foundation for building a high-quality, professional frontend application.

## Implementation Checklist

- [ ] Initialize React project with Vite and TypeScript
- [ ] Set up project structure according to folder organization
- [ ] Configure TailwindCSS and shadcn/ui
- [ ] Implement React Query configuration
- [ ] Set up React Router with role-based routing
- [ ] Implement React Context providers
- [ ] Create shared components (UI components, layout components)
- [ ] Implement feature modules (Regional Intelligence, Catalog Gap, Seller Discovery, Seller Onboarding, Regional Storefront)
- [ ] Implement page components
- [ ] Add error handling and loading states
- [ ] Implement accessibility features
- [ ] Add responsive design
- [ ] Optimize performance
- [ ] Test complete user flow

## Next Steps

1. Review this architecture document with the development team
2. Set up the project structure
3. Implement shared components and utilities
4. Implement feature modules one by one
5. Test and iterate based on feedback
6. Deploy and monitor performance

---

**Document End**
