import type { FhirResource, ResourceType } from "./types.js";
import { RESOURCE_TYPES } from "./types.js";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasString(obj: Record<string, unknown>, key: string): boolean {
  return typeof obj[key] === "string" && (obj[key] as string).length > 0;
}

function isReference(value: unknown): boolean {
  return isObject(value) && (typeof value.reference === "string" || typeof value.display === "string");
}

function isCodeableConcept(value: unknown): boolean {
  if (!isObject(value)) return false;
  if (value.text !== undefined && typeof value.text !== "string") return false;
  if (value.coding !== undefined && !Array.isArray(value.coding)) return false;
  return true;
}

// ---------------------------------------------------------------------------
// Per-resource required-field checks
// ---------------------------------------------------------------------------

type FieldChecker = (resource: Record<string, unknown>, errors: string[]) => void;

function requireReference(resource: Record<string, unknown>, field: string, errors: string[]): void {
  if (!isReference(resource[field])) {
    errors.push(`${field} must be a valid Reference`);
  }
}

function requireCodeableConcept(resource: Record<string, unknown>, field: string, errors: string[]): void {
  if (!isCodeableConcept(resource[field])) {
    errors.push(`${field} must be a valid CodeableConcept`);
  }
}

function requireStringField(resource: Record<string, unknown>, field: string, errors: string[]): void {
  if (!hasString(resource, field)) {
    errors.push(`${field} is required`);
  }
}

const RESOURCE_VALIDATORS: Record<ResourceType, FieldChecker> = {
  Patient(_resource, _errors) {
    // Patient has no strictly required fields beyond resourceType in FHIR R4
  },

  AllergyIntolerance(resource, errors) {
    requireReference(resource, "patient", errors);
  },

  Condition(resource, errors) {
    requireReference(resource, "subject", errors);
  },

  MedicationStatement(resource, errors) {
    requireReference(resource, "subject", errors);
    if (!hasString(resource, "status")) {
      errors.push("status is required");
    }
  },

  Observation(resource, errors) {
    if (!hasString(resource, "status")) {
      errors.push("status is required");
    }
    if (!isCodeableConcept(resource.code)) {
      errors.push("code must be a valid CodeableConcept");
    }
  },

  Procedure(resource, errors) {
    requireReference(resource, "subject", errors);
    if (!hasString(resource, "status")) {
      errors.push("status is required");
    }
  },

  Immunization(resource, errors) {
    requireReference(resource, "patient", errors);
    if (!hasString(resource, "status")) {
      errors.push("status is required");
    }
    requireCodeableConcept(resource, "vaccineCode", errors);
  },

  DocumentReference(resource, errors) {
    if (!hasString(resource, "status")) {
      errors.push("status is required");
    }
    if (!Array.isArray(resource.content) || resource.content.length === 0) {
      errors.push("content must be a non-empty array");
    }
  },

  DiagnosticReport(resource, errors) {
    if (!hasString(resource, "status")) {
      errors.push("status is required");
    }
    if (!isCodeableConcept(resource.code)) {
      errors.push("code must be a valid CodeableConcept");
    }
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function validateResource(resource: unknown): ValidationResult {
  const errors: string[] = [];

  if (!isObject(resource)) {
    return { valid: false, errors: ["resource must be an object"] };
  }

  if (!hasString(resource, "resourceType")) {
    return { valid: false, errors: ["resourceType is required"] };
  }

  const resourceType = resource.resourceType as string;

  if (!RESOURCE_TYPES.includes(resourceType as ResourceType)) {
    return {
      valid: false,
      errors: [`unknown resourceType: ${resourceType}`],
    };
  }

  const validator = RESOURCE_VALIDATORS[resourceType as ResourceType];
  validator(resource, errors);

  return { valid: errors.length === 0, errors };
}

/**
 * Type-narrowing helper: validates and narrows to FhirResource.
 */
export function isFhirResource(value: unknown): value is FhirResource {
  return validateResource(value).valid;
}
