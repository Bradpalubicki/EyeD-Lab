"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ScanPage() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
      setError("Enter a valid 6-digit PIN")
      return
    }
    setError("")
    router.push(`/records/${pin}`)
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "8px" }}>Patient Access</div>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>Scan or Enter PIN</h1>
        <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>Point camera at patient QR code, or enter their 6-digit PIN manually.</p>
      </div>

      {/* QR Camera Placeholder */}
      <div className="glass-card" style={{ padding: 0, overflow: "hidden", marginBottom: "24px" }}>
        <div style={{
          height: "240px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          background: "repeating-linear-gradient(45deg, var(--bg-elevated) 0px, var(--bg-elevated) 10px, var(--bg-surface) 10px, var(--bg-surface) 20px)",
          gap: "12px"
        }}>
          <div style={{ fontSize: "40px", opacity: 0.3 }}>▣</div>
          <div style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>Point camera at<br />patient QR code</div>
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-muted)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Camera access required — or use PIN entry below</span>
        </div>
      </div>

      {/* PIN Form */}
      <div className="glass-card" style={{ padding: "28px" }}>
        <div className="gradient-bar" />
        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>Manual PIN Entry</div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label className="field-label">6-Digit Patient PIN</label>
            <input
              className="field-input"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
              style={{ fontSize: "24px", letterSpacing: "0.3em", textAlign: "center", fontFamily: "monospace" }}
              maxLength={6}
              autoFocus
            />
            {error && <p style={{ fontSize: "12px", color: "var(--red)", marginTop: "8px" }}>{error}</p>}
          </div>
          <button className="btn-primary" type="submit" style={{ width: "100%" }} disabled={pin.length !== 6}>
            Pull Patient Record →
          </button>
        </form>

        <div style={{ marginTop: "20px", paddingTop: "20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>Quick Access — Training Patients</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[["111111","Mitchell"],["222222","Crawford"],["333333","Holbrook"],["123456","Thornton"],["654321","Chen"]].map(([p, name]) => (
              <button key={p} onClick={() => router.push(`/records/${p}`)} style={{
                fontSize: "11px", padding: "5px 10px", borderRadius: "6px", border: "1px solid var(--border)",
                background: "transparent", color: "var(--text-secondary)", cursor: "pointer", fontFamily: "monospace",
                transition: "all 0.15s"
              }}>{p} <span style={{ color: "var(--text-muted)" }}>{name}</span></button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
