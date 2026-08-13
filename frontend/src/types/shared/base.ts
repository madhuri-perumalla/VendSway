// ============================================================================
// SHARED BASE TYPES
// ============================================================================
// Base type definitions used across the application

export type UUID = string;

export type Timestamp = string; // ISO 8601 timestamp string

export type DateString = string; // YYYY-MM-DD format

export type PositiveNumber = number;

export type NonEmptyString = string;

export type Nullable<T> = T | null;

export type Optional<T> = T | undefined;

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export type JsonObject = Record<string, JsonValue>;

export type JsonArray = JsonValue[];
