// ============================================================================
// FORM TYPES AND VALIDATION TYPES
// ============================================================================
// These types are used for form submissions and validation

import { UUID, ProductCategory } from './shared';

// ============================================================================
// USER FORMS
// ============================================================================

export interface UserRegistrationForm {
  email: string;
  name: string;
  role: 'ADMIN' | 'SELLER';
  password: string;
  confirmPassword: string;
}

export interface UserProfileForm {
  name: string;
  email: string;
  phone?: string;
}

export interface UserPreferencesForm {
  regionId: UUID;
  categories: ProductCategory[];
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

// ============================================================================
// SELLER FORMS
// ============================================================================

export interface SellerRegistrationForm {
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

export interface SellerUpdateForm {
  businessName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  location?: string;
  regionId?: UUID;
  categories?: string[];
  productionCapacity?: number;
}

export interface SellerApplicationForm {
  sellerId: UUID;
  businessDescription: string;
  productCategories: string[];
  productionDetails: string;
  certifications: string[];
  additionalNotes?: string;
}

// ============================================================================
// PRODUCT FORMS
// ============================================================================

export interface ProductCreateForm {
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
}

export interface ProductUpdateForm {
  name?: string;
  category?: string;
  regionId?: UUID | null;
  textileIds?: UUID[];
  price?: number;
  giTagged?: boolean;
  description?: string;
  imageUrl?: string;
  available?: boolean;
  stock?: number;
}

export interface ProductSearchForm {
  query?: string;
  category?: ProductCategory;
  regionId?: UUID;
  sellerId?: UUID;
  giTagged?: boolean;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// ============================================================================
// REGIONAL INTELLIGENCE FORMS
// ============================================================================

export interface RegionFilterForm {
  regionId?: UUID;
  category?: ProductCategory;
  giTagged?: boolean;
  festivalId?: UUID;
  dateFrom?: string;
  dateTo?: string;
}

export interface DemandAnalysisForm {
  regionId: UUID;
  category: string;
  festivalId?: UUID;
  period: string;
}

export interface CatalogGapFilterForm {
  regionId?: UUID;
  category?: string;
  festivalId?: UUID;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  resolved?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// ============================================================================
// ANALYTICS FORMS
// ============================================================================

export interface AnalyticsQueryForm {
  regionId?: UUID;
  metricType: string;
  period: string;
  dateFrom?: string;
  dateTo?: string;
  breakdown?: string[];
}

export interface ReportGenerationForm {
  reportType: string;
  regionId?: UUID;
  period: string;
  format: 'PDF' | 'CSV' | 'EXCEL';
  includeCharts: boolean;
}

// ============================================================================
// ADMIN FORMS
// ============================================================================

export interface ApplicationReviewForm {
  applicationId: UUID;
  status: 'APPROVED' | 'REJECTED';
  reviewedBy: string;
  notes?: string;
}

export interface RegionalDataForm {
  regionId: UUID;
  textileData: string;
  festivalData: string;
  clusterData: string;
}

export interface SystemConfigForm {
  gapThreshold: number;
  demandWeight: number;
  festivalWeight: number;
  giWeight: number;
  catalogWeight: number;
}

// ============================================================================
// VALIDATION SCHEMAS (Zod-compatible)
// ============================================================================

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FormError {
  field: string;
  message: string;
}

// ============================================================================
// FORM STATES
// ============================================================================

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isDirty: boolean;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormAction {
  type: 'SET_VALUE' | 'SET_ERROR' | 'SET_TOUCHED' | 'RESET' | 'SUBMIT' | 'SUBMIT_SUCCESS' | 'SUBMIT_ERROR';
  payload: unknown;
}

// ============================================================================
// FORM SUBMISSION TYPES
// ============================================================================

export interface FormSubmitOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  onFinally?: () => void;
}

export interface FormSubmitResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

// ============================================================================
// MULTI-STEP FORM TYPES
// ============================================================================

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: string[];
  validation?: ValidationSchema;
}

export interface MultiStepFormData {
  currentStep: number;
  steps: FormStep[];
  data: Record<string, unknown>;
  completedSteps: string[];
}

export interface StepNavigation {
  next: () => void;
  previous: () => void;
  goTo: (step: number) => void;
  isLastStep: boolean;
  isFirstStep: boolean;
}
