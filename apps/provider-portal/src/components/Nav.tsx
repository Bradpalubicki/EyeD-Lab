"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/scan", label: "Scan" },
  { href: "/upload", label: "Patient Upload" },
]

export default function Nav() {
  const pathname = usePathname()
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      height: "56px", display: "flex", alignItems: "center",
      padding: "0 24px", justifyContent: "space-between",
      background: "var(--bg-surface)",
      borderBottom: "1px solid var(--border)",
    }}>
      <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <span style={{ color: "var(--teal)", fontSize: "8px" }}>●</span>
        <span style={{ color: "var(--text-primary)", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em" }}>EyeD</span>
      </Link>
      <div style={{ display: "flex", gap: "4px" }}>
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} style={{
            padding: "6px 14px", borderRadius: "var(--radius-sm)", fontSize: "13px",
            fontWeight: 500, textDecoration: "none", transition: "all 0.15s",
            color: pathname === link.href ? "var(--teal)" : "var(--text-secondary)",
            background: pathname === link.href ? "var(--teal-dim)" : "transparent",
          }}>{link.label}</Link>
        ))}
      </div>
      <div style={{
        fontSize: "11px", color: "var(--text-muted)", padding: "4px 12px",
        background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "100px",
        letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 600,
      }}>Provider Portal</div>
    </nav>
  )
}
