"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function EmergencyPage() {
  const router = useRouter()
  const [hw1Id, setHw1Id] = useState("")
  const [hw1Pass, setHw1Pass] = useState("")
  const [hw2Id, setHw2Id] = useState("")
  const [hw2Pass, setHw2Pass] = useState("")
  const [patientId, setPatientId] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [granted, setGranted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!hw1Id || !hw1Pass || !hw2Id || !hw2Pass || !patientId) {
      setError("All fields are required for dual-authorization.")
      return
    }
    if (hw1Id === hw2Id) {
      setError("Both authorizing providers must be different individuals.")
      return
    }
    setError("")
    setSubmitting(true)
    // Demo mode — log access attempt, redirect to records
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    setGranted(true)
    setTimeout(() => router.push(`/records/${patientId}`), 1500)
  }

  if (granted) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "rgba(239,68,68,0.1)", border: "1px solid var(--red)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: "24px", color: "var(--red)"
        }}>⚡</div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
          Emergency Access Granted
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
          Dual authorization verified. Access logged. Redirecting to patient record…
        </p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--red)", marginBottom: "8px" }}>
          Emergency Access
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Dual Authorization Required
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Emergency record access requires two healthcare workers. All attempts are logged and audited.
        </p>
      </div>

      {/* Warning banner */}
      <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "var(--radius-md)", padding: "14px 18px", marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "16px" }}>⚠</span>
        <span style={{ fontSize: "13px", color: "var(--red)", fontWeight: 500 }}>
          Unauthorized emergency access attempts are a HIPAA violation and subject to termination and legal action.
        </span>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Healthcare Worker 1 */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "16px" }}>
          <div className="section-label" style={{ marginBottom: "16px" }}>Healthcare Worker 1</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label className="field-label">Provider ID</label>
              <input
                className="field-input"
                type="text"
                placeholder="e.g. NP-0042"
                value={hw1Id}
                onChange={e => setHw1Id(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={hw1Pass}
                onChange={e => setHw1Pass(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        {/* Healthcare Worker 2 */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "16px" }}>
          <div className="section-label" style={{ marginBottom: "16px" }}>Healthcare Worker 2</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
            <div>
              <label className="field-label">Provider ID</label>
              <input
                className="field-input"
                type="text"
                placeholder="e.g. MD-0018"
                value={hw2Id}
                onChange={e => setHw2Id(e.target.value)}
                autoComplete="off"
              />
            </div>
            <div>
              <label className="field-label">Password</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={hw2Pass}
                onChange={e => setHw2Pass(e.target.value)}
                autoComplete="new-password"
              />
            </div>
          </div>
        </div>

        {/* Patient Identifier */}
        <div className="glass-card" style={{ padding: "24px", marginBottom: "24px" }}>
          <div className="section-label" style={{ marginBottom: "16px" }}>Patient Identifier</div>
          <div>
            <label className="field-label">Patient PIN or MRN</label>
            <input
              className="field-input"
              type="text"
              placeholder="6-digit PIN or MRN-TRAIN-XXX"
              value={patientId}
              onChange={e => setPatientId(e.target.value)}
              style={{ fontFamily: "monospace", letterSpacing: "0.05em" }}
            />
          </div>
        </div>

        {error && (
          <p style={{ fontSize: "13px", color: "var(--red)", marginBottom: "16px" }}>{error}</p>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => router.back()}
          >
            ← Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            style={{ flex: 1, background: "var(--red)", borderColor: "var(--red)" }}
            disabled={submitting || !hw1Id || !hw1Pass || !hw2Id || !hw2Pass || !patientId}
          >
            {submitting ? "Verifying…" : "Request Emergency Access"}
          </button>
        </div>
      </form>
    </div>
  )
}
