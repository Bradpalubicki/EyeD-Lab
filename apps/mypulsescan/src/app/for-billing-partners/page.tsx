import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Billing Partner Program | MyPulseScan',
  description: 'White-label MyPulseScan to your urgent care clients. They get $17,710/month in enabled revenue. You get 25% margin. No new infrastructure required.',
  alternates: { canonical: 'mypulsescan.com/for-billing-partners' },
}

const marginModel = [
  { clients: 10, resale: '$300', yourCost: '$200', grossPerClient: '$100', monthlyGross: '$1,000', annualGross: '$12,000' },
  { clients: 25, resale: '$300', yourCost: '$200', grossPerClient: '$100', monthlyGross: '$2,500', annualGross: '$30,000' },
  { clients: 50, resale: '$275', yourCost: '$175', grossPerClient: '$100', monthlyGross: '$5,000', annualGross: '$60,000' },
  { clients: 100, resale: '$275', yourCost: '$150', grossPerClient: '$125', monthlyGross: '$12,500', annualGross: '$150,000' },
]

const partnerBenefits = [
  {
    icon: '🏷',
    title: 'White-label option',
    text: 'Present MyPulseScan under your firm\'s brand. Your clients see your name. You own the relationship. We operate the infrastructure.',
  },
  {
    icon: '💼',
    title: 'Your revenue pitch just got stronger',
    text: 'Your clients are already paying you to optimize their billing. Now you bring them a tool that enables $17,710/month in new revenue streams. That\'s a retention and expansion play.',
  },
  {
    icon: '📈',
    title: '250–300% margin on Particle cost',
    text: 'Your resale price is $250–$300/practice/month. Our infrastructure cost is $100–$150. The spread is yours.',
  },
  {
    icon: '🔗',
    title: 'No new infrastructure to manage',
    text: 'You resell access. We operate the Particle Health connection, the FHIR layer, the EMR integration, and the HIPAA audit trail. Your clients get the platform; you get the margin.',
  },
  {
    icon: '📋',
    title: 'Co-sell materials included',
    text: 'ROI models, billing code explainers, and objection-handling guides formatted for your clients — customized with your branding.',
  },
  {
    icon: '🤝',
    title: 'Dedicated partner success contact',
    text: 'A single point of contact for client onboarding, escalations, and billing questions. You talk to us; your clients talk to you.',
  },
]

const partnerQualifiers = [
  'Serves urgent care, primary care, or multi-specialty practices',
  'Currently provides RCM, billing, or coding services',
  'Has 5+ active practice clients',
  'Looking to add a recurring revenue product to your service stack',
]

export default function ForBillingPartnersPage() {
  return (
    <>
      <Nav />
      <main id="main-content">

        {/* ── HERO ── */}
        <section className="hero" aria-label="For Billing Partners">
          <div className="hero-inner">
            <div className="hero-kicker">For Healthcare Billing Service Bureaus</div>
            <h1>Your clients get <em>$17,710/month.</em><br />You get 25% margin.</h1>
            <p className="hero-sub">
              White-label MyPulseScan to your urgent care clients. They get a complete record retrieval
              and billing enablement platform. You get a recurring revenue product with 250–300% margin
              on infrastructure cost — and a reason for every client to stay.
            </p>
            <div className="hero-actions">
              <a href="mailto:partners@mypulsescan.com" className="btn-primary">
                Apply for partner access →
              </a>
              <a href="#margin-model" className="btn-ghost">
                See the margin model ↓
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-n">$250–$300</div>
                <div className="hero-stat-l">Your resale price / practice / mo</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n">250–300%</div>
                <div className="hero-stat-l">Margin on Particle infrastructure cost</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n">$150K</div>
                <div className="hero-stat-l">Annual gross at 100 clients</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-n">$0</div>
                <div className="hero-stat-l">New infrastructure for you to build</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHAT YOU'RE SELLING ── */}
        <section className="section section-alt">
          <div className="section-inner">
            <div className="section-kicker">What you&apos;re selling to your clients</div>
            <h2 className="section-title">A platform that enables <em>$17,710/month in new revenue</em> per practice.</h2>
            <p className="section-sub">
              MyPulseScan retrieves the verified external patient record in 30 seconds. For practices
              that offer CCM, BHI, TCM, or RPM, that verified record makes those billing codes documentable
              and defensible. Your clients keep the revenue. You keep the margin.
            </p>
            <div style={{background: 'var(--teal-pale)', border: '1px solid var(--teal-lt)', borderRadius: 'var(--r-lg)', padding: '32px', marginBottom: 16}}>
              <div style={{fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: 'var(--teal)', marginBottom: 20}}>
                What your client earns — per practice, 200 patients/month
              </div>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24}}>
                {[
                  { label: 'RPM revenue', value: '$5,700', sub: '60 pts × $95/mo' },
                  { label: 'CCM (if offered)', value: '$4,650', sub: '75 pts × $62/mo' },
                  { label: 'BHI (if offered)', value: '$1,710', sub: '30 pts × $57/mo' },
                  { label: 'TCM (post-discharge)', value: '$3,500', sub: '20 events × $175' },
                  { label: 'Prior auth savings', value: '$3,500', sub: '100 pts × $35' },
                  { label: 'Platform cost', value: '-$300', sub: 'Your resale price', neg: true },
                ].map(r => (
                  <div key={r.label}>
                    <div style={{fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4}}>{r.label}</div>
                    <div style={{fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600, color: r.neg ? 'var(--red)' : 'var(--teal)'}}>{r.value}</div>
                    <div style={{fontSize: 11, color: 'var(--ink-muted)'}}>{r.sub}</div>
                  </div>
                ))}
              </div>
              <div style={{borderTop: '1px solid var(--teal-lt)', paddingTop: 20}}>
                <div style={{fontSize: 12, color: 'var(--ink-muted)', marginBottom: 4}}>NET MONTHLY REVENUE TO PRACTICE</div>
                <div style={{fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 700, color: 'var(--teal)'}}>$19,060 / mo</div>
                <div style={{fontSize: 12, color: 'var(--ink-muted)'}}>After your platform fee</div>
              </div>
            </div>
            <div style={{fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6}}>
              CCM, BHI, and TCM apply to eligible patients at practices that offer these services.
              MyPulseScan retrieves the verified external record. Your clients&apos; clinical teams decide what to do with it.
              Their billing teams determine what codes apply.
            </div>
          </div>
        </section>

        {/* ── MARGIN MODEL ── */}
        <section className="section" id="margin-model">
          <div className="section-inner">
            <div className="section-kicker">Your margin model</div>
            <h2 className="section-title">What the <em>recurring revenue looks like for your firm.</em></h2>
            <p className="section-sub">
              Platform-only margin — before counting any RCM fees you earn on the additional billing revenue your clients now generate.
            </p>
            <div style={{overflowX: 'auto' as const, marginBottom: 32}}>
              <table style={{width: '100%', borderCollapse: 'collapse' as const, fontSize: 14}}>
                <thead>
                  <tr style={{background: 'var(--bg-alt)'}}>
                    {['Active Clients', 'Your Resale Price', 'Your Cost', 'Gross / Client', 'Monthly Gross', 'Annual Gross'].map(h => (
                      <th key={h} style={{padding: '14px 20px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase' as const, color: 'var(--ink-muted)', borderBottom: '2px solid var(--border)', textAlign: h === 'Active Clients' ? 'left' as const : 'right' as const}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {marginModel.map((row, i) => (
                    <tr key={row.clients} style={{background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg)'}}>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', fontWeight: 600}}>{row.clients} practices</td>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'right' as const, fontFamily: 'var(--font-mono)'}}>{row.resale}</td>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'right' as const, fontFamily: 'var(--font-mono)', color: 'var(--red)'}}>{row.yourCost}</td>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'right' as const, fontFamily: 'var(--font-mono)', color: 'var(--teal)'}}>{row.grossPerClient}</td>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'right' as const, fontFamily: 'var(--font-mono)', fontWeight: 600}}>{row.monthlyGross}</td>
                      <td style={{padding: '16px 20px', borderBottom: '1px solid var(--border)', textAlign: 'right' as const, fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--teal)'}}>{row.annualGross}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{background: 'var(--bg-alt)', borderRadius: 'var(--r)', padding: '16px 20px', fontSize: 12, color: 'var(--ink-muted)', lineHeight: 1.6}}>
              Platform margin only. Not included: incremental RCM fees you earn on CCM, BHI, and TCM billing your clients newly capture.
              If you bill on a percentage-of-collections model, the new billing volume your clients generate flows through your RCM fee as well.
            </div>
          </div>
        </section>

        {/* ── PARTNER BENEFITS ── */}
        <section className="section section-alt">
          <div className="section-inner">
            <div className="section-kicker">What you get as a partner</div>
            <h2 className="section-title">A complete resale program. <em>Nothing to build.</em></h2>
            <div className="feature-grid">
              {partnerBenefits.map(f => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <div className="feature-title">{f.title}</div>
                  <p className="feature-text">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PARTNER QUALIFIERS ── */}
        <section className="section">
          <div className="section-inner">
            <div className="section-kicker">Is this right for your firm?</div>
            <h2 className="section-title">Partner program is a fit if <em>all four are true.</em></h2>
            <div style={{maxWidth: 640, margin: '40px auto 0'}}>
              {partnerQualifiers.map((q, i) => (
                <div key={i} style={{display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px 0', borderBottom: i < partnerQualifiers.length - 1 ? '1px solid var(--border)' : 'none'}}>
                  <div style={{width: 28, height: 28, borderRadius: '50%', background: 'var(--teal)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 600, flexShrink: 0}}>✓</div>
                  <div style={{fontSize: 15, color: 'var(--ink)', lineHeight: 1.6}}>{q}</div>
                </div>
              ))}
              <div style={{marginTop: 40, textAlign: 'center' as const}}>
                <a href="mailto:partners@mypulsescan.com" className="btn-primary" style={{display: 'inline-block'}}>
                  Apply for partner access →
                </a>
                <div style={{fontSize: 12, color: 'var(--ink-muted)', marginTop: 12}}>
                  Response within 2 business days. No commitment required to apply.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <div className="cta-section">
          <div className="cta-section-inner">
            <h2>Turn your billing practice into a <em style={{color: 'var(--teal-lt)'}}>platform business.</em></h2>
            <p>
              You already know your clients&apos; revenue cycle better than anyone.
              MyPulseScan gives you a product that makes their revenue cycle bigger —
              and makes your firm indispensable in the process.
            </p>
            <div className="cta-actions">
              <a href="mailto:partners@mypulsescan.com" className="btn-white">
                Apply for partner access →
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
