-- ============================================================
-- particle_access_logs
-- Immutable audit trail for every Particle Health data access.
-- HIPAA minimum 6-year retention.
-- NO UPDATE, NO DELETE — append-only enforced via RLS + trigger.
-- ============================================================

CREATE TABLE IF NOT EXISTS particle_access_logs (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp                TIMESTAMPTZ NOT NULL DEFAULT now(),
  accessing_user_id        TEXT NOT NULL,
  accessing_user_name      TEXT NOT NULL,
  clinic_id                TEXT NOT NULL,
  clinic_npi               TEXT,
  patient_id               TEXT NOT NULL,
  particle_patient_id      TEXT NOT NULL,
  query_id                 TEXT,
  purpose_of_use           TEXT NOT NULL DEFAULT 'TREATMENT',
  data_formats_retrieved   TEXT[],
  patient_confirmed        BOOLEAN NOT NULL DEFAULT false,
  confirmation_timestamp   TIMESTAMPTZ,
  signal_event_type        TEXT CHECK (signal_event_type IN ('TRANSITION', 'ENCOUNTER', 'DISCHARGE', 'REFERRAL')),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_pal_patient_id          ON particle_access_logs (patient_id);
CREATE INDEX IF NOT EXISTS idx_pal_particle_patient_id ON particle_access_logs (particle_patient_id);
CREATE INDEX IF NOT EXISTS idx_pal_clinic_id           ON particle_access_logs (clinic_id);
CREATE INDEX IF NOT EXISTS idx_pal_timestamp           ON particle_access_logs (timestamp DESC);

-- Prevent any UPDATE or DELETE — immutable audit log
CREATE OR REPLACE FUNCTION particle_access_logs_immutable()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'particle_access_logs is immutable — UPDATE and DELETE are not permitted';
END;
$$;

DROP TRIGGER IF EXISTS trg_pal_no_update ON particle_access_logs;
CREATE TRIGGER trg_pal_no_update
  BEFORE UPDATE ON particle_access_logs
  FOR EACH ROW EXECUTE FUNCTION particle_access_logs_immutable();

DROP TRIGGER IF EXISTS trg_pal_no_delete ON particle_access_logs;
CREATE TRIGGER trg_pal_no_delete
  BEFORE DELETE ON particle_access_logs
  FOR EACH ROW EXECUTE FUNCTION particle_access_logs_immutable();

-- RLS: enable row-level security
ALTER TABLE particle_access_logs ENABLE ROW LEVEL SECURITY;

-- Admins (service role) can read all rows
CREATE POLICY "admins_read_all" ON particle_access_logs
  FOR SELECT
  USING (true);

-- No user-level writes via RLS — only service role (backend) can INSERT
-- (Supabase service role bypasses RLS by default)
CREATE POLICY "no_user_writes" ON particle_access_logs
  FOR INSERT
  WITH CHECK (false);

-- Also add Signal subscription tracking columns to patients table if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'patients') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'signal_subscribed') THEN
      ALTER TABLE patients ADD COLUMN signal_subscribed BOOLEAN NOT NULL DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'signal_subscribed_at') THEN
      ALTER TABLE patients ADD COLUMN signal_subscribed_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'last_signal_event') THEN
      ALTER TABLE patients ADD COLUMN last_signal_event TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'last_signal_event_type') THEN
      ALTER TABLE patients ADD COLUMN last_signal_event_type TEXT CHECK (last_signal_event_type IN ('TRANSITION', 'ENCOUNTER', 'DISCHARGE', 'REFERRAL'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'patients' AND column_name = 'monitoring_days_this_period') THEN
      ALTER TABLE patients ADD COLUMN monitoring_days_this_period INTEGER NOT NULL DEFAULT 0;
    END IF;
  END IF;
END;
$$;

-- RPC helper: increment monitoring days (called from webhook handler)
CREATE OR REPLACE FUNCTION increment_monitoring_days(patient_id TEXT)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE patients
  SET monitoring_days_this_period = monitoring_days_this_period + 1
  WHERE id = patient_id;
END;
$$;

-- particle_webhook_events — raw log of every inbound webhook
CREATE TABLE IF NOT EXISTS particle_webhook_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  TEXT NOT NULL,
  payload     JSONB NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pwe_event_type  ON particle_webhook_events (event_type);
CREATE INDEX IF NOT EXISTS idx_pwe_received_at ON particle_webhook_events (received_at DESC);

-- particle_snapshots — AI summary outputs from Particle Snapshot
CREATE TABLE IF NOT EXISTS particle_snapshots (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_output_id         TEXT NOT NULL UNIQUE,
  output_type          TEXT NOT NULL,
  particle_patient_id  TEXT,
  summary              JSONB NOT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ps_particle_patient_id ON particle_snapshots (particle_patient_id);
