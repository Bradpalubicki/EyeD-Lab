export type {
  // Base types
  Coding,
  CodeableConcept,
  Reference,
  HumanName,
  ContactPoint,
  Address,
  Period,
  Identifier,
  Attachment,
  Quantity,
  Dosage,
  Annotation,

  // Resources
  Patient,
  AllergyIntolerance,
  Condition,
  MedicationStatement,
  Observation,
  Procedure,
  Immunization,
  DocumentReference,
  DiagnosticReport,

  // Union & status types
  FhirResource,
  ResourceType,
  AllergySeverity,
  AllergyCategory,
  AllergyType,
  AllergyStatus,
  AllergyVerification,
  ConditionClinicalStatus,
  MedicationStatementStatus,
  ObservationStatus,
  ProcedureStatus,
  ImmunizationStatus,
  DocumentReferenceStatus,
  DiagnosticReportStatus,
} from "./types.js";

export { RESOURCE_TYPES } from "./types.js";

export { validateResource, isFhirResource } from "./validate.js";
export type { ValidationResult } from "./validate.js";

export {
  createPatient,
  createAllergyIntolerance,
  createCondition,
  createMedicationStatement,
} from "./helpers.js";
export type {
  CreatePatientInput,
  CreateAllergyIntoleranceInput,
  CreateConditionInput,
  CreateMedicationStatementInput,
} from "./helpers.js";
