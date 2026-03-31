-- ============================================================
-- EyeD-Lab: Men's Health / TRT Clinic — Initial Schema
-- Migration: 001_initial_schema.sql
-- All data in this system is SYNTHETIC TRAINING DATA ONLY
-- ============================================================

-- -----------------------------------------------
-- PROVIDERS
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS providers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code              TEXT UNIQUE NOT NULL,
  first_name        TEXT NOT NULL,
  last_name         TEXT NOT NULL,
  title             TEXT NOT NULL, -- MD, DO, NP, PA
  specialty         TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- -----------------------------------------------
-- PATIENTS
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS patients (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chart_number          TEXT UNIQUE NOT NULL,
  mrn                   TEXT UNIQUE NOT NULL, -- format: MRN-TRAIN-XXX
  first_name            TEXT NOT NULL,
  last_name             TEXT NOT NULL,
  dob                   DATE NOT NULL,
  age                   INTEGER NOT NULL,
  gender                TEXT NOT NULL,
  blood_type            TEXT,
  phone                 TEXT,
  email                 TEXT,
  primary_provider_id   UUID REFERENCES providers(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_patients_chart_number ON patients(chart_number);
CREATE INDEX IF NOT EXISTS idx_patients_mrn ON patients(mrn);

-- -----------------------------------------------
-- MEDICATIONS
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS medications (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id                UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name                      TEXT NOT NULL,
  dosage                    TEXT NOT NULL,
  frequency                 TEXT NOT NULL,
  route                     TEXT NOT NULL, -- oral, injection, topical, pellet
  indication                TEXT,
  prescribing_provider_id   UUID REFERENCES providers(id),
  start_date                DATE NOT NULL,
  end_date                  DATE,
  status                    TEXT NOT NULL DEFAULT 'active', -- active, discontinued, on_hold
  created_at                TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_medications_patient_id ON medications(patient_id);

-- -----------------------------------------------
-- CONDITIONS
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS conditions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  icd10_code    TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'active', -- active, resolved, chronic
  onset_year    INTEGER,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conditions_patient_id ON conditions(patient_id);

-- -----------------------------------------------
-- ALLERGIES
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS allergies (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id    UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  substance     TEXT NOT NULL,
  reaction      TEXT NOT NULL,
  severity      TEXT NOT NULL, -- mild, moderate, severe
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_allergies_patient_id ON allergies(patient_id);

-- -----------------------------------------------
-- LAB RESULTS
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS lab_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  test_name         TEXT NOT NULL,
  value             TEXT NOT NULL,
  unit              TEXT NOT NULL,
  reference_range   TEXT,
  status            TEXT NOT NULL, -- normal, abnormal, critical
  collected_date    DATE NOT NULL,
  resulted_date     DATE NOT NULL,
  ordered_by_id     UUID REFERENCES providers(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lab_results_patient_id ON lab_results(patient_id);
CREATE INDEX IF NOT EXISTS idx_lab_results_collected_date ON lab_results(collected_date);

-- -----------------------------------------------
-- VITALS
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS vitals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id        UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  recorded_date     DATE NOT NULL,
  weight_lbs        NUMERIC(6,1),
  height_inches     NUMERIC(5,1),
  bmi               NUMERIC(5,1),
  bp_systolic       INTEGER,
  bp_diastolic      INTEGER,
  heart_rate        INTEGER,
  recorded_by_id    UUID REFERENCES providers(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vitals_patient_id ON vitals(patient_id);

-- -----------------------------------------------
-- TREATMENT SESSIONS
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS treatment_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  provider_id           UUID REFERENCES providers(id),
  session_date          DATE NOT NULL,
  session_type          TEXT NOT NULL, -- tcyp_injection, pellet_insertion, shockwave, eros, follow_up, initial_visit
  side                  TEXT,          -- left, right, bilateral
  dosage_mg             NUMERIC(6,2),  -- for TCYP injections
  pellet_count          INTEGER,
  testosterone_total    NUMERIC(7,2),  -- ng/dL at time of treatment
  notes                 TEXT,
  signed_at             TIMESTAMPTZ,
  signed_by_id          UUID REFERENCES providers(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_treatment_sessions_patient_id ON treatment_sessions(patient_id);

-- -----------------------------------------------
-- ACCESS SESSIONS (QR / PIN sharing)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS access_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id            UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  session_pin           TEXT NOT NULL,
  provider_accessed_by  TEXT,
  scope                 TEXT[] NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at            TIMESTAMPTZ NOT NULL,
  accessed_at           TIMESTAMPTZ,
  revoked_at            TIMESTAMPTZ,
  status                TEXT NOT NULL DEFAULT 'active' -- active, expired, revoked, accessed
);

CREATE INDEX IF NOT EXISTS idx_access_sessions_patient_id ON access_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_access_sessions_session_pin ON access_sessions(session_pin);
CREATE INDEX IF NOT EXISTS idx_access_sessions_status ON access_sessions(status);

-- -----------------------------------------------
-- AUDIT LOG
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    TEXT NOT NULL, -- patient_viewed, summary_generated, session_created, session_accessed, session_revoked
  patient_id    UUID REFERENCES patients(id),
  actor_id      TEXT NOT NULL,
  actor_type    TEXT NOT NULL, -- provider, patient, system
  details       JSONB NOT NULL DEFAULT '{}',
  ip_address    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_patient_id ON audit_log(patient_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at);
