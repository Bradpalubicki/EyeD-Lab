import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import RoiCalculator from '@/components/RoiCalculator'

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-kicker">For Urgent Care &amp; Primary Care Operators</div>
          <h1>Your intake forms are <em>costing you money.</em></h1>
          <p className="hero-sub">
            Every patient that walks through your door gives you their full medical history in 30 seconds —
            no forms, no faxing, no liability gaps — and Medicare pays for it.
          </p>
          <div className="hero-actions">
            <a href="#calculator" className="btn-primary">
              Calculate My ROI →
            </a>
            <a href="#how-it-works" className="btn-ghost">
              See how it works ↓
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-n">30s</div>
              <div className="hero-stat-l">Patient lookup time</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">320M+</div>
              <div className="hero-stat-l">US patients covered</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">4×</div>
              <div className="hero-stat-l">Average ROI on cost</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">$1,470</div>
              <div className="hero-stat-l">Annual RPM revenue / patient</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NETWORK LOGOS ── */}
      <div className="logos-strip">
        <div className="logos-inner">
          <div className="logos-label">Connected networks</div>
          <div className="logos-items">
            {['CommonWell', 'Carequality', 'Epic MyChart', 'Apple Health', 'Google Health', 'TEFCA'].map(n => (
              <div key={n} className="logo-item">
                <div className="logo-dot" />
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section" id="features">
        <div className="section-inner">
          <div className="section-kicker">Platform capabilities</div>
          <h2 className="section-title">Everything your clinic needs to <em>know more, bill more.</em></h2>
          <p className="section-sub">
            Stop asking patients to remember their medication lists. MyPulseScan pulls verified records from
            every major health network — automatically, compliantly, and in real time.
          </p>
          <div className="feature-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section section-alt" id="how-it-works">
        <div className="section-inner">
          <div className="section-kicker">The workflow</div>
          <h2 className="section-title">Patient arrives. Records appear. <em>You&apos;re already ready.</em></h2>
          <p className="section-sub">
            Four steps from check-in to complete clinical picture. No IT department required.
          </p>
          <div className="steps-grid">
            {steps.map(s => (
              <div key={s.n} className="step-item">
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-text">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CPT CODES / REVENUE ── */}
      <section className="section" id="revenue">
        <div className="section-inner">
          <div className="section-kicker">Medicare billing</div>
          <h2 className="section-title">Three CPT codes. <em>$1,470 per patient per year.</em></h2>
          <p className="section-sub">
            Remote Patient Monitoring is already reimbursed by Medicare. Most clinics are leaving this
            revenue on the table because setup is too complex. MyPulseScan wires it in automatically.
          </p>
          <div className="cpt-grid">
            {cptCodes.map(c => (
              <div key={c.code} className="cpt-card">
                <div className="cpt-code">CPT {c.code}</div>
                <div className="cpt-title">{c.title}</div>
                <p className="cpt-desc">{c.desc}</p>
                <div className="cpt-rate">{c.rate}</div>
                <div className="cpt-rate-sub">{c.rateSub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF PANEL ── */}
      <section className="section section-dark">
        <div className="section-inner">
          <div className="proof-panel">
            <div>
              <div className="section-kicker" style={{color: 'var(--teal-lt)'}}>
                Why operators choose MyPulseScan
              </div>
              <h2 className="section-title">The clinical data you need. <em style={{color: 'var(--teal-lt)'}}>Already in the network.</em></h2>
              <p className="section-sub">
                Unlike EHR integrations that only connect to one health system, MyPulseScan accesses
                CommonWell and Carequality — the two largest US health data networks — covering 90% of
                US patients regardless of where they received care.
              </p>
              <a href="#calculator" className="btn-primary">See your numbers →</a>
            </div>
            <div className="proof-stats">
              {proofStats.map(s => (
                <div key={s.n} className="proof-stat">
                  <div className="proof-stat-n">{s.n}</div>
                  <div className="proof-stat-l">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VERTICALS ── */}
      <section className="section section-alt" id="verticals">
        <div className="section-inner">
          <div className="section-kicker">Built for your model</div>
          <h2 className="section-title">The right fit for <em>every practice type.</em></h2>
          <p className="section-sub">
            Whether you see 50 patients a day or manage a network of locations, MyPulseScan
            adapts to your workflow and billing model.
          </p>
          <div className="verticals-grid">
            {verticals.map(v => (
              <div key={v.tag} className="vertical-card">
                <div className="vertical-card-img">{v.icon}</div>
                <div className="vertical-card-body">
                  <div className="vertical-card-tag">{v.tag}</div>
                  <div className="vertical-card-title">{v.title}</div>
                  <p className="vertical-card-text">{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-kicker">From the field</div>
          <h2 className="section-title">What practice managers <em>actually say.</em></h2>
          <p className="section-sub" style={{marginBottom: 40}}>
            Early access operators across urgent care and primary care.
          </p>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.name} className="testimonial-card">
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI CALCULATOR ── */}
      <section className="section section-alt" id="calculator">
        <div className="section-inner">
          <div className="section-kicker">Build your business case</div>
          <h2 className="section-title" style={{marginBottom: 8}}>Calculate your <em>exact ROI.</em></h2>
          <p className="section-sub">
            Adjust your patient volume, staffing costs, and RPM enrollment to see your precise
            monthly and annual return on MyPulseScan.
          </p>
          <RoiCalculator />
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-section">
        <div className="cta-section-inner">
          <h2>Start seeing complete patient records in 30 seconds.</h2>
          <p>
            Setup takes one afternoon. Your first month of RPM billing covers the platform cost.
            No long-term contracts.
          </p>
          <div className="cta-actions">
            <a href="mailto:hello@mypulsescan.com" className="btn-white">
              Request a Demo →
            </a>
            <a href="#calculator" className="btn-outline-white">
              View ROI Calculator
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

// ── DATA ──

const features = [
  {
    icon: '⚡',
    title: 'Instant Record Retrieval',
    text: 'Pull verified patient history from 320M+ US records in under 30 seconds. Medications, allergies, conditions, labs — everything, instantly.',
  },
  {
    icon: '🏥',
    title: 'TEFCA Network Access',
    text: 'Connected to CommonWell and Carequality — the two largest US health data networks. Cross-organization records included.',
  },
  {
    icon: '💰',
    title: 'Automatic RPM Billing',
    text: 'Medicare reimburses $95/month per enrolled patient for Remote Patient Monitoring. MyPulseScan automates the paperwork.',
  },
  {
    icon: '🔒',
    title: 'HIPAA Compliant by Default',
    text: 'Every data request is logged, auditable, and scoped to treatment purpose. BAA included. FHIR R4 standard throughout.',
  },
  {
    icon: '📋',
    title: 'No-Form Patient Intake',
    text: 'Eliminate clipboards and PDF intake forms. Records arrive before the patient sits down. Staff spends time on care, not data entry.',
  },
  {
    icon: '📊',
    title: 'Revenue Intelligence Dashboard',
    text: 'See CPT billing opportunities, enrollment rates, and revenue per patient — in one place. Know your single number every morning.',
  },
]

const steps = [
  { n: '01', title: 'Patient Checks In', text: 'Staff enters name, DOB, and ZIP. That\'s it. No paper forms, no manual data entry.' },
  { n: '02', title: 'Records Retrieved', text: 'MyPulseScan queries CommonWell + Carequality in real time. Full medical history in 30 seconds.' },
  { n: '03', title: 'Provider Reviews', text: 'Medications, allergies, recent labs, and active conditions appear in a clean clinical view. Care decisions improve immediately.' },
  { n: '04', title: 'RPM Billed Automatically', text: 'Eligible patients are enrolled in RPM automatically. Medicare billing flows through your existing billing system.' },
]

const cptCodes = [
  {
    code: '99453',
    title: 'Device Setup',
    desc: 'One-time setup and patient education for remote monitoring device. Billed once per patient.',
    rate: '$20',
    rateSub: 'one-time per patient',
  },
  {
    code: '99454',
    title: 'Device Supply',
    desc: 'Monthly supply of remote monitoring device with daily readings. Medicare reimburses per 30-day period.',
    rate: '$47',
    rateSub: 'per month per patient',
  },
  {
    code: '99457',
    title: 'Remote Monitoring',
    desc: 'Clinical staff time reviewing data and communicating with patient. Minimum 20 min/month required.',
    rate: '$48',
    rateSub: 'per month per patient',
  },
]

const proofStats = [
  { n: '320M+', l: 'US patients in network' },
  { n: '90%', l: 'US population coverage' },
  { n: '30s', l: 'Average retrieval time' },
  { n: '$1,470', l: 'Annual RPM rev/patient' },
]

const verticals = [
  {
    icon: '🚑',
    tag: 'Urgent Care',
    title: 'High-Volume, High-Stakes',
    text: 'Walk-in patients bring zero history. MyPulseScan gives your providers a complete picture before the exam room door opens.',
  },
  {
    icon: '🩺',
    tag: 'Primary Care',
    title: 'Continuity of Care',
    text: 'Your patients see specialists, urgent care, and ERs that you never hear about. MyPulseScan closes the loop automatically.',
  },
  {
    icon: '🏢',
    tag: 'Insurance-Based Practice',
    title: 'Documentation-First',
    text: 'Verified record history strengthens every prior auth, reduces denials, and supports accurate risk coding at scale.',
  },
]

const testimonials = [
  {
    quote: 'We were asking patients to remember their medications on a clipboard. Now we have their actual pharmacy history before they sit down. It changed how we practice.',
    name: 'Dr. Sarah M.',
    role: 'Medical Director, Urgent Care Network (Chicago)',
    initials: 'SM',
  },
  {
    quote: 'The RPM billing alone paid for the platform in the first month. We enrolled 40 patients and added $3,800 in monthly recurring revenue we weren\'t capturing before.',
    name: 'James K.',
    role: 'Practice Manager, Primary Care Group (Dallas)',
    initials: 'JK',
  },
  {
    quote: 'Our prior auth denial rate dropped 22% in the first quarter. Having verified records attached to every claim changed our relationship with the payers.',
    name: 'Michelle T.',
    role: 'Revenue Cycle Director, Multi-Location Practice (Phoenix)',
    initials: 'MT',
  },
]
