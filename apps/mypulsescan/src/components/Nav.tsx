'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        MyPulse<span>Scan</span>
      </Link>
      <div className="nav-links">
        <a href="/#features" className="nav-link">Features</a>
        <a href="/#how-it-works" className="nav-link">How It Works</a>
        <a href="/#billing-expansion" className="nav-link">Revenue</a>
        <a href="/#calculator" className="nav-link">ROI Calculator</a>
        <Link href="/for-chains" className="nav-link">Chains</Link>
        <Link href="/for-billing-partners" className="nav-link">Partners</Link>
        <a href="mailto:hello@mypulsescan.com" className="nav-cta">Request Demo →</a>
      </div>
      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px',
          color: 'var(--ink)',
          fontSize: '20px',
        }}
        aria-label="Menu"
      >
        {open ? '✕' : '☰'}
      </button>
    </nav>
  )
}
