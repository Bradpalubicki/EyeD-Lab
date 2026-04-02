'use client'
// src/components/RecordSourcesPanel.tsx
// Unified panel showing all health record sources: Epic FHIR, Particle Health,
// Google Health (Android export), and Apple Health (iOS export)

import { useState, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FhirEntry {
  resource: Record<string, unknown>
}

interface NetworkRecords {
  matched: boolean
  needsClientId?: boolean
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
  error?: string
}

interface ParsedHealthRecord {
  allergies: string[]
  conditions: string[]
  medications: string[]
  immunizations: string[]
  observations: string[]
}

type SourceStatus = 'idle' | 'loading' | 'done' | 'error' | 'needs_setup'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  patientName: string
  patientDob: string
  patientGender: string
  // Epic data already fetched server-side — pass it down
  epicSource?: 'live' | 'none'
  epicScopes?: string[]
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function RecordSourcesPanel({
  patientName,
  patientDob,
  patientGender,
  epicSource = 'none',
}: Props) {
  const [particleStatus, setParticleStatus] = useState<SourceStatus>('idle')
  const [particleData, setParticleData] = useState<NetworkRecords | null>(null)
  const [particleError, setParticleError] = useState('')

  const [appleStatus, setAppleStatus] = useState<SourceStatus>('idle')
  const [appleRecords, setAppleRecords] = useState<ParsedHealthRecord | null>(null)

  const [googleStatus, setGoogleStatus] = useState<SourceStatus>('idle')
  const [googleRecords, setGoogleRecords] = useState<ParsedHealthRecord | null>(null)

  const appleInputRef = useRef<HTMLInputElement>(null)
  const googleInputRef = useRef<HTMLInputElement>(null)

  // ── Particle Health ──────────────────────────────────────────────────────────

  async function pullParticle() {
    setParticleStatus('loading')
    setParticleError('')
    try {
      const res = await fetch('/api/particle/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: patientName, dob: patientDob, gender: patientGender }),
      })
      const json = await res.json() as NetworkRecords
      if (json.needsClientId) {
        setParticleStatus('needs_setup')
        setParticleData(json)
        return
      }
      if (!res.ok) throw new Error(json.error ?? 'Request failed')
      setParticleData(json)
      setParticleStatus('done')
    } catch (err) {
      setParticleError(err instanceof Error ? err.message : 'Unknown error')
      setParticleStatus('error')
    }
  }

  // ── File parsers (Apple / Google export CCD or FHIR JSON) ────────────────────

  async function parseHealthFile(
    file: File,
    setter: (r: ParsedHealthRecord) => void,
    setStatus: (s: SourceStatus) => void
  ) {
    setStatus('loading')
    try {
      const text = await file.text()
      let parsed: ParsedHealthRecord

      if (file.name.endsWith('.json')) {
        parsed = parseFhirJson(text)
      } else if (file.name.endsWith('.xml') || file.name.endsWith('.ccd') || file.name.endsWith('.ccda')) {
        parsed = parseCcdXml(text)
      } else {
        // Try JSON first, then XML
        try { parsed = parseFhirJson(text) }
        catch { parsed = parseCcdXml(text) }
      }

      setter(parsed)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  function parseFhirJson(text: string): ParsedHealthRecord {
    const bundle = JSON.parse(text) as { entry?: Array<{ resource: Record<string, unknown> }> }
    const result: ParsedHealthRecord = { allergies: [], conditions: [], medications: [], immunizations: [], observations: [] }

    for (const entry of bundle.entry ?? []) {
      const r = entry.resource
      const type = r.resourceType as string

      if (type === 'AllergyIntolerance') {
        const code = r.code as { text?: string; coding?: Array<{ display?: string }> } | undefined
        const name = code?.text ?? code?.coding?.[0]?.display ?? 'Unknown allergy'
        result.allergies.push(name)
      } else if (type === 'Condition') {
        const code = r.code as { text?: string; coding?: Array<{ display?: string }> } | undefined
        result.conditions.push(code?.text ?? code?.coding?.[0]?.display ?? 'Unknown condition')
      } else if (type === 'MedicationRequest' || type === 'MedicationStatement') {
        const med = r.medicationCodeableConcept as { text?: string; coding?: Array<{ display?: string }> } | undefined
        result.medications.push(med?.text ?? med?.coding?.[0]?.display ?? 'Unknown medication')
      } else if (type === 'Immunization') {
        const vax = r.vaccineCode as { text?: string; coding?: Array<{ display?: string }> } | undefined
        result.immunizations.push(vax?.text ?? vax?.coding?.[0]?.display ?? 'Unknown vaccine')
      } else if (type === 'Observation') {
        const code = r.code as { text?: string; coding?: Array<{ display?: string }> } | undefined
        const name = code?.text ?? code?.coding?.[0]?.display ?? 'Observation'
        const valQ = r.valueQuantity as { value?: number; unit?: string } | undefined
        const val = valQ ? `${valQ.value} ${valQ.unit ?? ''}`.trim() : (r.valueString as string | undefined ?? '')
        result.observations.push(val ? `${name}: ${val}` : name)
      }
    }
    return result
  }

  function parseCcdXml(text: string): ParsedHealthRecord {
    const result: ParsedHealthRecord = { allergies: [], conditions: [], medications: [], immunizations: [], observations: [] }
    // Extract displayNames from CCD sections using simple regex (no DOM parser needed)
    const allergySection = text.match(/Allergies[\s\S]{0,200}?<section>([\s\S]*?)<\/section>/i)?.[1] ?? ''
    const condSection = text.match(/Problems[\s\S]{0,200}?<section>([\s\S]*?)<\/section>/i)?.[1] ?? ''
    const medSection = text.match(/Medications[\s\S]{0,200}?<section>([\s\S]*?)<\/section>/i)?.[1] ?? ''
    const vaxSection = text.match(/Immunizations[\s\S]{0,200}?<section>([\s\S]*?)<\/section>/i)?.[1] ?? ''

    const extractDisplayNames = (xml: string) =>
      [...xml.matchAll(/displayName="([^"]+)"/g)].map(m => m[1]).filter(Boolean).slice(0, 20)

    result.allergies = extractDisplayNames(allergySection)
    result.conditions = extractDisplayNames(condSection)
    result.medications = extractDisplayNames(medSection)
    result.immunizations = extractDisplayNames(vaxSection)
    return result
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Section header */}
      <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
        Health Record Sources
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

        {/* ── Epic MyChart ── */}
        <SourceCard
          title="Epic MyChart"
          subtitle="Live — SMART on FHIR OAuth"
          logo="E"
          logoColor="#C74B27"
          status={epicSource === 'live' ? 'done' : 'idle'}
          statusLabel={epicSource === 'live' ? 'Connected' : 'Not connected'}
        >
          {epicSource === 'live' ? (
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Records loaded from MyChart. To pull from <strong>additional health systems</strong>, the patient needs to authorize each system separately.
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
                <strong style={{ color: 'var(--teal)' }}>Note:</strong> Epic SMART on FHIR only returns records from the <em>single health system</em> the patient authenticated with. Cross-org requires Particle Health (TEFCA).
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Patient can connect their MyChart account to pull live records from any Epic-connected health system.
              </div>
              <a
                href="/api/fhir/authorize"
                style={{
                  display: 'inline-block', background: '#C74B27', color: '#fff',
                  border: 'none', borderRadius: '6px', padding: '7px 16px',
                  fontSize: '12px', fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
                }}
              >
                Connect Epic
              </a>
            </div>
          )}
        </SourceCard>

        {/* ── Particle Health ── */}
        <SourceCard
          title="Particle Health"
          subtitle="CommonWell + CareQuality · 320M patients"
          logo="P"
          logoColor="#7C3AED"
          status={particleStatus}
          statusLabel={
            particleStatus === 'idle' ? 'Ready' :
            particleStatus === 'loading' ? 'Querying network...' :
            particleStatus === 'needs_setup' ? 'Needs setup' :
            particleStatus === 'done' && particleData?.matched ? 'Matched' :
            particleStatus === 'done' ? 'No match' :
            'Error'
          }
        >
          {particleStatus === 'needs_setup' ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: '6px' }}>
              <strong style={{ color: 'rgb(245,158,11)' }}>Setup required:</strong> Add <code style={{ fontFamily: 'monospace', fontSize: '11px', background: 'rgba(0,0,0,0.2)', padding: '1px 4px', borderRadius: '3px' }}>PARTICLE_CLIENT_ID</code> to Vercel env vars.<br />
              <span style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>Get it from your Particle Health Developer Portal → API Credentials tab.</span>
            </div>
          ) : particleStatus === 'done' && particleData?.matched && particleData.records ? (
            <ParticleResults data={particleData} />
          ) : particleStatus === 'done' && !particleData?.matched ? (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{particleData?.message ?? 'No records found in network.'}</div>
          ) : particleStatus === 'error' ? (
            <div style={{ fontSize: '12px', color: 'rgb(239,68,68)' }}>{particleError}</div>
          ) : (
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Match patient against the national network using name + DOB.
              </div>
              <button
                onClick={pullParticle}
                style={{
                  background: '#7C3AED', color: '#fff', border: 'none', borderRadius: '6px',
                  padding: '7px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                }}
              >
                Pull Records
              </button>
            </div>
          )}
          {(particleStatus === 'done' || particleStatus === 'error') && (
            <button
              onClick={pullParticle}
              style={{
                marginTop: '10px', background: 'transparent', color: '#7C3AED',
                border: '1px solid #7C3AED', borderRadius: '6px', padding: '5px 12px',
                fontSize: '11px', cursor: 'pointer',
              }}
            >
              Refresh
            </button>
          )}
        </SourceCard>

        {/* ── Apple Health ── */}
        <SourceCard
          title="Apple Health"
          subtitle="iOS export · Health Records (FHIR)"
          logo="🍎"
          logoColor="#000000"
          status={appleStatus}
          statusLabel={
            appleStatus === 'idle' ? 'Upload export' :
            appleStatus === 'loading' ? 'Parsing...' :
            appleStatus === 'done' ? 'Loaded' : 'Error'
          }
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Patient exports Health Records from iPhone: <strong>Health app → Browse → Health Records → Export</strong>.
            Upload the JSON or XML file here.
          </div>
          <input
            ref={appleInputRef}
            type="file"
            accept=".json,.xml,.ccd,.ccda"
            style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) parseHealthFile(f, setAppleRecords, setAppleStatus)
            }}
          />
          {appleStatus === 'idle' || appleStatus === 'error' ? (
            <button
              onClick={() => appleInputRef.current?.click()}
              style={{
                background: '#000', color: '#fff', border: 'none', borderRadius: '6px',
                padding: '7px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Upload Apple Health Export
            </button>
          ) : appleStatus === 'done' && appleRecords ? (
            <ImportedRecordsSummary records={appleRecords} onRefresh={() => appleInputRef.current?.click()} />
          ) : null}
        </SourceCard>

        {/* ── Google Health ── */}
        <SourceCard
          title="Google Health"
          subtitle="Android export · Health Connect / FHIR"
          logo="G"
          logoColor="#4285F4"
          status={googleStatus}
          statusLabel={
            googleStatus === 'idle' ? 'Upload export' :
            googleStatus === 'loading' ? 'Parsing...' :
            googleStatus === 'done' ? 'Loaded' : 'Error'
          }
        >
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Patient exports from Google Health / Android: <strong>Health Connect app → Export data</strong>, or from their health provider's portal as a FHIR/CCD file.
          </div>
          <input
            ref={googleInputRef}
            type="file"
            accept=".json,.xml,.ccd,.ccda"
            style={{ display: 'none' }}
            onChange={e => {
              const f = e.target.files?.[0]
              if (f) parseHealthFile(f, setGoogleRecords, setGoogleStatus)
            }}
          />
          {googleStatus === 'idle' || googleStatus === 'error' ? (
            <button
              onClick={() => googleInputRef.current?.click()}
              style={{
                background: '#4285F4', color: '#fff', border: 'none', borderRadius: '6px',
                padding: '7px 16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              }}
            >
              Upload Google Health Export
            </button>
          ) : googleStatus === 'done' && googleRecords ? (
            <ImportedRecordsSummary records={googleRecords} onRefresh={() => googleInputRef.current?.click()} />
          ) : null}
        </SourceCard>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SourceCard({
  title, subtitle, logo, logoColor, status, statusLabel, children,
}: {
  title: string
  subtitle: string
  logo: string
  logoColor: string
  status: SourceStatus
  statusLabel: string
  children: React.ReactNode
}) {
  const statusColors: Record<SourceStatus, string> = {
    idle: 'var(--text-muted)',
    loading: 'var(--teal)',
    done: 'rgb(16,185,129)',
    error: 'rgb(239,68,68)',
    needs_setup: 'rgb(245,158,11)',
  }

  return (
    <div className="glass-card" style={{ padding: '18px 20px' }}>
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
          background: `${logoColor}22`, display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: logoColor,
        }}>
          {logo}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '1px' }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: '10px', fontWeight: 600, color: statusColors[status], flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {status === 'loading' ? (
            <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
          ) : status === 'done' && (statusLabel === 'Connected' || statusLabel === 'Matched' || statusLabel === 'Loaded') ? '✓ ' : ''}
          {statusLabel}
        </div>
      </div>
      {children}
    </div>
  )
}

function ParticleResults({ data }: { data: NetworkRecords }) {
  if (!data.records) return null
  const counts = [
    { label: 'Allergies', count: data.records.allergies.entry?.length ?? 0 },
    { label: 'Conditions', count: data.records.conditions.entry?.length ?? 0 },
    { label: 'Medications', count: data.records.medications.entry?.length ?? 0 },
    { label: 'Observations', count: data.records.observations.entry?.length ?? 0 },
    { label: 'Immunizations', count: data.records.immunizations.entry?.length ?? 0 },
  ]
  const total = counts.reduce((s, c) => s + c.count, 0)

  return (
    <div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        Matched: <strong style={{ color: 'var(--text-primary)' }}>{data.matchedName}</strong> · {total} records
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
        {counts.map(({ label, count }) => (
          <div key={label} style={{ background: 'var(--bg-elevated)', borderRadius: '4px', padding: '6px 4px', textAlign: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 700, color: count > 0 ? 'var(--teal)' : 'var(--text-muted)', fontFamily: 'monospace' }}>{count}</div>
            <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ImportedRecordsSummary({ records, onRefresh }: { records: ParsedHealthRecord; onRefresh: () => void }) {
  const sections: Array<{ label: string; items: string[] }> = [
    { label: 'Allergies', items: records.allergies },
    { label: 'Conditions', items: records.conditions },
    { label: 'Medications', items: records.medications },
    { label: 'Immunizations', items: records.immunizations },
    { label: 'Observations', items: records.observations },
  ].filter(s => s.items.length > 0)

  const total = sections.reduce((s, sec) => s + sec.items.length, 0)

  return (
    <div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        {total} records parsed from export
      </div>
      {sections.map(({ label, items }) => (
        <div key={label} style={{ marginBottom: '8px' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
          {items.slice(0, 5).map((item, i) => (
            <div key={i} style={{ fontSize: '12px', color: 'var(--text-primary)', padding: '2px 0', borderBottom: '1px solid var(--border)' }}>{item}</div>
          ))}
          {items.length > 5 && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>+{items.length - 5} more</div>}
        </div>
      ))}
      <button
        onClick={onRefresh}
        style={{
          marginTop: '8px', background: 'transparent', color: 'var(--text-muted)',
          border: '1px solid var(--border)', borderRadius: '6px', padding: '4px 10px',
          fontSize: '11px', cursor: 'pointer',
        }}
      >
        Replace file
      </button>
    </div>
  )
}
