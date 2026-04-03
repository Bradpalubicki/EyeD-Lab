'use client'
// src/components/ParticleHealthPanel.tsx
// Provider-facing panel: pull patient records from Particle Health
// Networks: CommonWell, Carequality, eHealthExchange, Surescripts, Healthix (NY), Manifest MedEx (CA)
// Flow: register → async query → webhook fires → DB updated → UI shows data

import { useState } from 'react'

interface Props {
  patientName: string
  patientDob: string
  patientGender: string
  patientCity?: string      // REQUIRED for accurate record matching
  patientState?: string     // REQUIRED for accurate record matching (2-letter)
  patientPostalCode?: string
  // If patient already registered with Particle, pass ID to skip re-registration
  existingParticlePatientId?: string
  lastQueriedAt?: string
}


interface NetworkResponse {
  // v2 async response — query is queued, data arrives via webhook
  queued?: boolean
  particle_patient_id?: string
  query_id?: string
  needsClientId?: boolean
  message?: string
  error?: string
}

export default function ParticleHealthPanel({
  patientName,
  patientDob,
  patientGender,
  patientCity,
  patientState,
  patientPostalCode,
  existingParticlePatientId,
  lastQueriedAt,
}: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'queued' | 'error'>('idle')
  const [queryId, setQueryId] = useState<string | null>(null)
  const [particleId, setParticleId] = useState<string | null>(existingParticlePatientId ?? null)
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
          addressCity: patientCity,
          addressState: patientState,
          postalCode: patientPostalCode,
          existingParticlePatientId: existingParticlePatientId ?? undefined,
          lastQueriedAt: lastQueriedAt ?? undefined,
        }),
      })
      const json = await res.json() as NetworkResponse
      if (!res.ok) throw new Error(json.error ?? 'Request failed')
      if (json.needsClientId) {
        setError(json.message ?? 'Particle Health not configured')
        setStatus('error')
        return
      }
      if (json.queued) {
        setQueryId(json.query_id ?? null)
        setParticleId(json.particle_patient_id ?? null)
        setStatus('queued')
      } else {
        setError(json.message ?? 'Query could not be submitted')
        setStatus('error')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  const teal = 'var(--teal)'
  const textPrimary = 'var(--text-primary)'
  const textMuted = 'var(--text-muted)'
  const bgElevated = 'var(--bg-elevated)'

  return (
    <div className="glass-card" style={{ padding: '24px', marginBottom: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="section-label" style={{ marginBottom: '4px' }}>National Health Network</div>
          <div style={{ fontSize: '12px', color: textMuted }}>
            CommonWell · Carequality · eHealthExchange · Surescripts via Particle Health · 320M US patients
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
            Registering patient<span style={{ animation: 'blink 1s step-end infinite' }}>...</span>
          </div>
        ) : status === 'queued' ? (
          <button
            onClick={handlePull}
            style={{
              background: 'transparent', color: teal, border: `1px solid ${teal}`,
              borderRadius: '6px', padding: '7px 16px', fontSize: '12px', cursor: 'pointer',
            }}
          >
            Re-query
          </button>
        ) : null}
      </div>

      {/* Error */}
      {status === 'error' && (
        <div style={{ fontSize: '13px', color: 'rgb(239,68,68)', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', borderRadius: '6px' }}>
          {error}
        </div>
      )}

      {/* Query queued — async, data arrives via webhook */}
      {status === 'queued' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', borderRadius: '6px' }}>
            <span style={{ color: teal, fontWeight: 700 }}>⟳</span>
            <span style={{ fontSize: '13px', color: textPrimary }}>
              Query submitted — querying CommonWell, Carequality, eHealthExchange, Surescripts
            </span>
          </div>
          <div style={{ fontSize: '12px', color: textMuted, padding: '8px 14px', background: bgElevated, borderRadius: '6px', lineHeight: 1.6 }}>
            Records typically arrive in 3–6 minutes. This page will update automatically when the network responds.
            {queryId && (
              <div style={{ fontFamily: 'monospace', fontSize: '11px', marginTop: '4px', opacity: 0.6 }}>
                Query ID: {queryId}
              </div>
            )}
            {particleId && (
              <div style={{ fontFamily: 'monospace', fontSize: '11px', marginTop: '2px', opacity: 0.6 }}>
                Network ID: {particleId.slice(0, 8)}…
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

