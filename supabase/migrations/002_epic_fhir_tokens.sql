-- Migration 002: Add Epic FHIR OAuth token columns to access_sessions
ALTER TABLE access_sessions
  ADD COLUMN IF NOT EXISTS epic_access_token  text,
  ADD COLUMN IF NOT EXISTS epic_patient_id    text,
  ADD COLUMN IF NOT EXISTS epic_token_expires_at timestamptz;

-- Index for fast lookup by epic_patient_id
CREATE INDEX IF NOT EXISTS idx_access_sessions_epic_patient
  ON access_sessions(epic_patient_id)
  WHERE epic_patient_id IS NOT NULL;
