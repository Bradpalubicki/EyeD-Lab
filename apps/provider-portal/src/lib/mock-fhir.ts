// src/lib/mock-fhir.ts
// SYNTHETIC DEMO DATA ONLY — no real patient information

export interface MockMedication {
  name: string;
  dosage: string;
  indication: string;
  rxnormCode?: string;
}

export interface MockAllergy {
  substance: string;
  reaction: string;
  severity: "mild" | "moderate" | "severe";
}

export interface MockCondition {
  name: string;
  status: "active" | "resolved";
  onsetYear?: number;
  icdCode?: string;
}

export interface MockLabResult {
  name: string;
  value: string;
  date: string;
  status: "normal" | "abnormal" | "critical";
  referenceRange?: string;
}

export interface MockVital {
  name: string;
  value: string;
  date: string;
}

export interface MockPatient {
  mrn: string;
  name: string;
  dob: string;
  age: number;
  gender: "male" | "female" | "other";
  bloodType: string;
  primaryProvider: string;
  medications: MockMedication[];
  allergies: MockAllergy[];
  conditions: MockCondition[];
  labs: MockLabResult[];
  vitals: MockVital[];
  lastVisit: string;
}

export interface MockFhirBundle {
  patient: MockPatient;
}

// Patient 1: PIN 123456 — complex multi-morbidity with warfarin/aspirin interaction
const PATIENT_THORNTON: MockPatient = {
  mrn: "MRN-DEMO-001",
  name: "James A. Thornton",
  dob: "1968-04-15",
  age: 57,
  gender: "male",
  bloodType: "O+",
  primaryProvider: "Dr. Elena Vasquez, MD",
  medications: [
    { name: "Metformin", dosage: "500mg twice daily", indication: "Type 2 Diabetes", rxnormCode: "860975" },
    { name: "Lisinopril", dosage: "10mg once daily", indication: "Hypertension", rxnormCode: "314076" },
    { name: "Atorvastatin", dosage: "20mg at bedtime", indication: "Hyperlipidemia", rxnormCode: "617311" },
    { name: "Warfarin", dosage: "5mg once daily", indication: "Atrial Fibrillation / DVT prophylaxis", rxnormCode: "855332" },
    { name: "Aspirin", dosage: "81mg once daily", indication: "Cardiovascular protection", rxnormCode: "243670" },
  ],
  allergies: [
    { substance: "Penicillin", reaction: "Anaphylaxis — hives, throat swelling", severity: "severe" },
    { substance: "Sulfonamides", reaction: "Rash, pruritus", severity: "moderate" },
  ],
  conditions: [
    { name: "Type 2 Diabetes Mellitus", status: "active", onsetYear: 2015, icdCode: "E11.9" },
    { name: "Hypertension", status: "active", onsetYear: 2012, icdCode: "I10" },
    { name: "Hyperlipidemia", status: "active", onsetYear: 2014, icdCode: "E78.5" },
    { name: "Atrial Fibrillation", status: "active", onsetYear: 2022, icdCode: "I48.91" },
    { name: "Appendectomy", status: "resolved", onsetYear: 1995, icdCode: "Z87.39" },
  ],
  labs: [
    { name: "HbA1c", value: "7.8%", date: "2025-11-10", status: "abnormal", referenceRange: "< 5.7% normal; < 7.0% target for diabetics" },
    { name: "INR (Warfarin monitoring)", value: "2.4", date: "2025-12-01", status: "normal", referenceRange: "2.0–3.0 therapeutic for AF" },
    { name: "LDL Cholesterol", value: "98 mg/dL", date: "2025-11-10", status: "normal", referenceRange: "< 100 mg/dL target" },
    { name: "eGFR", value: "62 mL/min/1.73m²", date: "2025-11-10", status: "abnormal", referenceRange: "> 60 normal; 45-59 = stage 3a CKD" },
    { name: "Blood Pressure", value: "138/88 mmHg", date: "2025-12-01", status: "abnormal", referenceRange: "< 130/80 target" },
  ],
  vitals: [
    { name: "Weight", value: "198 lbs (89.8 kg)", date: "2025-12-01" },
    { name: "BMI", value: "28.4", date: "2025-12-01" },
    { name: "Heart Rate", value: "78 bpm (irregular)", date: "2025-12-01" },
  ],
  lastVisit: "2025-12-01",
};

// Patient 2: PIN 654321 — mental health profile with sulfa allergy
const PATIENT_CHEN: MockPatient = {
  mrn: "MRN-DEMO-002",
  name: "Sarah M. Chen",
  dob: "2001-09-22",
  age: 24,
  gender: "female",
  bloodType: "A-",
  primaryProvider: "Dr. Marcus Webb, DO",
  medications: [
    { name: "Sertraline", dosage: "50mg once daily", indication: "Major Depressive Disorder", rxnormCode: "616402" },
    { name: "Oral Contraceptive (Levonorgestrel/Ethinyl Estradiol)", dosage: "0.15mg/0.03mg once daily", indication: "Contraception", rxnormCode: "748945" },
    { name: "Lorazepam", dosage: "0.5mg as needed (max 2x/week)", indication: "Acute anxiety", rxnormCode: "311700" },
  ],
  allergies: [
    { substance: "Sulfonamides (Bactrim)", reaction: "Severe rash, fever", severity: "severe" },
    { substance: "Latex", reaction: "Contact dermatitis", severity: "mild" },
  ],
  conditions: [
    { name: "Major Depressive Disorder, recurrent", status: "active", onsetYear: 2020, icdCode: "F33.1" },
    { name: "Generalized Anxiety Disorder", status: "active", onsetYear: 2019, icdCode: "F41.1" },
    { name: "Migraines without aura", status: "active", onsetYear: 2018, icdCode: "G43.009" },
  ],
  labs: [
    { name: "TSH", value: "2.1 mIU/L", date: "2025-10-05", status: "normal", referenceRange: "0.4–4.0 mIU/L" },
    { name: "CBC — WBC", value: "6.8 K/uL", date: "2025-10-05", status: "normal", referenceRange: "4.5–11.0 K/uL" },
    { name: "Vitamin D (25-OH)", value: "18 ng/mL", date: "2025-10-05", status: "abnormal", referenceRange: "30–100 ng/mL" },
  ],
  vitals: [
    { name: "Weight", value: "132 lbs (59.9 kg)", date: "2025-10-05" },
    { name: "BMI", value: "22.1", date: "2025-10-05" },
    { name: "Blood Pressure", value: "112/72 mmHg", date: "2025-10-05" },
  ],
  lastVisit: "2025-10-05",
};

const PATIENT_DEFAULT: MockPatient = {
  mrn: "MRN-DEMO-000",
  name: "Demo Patient",
  dob: "1985-01-01",
  age: 40,
  gender: "other",
  bloodType: "Unknown",
  primaryProvider: "Unassigned",
  medications: [],
  allergies: [],
  conditions: [],
  labs: [],
  vitals: [],
  lastVisit: "2025-01-01",
};

const PATIENT_MAP: Record<string, MockPatient> = {
  "123456": PATIENT_THORNTON,
  "654321": PATIENT_CHEN,
};

export function getMockPatient(sessionId: string): MockFhirBundle {
  const patient = PATIENT_MAP[sessionId] ?? PATIENT_DEFAULT;
  return { patient };
}
