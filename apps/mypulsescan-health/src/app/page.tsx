import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MSO Clinical Intelligence Platform | MyPulseScan',
  description:
    'Clinical intelligence for multi-location practices and PE-backed MSOs. Usage-based pricing, RPM billing automation, 30-day pilot included.',
  openGraph: {
    title: 'MSO Clinical Intelligence Platform | MyPulseScan',
    description:
      'Clinical intelligence for multi-location practices and PE-backed MSOs. Usage-based pricing, RPM billing automation, 30-day pilot included.',
    url: 'https://mypulsescan.health',
    siteName: 'MyPulseScan Health',
    images: [
      {
        url: 'https://mypulsescan.health/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'MyPulseScan Enterprise Clinical Intelligence Platform',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MSO Clinical Intelligence Platform | MyPulseScan',
    description:
      'Clinical intelligence for multi-location practices and PE-backed MSOs. Usage-based pricing, RPM billing automation, 30-day pilot included.',
    images: ['https://mypulsescan.health/opengraph-image'],
  },
  alternates: {
    canonical: 'https://mypulsescan.health',
  },
}

export default function HomePage() {
  return (
    <>
      {/* ── NAV ─────────────────────────────────────────── */}
      <nav className="nav" aria-label="Main navigation">
        <div className="nav-inner">
          <div className="nav-logo">
            MyPulseScan<span>.health</span>
          </div>
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={link.cta ? 'nav-cta' : ''}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <main id="main-content">
      <section className="hero" id="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <p className="kicker hero-kicker">Enterprise Clinical Intelligence</p>
            <h1>
              Clinical Intelligence
              <br />
              <em className="italic-teal">at Scale.</em>
            </h1>
            <p className="hero-subhead">
              Built for multi-location practices, PE-backed platforms, and MSOs ready to turn
              patient data into revenue.
            </p>
            <div className="hero-actions">
              <a href="mailto:pilot@mypulsescan.health" className="btn-primary">
                Start a 30-Day Pilot →
              </a>
              <a
                href="mailto:pilot@mypulsescan.health?subject=Economics Brief"
                className="btn-ghost"
              >
                Download the Economics Brief
              </a>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="stats-panel">
            <p className="stats-panel-header">Portfolio Economics — Per Location</p>
            <div className="stats-grid">
              {HERO_STATS.map((stat) => (
                <div key={stat.number} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                  <div className="stat-desc">{stat.desc}</div>
                </div>
              ))}
            </div>
            <p className="stats-panel-footer">
              FHIR R4 · CommonWell · Carequality · TEFCA · BAA Available
            </p>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM AT SCALE ─────────────────────────── */}
      <section className="section section-offwhite" id="problem">
        <div className="section-header container">
          <p className="kicker">The Problem at Scale</p>
          <h2>
            At 50 locations, gaps become
            <br />
            <em className="italic-teal">portfolio liabilities.</em>
          </h2>
          <p>
            What feels like an intake problem at one clinic is a $2M liability problem across your
            network. MyPulseScan closes the gap.
          </p>
        </div>
        <div className="card-grid-3 container">
          {PROBLEMS.map((p) => (
            <div key={p.num} className="problem-card">
              <p className="problem-num">Problem {p.num}</p>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE PLATFORM ─────────────────────────────────── */}
      <section className="section section-light" id="platform">
        <div className="section-header container">
          <p className="kicker">The Platform</p>
          <h2>
            What MyPulseScan delivers
            <br />
            <em className="italic-teal">across your network.</em>
          </h2>
          <p>
            Not a point solution. A clinical intelligence layer that runs across every location in
            your portfolio — from day one.
          </p>
        </div>
        <div className="platform-grid container">
          {PLATFORM_FEATURES.map((f) => (
            <div key={f.title} className="platform-item">
              <div className="platform-check">✓</div>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE ECONOMICS ────────────────────────────────── */}
      <section className="section section-offwhite" id="economics">
        <div className="section-header container">
          <p className="kicker">The Economics</p>
          <h2>
            Medicare pays your network $95.
            <br />
            <em className="italic-teal">We charge $6. You keep $89.</em>
          </h2>
          <p>
            Per enrolled RPM patient, per month. Platform fee covers everything else.
            Our revenue comes from new reimbursement — not your existing budget.
          </p>
        </div>

        <div className="pricing-grid container">
          {PRICING_TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`pricing-card${tier.featured ? ' featured' : ''}`}
            >
              {tier.featured && <div className="pricing-badge">Most Popular</div>}
              <div className="pricing-tier">{tier.tier}</div>
              <h3>{tier.name}</h3>
              <p className="pricing-desc">{tier.tagline}</p>
              <div className="pricing-price">{tier.price}</div>
              <p className="pricing-price-sub">{tier.priceSub}</p>
              <ul className="pricing-features">
                {tier.features.map((f) => (
                  <li key={f} className="pricing-feature">
                    <span className="pricing-feature-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:pilot@mypulsescan.health"
                className="pricing-cta"
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="pricing-tagline container">
          &ldquo;Medicare pays you $95. We charge $6. You keep $89. Per patient, per month.&rdquo;
        </p>

        <div className="economics-math container">
          <p className="kicker">Show the math</p>
          <div className="math-equation">
            <span className="math-highlight">100 locations</span> × 200 patients × 40% chronic ×
            $95/month ×{' '}
            <span className="math-highlight">10% revenue share</span>
            {' = '}
          </div>
          <div className="math-result">
            <div className="math-result-item">
              <div className="math-result-number">$76K</div>
              <div className="math-result-label">/ month to MyPulseScan</div>
            </div>
            <div className="math-result-item">
              <div className="math-result-number">$684K</div>
              <div className="math-result-label">/ month to your network</div>
            </div>
            <div className="math-result-item">
              <div className="math-result-number">9×</div>
              <div className="math-result-label">revenue returned to you</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE 30-DAY PILOT ─────────────────────────────── */}
      <section className="section section-light" id="pilot">
        <div className="section-header container">
          <p className="kicker">The 30-Day Pilot</p>
          <h2>
            No IT project.
            <br />
            <em className="italic-teal">Afternoon setup.</em>
          </h2>
          <p>
            One location. Four weeks. Everything you need to make a fleet decision.
          </p>
        </div>
        <div className="pilot-steps container">
          {PILOT_STEPS.map((step) => (
            <div key={step.day} className="pilot-step">
              <div className="pilot-day">
                <div className="pilot-day-num">{step.day}</div>
                <div className="pilot-day-label">Day</div>
              </div>
              <div className="pilot-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO BUYS THIS ────────────────────────────────── */}
      <section className="section section-offwhite">
        <div className="section-header container">
          <p className="kicker">Who Buys This</p>
          <h2>
            Built for operators who
            <br />
            <em className="italic-teal">think in portfolio ROI.</em>
          </h2>
        </div>
        <div className="card-grid-3 container">
          {BUYER_SEGMENTS.map((b) => (
            <div key={b.tag} className="buyer-card">
              <span className="buyer-tag">{b.tag}</span>
              <h3>{b.title}</h3>
              <p>{b.desc}</p>
              <p className="buyer-examples">{b.examples}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────── */}
      <section className="section section-light">
        <div className="section-header container">
          <p className="kicker">From the Field</p>
          <h2>
            Operators who ran the
            <br />
            <em className="italic-teal">pilot. Then the rollout.</em>
          </h2>
        </div>
        <div className="testimonials-grid container">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="testimonial-card">
              <p className="testimonial-quote">{t.quote}</p>
              <p className="testimonial-author">{t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA SECTION ──────────────────────────────────── */}
      <section className="cta-section" id="contact">
        <div className="cta-inner">
          <h2>One pilot. 30 days. Your data.</h2>
          <p>
            No IT project. No EHR replacement. Pick one location and we&apos;ll show you the
            numbers. If the ROI isn&apos;t there, you walk away. If it is, you have everything you
            need to roll out.
          </p>
          <div className="cta-actions">
            <a href="mailto:pilot@mypulsescan.health" className="btn-white">
              Start Your Pilot →
            </a>
            <a
              href="mailto:pilot@mypulsescan.health?subject=Economics Brief"
              className="btn-outline-white"
            >
              Download the Economics Brief
            </a>
          </div>
        </div>
      </section>

      </main>
      {/* ── FOOTER ───────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-logo">
              MyPulseScan<span>.health</span>
            </div>
            <p className="footer-sub">NuStack Digital Ventures</p>
          </div>
          <div className="footer-right">
            <div className="footer-contact">
              <a href="mailto:pilot@mypulsescan.health">pilot@mypulsescan.health</a>
              {' · '}
              <a href="mailto:hello@mypulsescan.health">hello@mypulsescan.health</a>
            </div>
            <div className="footer-badges">
              {FOOTER_BADGES.map((b) => (
                <span key={b} className="footer-badge">{b}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

/* ── DATA ──────────────────────────────────────────────── */

const NAV_LINKS = [
  { href: '#platform', label: 'The Platform', cta: false },
  { href: '#economics', label: 'Economics', cta: false },
  { href: '#pilot', label: 'Pilot Program', cta: false },
  { href: '#contact', label: 'Contact', cta: false },
  { href: 'mailto:pilot@mypulsescan.health', label: 'Start a 30-Day Pilot →', cta: true },
]

const HERO_STATS = [
  {
    number: '$1,140',
    label: 'Per enrolled patient / year',
    desc: 'RPM billing revenue via CPT 99453/99454/99457',
  },
  {
    number: '6 min',
    label: 'Saved per visit',
    desc: 'Staff time recovered through automated record pull',
  },
  {
    number: '90%',
    label: 'US population covered',
    desc: 'CommonWell + Carequality + TEFCA + Surescripts',
  },
  {
    number: '30 days',
    label: 'To first ROI',
    desc: 'Pilot at one location, full report by day 30',
  },
]

const PROBLEMS = [
  {
    num: '01',
    title: 'At 50 locations, incomplete intake is a $2M liability problem.',
    desc: 'Wrong-patient errors, missed drug interactions, and incomplete medication histories don\'t scale linearly — they compound. One location\'s blind spot becomes your network\'s exposure.',
  },
  {
    num: '02',
    title: 'Duplicate testing across your network costs more than your EMR.',
    desc: 'Without visibility into what was ordered at location A, location B orders it again. At scale, redundant labs and imaging add up faster than any software license you\'ve ever paid.',
  },
  {
    num: '03',
    title: 'Your highest-risk patients are invisible between visits.',
    desc: 'Chronic patients with filled prescriptions, recent ER visits, or new diagnoses at competitor facilities don\'t show up in your system until they\'re in crisis — and in front of your staff.',
  },
]

const PLATFORM_FEATURES = [
  {
    title: 'Multi-network aggregation',
    desc: 'CommonWell, Carequality, TEFCA, Epic, and Surescripts — every major health record network, unified in a single query at the point of care.',
  },
  {
    title: 'Patient match confidence scoring',
    desc: 'Eliminates wrong-patient liability before it reaches your staff. Every record returned is scored for match confidence — your teams only see verified data.',
  },
  {
    title: 'Real pharmacy fill history',
    desc: 'Not self-reported medications. Actual dispense history from Surescripts — what was filled, when, and at which pharmacy. Catches non-adherence and poly-pharmacy on intake.',
  },
  {
    title: 'Direct EMR push via Redox',
    desc: 'Epic, Athena, eClinicalWorks, Cerner — zero re-entry. Records are pushed directly into the chart, not into a separate portal your staff has to toggle to.',
  },
  {
    title: 'HIPAA audit trail on every pull',
    desc: 'Every record query is logged with the treatment relationship attestation. Your compliance team has a complete audit trail without any manual documentation.',
  },
  {
    title: 'RPM billing automation',
    desc: 'CPT 99453, 99454, 99457 — the $1,140/enrolled patient/year opportunity. We identify eligible patients, automate device enrollment, and feed billable time data to your billing team.',
  },
]

const PRICING_TIERS = [
  {
    tier: 'Tier 1',
    name: 'Pilot',
    tagline: 'Prove it works before you commit.',
    price: '$0',
    priceSub: '1 location · 30 days · no commitment',
    featured: false,
    cta: 'Start Your Pilot',
    features: [
      'One location, full 30-day term',
      'Full platform access — nothing gated',
      'Day-30 ROI summary report',
      'Records retrieved + interactions flagged',
      'RPM-eligible patient identification',
      'Rollout recommendation included',
    ],
  },
  {
    tier: 'Tier 2',
    name: 'Growth',
    tagline: 'Medicare pays $95/patient. We take $6. You keep $89.',
    price: '$299',
    priceSub: 'per location / month + $6 per enrolled RPM patient',
    featured: true,
    cta: 'Get Growth Pricing',
    features: [
      '5–50 locations',
      'Platform fee: $299/location/month (record pulls, EMR push, audit trail)',
      'RPM fee: $6/enrolled patient/month — funded by Medicare reimbursement',
      'Medicare pays $95 → you keep $89 net per patient',
      'Dedicated implementation team',
      'Quarterly ROI reviews',
    ],
  },
  {
    tier: 'Tier 3',
    name: 'Platform',
    tagline: 'Same $6/patient fee. Platform rate negotiated at volume.',
    price: 'Custom',
    priceSub: 'per location / month + $6 per enrolled RPM patient',
    featured: false,
    cta: 'Schedule a Platform Call',
    features: [
      '50+ locations',
      'Same $6/patient RPM fee — funded by Medicare reimbursement',
      'Platform rate negotiated based on location count',
      'Custom EMR integrations + dedicated CSM',
      'Executive reporting dashboard',
      'BAA + enterprise SLA included',
    ],
  },
]

const PILOT_STEPS = [
  {
    day: '1',
    title: 'One location, zero IT project, afternoon setup.',
    desc: 'We connect to your existing EMR via Redox. No new software to install, no IT tickets to open. Your staff is querying patient records by end of day.',
  },
  {
    day: '7',
    title: 'First patient match confidence report.',
    desc: 'See exactly how many patient records returned at 90%+ match confidence, how many were flagged for review, and how much staff time was saved versus manual fax requests.',
  },
  {
    day: '14',
    title: 'Drug interaction flags + staff time recovered report.',
    desc: 'Cumulative report: interactions flagged before they reached a prescriber, total record pull time vs. prior fax workflow, and early indicators on RPM-eligible patient population.',
  },
  {
    day: '30',
    title: 'Full ROI summary — your rollout decision made easy.',
    desc: 'Records retrieved, interactions flagged, staff hours recovered, RPM revenue potential across your eligible patient population, and a location-by-location rollout recommendation with payback period.',
  },
]

const BUYER_SEGMENTS = [
  {
    tag: 'PE-Backed MSOs',
    title: 'Multi-site platforms built for portfolio ROI.',
    desc: 'You manage 20–200 locations and report to a board that wants EBITDA improvement, not feature lists. MyPulseScan.health speaks in per-location economics, rollout velocity, and revenue per enrolled patient.',
    examples: 'TeamHealth · US Acute Care Solutions · Carbon Health',
  },
  {
    tag: 'Urgent Care Chains',
    title: 'Walk-in volume means walk-in liability.',
    desc: 'You see 50–300 patients daily with no prior relationship. Missed drug interactions and duplicate orders are your highest-risk exposure. We close that gap at the point of registration — before the provider sees the patient.',
    examples: 'CareNow · CityMD · NextCare · GoHealth',
  },
  {
    tag: 'Medicare-Heavy Primary Care',
    title: 'RPM billing is already in your contracts. Capture it.',
    desc: 'Your chronic patient panel is pre-qualified for RPM reimbursement. Most organizations leave $800–$1,400 per eligible patient on the table annually. We automate enrollment, monitoring, and billing documentation.',
    examples: 'Oak Street Health · ChenMed · VillageMD · Iora Health',
  },
]

const TESTIMONIALS = [
  {
    quote:
      'We piloted at two locations. By day 30 we had the data to justify a 47-location rollout.',
    author: 'Operations VP, Regional Urgent Care Group',
  },
  {
    quote:
      'The per-location economics made this a no-brainer. We weren\'t buying software — we were buying a revenue layer.',
    author: 'CFO, PE-Backed MSO (Southeast)',
  },
]

const FOOTER_BADGES = ['HIPAA Compliant', 'FHIR R4', 'TEFCA', 'BAA Available']
