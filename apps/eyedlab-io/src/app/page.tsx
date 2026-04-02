export default function HomePage() {
  return (
    <>
      {/* NAV */}
      <nav className="nav" aria-label="Main navigation">
        <a href="/" className="nav-wordmark">
          EyeD <span>ID</span> Lab
        </a>
        <div className="nav-links">
          <a href="mailto:partnerships@eyedlab.io" className="nav-link">
            Partnerships
          </a>
          <a href="mailto:developers@eyedlab.io" className="nav-link">
            Developers
          </a>
        </div>
      </nav>

      {/* HERO */}
      <main id="main-content">
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Powered by Particle Health
        </div>
        <h1 className="hero-wordmark">
          EyeD <span className="accent">ID</span> Lab
        </h1>
        <p className="hero-tagline">
          Build off the most complete foundation of clinical data.
        </p>
        <p className="hero-subtagline">
          Relying on a single EMR leaves critical gaps in a patient&apos;s health
          history. EyeD ID Lab delivers a comprehensive, longitudinal picture —
          aggregated across every provider and system — so your application works
          from the most accurate record available.
        </p>
        <div className="hero-ctas">
          <a
            href="https://mypulsescan.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            View MyPulseScan →
          </a>
          <a
            href="mailto:partnerships@eyedlab.io"
            className="btn-ghost"
          >
            Partnership Inquiry →
          </a>
        </div>
      </section>

      {/* TRUST BAR */}
      <div
        className="network-section"
        style={{ borderTop: "none", marginTop: 0, paddingTop: 24, paddingBottom: 24 }}
      >
        <div className="network-inner">
          <div className="network-label">Compliance &amp; Security</div>
          <div className="network-logos">
            {["HITRUST Certified", "SOC 2 Type II", "HIPAA BAA", "FHIR R4", "TEFCA"].map(
              (name) => (
                <div
                  key={name}
                  className="network-badge"
                  style={{
                    background: "rgba(13,107,110,0.15)",
                    border: "1px solid rgba(93,232,192,0.3)",
                  }}
                >
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* WHY COMPLETE DATA MATTERS */}
      <section className="section">
        <div className="section-label">The Platform</div>
        <h2 className="section-title">
          One API. Every patient. Every network.
        </h2>
        <p className="section-subtitle">
          A patient&apos;s medications, labs, diagnoses, and procedures exist across
          dozens of providers and systems — most of which your EMR never sees.
          EyeD ID Lab aggregates all of it, deduplicates it, and delivers a single
          accurate record through one API call.
        </p>
        <div className="pillars-grid">
          {/* Pillar 1 */}
          <div className="pillar">
            <div className="pillar-icon">
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="2" />
                <circle cx="5" cy="19" r="2" />
                <circle cx="19" cy="19" r="2" />
                <path d="M12 7v4M12 11l-5.5 6M12 11l5.5 6" />
              </svg>
            </div>
            <div className="pillar-title">National + State Partners</div>
            <div className="pillar-desc">
              Access clinical data through our national and state network partners —
              CommonWell, Carequality, TEFCA, and Surescripts. One API call reaches
              all of them simultaneously, so no provider is missed.
            </div>
            <div className="pillar-stat">320M+ patients · 160,000+ organizations</div>
          </div>
          {/* Pillar 2 */}
          <div className="pillar">
            <div className="pillar-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="pillar-title">Highest Data Quality</div>
            <div className="pillar-desc">
              We work hard to extract maximum value from every data source. Verato
              MPI resolves patient identity across networks with confidence scoring,
              so the record your application receives is complete, accurate,
              and deduplicated.
            </div>
            <div className="pillar-stat">Verato MPI · 90% national match rate</div>
          </div>
          {/* Pillar 3 */}
          <div className="pillar">
            <div className="pillar-icon">
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="8" height="8" rx="1" />
                <rect x="13" y="3" width="8" height="8" rx="1" />
                <rect x="3" y="13" width="8" height="8" rx="1" />
                <path d="M17 13v8M13 17h8" />
              </svg>
            </div>
            <div className="pillar-title">FHIR R4 or C-CDA</div>
            <div className="pillar-desc">
              Data delivered as structured FHIR R4 resources or C-CDA documents
              via a single RESTful API. Direct write-back to Epic, Athena,
              eClinicalWorks, and Cerner. Zero re-entry. Zero tab-switching.
            </div>
            <div className="pillar-stat">FHIR R4 · C-CDA · Epic · Athena · Cerner</div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div
          className="stats-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 2,
            background: "rgba(13,107,110,0.12)",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(93,232,192,0.15)",
          }}
        >
          {[
            { stat: "320M+", label: "Patient records accessible" },
            { stat: "160,000+", label: "Healthcare organizations connected" },
            { stat: "90%", label: "Average national patient match rate" },
          ].map(({ stat, label }) => (
            <div
              key={stat}
              style={{
                padding: "40px 32px",
                textAlign: "center",
                background: "rgba(6,13,14,0.6)",
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: "#5de8c0",
                  fontFamily: "var(--font-inter)",
                  lineHeight: 1,
                }}
              >
                {stat}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.5)",
                  marginTop: 8,
                  lineHeight: 1.4,
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NETWORK LOGOS */}
      <div className="network-section">
        <div className="network-inner">
          <div className="network-label">
            Connected to every major US health network
          </div>
          <div className="network-logos">
            {["CommonWell", "Carequality", "TEFCA", "Surescripts", "Epic", "Redox"].map(
              (name) => (
                <div key={name} className="network-badge">
                  {name}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="section">
        <div className="section-label">Our Products</div>
        <h2 className="section-title">Built for every care setting</h2>
        <p className="section-subtitle">
          Two purpose-built products sharing the same complete clinical data
          infrastructure — one optimized for the individual clinic, one for
          enterprise networks and PE-backed operators.
        </p>
        <div className="products-grid">
          {/* MyPulseScan */}
          <div className="product-card">
            <span className="product-chip product-chip-clinic">Clinic</span>
            <div>
              <div className="product-name">
                MyPulse<span>Scan</span>
              </div>
              <div className="product-audience">
                Urgent Care &amp; Primary Care
              </div>
            </div>
            <p className="product-desc">
              Patient health records in 30 seconds at the point of care. Staff
              enter patient demographics, EyeD ID queries all four networks
              simultaneously, and a longitudinal clinical summary — medications,
              labs, diagnoses, procedures — lands in the EMR before the physician
              walks in. Medicare-billable RPM included.
            </p>
            <a
              href="https://mypulsescan.com"
              target="_blank"
              rel="noopener noreferrer"
              className="product-link"
            >
              mypulsescan.com →
            </a>
          </div>

          {/* MyPulseScan Health */}
          <div className="product-card">
            <span className="product-chip product-chip-enterprise">Enterprise</span>
            <div>
              <div className="product-name">
                MyPulseScan <span>Health</span>
              </div>
              <div className="product-audience">
                PE-Backed MSOs &amp; Multi-Location Networks
              </div>
            </div>
            <p className="product-desc">
              Clinical intelligence at scale. Portfolio-wide record retrieval,
              cross-site patient deduplication, population health reporting, and
              direct API access for custom integrations. Built for operators
              managing 50 to 500+ locations who need actionable clinical insights
              across the entire network — not just individual encounters.
            </p>
            <a
              href="https://mypulsescan.health"
              target="_blank"
              rel="noopener noreferrer"
              className="product-link"
            >
              mypulsescan.health →
            </a>
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="section">
        <div className="section-label">Built for your most pressing use cases</div>
        <h2 className="section-title">Deliver a better understanding of patient risk.</h2>
        <p className="section-subtitle">
          More complete data leads to a more accurate understanding of patient risk.
          Build advanced analytics that support improved diagnostics, treatment
          recommendations, and applications that stratify or manage risk at scale.
        </p>
        <div
          className="use-cases-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}
        >
          {[
            { title: "AI, Machine Learning & Analytics", desc: "Power models with the most complete longitudinal record available nationally." },
            { title: "Clinical Decision Support", desc: "Surface relevant history — medications, labs, diagnoses — at the moment of care." },
            { title: "Care Management", desc: "Identify gaps in care across populations using data aggregated across all providers." },
            { title: "Quality Measure Reporting", desc: "Meet HEDIS and other reporting requirements with comprehensive encounter data." },
            { title: "Disease Progression", desc: "Track condition trajectories across the full care continuum, not just one system." },
            { title: "Medication Reconciliation", desc: "Use complete medication records to reduce adverse events and duplication at transitions of care." },
          ].map(({ title, desc }) => (
            <div
              key={title}
              style={{
                padding: "28px 24px",
                background: "rgba(13,107,110,0.08)",
                borderRadius: 12,
                border: "1px solid rgba(93,232,192,0.12)",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#5de8c0",
                  marginBottom: 10,
                  lineHeight: 1.3,
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.6,
                }}
              >
                {desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <div className="cta-section">
        <div className="cta-inner">
          <div className="cta-grid">
            <div className="cta-card">
              <div className="cta-card-label">For Networks &amp; Operators</div>
              <div className="cta-card-title">Platform partnerships</div>
              <p className="cta-card-desc">
                EHR vendors, health systems, MSO platforms, and payers — let&apos;s
                discuss how EyeD ID Lab infrastructure can accelerate your
                clinical data strategy. We&apos;re expanding entity licensing
                for multi-platform deployments.
              </p>
              <a href="mailto:partnerships@eyedlab.io" className="btn-cta">
                partnerships@eyedlab.io →
              </a>
            </div>
            <div className="cta-card">
              <div className="cta-card-label">For Developers &amp; Builders</div>
              <div className="cta-card-title">Build fast with clinical insights that are fit-for-purpose.</div>
              <p className="cta-card-desc">
                No need to start from scratch. Plug into a library of integrations,
                data marts, APIs, and analytics modules. Tackle healthcare&apos;s
                toughest problems — AI, clinical decision support, care management,
                quality reporting, disease progression — using flexible building blocks
                that deliver FHIR R4, C-CDA, or analytics-optimized schema.
              </p>
              <a href="mailto:developers@eyedlab.io" className="btn-cta">
                developers@eyedlab.io →
              </a>
            </div>
          </div>
        </div>
      </div>

      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            EyeD ID Lab <span>· Powered by Particle Health · NuStack Digital Ventures</span>
          </div>
          <div className="footer-links">
            <a href="/terms" className="footer-link">
              Terms of Service
            </a>
            <a href="/privacy" className="footer-link">
              Privacy Policy
            </a>
            <a href="mailto:partnerships@eyedlab.io" className="footer-link">
              partnerships@eyedlab.io
            </a>
            <a href="mailto:developers@eyedlab.io" className="footer-link">
              developers@eyedlab.io
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
