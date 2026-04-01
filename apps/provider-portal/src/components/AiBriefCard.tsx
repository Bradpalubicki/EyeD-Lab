'use client'
// src/components/AiBriefCard.tsx
// Client component — calls /api/ai/summarize to avoid SSR/Suspense edge issues
import { useEffect, useState } from 'react'
import type { AiSummaryResult, DrugInteractionFlag } from '@/lib/claude'

interface AiBriefCardProps {
  sessionId: string
  isEpicPatient?: boolean
}

const severityPill: Record<DrugInteractionFlag['severity'], string> = {
  moderate: 'pill-moderate',
  major: 'pill-abnormal',
  contraindicated: 'pill-critical',
}

const severityBorder: Record<DrugInteractionFlag['severity'], string> = {
  moderate: 'var(--amber)',
  major: 'var(--amber)',
  contraindicated: 'var(--red)',
}

export default function AiBriefCard({ sessionId, isEpicPatient = false }: AiBriefCardProps) {
  const [result, setResult] = useState<AiSummaryResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchBrief() {
      try {
        const res = await fetch('/api/ai/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })
        if (cancelled) return
        if (!res.ok) {
          const data = await res.json() as { error?: string }
          setError(data.error ?? `HTTP ${res.status}`)
        } else {
          const data = await res.json() as AiSummaryResult
          setResult(data)
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void fetchBrief()
    return () => { cancelled = true }
  }, [sessionId])

  if (loading) {
    return (
      <div className="glass-card" style={{ padding: '24px', borderColor: 'var(--teal)', boxShadow: '0 0 24px var(--teal-glow)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--teal)', opacity: 0.6 }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>AI Clinical Brief</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>Generating…</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[100, 85, 70].map((w, i) => (
            <div key={i} style={{ height: '14px', width: `${w}%`, background: 'var(--bg-elevated)', borderRadius: '4px', animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card" style={{ padding: '20px 24px', borderColor: 'var(--red-dim)', background: 'var(--red-dim)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>AI summary unavailable — {error}</p>
        </div>
      </div>
    )
  }

  if (!result) return null

  const generatedTime = result.generatedAt
    ? new Date(result.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className="glass-card" style={{ padding: '24px', borderColor: 'var(--teal)', boxShadow: '0 0 24px var(--teal-glow)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--teal)' }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>AI Clinical Brief</span>
        </div>
        {isEpicPatient ? (
          <span className="pill" style={{ background: 'rgba(16,185,129,0.15)', color: 'rgb(16,185,129)', border: '1px solid rgba(16,185,129,0.35)' }}>EPIC LIVE DATA</span>
        ) : (
          <span className="pill pill-abnormal">SYNTHETIC DATA</span>
        )}
      </div>

      {/* Summary */}
      <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--text-secondary)', marginBottom: '20px' }}>{result.summary}</p>

      {/* Drug Interactions */}
      <div>
        <div className="section-label">Drug Interactions</div>
        {result.drugInteractions.length === 0 ? (
          <span className="pill pill-normal">No interactions identified</span>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.drugInteractions.map((flag, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${severityBorder[flag.severity]}`,
                  borderRadius: 'var(--radius-sm)',
                  padding: '12px 16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <code style={{ fontSize: '13px', color: 'var(--teal)', fontFamily: 'monospace', background: 'var(--teal-dim)', padding: '2px 6px', borderRadius: '4px' }}>{flag.drug1}</code>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>↔</span>
                  <code style={{ fontSize: '13px', color: 'var(--teal)', fontFamily: 'monospace', background: 'var(--teal-dim)', padding: '2px 6px', borderRadius: '4px' }}>{flag.drug2}</code>
                  <span className={`pill ${severityPill[flag.severity]}`}>{flag.severity}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{flag.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
        Generated {generatedTime} · {isEpicPatient ? 'Live Epic MyChart data' : 'Synthetic demo data only'} · Not for clinical use
      </p>
    </div>
  )
}
