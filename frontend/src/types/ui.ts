// ============================================================================
// UI MODEL TYPES
// ============================================================================
// These types are used for UI components and state management
// They may transform or extend domain models for UI purposes

import { UUID, ProductCategory, GapPriority, SellerStatus, ApplicationStatus } from './shared';
import { Region, Festival, Textile, Product, Seller, DemandSignal, RegionalCollection } from './domain';

// ============================================================================
// TABLE ROW TYPES
// ============================================================================

export interface RegionTableRow {
  id: UUID;
  name: string;
  code: string;
  textileCount: number;
  festivalCount: number;
  sellerCount: number;
  gapCount: number;
}

export interface SellerTableRow {
  id: UUID;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  giTagged: boolean;
  msme: boolean;
  categories: string[];
  rating: number;
  status: SellerStatus;
  appliedDate: string;
}

export interface ProductTableRow {
  id: UUID;
  name: string;
  category: string;
  seller: string;
  region: string;
  price: number;
  giTagged: boolean;
  stock: number;
  available: boolean;
}

export interface CatalogGapTableRow {
  id: UUID;
  region: string;
  category: string;
  festival: string | null;
  demand: number;
  available: number;
  gap: number;
  priority: GapPriority;
  identifiedAt: string;
  resolvedAt: string | null;
}

export interface ApplicationTableRow {
  id: UUID;
  businessName: string;
  contactPerson: string;
  email: string;
  phone: string;
  region: string;
  submittedAt: string;
  status: ApplicationStatus;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

// ============================================================================
// CARD DATA TYPES
// ============================================================================

export interface RegionCardData {
  region: Region;
  textileCount: number;
  festivalCount: number;
  sellerCount: number;
  demandScore: number;
  gapCount: number;
}

export interface SellerCardData {
  seller: Seller;
  matchScore?: number;
  distance?: number;
  productCount: number;
}

export interface ProductCardData {
  product: Product;
  seller: Seller;
  textiles: Textile[];
  region?: Region;
}

export interface FestivalCardData {
  festival: Festival;
  region: Region;
  demandSignal?: DemandSignal;
  productCount: number;
}

export interface CollectionCardData {
  collection: RegionalCollection;
  region: Region;
  festival?: Festival;
  productCount: number;
}

// ============================================================================
// DASHBOARD METRIC TYPES
// ============================================================================

export interface DashboardMetric {
  label: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease';
  period: string;
}

export interface RegionalMetric {
  regionId: UUID;
  regionName: string;
  metrics: DashboardMetric[];
}

export interface CategoryMetric {
  category: ProductCategory;
  demand: number;
  available: number;
  gap: number;
  priority: GapPriority;
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  timestamp: string;
  value: number;
  label?: string;
}

export interface BarChartData {
  category: string;
  value: number;
  color?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  x: string;
  y: number;
}

// ============================================================================
// MAP DATA TYPES
// ============================================================================

export interface MapMarker {
  id: UUID;
  lat: number;
  lng: number;
  label: string;
  type: 'region' | 'seller' | 'cluster';
  data: Region | Seller;
}

export interface MapCluster {
  id: UUID;
  lat: number;
  lng: number;
  count: number;
  type: 'textile' | 'seller' | 'gap';
}

export interface MapRegion {
  id: UUID;
  name: string;
  center: { lat: number; lng: number };
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  data: Region;
}

// ============================================================================
// FILTER UI TYPES
// ============================================================================

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface FilterGroup {
  label: string;
  name: string;
  type: 'select' | 'multiselect' | 'range' | 'date';
  options: FilterOption[];
  selected: string | string[] | [number, number] | null;
}

export interface ActiveFilter {
  key: string;
  label: string;
  value: string;
  removable: boolean;
}

// ============================================================================
// FORM UI TYPES
// ============================================================================

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'multiselect' | 'textarea' | 'date' | 'checkbox' | 'radio';
  placeholder?: string;
  required: boolean;
  options?: Array<{ label: string; value: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    custom?: (value: unknown) => string | null;
  };
  disabled?: boolean;
  defaultValue?: string | number | boolean | string[];
}

export interface FormSection {
  title: string;
  description?: string;
  fields: FormField[];
}

// ============================================================================
// DROPDOWN/SELECT TYPES
// ============================================================================

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: string;
}

export interface MultiSelectOption extends SelectOption {
  selected: boolean;
}

// ============================================================================
// MODAL/TOAST TYPES
// ============================================================================

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

export interface ToastProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

// ============================================================================
// LOADING/EMPTY STATE TYPES
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface EmptyState {
  isEmpty: boolean;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// ============================================================================
// TAB/PAGINATION TYPES
// ============================================================================

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// ============================================================================
// SORTING TYPES
// ============================================================================

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface SortOption {
  label: string;
  value: string;
  direction: 'asc' | 'desc';
}
