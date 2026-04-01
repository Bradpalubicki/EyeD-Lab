"use client"
import { useState, use } from "react"
import { useRouter } from "next/navigation"

const SESSION_TYPES = [
  { value: "tcyp_injection", label: "T-Cyp Injection" },
  { value: "pellet_insertion", label: "Pellet Insertion" },
  { value: "shockwave", label: "Shockwave Therapy" },
  { value: "eros", label: "Eros Therapy" },
  { value: "follow_up", label: "Follow-Up Visit" },
  { value: "initial_visit", label: "Initial Visit" },
]

export default function TreatmentPage({
  params,
}: {
  params: Promise<{ sessionId: string }>
}) {
  const router = useRouter()
  const { sessionId } = use(params)

  const [sessionType, setSessionType] = useState("")
  const [dosageMg, setDosageMg] = useState("")
  const [side, setSide] = useState("")
  const [notes, setNotes] = useState("")
  const [followupDate, setFollowupDate] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!sessionType) {
      setError("Select a session type")
      return
    }
    setError("")
    setSubmitting(true)
    // Demo mode — no server write yet
    await new Promise(r => setTimeout(r, 600))
    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: "var(--teal-dim)", border: "1px solid var(--teal)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: "24px", color: "var(--teal)"
        }}>✓</div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px", letterSpacing: "-0.01em" }}>
          Treatment Recorded
        </h2>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "32px" }}>
          Session logged for PIN <code style={{ fontFamily: "monospace", color: "var(--teal)", background: "var(--teal-dim)", padding: "2px 8px", borderRadius: "4px" }}>{sessionId}</code>
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button className="btn-ghost" onClick={() => router.push(`/records/${sessionId}`)}>← Back to Records</button>
          <button className="btn-primary" onClick={() => { setSubmitted(false); setSessionType(""); setDosageMg(""); setSide(""); setNotes(""); setFollowupDate("") }}>
            Add Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "8px" }}>
          Treatment Record
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          Add Treatment Session
        </h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>
          Log a treatment for PIN{" "}
          <code style={{ fontFamily: "monospace", color: "var(--teal)", background: "var(--teal-dim)", padding: "2px 8px", borderRadius: "4px" }}>{sessionId}</code>
        </p>
      </div>

      <div className="glass-card" style={{ padding: "32px" }}>
        <form onSubmit={handleSubmit}>

          {/* Session Type */}
          <div style={{ marginBottom: "20px" }}>
            <label className="field-label">Session Type *</label>
            <select
              className="field-input"
              value={sessionType}
              onChange={e => setSessionType(e.target.value)}
              required
            >
              <option value="">Select type</option>
              {SESSION_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Dosage + Side — only relevant for injections / pellets */}
          {(sessionType === "tcyp_injection" || sessionType === "pellet_insertion") && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label className="field-label">Dosage (mg)</label>
                <input
                  className="field-input"
                  type="number"
                  placeholder="e.g. 200"
                  value={dosageMg}
                  onChange={e => setDosageMg(e.target.value)}
                  min={0}
                  step={0.1}
                />
              </div>
              <div>
                <label className="field-label">Side</label>
                <select className="field-input" value={side} onChange={e => setSide(e.target.value)}>
                  <option value="">N/A</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="bilateral">Bilateral</option>
                </select>
              </div>
            </div>
          )}

          {/* Follow-up Date */}
          <div style={{ marginBottom: "20px" }}>
            <label className="field-label">Follow-up Date</label>
            <input
              className="field-input"
              type="date"
              value={followupDate}
              onChange={e => setFollowupDate(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div style={{ marginBottom: "24px" }}>
            <label className="field-label">Clinical Notes</label>
            <textarea
              className="field-input"
              rows={4}
              placeholder="Observations, patient response, next steps..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ resize: "vertical", minHeight: "96px" }}
            />
          </div>

          {error && (
            <p style={{ fontSize: "13px", color: "var(--red)", marginBottom: "16px" }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => router.push(`/records/${sessionId}`)}
            >
              ← Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={submitting || !sessionType}
            >
              {submitting ? "Saving…" : "Save Treatment Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
