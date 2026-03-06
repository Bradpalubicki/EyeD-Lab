import type {
  AllergyIntolerance,
  AllergyCategory,
  AllergySeverity,
  CodeableConcept,
  Condition,
  HumanName,
  Identifier,
  MedicationStatement,
  MedicationStatementStatus,
  Patient,
  Reference,
  Dosage,
} from "./types.js";

// ---------------------------------------------------------------------------
// Helpers to build common sub-structures
// ---------------------------------------------------------------------------

function codeableConcept(text: string, code?: string, system?: string): CodeableConcept {
  const cc: CodeableConcept = { text };
  if (code) {
    cc.coding = [{ code, display: text, ...(system ? { system } : {}) }];
  }
  return cc;
}

function ref(reference: string, display?: string): Reference {
  return { reference, ...(display ? { display } : {}) };
}

// ---------------------------------------------------------------------------
// Factory: Patient
// ---------------------------------------------------------------------------

export interface CreatePatientInput {
  id?: string;
  given: string[];
  family: string;
  birthDate?: string;
  gender?: Patient["gender"];
  identifier?: Identifier[];
  phone?: string;
  email?: string;
}

export function createPatient(data: CreatePatientInput): Patient {
  const name: HumanName = {
    use: "official",
    family: data.family,
    given: data.given,
  };

  const patient: Patient = {
    resourceType: "Patient",
    ...(data.id ? { id: data.id } : {}),
    active: true,
    name: [name],
    ...(data.birthDate ? { birthDate: data.birthDate } : {}),
    ...(data.gender ? { gender: data.gender } : {}),
    ...(data.identifier ? { identifier: data.identifier } : {}),
  };

  const telecom: Patient["telecom"] = [];
  if (data.phone) telecom.push({ system: "phone", value: data.phone, use: "home" });
  if (data.email) telecom.push({ system: "email", value: data.email, use: "home" });
  if (telecom.length > 0) patient.telecom = telecom;

  return patient;
}

// ---------------------------------------------------------------------------
// Factory: AllergyIntolerance
// ---------------------------------------------------------------------------

export interface CreateAllergyIntoleranceInput {
  id?: string;
  patientRef: string;
  substance: string;
  substanceCode?: string;
  substanceSystem?: string;
  category?: AllergyCategory;
  criticality?: AllergyIntolerance["criticality"];
  reaction?: {
    manifestation: string;
    severity?: AllergySeverity;
  };
  recordedDate?: string;
}

export function createAllergyIntolerance(data: CreateAllergyIntoleranceInput): AllergyIntolerance {
  const allergy: AllergyIntolerance = {
    resourceType: "AllergyIntolerance",
    ...(data.id ? { id: data.id } : {}),
    clinicalStatus: codeableConcept("Active", "active", "http://terminology.hl7.org/CodeSystem/allergyintolerance-clinical"),
    verificationStatus: codeableConcept("Confirmed", "confirmed", "http://terminology.hl7.org/CodeSystem/allergyintolerance-verification"),
    type: "allergy",
    code: codeableConcept(data.substance, data.substanceCode, data.substanceSystem),
    patient: ref(data.patientRef),
    ...(data.category ? { category: [data.category] } : {}),
    ...(data.criticality ? { criticality: data.criticality } : {}),
    ...(data.recordedDate ? { recordedDate: data.recordedDate } : {}),
  };

  if (data.reaction) {
    allergy.reaction = [
      {
        manifestation: [codeableConcept(data.reaction.manifestation)],
        ...(data.reaction.severity ? { severity: data.reaction.severity } : {}),
      },
    ];
  }

  return allergy;
}

// ---------------------------------------------------------------------------
// Factory: Condition
// ---------------------------------------------------------------------------

export interface CreateConditionInput {
  id?: string;
  subjectRef: string;
  condition: string;
  conditionCode?: string;
  conditionSystem?: string;
  clinicalStatus?: string;
  onsetDateTime?: string;
  recordedDate?: string;
  severity?: string;
}

export function createCondition(data: CreateConditionInput): Condition {
  const status = data.clinicalStatus ?? "active";

  return {
    resourceType: "Condition",
    ...(data.id ? { id: data.id } : {}),
    clinicalStatus: codeableConcept(
      status.charAt(0).toUpperCase() + status.slice(1),
      status,
      "http://terminology.hl7.org/CodeSystem/condition-clinical",
    ),
    verificationStatus: codeableConcept("Confirmed", "confirmed", "http://terminology.hl7.org/CodeSystem/condition-ver-status"),
    code: codeableConcept(data.condition, data.conditionCode, data.conditionSystem),
    subject: ref(data.subjectRef),
    ...(data.onsetDateTime ? { onsetDateTime: data.onsetDateTime } : {}),
    ...(data.recordedDate ? { recordedDate: data.recordedDate } : {}),
    ...(data.severity ? { severity: codeableConcept(data.severity) } : {}),
  };
}

// ---------------------------------------------------------------------------
// Factory: MedicationStatement
// ---------------------------------------------------------------------------

export interface CreateMedicationStatementInput {
  id?: string;
  subjectRef: string;
  medication: string;
  medicationCode?: string;
  medicationSystem?: string;
  status?: MedicationStatementStatus;
  dosageText?: string;
  effectiveDateTime?: string;
  prescriberRef?: string;
}

export function createMedicationStatement(data: CreateMedicationStatementInput): MedicationStatement {
  const dosage: Dosage[] | undefined = data.dosageText
    ? [{ text: data.dosageText }]
    : undefined;

  return {
    resourceType: "MedicationStatement",
    ...(data.id ? { id: data.id } : {}),
    status: data.status ?? "active",
    medicationCodeableConcept: codeableConcept(data.medication, data.medicationCode, data.medicationSystem),
    subject: ref(data.subjectRef),
    ...(dosage ? { dosage } : {}),
    ...(data.effectiveDateTime ? { effectiveDateTime: data.effectiveDateTime } : {}),
    ...(data.prescriberRef ? { informationSource: ref(data.prescriberRef) } : {}),
  };
}
