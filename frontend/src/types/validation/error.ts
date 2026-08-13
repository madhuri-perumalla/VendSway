// ============================================================================
// VALIDATION ERROR TYPES
// ============================================================================
// Error types for validation failures

export interface FieldValidationError {
  field: string;
  message: string;
  code: string;
  value?: unknown;
}

export interface FormError {
  field: string;
  message: string;
}

export interface ApiValidationError {
  field: string;
  message: string;
  code: string;
}
