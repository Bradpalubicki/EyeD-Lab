// ---------------------------------------------------------------------------
// FHIR R4 base data types (subset used by EyeD)
// ---------------------------------------------------------------------------

export interface Coding {
  system?: string;
  code?: string;
  display?: string;
}

export interface CodeableConcept {
  coding?: Coding[];
  text?: string;
}

export interface Reference {
  reference?: string;
  display?: string;
  type?: string;
}

export interface HumanName {
  use?: "official" | "usual" | "temp" | "nickname" | "anonymous" | "old" | "maiden";
  family?: string;
  given?: string[];
  prefix?: string[];
  suffix?: string[];
  text?: string;
}

export interface ContactPoint {
  system?: "phone" | "fax" | "email" | "pager" | "url" | "sms" | "other";
  value?: string;
  use?: "home" | "work" | "temp" | "old" | "mobile";
}

export interface Address {
  use?: "home" | "work" | "temp" | "old" | "billing";
  line?: string[];
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  text?: string;
}

export interface Period {
  start?: string;
  end?: string;
}

export interface Identifier {
  system?: string;
  value?: string;
  use?: "usual" | "official" | "temp" | "secondary" | "old";
  type?: CodeableConcept;
  period?: Period;
}

export interface Attachment {
  contentType?: string;
  url?: string;
  data?: string; // base64
  title?: string;
  creation?: string;
}

export interface Quantity {
  value?: number;
  unit?: string;
  system?: string;
  code?: string;
}

export interface Dosage {
  text?: string;
  timing?: { repeat?: { frequency?: number; period?: number; periodUnit?: string } };
  route?: CodeableConcept;
  doseAndRate?: { doseQuantity?: Quantity }[];
}

export interface Annotation {
  text: string;
  authorReference?: Reference;
  time?: string;
}

// ---------------------------------------------------------------------------
// Resources
// ---------------------------------------------------------------------------

interface ResourceBase {
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
  };
}

export interface Patient extends ResourceBase {
  resourceType: "Patient";
  identifier?: Identifier[];
  active?: boolean;
  name?: HumanName[];
  telecom?: ContactPoint[];
  gender?: "male" | "female" | "other" | "unknown";
  birthDate?: string;
  address?: Address[];
  deceasedBoolean?: boolean;
  deceasedDateTime?: string;
  maritalStatus?: CodeableConcept;
  contact?: {
    relationship?: CodeableConcept[];
    name?: HumanName;
    telecom?: ContactPoint[];
    address?: Address;
  }[];
}

export type AllergySeverity = "mild" | "moderate" | "severe";
export type AllergyCategory = "food" | "medication" | "environment" | "biologic";
export type AllergyType = "allergy" | "intolerance";
export type AllergyStatus =
  | "active"
  | "inactive"
  | "resolved";
export type AllergyVerification =
  | "unconfirmed"
  | "confirmed"
  | "refuted"
  | "entered-in-error";

export interface AllergyIntolerance extends ResourceBase {
  resourceType: "AllergyIntolerance";
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  type?: AllergyType;
  category?: AllergyCategory[];
  criticality?: "low" | "high" | "unable-to-assess";
  code?: CodeableConcept;
  patient: Reference;
  onsetDateTime?: string;
  onsetAge?: Quantity;
  onsetString?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  note?: Annotation[];
  reaction?: {
    substance?: CodeableConcept;
    manifestation: CodeableConcept[];
    severity?: AllergySeverity;
    description?: string;
    onset?: string;
  }[];
}

export type ConditionClinicalStatus =
  | "active"
  | "recurrence"
  | "relapse"
  | "inactive"
  | "remission"
  | "resolved";

export interface Condition extends ResourceBase {
  resourceType: "Condition";
  clinicalStatus?: CodeableConcept;
  verificationStatus?: CodeableConcept;
  category?: CodeableConcept[];
  severity?: CodeableConcept;
  code?: CodeableConcept;
  bodySite?: CodeableConcept[];
  subject: Reference;
  onsetDateTime?: string;
  onsetAge?: Quantity;
  onsetString?: string;
  abatementDateTime?: string;
  recordedDate?: string;
  recorder?: Reference;
  asserter?: Reference;
  note?: Annotation[];
}

export type MedicationStatementStatus =
  | "active"
  | "completed"
  | "entered-in-error"
  | "intended"
  | "stopped"
  | "on-hold"
  | "unknown"
  | "not-taken";

export interface MedicationStatement extends ResourceBase {
  resourceType: "MedicationStatement";
  status: MedicationStatementStatus;
  medicationCodeableConcept?: CodeableConcept;
  medicationReference?: Reference;
  subject: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  dateAsserted?: string;
  informationSource?: Reference;
  dosage?: Dosage[];
  reasonCode?: CodeableConcept[];
  note?: Annotation[];
}

export type ObservationStatus =
  | "registered"
  | "preliminary"
  | "final"
  | "amended"
  | "corrected"
  | "cancelled"
  | "entered-in-error"
  | "unknown";

export interface Observation extends ResourceBase {
  resourceType: "Observation";
  status: ObservationStatus;
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  issued?: string;
  performer?: Reference[];
  valueQuantity?: Quantity;
  valueCodeableConcept?: CodeableConcept;
  valueString?: string;
  valueBoolean?: boolean;
  interpretation?: CodeableConcept[];
  note?: Annotation[];
  referenceRange?: {
    low?: Quantity;
    high?: Quantity;
    text?: string;
  }[];
  component?: {
    code: CodeableConcept;
    valueQuantity?: Quantity;
    valueCodeableConcept?: CodeableConcept;
    valueString?: string;
  }[];
}

export type ProcedureStatus =
  | "preparation"
  | "in-progress"
  | "not-done"
  | "on-hold"
  | "stopped"
  | "completed"
  | "entered-in-error"
  | "unknown";

export interface Procedure extends ResourceBase {
  resourceType: "Procedure";
  status: ProcedureStatus;
  code?: CodeableConcept;
  subject: Reference;
  performedDateTime?: string;
  performedPeriod?: Period;
  recorder?: Reference;
  asserter?: Reference;
  performer?: {
    actor: Reference;
    function?: CodeableConcept;
    onBehalfOf?: Reference;
  }[];
  location?: Reference;
  reasonCode?: CodeableConcept[];
  bodySite?: CodeableConcept[];
  outcome?: CodeableConcept;
  report?: Reference[];
  complication?: CodeableConcept[];
  note?: Annotation[];
}

export type ImmunizationStatus = "completed" | "entered-in-error" | "not-done";

export interface Immunization extends ResourceBase {
  resourceType: "Immunization";
  status: ImmunizationStatus;
  vaccineCode: CodeableConcept;
  patient: Reference;
  occurrenceDateTime?: string;
  occurrenceString?: string;
  recorded?: string;
  primarySource?: boolean;
  lotNumber?: string;
  expirationDate?: string;
  site?: CodeableConcept;
  route?: CodeableConcept;
  doseQuantity?: Quantity;
  performer?: {
    actor: Reference;
    function?: CodeableConcept;
  }[];
  note?: Annotation[];
  reasonCode?: CodeableConcept[];
}

export type DocumentReferenceStatus = "current" | "superseded" | "entered-in-error";

export interface DocumentReference extends ResourceBase {
  resourceType: "DocumentReference";
  status: DocumentReferenceStatus;
  type?: CodeableConcept;
  category?: CodeableConcept[];
  subject?: Reference;
  date?: string;
  author?: Reference[];
  description?: string;
  content: {
    attachment: Attachment;
    format?: Coding;
  }[];
  context?: {
    encounter?: Reference[];
    period?: Period;
    facilityType?: CodeableConcept;
    practiceSetting?: CodeableConcept;
  };
}

export type DiagnosticReportStatus =
  | "registered"
  | "partial"
  | "preliminary"
  | "final"
  | "amended"
  | "corrected"
  | "appended"
  | "cancelled"
  | "entered-in-error"
  | "unknown";

export interface DiagnosticReport extends ResourceBase {
  resourceType: "DiagnosticReport";
  status: DiagnosticReportStatus;
  category?: CodeableConcept[];
  code: CodeableConcept;
  subject?: Reference;
  effectiveDateTime?: string;
  effectivePeriod?: Period;
  issued?: string;
  performer?: Reference[];
  result?: Reference[];
  conclusion?: string;
  conclusionCode?: CodeableConcept[];
  presentedForm?: Attachment[];
}

// ---------------------------------------------------------------------------
// Discriminated union of all EyeD resource types
// ---------------------------------------------------------------------------

export type FhirResource =
  | Patient
  | AllergyIntolerance
  | Condition
  | MedicationStatement
  | Observation
  | Procedure
  | Immunization
  | DocumentReference
  | DiagnosticReport;

export type ResourceType = FhirResource["resourceType"];

export const RESOURCE_TYPES: readonly ResourceType[] = [
  "Patient",
  "AllergyIntolerance",
  "Condition",
  "MedicationStatement",
  "Observation",
  "Procedure",
  "Immunization",
  "DocumentReference",
  "DiagnosticReport",
] as const;
