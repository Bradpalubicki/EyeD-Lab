"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg-base)" }}>
      <div style={{ width: "100%", maxWidth: "400px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "18px" }}>👁</span>
            </div>
            <span style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>EyeD</span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", margin: 0 }}>Provider Portal — Secure Clinical Access</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: "32px" }}>
          <div className="gradient-bar" />
          <h2 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>Sign in</h2>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px" }}>Enter your provider credentials to continue</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label className="field-label">Email address</label>
              <input className="field-input" type="email" placeholder="provider@hospital.org" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label className="field-label">Password</label>
              <input className="field-input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn-primary" type="submit" style={{ width: "100%" }}>Access Portal</button>
          </form>

          <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center", marginTop: "20px" }}>
            For demo access, proceed directly to{" "}
            <Link href="/dashboard" style={{ color: "var(--teal)", textDecoration: "none" }}>Dashboard →</Link>
          </p>
        </div>

        <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "24px" }}>
          Demo system — synthetic patient data only · HIPAA compliant infrastructure
        </p>
      </div>
    </div>
  )
}
