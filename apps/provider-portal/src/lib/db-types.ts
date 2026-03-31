// src/lib/db-types.ts
// Auto-generated TypeScript interfaces matching 001_initial_schema.sql
// ALL DATA IN THIS SYSTEM IS SYNTHETIC TRAINING DATA ONLY

export interface Provider {
  id: string;
  code: string;
  first_name: string;
  last_name: string;
  title: string; // MD, DO, NP, PA
  specialty: string;
  created_at: string;
}

export interface Patient {
  id: string;
  chart_number: string;
  mrn: string; // format: MRN-TRAIN-XXX
  first_name: string;
  last_name: string;
  dob: string; // ISO date string
  age: number;
  gender: string;
  blood_type: string | null;
  phone: string | null;
  email: string | null;
  primary_provider_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  patient_id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string; // oral, injection, topical, pellet
  indication: string | null;
  prescribing_provider_id: string | null;
  start_date: string; // ISO date string
  end_date: string | null;
  status: 'active' | 'discontinued' | 'on_hold';
  created_at: string;
}

export interface Condition {
  id: string;
  patient_id: string;
  name: string;
  icd10_code: string;
  status: 'active' | 'resolved' | 'chronic';
  onset_year: number | null;
  notes: string | null;
  created_at: string;
}

export interface Allergy {
  id: string;
  patient_id: string;
  substance: string;
  reaction: string;
  severity: 'mild' | 'moderate' | 'severe';
  created_at: string;
}

export interface LabResult {
  id: string;
  patient_id: string;
  test_name: string;
  value: string;
  unit: string;
  reference_range: string | null;
  status: 'normal' | 'abnormal' | 'critical';
  collected_date: string; // ISO date string
  resulted_date: string;  // ISO date string
  ordered_by_id: string | null;
  created_at: string;
}

export interface Vital {
  id: string;
  patient_id: string;
  recorded_date: string; // ISO date string
  weight_lbs: number | null;
  height_inches: number | null;
  bmi: number | null;
  bp_systolic: number | null;
  bp_diastolic: number | null;
  heart_rate: number | null;
  recorded_by_id: string | null;
  created_at: string;
}

export type TreatmentSessionType =
  | 'tcyp_injection'
  | 'pellet_insertion'
  | 'shockwave'
  | 'eros'
  | 'follow_up'
  | 'initial_visit';

export interface TreatmentSession {
  id: string;
  patient_id: string;
  provider_id: string | null;
  session_date: string; // ISO date string
  session_type: TreatmentSessionType;
  side: 'left' | 'right' | 'bilateral' | null;
  dosage_mg: number | null;
  pellet_count: number | null;
  testosterone_total: number | null; // ng/dL at time of treatment
  notes: string | null;
  signed_at: string | null;
  signed_by_id: string | null;
  created_at: string;
}

export type AccessSessionStatus = 'active' | 'expired' | 'revoked' | 'accessed';

export interface AccessSession {
  id: string;
  patient_id: string;
  session_pin: string; // 6-digit PIN
  provider_accessed_by: string | null;
  scope: string[];
  created_at: string;
  expires_at: string;
  accessed_at: string | null;
  revoked_at: string | null;
  status: AccessSessionStatus;
}

export type AuditEventType =
  | 'patient_viewed'
  | 'summary_generated'
  | 'session_created'
  | 'session_accessed'
  | 'session_revoked';

export type ActorType = 'provider' | 'patient' | 'system';

export interface AuditLog {
  id: string;
  event_type: AuditEventType;
  patient_id: string | null;
  actor_id: string;
  actor_type: ActorType;
  details: Record<string, unknown>;
  ip_address: string | null;
  created_at: string;
}

// -----------------------------------------------
// Joined / view types for UI convenience
// -----------------------------------------------

export interface PatientWithProvider extends Patient {
  provider?: Provider;
}

export interface TreatmentSessionWithProvider extends TreatmentSession {
  provider?: Provider;
  signed_by?: Provider;
}

export interface LabResultWithProvider extends LabResult {
  ordered_by?: Provider;
}

export interface VitalWithProvider extends Vital {
  recorded_by?: Provider;
}

// Full patient record for summary views
export interface PatientRecord {
  patient: PatientWithProvider;
  conditions: Condition[];
  medications: Medication[];
  allergies: Allergy[];
  labs: LabResult[];
  vitals: Vital[];
  treatment_sessions: TreatmentSessionWithProvider[];
}
