'use client'
// src/components/ParticleHealthPanel.tsx
// Provider-facing panel: pull patient records from Particle Health (CommonWell + CareQuality)
// Displays FHIR resources returned from the national network

import { useState } from 'react'

interface Props {
  patientName: string
  patientDob: string
  patientGender: string
}

interface FhirEntry {
  resource: {
    resourceType: string
    // AllergyIntolerance
    code?: { coding?: Array<{ display?: string }>; text?: string }
    reaction?: Array<{ description?: string; severity?: string }>
    // Condition
    clinicalStatus?: { coding?: Array<{ code?: string }> }
    // MedicationRequest
    medicationCodeableConcept?: { text?: string; coding?: Array<{ display?: string }> }
    dosageInstruction?: Array<{ text?: string }>
    // Observation
    valueQuantity?: { value?: number; unit?: string }
    valueString?: string
    effectiveDateTime?: string
    // Immunization
    vaccineCode?: { text?: string; coding?: Array<{ display?: string }> }
    occurrenceDateTime?: string
    // shared
    onsetDateTime?: string
    recordedDate?: string
    subject?: { reference?: string }
  }
}

interface NetworkRecords {
  matched: boolean
  patientId?: string
  matchedName?: string
  records?: {
    allergies: { entry?: FhirEntry[] }
    conditions: { entry?: FhirEntry[] }
    medications: { entry?: FhirEntry[] }
    observations: { entry?: FhirEntry[] }
    immunizations: { entry?: FhirEntry[] }
  }
  message?: string
}

function entryCount(bundle?: { entry?: unknown[] }) {
  return bundle?.entry?.length ?? 0
}

export default function ParticleHealthPanel({ patientName, patientDob, patientGender }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [data, setData] = useState<NetworkRecords | null>(null)
  const [error, setError] = useState('')

  async function handlePull() {
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/particle/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: patientName,
          dob: patientDob,
          gender: patientGender,
        }),
      })
      const json = await res.json() as NetworkRecords & { error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Request failed')
      setData(json)
      setStatus('done')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  const teal = 'var(--teal)'
  const textPrimary = 'var(--text-primary)'
  const textSecondary = 'var(--text-secondary)'
  const textMuted = 'var(--text-muted)'
  const bgElevated = 'var(--bg-elevated)'

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="section-label" style={{ marginBottom: '4px' }}>National Health Network</div>
          <div style={{ fontSize: '12px', color: textMuted }}>
            CommonWell + CareQuality via Particle Health · 320M US patients · FHIR R4
          </div>
        </div>
        {status === 'idle' || status === 'error' ? (
          <button
            onClick={handlePull}
            style={{
              background: teal, color: '#000', border: 'none', borderRadius: '6px',
              padding: '8px 18px', fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Pull Records
          </button>
        ) : status === 'loading' ? (
          <div style={{ fontSize: '13px', color: teal }}>
            Querying network<span style={{ animation: 'blink 1s step-end infinite' }}>...</span>
          </div>
        ) : (
          <button
            onClick={handlePull}
            style={{
              background: 'transparent', color: teal, border: `1px solid ${teal}`,
              borderRadius: '6px', padding: '7px 16px', fontSize: '12px', cursor: 'pointer',
            }}
          >
            Refresh
          </button>
        )}
      </div>

      {/* Error */}
      {status === 'error' && (
        <div style={{ fontSize: '13px', color: 'rgb(239,68,68)', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* No match */}
      {status === 'done' && data && !data.matched && (
        <div style={{ fontSize: '13px', color: textMuted, padding: '10px 14px', background: bgElevated, borderRadius: '6px' }}>
          {data.message ?? 'No matching records found in the national network for this patient.'}
        </div>
      )}

      {/* Match found */}
      {status === 'done' && data?.matched && data.records && (
        <>
          {/* Match badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '8px 14px', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '6px' }}>
            <span style={{ color: 'rgb(20,184,166)', fontWeight: 700 }}>✓</span>
            <span style={{ fontSize: '13px', color: textPrimary }}>
              Matched: <strong>{data.matchedName}</strong>
            </span>
            <code style={{ fontSize: '11px', color: textMuted, marginLeft: 'auto', fontFamily: 'monospace' }}>
              {data.patientId}
            </code>
          </div>

          {/* Record counts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', marginBottom: '20px' }}>
            {[
              { label: 'Allergies', count: entryCount(data.records.allergies) },
              { label: 'Conditions', count: entryCount(data.records.conditions) },
              { label: 'Medications', count: entryCount(data.records.medications) },
              { label: 'Observations', count: entryCount(data.records.observations) },
              { label: 'Immunizations', count: entryCount(data.records.immunizations) },
            ].map(({ label, count }) => (
              <div key={label} style={{ background: bgElevated, borderRadius: '6px', padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: 700, color: count > 0 ? teal : textMuted, fontFamily: 'monospace' }}>{count}</div>
                <div style={{ fontSize: '10px', color: textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: '2px' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Allergies */}
          {(data.records.allergies.entry?.length ?? 0) > 0 && (
            <Section label="Allergies (Network)">
              {data.records.allergies.entry!.map((e, i) => {
                const r = e.resource
                const name = r.code?.text ?? r.code?.coding?.[0]?.display ?? 'Unknown'
                const reaction = r.reaction?.[0]?.description ?? ''
                const severity = r.reaction?.[0]?.severity ?? ''
                return (
                  <Row key={i}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>{name}</div>
                      {reaction && <div style={{ fontSize: '12px', color: textSecondary, marginTop: '2px' }}>{reaction}</div>}
                    </div>
                    {severity && <Pill label={severity} />}
                  </Row>
                )
              })}
            </Section>
          )}

          {/* Conditions */}
          {(data.records.conditions.entry?.length ?? 0) > 0 && (
            <Section label="Conditions (Network)">
              {data.records.conditions.entry!.map((e, i) => {
                const r = e.resource
                const name = (r.code as { text?: string; coding?: Array<{ display?: string }> } | undefined)?.text ??
                  (r.code as { text?: string; coding?: Array<{ display?: string }> } | undefined)?.coding?.[0]?.display ?? 'Unknown'
                const status = r.clinicalStatus?.coding?.[0]?.code ?? 'unknown'
                return (
                  <Row key={i}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>{name}</div>
                    <Pill label={status} />
                  </Row>
                )
              })}
            </Section>
          )}

          {/* Medications */}
          {(data.records.medications.entry?.length ?? 0) > 0 && (
            <Section label="Medications (Network)">
              {data.records.medications.entry!.map((e, i) => {
                const r = e.resource
                const name = r.medicationCodeableConcept?.text ??
                  r.medicationCodeableConcept?.coding?.[0]?.display ?? 'Unknown'
                const dosage = r.dosageInstruction?.[0]?.text ?? ''
                return (
                  <Row key={i}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>{name}</div>
                      {dosage && <div style={{ fontSize: '12px', color: textSecondary, marginTop: '2px' }}>{dosage}</div>}
                    </div>
                  </Row>
                )
              })}
            </Section>
          )}

          {/* Immunizations */}
          {(data.records.immunizations.entry?.length ?? 0) > 0 && (
            <Section label="Immunizations (Network)">
              {data.records.immunizations.entry!.map((e, i) => {
                const r = e.resource
                const vaccine = r.vaccineCode?.text ?? r.vaccineCode?.coding?.[0]?.display ?? 'Unknown'
                const date = r.occurrenceDateTime ? new Date(r.occurrenceDateTime).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''
                return (
                  <Row key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: 'rgb(16,185,129)', fontWeight: 700, fontSize: '13px' }}>✓</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>{vaccine}</span>
                    </div>
                    {date && <div style={{ fontSize: '12px', color: textSecondary, fontFamily: 'monospace', flexShrink: 0 }}>{date}</div>}
                  </Row>
                )
              })}
            </Section>
          )}

          {/* No records despite match */}
          {Object.values(data.records).every(b => (b as { entry?: unknown[] }).entry?.length === 0) && (
            <div style={{ fontSize: '13px', color: textMuted, padding: '10px 14px', background: bgElevated, borderRadius: '6px' }}>
              Patient matched but no clinical records returned from network yet. Try refreshing in a moment.
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '8px' }}>
        {label}
      </div>
      {children}
    </div>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return (
    <div className="data-row" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
      {children}
    </div>
  )
}

function Pill({ label }: { label: string }) {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    severe: { bg: 'rgba(239,68,68,0.12)', color: 'rgb(239,68,68)', border: 'rgba(239,68,68,0.3)' },
    moderate: { bg: 'rgba(245,158,11,0.12)', color: 'rgb(245,158,11)', border: 'rgba(245,158,11,0.3)' },
    mild: { bg: 'rgba(16,185,129,0.12)', color: 'rgb(16,185,129)', border: 'rgba(16,185,129,0.3)' },
    active: { bg: 'rgba(20,184,166,0.1)', color: 'rgb(20,184,166)', border: 'rgba(20,184,166,0.2)' },
    resolved: { bg: 'rgba(100,116,139,0.1)', color: 'rgb(100,116,139)', border: 'rgba(100,116,139,0.2)' },
    inactive: { bg: 'rgba(100,116,139,0.1)', color: 'rgb(100,116,139)', border: 'rgba(100,116,139,0.2)' },
  }
  const style = colors[label.toLowerCase()] ?? { bg: 'rgba(100,116,139,0.1)', color: 'rgb(100,116,139)', border: 'rgba(100,116,139,0.2)' }
  return (
    <span style={{
      fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: '999px',
      background: style.bg, color: style.color, border: `1px solid ${style.border}`,
      textTransform: 'capitalize', flexShrink: 0,
    }}>
      {label}
    </span>
  )
}
