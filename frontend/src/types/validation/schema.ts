// ============================================================================
// VALIDATION SCHEMA TYPES
// ============================================================================
// Validation schema definitions for complex object validation

import { ValidationRule } from './rules';

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface NestedValidationSchema {
  [key: string]: ValidationRule | NestedValidationSchema;
}

export interface ArrayValidationSchema {
  type: 'array';
  itemSchema: ValidationSchema | NestedValidationSchema;
  minItems?: number;
  maxItems?: number;
}

export interface FormValidationSchema {
  fields: ValidationSchema;
  asyncValidation?: {
    [key: string]: (value: unknown) => Promise<boolean | string>;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

export interface AsyncValidationResult {
  isValid: boolean;
  error?: string;
  isLoading?: boolean;
}
