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

export interface MockTreatmentSession {
  sessionDate: string;
  sessionType: string;
  productName?: string;
  dosageMg?: number | null;
  providerName?: string;
  notes?: string | null;
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
  treatmentSessions?: MockTreatmentSession[];
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

// Patient 3: PIN 111111 — Robert Mitchell (chart 90001) — TRT injection patient
const PATIENT_MITCHELL: MockPatient = {
  mrn: "MRN-TRAIN-001",
  name: "Robert Mitchell",
  dob: "1978-03-12",
  age: 47,
  gender: "male",
  bloodType: "O+",
  primaryProvider: "Don Foncree, MD",
  medications: [
    { name: "Testosterone Cypionate 200mg/mL", dosage: "1mL (200mg) every 10 days", indication: "Male Hypogonadism (E29.1)" },
    { name: "Anastrozole", dosage: "0.5mg twice weekly", indication: "Estrogen control during TRT" },
    { name: "Lisinopril", dosage: "10mg once daily", indication: "Hypertension" },
  ],
  allergies: [
    { substance: "Penicillin", reaction: "Hives, urticaria", severity: "moderate" },
  ],
  conditions: [
    { name: "Male Hypogonadism", status: "active", onsetYear: 2020, icdCode: "E29.1" },
    { name: "Hypertension", status: "active", onsetYear: 2018, icdCode: "I10" },
    { name: "Erectile Dysfunction", status: "active", onsetYear: 2019, icdCode: "N52.9" },
  ],
  labs: [
    { name: "Total Testosterone", value: "842 ng/dL", date: "2025-10-14", status: "normal", referenceRange: "300–1000 ng/dL" },
    { name: "Free Testosterone", value: "18.4 pg/mL", date: "2025-10-14", status: "normal", referenceRange: "9.0–30.0 pg/mL" },
    { name: "Estradiol (E2)", value: "28 pg/mL", date: "2025-10-14", status: "normal", referenceRange: "10–40 pg/mL" },
    { name: "PSA", value: "1.2 ng/mL", date: "2025-10-14", status: "normal", referenceRange: "< 4.0 ng/mL" },
    { name: "Hematocrit", value: "46%", date: "2025-10-14", status: "normal", referenceRange: "38.3–48.6%" },
    { name: "SHBG", value: "24 nmol/L", date: "2025-10-14", status: "normal", referenceRange: "10–57 nmol/L" },
  ],
  vitals: [
    { name: "Weight", value: "214 lbs", date: "2025-10-15" },
    { name: "BMI", value: "30.7", date: "2025-10-15" },
    { name: "Blood Pressure", value: "132/84 mmHg", date: "2025-10-15" },
    { name: "Heart Rate", value: "72 bpm", date: "2025-10-15" },
  ],
  lastVisit: "2025-10-15",
};

// Patient 4: PIN 222222 — James Crawford (chart 90002) — TRT + T2DM
const PATIENT_CRAWFORD: MockPatient = {
  mrn: "MRN-TRAIN-002",
  name: "James Crawford",
  dob: "1971-07-28",
  age: 53,
  gender: "male",
  bloodType: "A+",
  primaryProvider: "Don Foncree, MD",
  medications: [
    { name: "Testosterone Cypionate 200mg/mL", dosage: "0.8mL (160mg) every 7 days", indication: "Male Hypogonadism (E29.1)" },
    { name: "Anastrozole", dosage: "0.5mg twice weekly", indication: "Estrogen control during TRT" },
    { name: "Metformin", dosage: "1000mg twice daily", indication: "Type 2 Diabetes" },
    { name: "Atorvastatin", dosage: "40mg once daily at bedtime", indication: "Hyperlipidemia" },
  ],
  allergies: [
    { substance: "Sulfonamides", reaction: "Rash, fever", severity: "moderate" },
    { substance: "NSAIDs", reaction: "GI bleeding history", severity: "severe" },
  ],
  conditions: [
    { name: "Male Hypogonadism", status: "active", onsetYear: 2019, icdCode: "E29.1" },
    { name: "Type 2 Diabetes Mellitus", status: "active", onsetYear: 2016, icdCode: "E11.9" },
    { name: "Hyperlipidemia", status: "active", onsetYear: 2017, icdCode: "E78.5" },
    { name: "Obesity", status: "active", onsetYear: 2016, icdCode: "E66.9" },
  ],
  labs: [
    { name: "Total Testosterone", value: "764 ng/dL", date: "2025-10-30", status: "normal", referenceRange: "300–1000 ng/dL" },
    { name: "Estradiol (E2)", value: "38 pg/mL", date: "2025-10-30", status: "normal", referenceRange: "10–40 pg/mL" },
    { name: "PSA", value: "1.8 ng/mL", date: "2025-10-30", status: "normal", referenceRange: "< 4.0 ng/mL" },
    { name: "HbA1c", value: "7.4%", date: "2025-10-30", status: "abnormal", referenceRange: "< 5.7% normal; < 7.0% target for diabetics" },
    { name: "Hematocrit", value: "48%", date: "2025-10-30", status: "normal", referenceRange: "38.3–48.6%" },
    { name: "LDL Cholesterol", value: "112 mg/dL", date: "2025-10-30", status: "abnormal", referenceRange: "< 100 mg/dL target" },
  ],
  vitals: [
    { name: "Weight", value: "248 lbs", date: "2025-11-02" },
    { name: "BMI", value: "37.7", date: "2025-11-02" },
    { name: "Blood Pressure", value: "144/90 mmHg", date: "2025-11-02" },
    { name: "Heart Rate", value: "78 bpm", date: "2025-11-02" },
  ],
  lastVisit: "2025-11-02",
};

// Patient 5: PIN 333333 — David Holbrook (chart 90003) — TRT + shockwave therapy
const PATIENT_HOLBROOK: MockPatient = {
  mrn: "MRN-TRAIN-003",
  name: "David Holbrook",
  dob: "1984-11-05",
  age: 40,
  gender: "male",
  bloodType: "B+",
  primaryProvider: "Melissa Weets, NP",
  medications: [
    { name: "Testosterone Cypionate 200mg/mL", dosage: "1mL (200mg) every 14 days", indication: "Male Hypogonadism (E29.1)" },
    { name: "HCG", dosage: "500 IU three times weekly", indication: "Testicular function preservation" },
  ],
  allergies: [
    { substance: "Latex", reaction: "Contact dermatitis", severity: "mild" },
  ],
  conditions: [
    { name: "Male Hypogonadism", status: "active", onsetYear: 2022, icdCode: "E29.1" },
    { name: "Erectile Dysfunction", status: "active", onsetYear: 2021, icdCode: "N52.9" },
  ],
  labs: [
    { name: "Total Testosterone", value: "918 ng/dL", date: "2025-09-16", status: "normal", referenceRange: "300–1000 ng/dL" },
    { name: "Free Testosterone", value: "22.1 pg/mL", date: "2025-09-16", status: "normal", referenceRange: "9.0–30.0 pg/mL" },
    { name: "Estradiol (E2)", value: "34 pg/mL", date: "2025-09-16", status: "normal", referenceRange: "10–40 pg/mL" },
    { name: "PSA", value: "0.7 ng/mL", date: "2025-09-16", status: "normal", referenceRange: "< 4.0 ng/mL" },
    { name: "LH", value: "1.2 mIU/mL", date: "2025-09-16", status: "abnormal", referenceRange: "1.7–8.6 mIU/mL (suppressed on TRT expected)" },
    { name: "FSH", value: "0.8 mIU/mL", date: "2025-09-16", status: "abnormal", referenceRange: "1.5–12.4 mIU/mL (suppressed on TRT expected)" },
  ],
  vitals: [
    { name: "Weight", value: "186 lbs", date: "2025-09-18" },
    { name: "BMI", value: "25.2", date: "2025-09-18" },
    { name: "Blood Pressure", value: "124/80 mmHg", date: "2025-09-18" },
    { name: "Heart Rate", value: "68 bpm", date: "2025-09-18" },
  ],
  lastVisit: "2025-10-01",
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
  "111111": PATIENT_MITCHELL,
  "222222": PATIENT_CRAWFORD,
  "333333": PATIENT_HOLBROOK,
};

export function getMockPatient(sessionId: string): MockFhirBundle {
  const patient = PATIENT_MAP[sessionId] ?? PATIENT_DEFAULT;
  return { patient };
}
