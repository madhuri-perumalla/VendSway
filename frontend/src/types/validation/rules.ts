// ============================================================================
// VALIDATION RULE TYPES
// ============================================================================
// Validation rule definitions for form and data validation

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
  message?: string;
}

export interface StringValidationRule extends ValidationRule {
  type: 'string';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
}

export interface NumberValidationRule extends ValidationRule {
  type: 'number';
  min?: number;
  max?: number;
}

export interface EmailValidationRule extends ValidationRule {
  type: 'email';
}

export interface DateValidationRule extends ValidationRule {
  type: 'date';
  minDate?: string;
  maxDate?: string;
}

export interface ArrayValidationRule extends ValidationRule {
  type: 'array';
  minItems?: number;
  maxItems?: number;
}

export interface EnumValidationRule extends ValidationRule {
  type: 'enum';
  values: string[];
}

export type FieldValidationRule =
  | StringValidationRule
  | NumberValidationRule
  | EmailValidationRule
  | DateValidationRule
  | ArrayValidationRule
  | EnumValidationRule;
