/**
 * NFC data layout types for NTAG216 (888 bytes).
 * Defines the structured medical profile stored on-tag.
 */

export enum BloodType {
  O_NEG = 0,
  O_POS = 1,
  A_NEG = 2,
  A_POS = 3,
  B_NEG = 4,
  B_POS = 5,
  AB_NEG = 6,
  AB_POS = 7,
  UNKNOWN = 8,
}

export enum Severity {
  MILD = 0,
  MODERATE = 1,
  SEVERE = 2,
  LIFE_THREATENING = 3,
}

export enum MedFrequency {
  ONCE_DAILY = 0,
  TWICE_DAILY = 1,
  THREE_DAILY = 2,
  FOUR_DAILY = 3,
  AS_NEEDED = 4,
  WEEKLY = 5,
  MONTHLY = 6,
  OTHER = 7,
}

export interface Allergy {
  name: string;
  severity: Severity;
}

export interface Medication {
  name: string;
  dosageMg: number;
  frequency: MedFrequency;
}

export interface Condition {
  name: string;
  severity: Severity;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface NFCProfile {
  protocolVersion: number;
  flags: number;
  patientIdHash: Buffer;
  bloodType: BloodType;
  allergies: Allergy[];
  medications: Medication[];
  conditions: Condition[];
  emergencyContacts: EmergencyContact[];
  emergencyUrl: string;
}
