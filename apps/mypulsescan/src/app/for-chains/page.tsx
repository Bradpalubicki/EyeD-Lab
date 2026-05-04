import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Multi-Location Chain Pricing | MyPulseScan',
  description: 'Same platform, chain economics. At 50 locations, MyPulseScan enables $10.6M in annual revenue across your network. Built for VP Operations and Revenue Cycle Directors.',
  alternates: { canonical: 'https://mypulsescan.com/for-chains' },
}

const networkStats = [
  { n: '50', unit: 'locations', math: '$17,710/mo × 50', result: '$10.6M/yr enabled revenue' },
  { n: '100', unit: 'locations', math: '$17,710/mo × 100', result: '$21.3M/yr enabled revenue' },
  { n: '250', unit: 'locations', math: '$17,710/mo × 250', result: '$53.1M/yr enabled revenue' },
  { n: '500', unit: 'locations', math: '$17,710/mo × 500', result: '$106.3M/yr enabled revenue' },
]

const chainPricingRows = [
  { tier: 'Single Location', perLocation: '$299', perPatient: '$6', notes: 'Full platform access' },
  { tier: '5–25 Locations', perLocation: '$249', perPatient: '$5', notes: 'Chain onboarding support' },
  { tier: '26–100 Locations', perLocation: '$200', perPatient: '$4', notes: 'Dedicated CSM, SLA guarantees' },
  { tier: '100+ Locations', perLocation: 'Custom', perPatient: '$2–$3', notes: 'Enterprise contract, BAA fleet-wide' },
]

const chainAdvantages = [
  {
    icon: '📊',
    title: 'Network-level analytics dashboard',
    text: 'Revenue Cycle Directors see record retrieval rates, billing code enablement, and staff time recovery across every location — in one view. Not clinic-by-clinic.',
  },
  {
    icon: '🔧',
    title: 'Centralized configuration, local execution',
    text: 'Configure EMR connections, billing workflows, and compliance settings once at the network level. Each location inherits settings automatically.',
  },
  {
    icon: '⚡',
    title: 'Phased rollout support',
    text: 'Go-live 5 locations at a time or deploy fleet-wide. We provide onboarding sequencing, staff training templates, and go-live checklists for each wave.',
  },
  {
    icon: '📋',
    title: 'Unified HIPAA audit trail',
    text: 'One BAA covering every location. Every record retrieval logged, auditable, and available for compliance review across the entire network.',
  },
  {
    icon: '🏥',
    title: 'Fleet-wide billing intelligence',
    text: 'Identify which locations are under-utilizing CCM, BHI, or TCM billing. Network-level data surfaces revenue gaps that individual location managers miss.',
  },
  {
    icon: '🔒',
    title: 'Network security posture',
    text: 'Centralized access controls. Role-based permissions by location, region, and function. No patient data crosses location lines without explicit routing rules.',
  },
]

const chainObjHandlers = [
  {
    objection: '"We already have Epic Care Everywhere."',
    answer: 'Epic Care Everywhere is Epic-to-Epic only — roughly 30% network coverage. We add the other 70%: CommonWell, Carequality, TEFCA, and Surescripts pharmacy fill history. We don\'t replace your Epic integration. We fill the gap it leaves.',
  },
  {
    objection: '"Our IT team will need to manage this."',
    answer: 'No EMR replacement. No IT project. We wire in via Redox — the same integration layer most chains already have. Typical go-live is one afternoon per location cohort, not an IT sprint.',
  },
  {
    objection: '"How do we know the revenue numbers are real?"',
    answer: 'We don\'t claim revenue — we enable it. Your billing team decides what codes apply to your patient population. The calculator shows the ceiling; your RCM team determines the actual capture rate for your mix.',
  },
]

export default function ForChainsPage() {
  return (
    <>
      <Nav />
      <main id="main-content">

        {/* ── HERO ── */}
        <section className="hero" aria-label="For Chains">
          <div className="hero-inner">
            <div className="hero-kicker">For Multi-Location Chains &amp; Networks</div>
            <h1>Same platform. <em>Chain economics.</em></h1>
            <p className="hero-sub">
              At 50 locations, MyPulseScan enables $17,710/month in revenue per location —
              $10.6 million in annual enabled revenue across your network.
              One contract. One BAA. One go-live sequence.
            </p>
            <div className="hero-actions">
              <a href="mailto:chains@mypulsescan.com" className="btn-primary">
                Talk to our chain team →
              </a>
              <a href="#chain-pricing" className="btn-ghost">
                See chain pricing ↓
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-n">$200</div>
                <div className="hero-stat-l">Per location / month (26–100 locations)</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n">$4</div>
                <div className="hero-stat-l">Per patient (chain tier)</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n">$17,710</div>
                <div className="hero-stat-l">Enabled revenue per location / month</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n">1 BAA</div>
                <div className="hero-stat-l">Fleet-wide coverage</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── NETWORK MATH ── */}
        <section className="section section-alt" id="network-math">
          <div className="section-inner">
            <div className="section-kicker">Network math</div>
            <h2 className="section-title">The number that matters for <em>VP Ops and RCDs.</em></h2>
            <p className="section-sub">
              $17,710/month per location is the full billing picture: RPM + CCM + BHI + TCM + prior auth savings,
              for practices that offer those services. Your Revenue Cycle Director sets the actual capture rate
              for your patient mix. This is the ceiling. Most chains hit 60–80% of it.
            </p>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32}}>
              {networkStats.map(s => (
                <div key={s.n} style={{background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '28px 24px', boxShadow: 'var(--shadow)', textAlign: 'center' as const}}>
                  <div style={{fontFamily: 'var(--font-serif)', fontSize: 48, fontWeight: 700, color: 'var(--teal)', lineHeight: 1}}>{s.n}</div>
                  <div style={{fontSize: 12, color: 'var(--ink-muted)', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '.08em', fontFamily: 'var(--font-mono)'}}>{s.unit}</div>
                  <div style={{fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8}}>{s.math}</div>
                  <div style={{fontWeight: 600, color: 'var(--ink)', fontSize: 15}}>{s.result}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6}}>
              CCM, BHI, and TCM figures apply to eligible patients at practices that offer these services.
              MyPulseScan retrieves the verified external record. Your clinical team decides what to do with it.
              Your billing team determines what applies.
            </div>
          </div>
        </section>

        {/* ── CHAIN PRICING ── */}
        <section className="section" id="chain-pricing">
          <div className="section-inner">
            <div className="section-kicker">Chain pricing</div>
            <h2 className="section-title">Volume pricing that <em>scales with your network.</em></h2>
            <p className="section-sub">
              Per-location and per-patient costs drop as your network grows. One contract, one billing cycle,
              one implementation team.
            </p>
            <div style={{overflowX: 'auto' as const, marginBottom: 32}}>
              <table style={{width: '100%', borderCollapse: 'collapse' as const, fontSize: 14}}>
                <thead>
                  <tr style={{background: 'var(--bg-alt)'}}>
                    <th style={{textAlign: 'left' as const, padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'var(--ink-muted)', borderBottom: '2px solid var(--border)'}}>Network Size</th>
                    <th style={{textAlign: 'right' as const, padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'var(--ink-muted)', borderBottom: '2px solid var(--border)'}}>Per Location / Mo</th>
                    <th style={{textAlign: 'right' as const, padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'var(--ink-muted)', borderBottom: '2px solid var(--border)'}}>Per Patient</th>
                    <th style={{textAlign: 'left' as const, padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'var(--ink-muted)', borderBottom: '2px solid var(--border)'}}>Includes</th>
                  </tr>
                </thead>
                <tbody>
                  {chainPricingRows.map((row, i) => (
                    <tr key={row.tier} style={{background: i === 2 ? 'var(--teal-pale)' : 'var(--bg-card)'}}>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: i === 2 ? 600 : 400, color: i === 2 ? 'var(--teal)' : 'var(--ink)'}}>
                        {row.tier} {i === 2 && <span style={{fontSize: 11, background: 'var(--teal)', color: '#fff', padding: '2px 8px', borderRadius: 20, marginLeft: 8, fontFamily: 'var(--font-mono)'}}>Most common</span>}
                      </td>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'right' as const, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--teal)'}}>{row.perLocation}</td>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'right' as const, fontFamily: 'var(--font-mono)'}}>{row.perPatient}</td>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', color: 'var(--ink-soft)', fontSize: 13}}>{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <a href="mailto:chains@mypulsescan.com" className="btn-primary">Get a chain quote →</a>
          </div>
        </section>

        {/* ── CHAIN ADVANTAGES ── */}
        <section className="section section-alt" id="chain-advantages">
          <div className="section-inner">
            <div className="section-kicker">Built for network operators</div>
            <h2 className="section-title">What changes when you run <em>50 locations, not one.</em></h2>
            <div className="feature-grid">
              {chainAdvantages.map(f => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-text">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── OBJECTION HANDLERS ── */}
        <section className="section" id="faq">
          <div className="section-inner">
            <div className="section-kicker">Common questions from chain operators</div>
            <h2 className="section-title">What VP Ops and RCDs <em>always ask first.</em></h2>
            <div style={{display: 'flex', flexDirection: 'column' as const, gap: 20, maxWidth: 800, margin: '40px auto 0'}}>
              {chainObjHandlers.map(q => (
                <div key={q.objection} style={{background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg)', padding: '28px 32px', boxShadow: 'var(--shadow)'}}>
                  <div style={{fontWeight: 600, fontSize: 16, marginBottom: 12, color: 'var(--ink)'}}>{q.objection}</div>
                  <p style={{fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7, margin: 0}}>{q.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="cta-section">
          <div className="cta-section-inner">
            <h2>Ready to model your network? <em style={{color: 'var(--teal-lt)'}}>We&apos;ll run the math with you.</em></h2>
            <p>
              Bring your location count and patient volume. We&apos;ll show you the full billing picture,
              the chain pricing, and a phased rollout sequence — in one call.
            </p>
            <div className="cta-actions">
              <a href="mailto:chains@mypulsescan.com" className="btn-white">
                Talk to our chain team →
              </a>
              <a href="/" className="btn-outline-white">
                ← Back to MyPulseScan
              </a>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
