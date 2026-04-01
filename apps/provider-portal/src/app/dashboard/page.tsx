import Link from "next/link"

const trainingPatients = [
  { name: "Robert Mitchell", pin: "111111", age: 47, condition: "TRT — Testosterone Cypionate", lastVisit: "Oct 15, 2025", status: "Active Treatment" },
  { name: "James Crawford", pin: "222222", age: 53, condition: "TRT + Type 2 Diabetes", lastVisit: "Nov 2, 2025", status: "Active Treatment" },
  { name: "David Holbrook", pin: "333333", age: 40, condition: "TRT + Shockwave Therapy", lastVisit: "Oct 1, 2025", status: "Active Treatment" },
]

const demoPatients = [
  { name: "James A. Thornton", pin: "123456", age: 57, condition: "AF + T2DM — Drug Interaction Demo", lastVisit: "Dec 1, 2025", status: "Demo" },
  { name: "Sarah M. Chen", pin: "654321", age: 24, condition: "MDD + GAD — Mental Health Demo", lastVisit: "Oct 5, 2025", status: "Demo" },
]

export default function DashboardPage() {
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--teal)", marginBottom: "8px" }}>Provider Dashboard</div>
        <h1 style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", margin: "0 0 8px" }}>Patient Access</h1>
        <p style={{ fontSize: "15px", color: "var(--text-secondary)", margin: 0 }}>Scan a QR code or enter a PIN to pull a patient&apos;s complete medical record with AI-powered clinical brief.</p>
      </div>

      {/* Epic MyChart CTA */}
      <div style={{ marginBottom: "24px", padding: "16px 20px", background: "rgba(0,122,255,0.08)", border: "1px solid rgba(0,122,255,0.2)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>Connect via Epic MyChart</div>
          <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>Fetch live patient records directly from Epic. Test with <code style={{ color: "var(--teal)", fontFamily: "monospace" }}>fhircamila / epicepic1</code></div>
        </div>
        <a href="/api/fhir/authorize" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: "rgba(0,122,255,0.15)", border: "1px solid rgba(0,122,255,0.35)", borderRadius: "8px", color: "#4a9eff", fontSize: "13px", fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap" }}>
          Connect via Epic MyChart →
        </a>
      </div>

      {/* Primary CTAs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "48px" }}>
        <Link href="/scan" style={{ textDecoration: "none" }}>
          <div className="glass-card" style={{ padding: "24px", cursor: "pointer", borderColor: "var(--teal-dim)" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>⬡</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>Scan QR Code</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Use camera or enter patient PIN to access records instantly</div>
            <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--teal)", fontSize: "13px", fontWeight: 500 }}>
              Open Scanner <span>→</span>
            </div>
          </div>
        </Link>
        <Link href="/upload" style={{ textDecoration: "none" }}>
          <div className="glass-card" style={{ padding: "24px", cursor: "pointer" }}>
            <div style={{ fontSize: "28px", marginBottom: "12px" }}>⊕</div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>Patient Upload</div>
            <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>Patient enters their own records and generates a QR code for provider access</div>
            <div style={{ marginTop: "16px", display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "13px", fontWeight: 500 }}>
              Start Upload <span>→</span>
            </div>
          </div>
        </Link>
      </div>

      {/* TRT Training Patients */}
      <div style={{ marginBottom: "40px" }}>
        <div className="section-label">TRT Training Patients — Live Supabase Data</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {trainingPatients.map(p => (
            <div key={p.pin} className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--teal-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "var(--teal)" }}>
                  {p.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
                <span className="pill pill-active">{p.status}</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{p.name}</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Age {p.age} · {p.condition}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "16px" }}>Last visit {p.lastVisit}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <code style={{ fontSize: "12px", color: "var(--teal)", background: "var(--teal-dim)", padding: "3px 8px", borderRadius: "6px", fontFamily: "monospace" }}>PIN {p.pin}</code>
                <Link href={`/records/${p.pin}`} style={{ fontSize: "12px", color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>View Records →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo Patients */}
      <div>
        <div className="section-label">Demo Patients — Mock Data</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {demoPatients.map(p => (
            <div key={p.pin} className="glass-card" style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "var(--text-secondary)" }}>
                  {p.name.split(" ").map(n => n[0]).slice(0,2).join("")}
                </div>
                <span className="pill pill-resolved">{p.status}</span>
              </div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>{p.name}</div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "4px" }}>Age {p.age} · {p.condition}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "16px" }}>
                <code style={{ fontSize: "12px", color: "var(--text-secondary)", background: "rgba(255,255,255,0.06)", padding: "3px 8px", borderRadius: "6px", fontFamily: "monospace" }}>PIN {p.pin}</code>
                <Link href={`/records/${p.pin}`} style={{ fontSize: "12px", color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500 }}>View Records →</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
