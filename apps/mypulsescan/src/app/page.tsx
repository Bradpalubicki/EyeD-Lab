import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import RoiCalculator from '@/components/RoiCalculator'
import HeartbeatLogo from '@/components/HeartbeatLogo'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does MyPulseScan retrieve patient records?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyPulseScan queries CommonWell, Carequality, and TEFCA simultaneously using only a patient\'s name, date of birth, and ZIP code. Records are aggregated from every connected health network and returned with a patient match confidence score in under 30 seconds.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which health networks does MyPulseScan connect to?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyPulseScan connects to CommonWell, Carequality, TEFCA, Epic MyChart, Apple Health, Google Health, and Surescripts — covering 90% of US patients and 6,000+ pharmacies for real pharmacy fill history.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to get a patient\'s medical history?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'MyPulseScan returns an aggregated, multi-network patient history in under 30 seconds. Staff enters the patient\'s name, date of birth, and ZIP code at check-in. Records are confirmed and pushed to the EMR before the provider opens the exam room door.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does MyPulseScan work with Epic EMR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. MyPulseScan pushes verified records directly into Epic, Athena, eClinicalWorks, and Cerner via Redox. No manual re-entry is required — the chart is pre-populated before the provider walks in.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does Medicare pay for patient record retrieval?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Practices that offer Remote Patient Monitoring (RPM) can bill Medicare under CPT codes 99453 (device setup, $20 one-time), 99454 (device supply, $47/month), and 99457 (remote monitoring, $48/month) — up to $1,470 per enrolled patient per year. MyPulseScan automates the billing workflow for practices that choose to activate RPM.',
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <Nav />

      {/* ── HERO ── */}
      <section className="hero" id="main-content" aria-label="Hero">
        <div className="hero-inner">
          <div style={{marginBottom: 24, display: 'flex', justifyContent: 'center'}}>
            <HeartbeatLogo size={88} />
          </div>
          <div className="hero-kicker">For Urgent Care &amp; Primary Care Operators</div>
          <h1>Your patient just walked in. <em>You already know their history.</em></h1>
          <p className="hero-sub">
            MyPulseScan gives every provider an aggregated, multi-network patient history before the exam room door opens —
            pulled from 320M+ US patients across every major health network, with pharmacy fill data and a patient match confidence score.
            No forms. No faxing. No guessing.
          </p>
          <div className="hero-actions">
            <a href="#cost-of-waiting" className="btn-primary">
              See the cost of waiting →
            </a>
            <a href="#how-it-works" className="btn-ghost">
              How it works ↓
            </a>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-n">30s</div>
              <div className="hero-stat-l">Complete record retrieval</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">320M+</div>
              <div className="hero-stat-l">US patients covered</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">90%</div>
              <div className="hero-stat-l">US population coverage</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-n">6 min</div>
              <div className="hero-stat-l">Saved per patient visit</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NETWORK LOGOS ── */}
      <div className="logos-strip">
        <div className="logos-inner">
          <div className="logos-label">Connected networks</div>
          <div className="logos-items">
            {['CommonWell', 'Carequality', 'TEFCA', 'Epic MyChart', 'Apple Health', 'Google Health', 'Surescripts', 'Redox EMR'].map(n => (
              <div key={n} className="logo-item">
                <div className="logo-dot" />
                {n}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── COST OF WAITING ── */}
      <section className="section" id="cost-of-waiting">
        <div className="section-inner">
          <div className="section-kicker">The problem every urgent care faces</div>
          <h2 className="section-title">Every patient who walks in is a <em>stranger to your system.</em></h2>
          <p className="section-sub">
            They tell you what they remember. You document what they say. And everyone hopes nothing was missed.
            That&apos;s not medicine — that&apos;s guesswork at scale.
          </p>
          <div className="feature-grid">
            {costOfWaiting.map(f => (
              <div key={f.title} className="feature-card" style={{borderTop: '3px solid var(--red-lt)'}}>
                <div className="feature-icon" style={{background: 'var(--red-lt)'}}>{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <p className="feature-text">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section section-alt" id="features">
        <div className="section-inner">
          <div className="section-kicker">What MyPulseScan delivers</div>
          <h2 className="section-title">Complete clinical intelligence. <em>Before the door opens.</em></h2>
          <p className="section-sub">
            Stop asking patients to remember their medications. MyPulseScan pulls verified records from
            every major health network — automatically, compliantly, in real time.
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
      <section className="section" id="how-it-works">
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
      <section className="section section-alt" id="revenue">
        <div className="section-inner">
          <div className="section-kicker">Optional revenue layer — for practices that offer RPM</div>
          <h2 className="section-title">Already offering Remote Patient Monitoring? <em>Bill it automatically.</em></h2>
          <p className="section-sub">
            If your practice offers RPM, MyPulseScan wires the billing automatically — no separate platform needed.
            Medicare reimburses up to $1,470 per enrolled patient per year across three CPT codes.
            This is a bonus layer, not the reason to sign up. The reason is what happens before this.
          </p>
          <div style={{marginBottom: 40, display: 'flex', gap: 16, flexWrap: 'wrap' as const}}>
            <a href="/billing" style={{display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--teal)', color: '#fff', fontWeight: 500, fontSize: 14, padding: '12px 22px', borderRadius: 6, textDecoration: 'none'}}>
              See exactly how the billing works →
            </a>
            <a href="https://careloop.digital" target="_blank" rel="noopener noreferrer" style={{display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid var(--border)', color: 'var(--ink-soft)', fontSize: 14, padding: '12px 22px', borderRadius: 6, textDecoration: 'none'}}>
              RPM management platform ↗
            </a>
          </div>
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
                Unlike EHR integrations that only connect to one health system, MyPulseScan queries
                CommonWell, Carequality, and TEFCA simultaneously — plus pharmacy fill history from
                6,000+ pharmacies via Surescripts. Every record push goes through Redox, so it lands
                in whatever EMR your practice already uses.
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
          <h2 className="section-title" style={{marginBottom: 8}}>See the exact dollar value of <em>knowing more.</em></h2>
          <p className="section-sub">
            Adjust your patient volume and staffing costs. The calculator shows staff time recovered,
            plus optional RPM revenue for practices that choose to activate it.
          </p>
          <RoiCalculator />
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-section">
        <div className="cta-section-inner">
          <h2>Your next patient already has a record. <em style={{color: 'var(--teal-lt)'}}>You just don&apos;t have it yet.</em></h2>
          <p>
            Setup takes one afternoon. No EHR replacement required. No IT project.
            Just complete patient history — every visit, from day one.
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

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Footer />
    </>
  )
}

// ── DATA ──

const costOfWaiting = [
  {
    icon: '💊',
    title: 'Drug interactions you never see coming',
    text: 'A patient on warfarin gets ibuprofen. A patient on SSRIs gets tramadol. They forgot to mention it. Your staff didn\'t ask. The clipboard never had a chance.',
  },
  {
    icon: '📋',
    title: '6 minutes of staff time. Per patient. Every visit.',
    text: 'At 200 patients/day, your team spends 20 hours a week transcribing information patients can\'t accurately recall. That\'s half an FTE — gone.',
  },
  {
    icon: '⚖️',
    title: 'The liability gap no one talks about',
    text: 'When a decision is made on incomplete history, documented or not, the practice bears the risk. Verified records close that gap before it opens.',
  },
]

const features = [
  {
    icon: '⚡',
    title: 'Best-Available History in 30 Seconds',
    text: 'Name, DOB, ZIP — that\'s all your staff enters. Aggregated records from every connected network appear in seconds. Multi-source, verified, confidence-scored.',
  },
  {
    icon: '🏥',
    title: 'Every Network. One Query.',
    text: 'CommonWell, Carequality, and TEFCA cover 90% of US patients. Epic MyChart, Apple Health, and Google Health fill the rest. One request hits all of them simultaneously.',
  },
  {
    icon: '💊',
    title: 'Real Medication History — Not What They Remember',
    text: 'Pharmacy fill data shows what patients actually picked up — not just what was prescribed. Drug interaction detection only works when the medication list is real.',
  },
  {
    icon: '🎯',
    title: 'Patient Match Confidence Score',
    text: 'Every record retrieval returns a match confidence score. Staff confirms the right patient before the chart populates. No false positives. No wrong-patient liability.',
  },
  {
    icon: '🔒',
    title: 'HIPAA-Compliant by Architecture',
    text: 'Every request is scoped to treatment purpose, logged, and auditable. BAA included on day one. FHIR R4 throughout. Full consent trail on every pull.',
  },
  {
    icon: '📋',
    title: 'No Clipboards. No Intake Forms.',
    text: 'Eliminate paper forms entirely. Records arrive before the patient sits down. Staff time shifts from data entry to actual care.',
  },
  {
    icon: '🔄',
    title: 'Direct EMR Import — Zero Re-Entry',
    text: 'Records push directly into your EMR via Redox — Epic, Athena, eClinicalWorks, Cerner. Your chart is pre-populated before the provider opens the door.',
  },
  {
    icon: '🧾',
    title: 'Verified History for Every Prior Auth',
    text: 'Attach verified multi-network records to every authorization request. Fewer denials. Less back-and-forth. Documentation that payers actually accept.',
  },
]

const steps = [
  { n: '01', title: 'Patient Checks In', text: 'Staff enters name, DOB, and ZIP. No forms. No clipboard. MyPulseScan queries every connected network simultaneously.' },
  { n: '02', title: 'Match Confirmed', text: 'A confidence score returns with the records. Staff confirms the right patient in one click — eliminating wrong-patient risk before anything populates.' },
  { n: '03', title: 'Records Land in Your EMR', text: 'Verified history pushes via Redox into Epic, Athena, eClinicalWorks, or Cerner. Medications, allergies, conditions, labs — all pre-populated. Zero re-entry.' },
  { n: '04', title: 'Provider Walks In Ready', text: 'Real pharmacy fill history, flagged drug interactions, verified conditions — all in the chart before the exam begins. Better decisions. 6 minutes saved per visit.' },
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
  { n: '6,000+', l: 'Pharmacies — real fill history' },
  { n: '6 min', l: 'Saved per patient visit' },
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
    quote: 'We were asking patients to remember their medications on a clipboard. Now we have their actual pharmacy fill history — what they picked up, not just what was prescribed. We caught a drug interaction on day two. It changed how we practice.',
    name: 'Dr. Sarah M.',
    role: 'Medical Director, Urgent Care Network (Chicago)',
    initials: 'SM',
  },
  {
    quote: 'I didn\'t realize how much time my front desk was spending re-entering information. At 150 patients a day, we\'ve recovered almost two full staff hours. That math is obvious.',
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
