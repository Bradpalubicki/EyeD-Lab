"use client";

export default function PetPage() {
  return (
    <>
      <style>{`
        :root {
          --bg: #050b18;
          --bg-card: #0c1628;
          --cyan: #5de8c0;
          --teal: #0D6B6E;
          --purple: #7c3aed;
          --gold: #f59e0b;
          --green: #10b981;
          --blue: #3b82f6;
          --red: #ef4444;
          --text: #f0f4ff;
          --text-2: #8b9cc8;
          --text-3: #445580;
          --border: rgba(59,90,163,0.2);
          --border-bright: rgba(93,232,192,0.25);
          --grad: linear-gradient(135deg,#7c3aed 0%,#0D6B6E 50%,#5de8c0 100%);
        }

        /* ── NAV ── */
        .p-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2.5rem; height: 68px;
          background: rgba(5,11,24,0.85);
          backdrop-filter: blur(20px) saturate(180%);
          border-bottom: 1px solid var(--border);
          font-family: 'Inter', sans-serif;
        }
        .p-nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: var(--text);
          font-weight: 700; font-size: 1.05rem; letter-spacing: -0.02em;
        }
        .p-nav-eye {
          width: 28px; height: 28px; border-radius: 50%;
          border: 1.5px solid rgba(93,232,192,0.4);
          display: flex; align-items: center; justify-content: center;
        }
        .p-nav-iris {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--grad);
        }
        .p-nav-sub { color: var(--cyan); font-size: .78em; letter-spacing: .04em; }
        .p-nav-links { display: flex; gap: 28px; margin-right: 28px; }
        .p-nav-link {
          font-size: .875rem; font-weight: 500; color: var(--text-2);
          text-decoration: none; transition: color .15s;
        }
        .p-nav-link:hover { color: var(--text); }
        .p-nav-cta {
          padding: .5rem 1.25rem; border-radius: 6px;
          background: var(--cyan); color: #030d1a; font-size: .85rem;
          font-weight: 700; text-decoration: none; transition: background .15s, transform .15s;
        }
        .p-nav-cta:hover { background: #fff; transform: translateY(-1px); }

        /* ── PAGE ── */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .p-page {
          background: var(--bg); color: var(--text);
          font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;
          min-height: 100vh;
        }

        /* ── HERO ── */
        .p-hero {
          padding: 9rem 2rem 6rem; max-width: 900px; margin: 0 auto; text-align: center;
        }
        .p-hero-badge {
          display: inline-flex; align-items: center; gap: .4rem;
          padding: .35rem .9rem; border-radius: 2rem;
          background: rgba(93,232,192,0.1); border: 1px solid rgba(93,232,192,0.25);
          color: var(--cyan); font-size: .72rem; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .p-hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); }
        .p-hero-title {
          font-size: clamp(2.25rem, 6vw, 4rem); font-weight: 800;
          letter-spacing: -.04em; line-height: 1.05; margin-bottom: 1.25rem;
        }
        .p-hero-title span { background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .p-hero-sub {
          font-size: 1.1rem; color: var(--text-2); line-height: 1.7;
          max-width: 640px; margin: 0 auto 2.5rem;
        }
        .p-hero-ctas { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .p-btn-primary {
          padding: .75rem 1.75rem; border-radius: 8px;
          background: var(--cyan); color: #030d1a; font-weight: 700; font-size: .9rem;
          text-decoration: none; transition: background .15s, transform .15s;
        }
        .p-btn-primary:hover { background: #fff; transform: translateY(-2px); }
        .p-btn-ghost {
          padding: .75rem 1.75rem; border-radius: 8px;
          border: 1px solid var(--border-bright); color: var(--text-2); font-size: .9rem;
          text-decoration: none; transition: border-color .15s, color .15s;
        }
        .p-btn-ghost:hover { border-color: var(--cyan); color: var(--text); }

        /* ── STATS STRIP ── */
        .p-stats {
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px;
          background: rgba(13,107,110,0.15); border-radius: 16px; overflow: hidden;
          border: 1px solid rgba(93,232,192,0.15);
          max-width: 1100px; margin: 0 auto 5rem;
        }
        .p-stat-cell {
          background: rgba(5,11,24,0.8); padding: 2rem 1.25rem; text-align: center;
        }
        .p-stat-num { font-size: 2.25rem; font-weight: 800; color: var(--cyan); line-height: 1; }
        .p-stat-label { font-size: .78rem; color: var(--text-2); margin-top: .5rem; line-height: 1.4; }

        /* ── SECTION ── */
        .p-section { max-width: 1100px; margin: 0 auto; padding: 0 2rem 5rem; }
        .p-label {
          font-size: .68rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase;
          background: var(--grad); -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; display: inline-block; margin-bottom: 1rem;
        }
        .p-section-title {
          font-size: clamp(1.5rem, 3.5vw, 2.25rem); font-weight: 800;
          letter-spacing: -.03em; line-height: 1.15; margin-bottom: .75rem;
        }
        .p-section-sub {
          font-size: .95rem; color: var(--text-2); line-height: 1.7;
          max-width: 640px; margin-bottom: 2.5rem;
        }

        /* ── FLOW ── */
        .p-flow {
          display: flex; align-items: stretch; gap: 0; margin-bottom: 4rem;
          overflow-x: auto; padding-bottom: .5rem;
        }
        .p-flow-step {
          flex: 1; min-width: 160px; background: var(--bg-card);
          border: 1px solid var(--border); padding: 1.5rem 1.25rem;
          position: relative; transition: border-color .2s;
        }
        .p-flow-step:first-child { border-radius: 12px 0 0 12px; }
        .p-flow-step:last-child { border-radius: 0 12px 12px 0; }
        .p-flow-step:not(:last-child)::after {
          content: "→"; position: absolute; right: -14px; top: 50%;
          transform: translateY(-50%); font-size: 1.2rem; color: var(--cyan);
          z-index: 2; background: var(--bg); width: 28px; text-align: center;
        }
        .p-flow-step:hover { border-color: var(--border-bright); }
        .p-flow-icon { font-size: 1.5rem; margin-bottom: .75rem; }
        .p-flow-num { font-size: .65rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--text-3); margin-bottom: .5rem; }
        .p-flow-title { font-size: .9rem; font-weight: 700; margin-bottom: .4rem; }
        .p-flow-desc { font-size: .78rem; color: var(--text-2); line-height: 1.5; }

        /* ── GTM LAYERS ── */
        .p-layers { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 4rem; }
        .p-layer {
          background: var(--bg-card); border: 1px solid var(--border);
          border-radius: 16px; padding: 2rem; position: relative; overflow: hidden;
          transition: border-color .2s, transform .2s;
        }
        .p-layer:hover { border-color: var(--border-bright); transform: translateY(-2px); }
        .p-layer::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          opacity: 0; transition: opacity .2s;
        }
        .p-layer:hover::before { opacity: 1; }
        .p-l1::before { background: linear-gradient(90deg,#5de8c0,#0D6B6E); }
        .p-l2::before { background: linear-gradient(90deg,#f59e0b,#ef4444); }
        .p-l3::before { background: linear-gradient(90deg,#3b82f6,#7c3aed); }
        .p-l4::before { background: linear-gradient(90deg,#10b981,#3b82f6); }
        .p-layer-num {
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px;
          font-size: .8rem; font-weight: 800; margin-bottom: 1rem;
        }
        .p-ln1 { background: rgba(93,232,192,0.15); color: var(--cyan); }
        .p-ln2 { background: rgba(245,158,11,0.15); color: var(--gold); }
        .p-ln3 { background: rgba(124,58,237,0.15); color: #a78bfa; }
        .p-ln4 { background: rgba(16,185,129,0.15); color: var(--green); }
        .p-layer-title { font-size: 1.05rem; font-weight: 700; letter-spacing: -.02em; margin-bottom: .3rem; }
        .p-layer-channel { font-size: .7rem; font-weight: 600; text-transform: uppercase; letter-spacing: .1em; color: var(--text-3); margin-bottom: .75rem; }
        .p-layer-desc { font-size: .875rem; color: var(--text-2); line-height: 1.7; margin-bottom: 1.25rem; }
        .p-layer-list { list-style: none; display: flex; flex-direction: column; gap: .4rem; }
        .p-layer-list li { display: flex; align-items: flex-start; gap: .5rem; font-size: .82rem; color: var(--text-2); line-height: 1.5; }
        .p-layer-list li::before { content: "→"; color: var(--cyan); flex-shrink: 0; margin-top: .05rem; }
        .p-layer-rev {
          margin-top: 1.25rem; padding: .75rem 1rem;
          background: rgba(93,232,192,0.06); border: 1px solid rgba(93,232,192,0.15);
          border-radius: 8px;
        }
        .p-layer-rev-label { font-size: .65rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: var(--text-3); margin-bottom: .25rem; }
        .p-layer-rev-value { font-size: .95rem; font-weight: 700; color: var(--cyan); }

        /* ── CALLOUT ── */
        .p-callout {
          padding: 1.5rem 2rem; border-radius: 12px; margin-bottom: 2rem; border-left: 3px solid;
        }
        .p-callout-gold { background: rgba(245,158,11,0.07); border-color: var(--gold); }
        .p-callout-teal { background: rgba(93,232,192,0.06); border-color: var(--cyan); }
        .p-callout-purple { background: rgba(124,58,237,0.07); border-color: #a78bfa; }
        .p-callout-title { font-size: .875rem; font-weight: 700; margin-bottom: .35rem; }
        .p-callout-gold .p-callout-title { color: var(--gold); }
        .p-callout-teal .p-callout-title { color: var(--cyan); }
        .p-callout-purple .p-callout-title { color: #a78bfa; }
        .p-callout-body { font-size: .85rem; color: var(--text-2); line-height: 1.65; }

        /* ── COMP TABLE ── */
        .p-table { width: 100%; border-collapse: collapse; margin-bottom: 4rem; font-size: .85rem; }
        .p-table th {
          text-align: left; padding: .75rem 1rem; font-size: .68rem;
          font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
          color: var(--text-3); border-bottom: 1px solid var(--border);
        }
        .p-table td { padding: 1rem; border-bottom: 1px solid rgba(59,90,163,0.1); color: var(--text-2); vertical-align: top; }
        .p-table tr:hover td { background: rgba(12,22,40,0.5); }
        .p-table .p-row-you td { color: var(--text); }
        .p-comp-name { font-weight: 700; color: var(--text); }
        .p-tag { display: inline-block; padding: .15rem .5rem; border-radius: 4px; font-size: .65rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
        .p-tag-you { background: rgba(93,232,192,0.15); color: var(--cyan); }
        .p-tag-strong { background: rgba(16,185,129,0.12); color: #6ee7b7; }
        .p-tag-weak { background: rgba(239,68,68,0.12); color: #fca5a5; }
        .p-tag-none { background: rgba(68,85,128,0.3); color: var(--text-3); }

        /* ── DIVIDER ── */
        .p-divider { border: none; border-top: 1px solid var(--border); margin: 0 2rem 4rem; max-width: 1100px; }

        /* ── FOOTER ── */
        .p-footer {
          border-top: 1px solid var(--border); padding: 2rem 2.5rem;
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1rem; font-size: .8rem; color: var(--text-3);
          font-family: 'Inter', sans-serif;
        }
        .p-footer strong { color: var(--text-2); }
        .p-footer-links { display: flex; gap: 1.5rem; flex-wrap: wrap; }
        .p-footer-link { color: var(--text-3); text-decoration: none; transition: color .15s; }
        .p-footer-link:hover { color: var(--text-2); }

        /* ── RESPONSIVE ── */
        @media (max-width: 860px) {
          .p-layers { grid-template-columns: 1fr; }
          .p-stats { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .p-flow { flex-direction: column; }
          .p-flow-step { border-radius: 0 !important; }
          .p-flow-step::after { display: none; }
          .p-stats { grid-template-columns: 1fr; }
          .p-nav-links { display: none; }
          .p-hero { padding: 7rem 1.25rem 4rem; }
          .p-section { padding: 0 1.25rem 4rem; }
        }
      `}</style>

      <div className="p-page">

        {/* NAV */}
        <nav className="p-nav" aria-label="Pet vertical navigation">
          <a className="p-nav-logo" href="/">
            <div className="p-nav-eye"><div className="p-nav-iris" /></div>
            EyeD <span className="p-nav-sub">ID LAB</span>
          </a>
          <div className="p-nav-links">
            <a href="#problem" className="p-nav-link">The Problem</a>
            <a href="#how" className="p-nav-link">How It Works</a>
            <a href="#gtm" className="p-nav-link">Go-To-Market</a>
            <a href="#ip" className="p-nav-link">IP Strategy</a>
          </div>
          <a href="mailto:partnerships@eyedlab.io" className="p-nav-cta">Partnership Inquiry</a>
        </nav>

        {/* HERO */}
        <section className="p-hero">
          <div className="p-hero-badge">
            <span className="p-hero-badge-dot" />
            Pet Biometric ID — Vertical Research
          </div>
          <h1 className="p-hero-title">
            A lost pet. A smartphone.<br />
            <span>Owner found in seconds.</span>
          </h1>
          <p className="p-hero-sub">
            8 million pets enter shelters every year. Only 15–20% are ever reunited. Microchips require a scanner. Tags fall off. EyeD ID solves it — one iris scan from any smartphone identifies the animal and surfaces the owner, vet records, and emergency contacts instantly.
          </p>
          <div className="p-hero-ctas">
            <a href="mailto:partnerships@eyedlab.io" className="p-btn-primary">Partnership Inquiry →</a>
            <a href="/" className="p-btn-ghost">← Back to EyeD ID Lab</a>
          </div>
        </section>

        {/* STATS */}
        <div className="p-stats" style={{ maxWidth: 1100, margin: "0 auto 5rem", padding: "0 2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 2, background: "rgba(13,107,110,0.15)", borderRadius: 16, overflow: "hidden", border: "1px solid rgba(93,232,192,0.15)" }}>
            {[
              { num: "86.9M", label: "US households with pets — total addressable enrollment base" },
              { num: "$150B+", label: "Annual US pet spend — owners invest more in pets than ever" },
              { num: "ZERO", label: "Funded competitors in pet iris recognition — field is wide open" },
              { num: "None", label: "Regulatory filings required — lowest-barrier vertical in portfolio" },
            ].map(({ num, label }) => (
              <div key={num} style={{ background: "rgba(5,11,24,0.8)", padding: "2rem 1.25rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.25rem", fontWeight: 800, color: "#5de8c0", lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: ".78rem", color: "#8b9cc8", marginTop: ".5rem", lineHeight: 1.4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* THE PROBLEM */}
        <section className="p-section" id="problem">
          <div className="p-label">The Problem</div>
          <h2 className="p-section-title">8 million pets enter shelters each year.<br />Most never make it home.</h2>
          <p className="p-section-sub">The #1 cause of failed pet recovery is broken identity infrastructure — microchips require a specific scanner, tags fall off, databases are out of date. Shelters, vets, and neighbors are all flying blind. EyeD ID builds the identity layer that was always missing.</p>

          <div className="p-callout p-callout-gold">
            <div className="p-callout-title">The Clear Field</div>
            <div className="p-callout-body">Every competitor in pet biometrics uses nose print (iSciLab, Petnow, SnoutID) or face recognition (FindPet). Nose print is blocked by iSciLab's US Patent #11,019,250. Animal iris recognition has no dominant blocking patent — the foundational Daugman human iris patents expired 2011–2016. EyeD ID builds iris and owns the only unencumbered modality in the space.</div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="p-section" id="how">
          <div className="p-label">How It Works</div>
          <h2 className="p-section-title">One scan. Five seconds. Pet goes home.</h2>
          <p className="p-section-sub">Enrollment happens at the vet clinic during the annual wellness visit — same as microchipping. Lookup happens from any smartphone, by anyone, anywhere.</p>

          <div className="p-flow">
            <div className="p-flow-step">
              <div className="p-flow-icon">🐾</div>
              <div className="p-flow-num">Step 01</div>
              <div className="p-flow-title">Pet Enrolls</div>
              <div className="p-flow-desc">Owner registers at vet clinic intake or via the EyeD ID app. Iris scan captured in 3 seconds. Owner info, vet records, and emergency contacts stored.</div>
            </div>
            <div className="p-flow-step">
              <div className="p-flow-icon">🚨</div>
              <div className="p-flow-num">Step 02</div>
              <div className="p-flow-title">Pet Goes Missing</div>
              <div className="p-flow-desc">Dog escapes. Cat gets lost. Animal found by a neighbor, shelter worker, or vet. No chip scanner. No tag. No paperwork.</div>
            </div>
            <div className="p-flow-step">
              <div className="p-flow-icon">👁️</div>
              <div className="p-flow-num">Step 03</div>
              <div className="p-flow-title">Iris Scan</div>
              <div className="p-flow-desc">Anyone opens EyeD ID on any smartphone. Pet's iris is scanned. Identity matched in seconds against the global enrollment database.</div>
            </div>
            <div className="p-flow-step">
              <div className="p-flow-icon">📋</div>
              <div className="p-flow-num">Step 04</div>
              <div className="p-flow-title">Records Surface</div>
              <div className="p-flow-desc">Owner contact info, pet name, vet records, vaccinations, medications, and emergency contacts appear instantly. Owner gets a push alert.</div>
            </div>
            <div className="p-flow-step">
              <div className="p-flow-icon">🏠</div>
              <div className="p-flow-num">Step 05</div>
              <div className="p-flow-title">Reunited</div>
              <div className="p-flow-desc">Pet goes home. Vet clinic has full treatment history. Shelter avoids an intake. EyeD ID becomes the identity layer every stakeholder in pet care depends on.</div>
            </div>
          </div>
        </section>

        <hr className="p-divider" />

        {/* GTM LAYERS */}
        <section className="p-section" id="gtm">
          <div className="p-label">Go-To-Market Layers</div>
          <h2 className="p-section-title">Four layers. One identity infrastructure.</h2>
          <p className="p-section-sub">Start where distribution already exists — vet clinics and pet insurance — then move into shelters, retailers, and breeder registries. Each layer adds enrollments and unlocks the next.</p>

          <div className="p-layers">
            <div className="p-layer p-l1">
              <div className="p-layer-num p-ln1">L1</div>
              <div className="p-layer-title">Vet Clinic Enrollment</div>
              <div className="p-layer-channel">Channel: Banfield · VCA · BluePearl · Independent Practices</div>
              <div className="p-layer-desc">Pet owners already trust their vet with everything. Enroll at the annual wellness visit — iris scan during intake, same as microchipping today. No behavior change for the owner. Vet gets a billing event and a value-add that drives retention.</div>
              <ul className="p-layer-list">
                <li>Banfield Pet Hospital — 1,000+ locations inside PetSmart, 3M+ active patients</li>
                <li>VCA Animal Hospitals — 1,000+ locations, owned by Mars Petcare</li>
                <li>BluePearl Emergency Vets — 100+ hospitals, 24/7 emergency intake</li>
                <li>Independent practices via AVMA / state vet board channels</li>
              </ul>
              <div className="p-layer-rev">
                <div className="p-layer-rev-label">Revenue model</div>
                <div className="p-layer-rev-value">$15–25/enrollment + $5/month per pet</div>
              </div>
            </div>

            <div className="p-layer p-l2">
              <div className="p-layer-num p-ln2">L2</div>
              <div className="p-layer-title">Pet Insurance Bundle</div>
              <div className="p-layer-channel">Channel: Nationwide · Trupanion · Lemonade · ASPCA</div>
              <div className="p-layer-desc">Pet insurers pay for lost pet recovery services as a policy benefit today — GPS tags, microchip registries. EyeD ID is the next generation: biometric identity that requires no hardware, no battery, no registration update. Bundle into every policy for $3–7/month per pet.</div>
              <ul className="p-layer-list">
                <li>Nationwide Pet Insurance — largest US pet insurer, 1M+ active policies</li>
                <li>Trupanion — 1.6M+ enrolled pets, vet-direct billing model</li>
                <li>Lemonade Pet — fastest-growing, tech-native, open to integrations</li>
                <li>ASPCA Pet Health Insurance — brand trust with shelter channel</li>
              </ul>
              <div className="p-layer-rev">
                <div className="p-layer-rev-label">Revenue potential at 1M policies</div>
                <div className="p-layer-rev-value">$3–7M ARR — single insurance contract</div>
              </div>
            </div>

            <div className="p-layer p-l3">
              <div className="p-layer-num p-ln3">L3</div>
              <div className="p-layer-title">Shelter & Rescue Network</div>
              <div className="p-layer-channel">Channel: ASPCA · Humane Society · 3,500+ US Shelters</div>
              <div className="p-layer-desc">Every shelter in America is drowning in unidentified animals. EyeD ID gives them a free scan tool at intake — if the pet is enrolled, the owner is found in seconds. Free lookup creates enrollment pressure: owners enroll to be findable.</div>
              <ul className="p-layer-list">
                <li>ASPCA national network — brand recognition drives consumer enrollment</li>
                <li>3,500+ animal shelters and humane societies in the US</li>
                <li>Local animal control agencies — mandatory first responders for lost pets</li>
                <li>Unregistered scan events → "Enroll your pet" conversion moment</li>
              </ul>
              <div className="p-layer-rev">
                <div className="p-layer-rev-label">Revenue model</div>
                <div className="p-layer-rev-value">$99–299/shelter/month SaaS + enrollment upsell</div>
              </div>
            </div>

            <div className="p-layer p-l4">
              <div className="p-layer-num p-ln4">L4</div>
              <div className="p-layer-title">AKC & Breeder Registry</div>
              <div className="p-layer-channel">Channel: AKC · Purebred Breeders · PetSmart · Chewy</div>
              <div className="p-layer-desc">The AKC has accepted nose prints for purebred registration since 1938 — 85 years of biometric pet ID precedent. Iris is more precise. EyeD ID pursues formal AKC recognition to unlock 500,000 registrations/year and accelerate state-level microchip law reform.</div>
              <ul className="p-layer-list">
                <li>AKC registers 500,000+ dogs/year — recognition = instant credibility</li>
                <li>Breeder theft prevention: prove ownership in a dispute with one scan</li>
                <li>PetSmart / Petco retail enrollment kiosks at point of adoption</li>
                <li>Chewy integration: link iris ID to pet profile, auto-fill prescriptions</li>
              </ul>
              <div className="p-layer-rev">
                <div className="p-layer-rev-label">Market opportunity</div>
                <div className="p-layer-rev-value">$500M–$1B microchip-adjacent services market</div>
              </div>
            </div>
          </div>
        </section>

        <hr className="p-divider" />

        {/* IP STRATEGY */}
        <section className="p-section" id="ip">
          <div className="p-label">IP Strategy</div>
          <h2 className="p-section-title">Nose print is patented. Iris is open.</h2>
          <p className="p-section-sub">The competitive landscape looks crowded — until you realize every competitor is building on a patented modality EyeD ID doesn't use. Iris recognition has no blocking patent for animals. The moat is real.</p>

          <div className="p-callout p-callout-gold">
            <div className="p-callout-title">iSciLab Patent #11,019,250 — Blocks Nose Print, Not Iris</div>
            <div className="p-callout-body">iSciLab holds the dominant US patent on smartphone-based animal nose print recognition, active in US, EU, Canada, and Japan. Any commercial nose print product must license from them or design around a 2021 patent with strong claims. Animal iris recognition has no equivalent blocking patent — the foundational Daugman human iris patents expired 2011–2016, and no company has filed dominant claims on smartphone-based animal iris recognition. Building iris means starting in open territory.</div>
          </div>

          <div className="p-callout p-callout-teal">
            <div className="p-callout-title">The ML Challenge Is Solvable in 3–6 Months</div>
            <div className="p-callout-body">iOS Vision and Google ML Kit don't work on animal irises out of the box — they're trained on human pupils. But fine-tuning on 5,000–10,000 labeled animal iris images using a pretrained EfficientNet or ViT backbone is feasible in 3–6 months with a research partner. The cat slit-pupil problem (pupil varies 1mm–14mm) is solved by pupil normalization algorithms proven to restore 99%+ accuracy. Dog motion blur is solved by burst-capture + best-frame selection. Engineering problems — not fundamental barriers.</div>
          </div>

          <div className="p-callout p-callout-purple">
            <div className="p-callout-title">Regulatory Barrier: Zero</div>
            <div className="p-callout-body">No FDA pathway. No HIPAA. No BIPA (biometric privacy laws apply to humans, not animals). No USDA jurisdiction over companion animals. The only pre-launch requirement is terms of service covering owner consent. This is the lowest-regulation vertical in the entire EyeD ID portfolio. Build, ship, and iterate — no agency filings, no licensing windows, no 3-year regulatory timelines.</div>
          </div>
        </section>

        {/* COMPETITIVE TABLE */}
        <section className="p-section">
          <div className="p-label">Competitive Landscape</div>
          <h2 className="p-section-title">Who else is in the room.</h2>
          <p className="p-section-sub" style={{ marginBottom: "1.5rem" }}>Every competitor uses nose print, face recognition, or RFID chips. No funded company is doing iris. EyeD ID builds the one modality with no blocking patents and no funded rival.</p>

          <table className="p-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Technology</th>
                <th>Iris ID</th>
                <th>Vet Records</th>
                <th>Insurance Link</th>
                <th>US Patent Risk</th>
              </tr>
            </thead>
            <tbody>
              <tr className="p-row-you">
                <td><span className="p-comp-name">EyeD ID Lab</span><br /><span className="p-tag p-tag-you">You</span></td>
                <td>Iris biometric → owner, vet records, emergency contacts</td>
                <td><span className="p-tag p-tag-strong">✓ Building now</span></td>
                <td><span className="p-tag p-tag-strong">✓ Via Particle</span></td>
                <td><span className="p-tag p-tag-strong">✓ Building now</span></td>
                <td><span className="p-tag p-tag-strong">Clear — open field</span></td>
              </tr>
              <tr>
                <td><span className="p-comp-name">Petnow</span></td>
                <td>Nose print — dogs and cats. 2.4M downloads, $5.25M funded.</td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-weak">iSciLab patent risk</span></td>
              </tr>
              <tr>
                <td><span className="p-comp-name">SnoutID (Crumb)</span></td>
                <td>Nose print embedded in subscription pet health app</td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-weak">✗ Manual entry</span></td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-weak">iSciLab patent risk</span></td>
              </tr>
              <tr>
                <td><span className="p-comp-name">FindPet</span></td>
                <td>Face recognition — whole-face photo matching, 86.5% accuracy</td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-strong">Low</span></td>
              </tr>
              <tr>
                <td><span className="p-comp-name">iSciLab (anipuppy)</span></td>
                <td>Nose print — government-backed South Korea, free US beta</td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-strong">Owns the patent</span></td>
              </tr>
              <tr>
                <td><span className="p-comp-name">AAHA Microchip Lookup</span></td>
                <td>RFID chip scanner — requires dedicated hardware at shelter</td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-weak">✗ Registry only</span></td>
                <td><span className="p-tag p-tag-none">None</span></td>
                <td><span className="p-tag p-tag-strong">Low</span></td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* FOOTER */}
        <footer className="p-footer">
          <div><strong>EyeD ID Lab</strong> — Pet Biometric ID Vertical · Confidential · April 2026</div>
          <div className="p-footer-links">
            <a href="/" className="p-footer-link">← EyeD ID Lab</a>
            <a href="/travel" className="p-footer-link">Travel Health</a>
            <a href="mailto:partnerships@eyedlab.io" className="p-footer-link">partnerships@eyedlab.io</a>
          </div>
        </footer>

      </div>
    </>
  );
}
