export default function HomePage() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-wordmark">
          EyeD <span>ID</span> Lab
        </div>
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
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Clinical Data Infrastructure
        </div>
        <h1 className="hero-wordmark">
          EyeD <span className="accent">ID</span> Lab
        </h1>
        <p className="hero-tagline">The identity layer for healthcare.</p>
        <p className="hero-subtagline">
          We aggregate, verify, and deliver patient health records at the point
          of care — across every major US health network.
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

      {/* PLATFORM */}
      <section className="section">
        <div className="section-label">The Platform</div>
        <h2 className="section-title">The Infrastructure</h2>
        <p className="section-subtitle">
          Three layers of clinical data infrastructure working in concert — so
          clinicians get the right record for the right patient, instantly.
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
            <div className="pillar-title">Multi-Network Aggregation</div>
            <div className="pillar-desc">
              Connected to CommonWell, Carequality, TEFCA, and Surescripts —
              the four dominant health information exchange networks in the US.
              One API call retrieves records from all of them simultaneously.
            </div>
            <div className="pillar-stat">320M+ US patients covered</div>
          </div>
          {/* Pillar 2 */}
          <div className="pillar">
            <div className="pillar-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div className="pillar-title">Identity Verification</div>
            <div className="pillar-desc">
              Powered by Verato MPI — the clinical standard for Master Patient
              Index matching. Probabilistic algorithms resolve identity across
              networks with confidence scoring. Zero wrong-patient risk.
            </div>
            <div className="pillar-stat">Verato MPI · Confidence scoring</div>
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
            <div className="pillar-title">EMR Integration</div>
            <div className="pillar-desc">
              Direct write-back to Epic, Athena, eClinicalWorks, and Cerner via
              the Redox integration layer. Records surface inside the existing
              clinical workflow. Zero re-entry. Zero tab-switching.
            </div>
            <div className="pillar-stat">Epic · Athena · eClinicalWorks · Cerner</div>
          </div>
        </div>
      </section>

      {/* NETWORK LOGOS */}
      <div className="network-section">
        <div className="network-inner">
          <div className="network-label">
            Connected to every major US health network
          </div>
          <div className="network-logos">
            {[
              "CommonWell",
              "Carequality",
              "TEFCA",
              "Surescripts",
              "Epic",
              "Redox",
            ].map((name) => (
              <div key={name} className="network-badge">
                {name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCTS */}
      <section className="section">
        <div className="section-label">Our Products</div>
        <h2 className="section-title">Built for every care setting</h2>
        <p className="section-subtitle">
          Two purpose-built products sharing the same data infrastructure —
          one optimized for the clinic, one for the enterprise.
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
              Patient health records in 30 seconds at the front desk. Staff
              scan or enter patient demographics, EyeD ID queries all four
              networks simultaneously, and a reconciled clinical summary lands
              in the EMR — before the physician walks in the room.
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
              API access for custom integrations. Built for operators managing
              50 to 500+ locations under a single platform.
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

      {/* CTA SECTION */}
      <div className="cta-section">
        <div className="cta-inner">
          <div className="cta-grid">
            <div className="cta-card">
              <div className="cta-card-label">For Networks &amp; Operators</div>
              <div className="cta-card-title">Platform partnerships</div>
              <p className="cta-card-desc">
                EHR vendors, health systems, MSO platforms, and payers — let&apos;s
                talk about how EyeD ID infrastructure can accelerate your
                clinical data strategy.
              </p>
              <a href="mailto:partnerships@eyedlab.io" className="btn-cta">
                partnerships@eyedlab.io →
              </a>
            </div>
            <div className="cta-card">
              <div className="cta-card-label">For Developers &amp; Builders</div>
              <div className="cta-card-title">Build on EyeD ID</div>
              <p className="cta-card-desc">
                Access 320M+ patient records through a single authenticated API.
                FHIR R4 compliant, HIPAA BAA available, sandbox environment on
                request. Developer docs and API keys issued on review.
              </p>
              <a href="mailto:developers@eyedlab.io" className="btn-cta">
                developers@eyedlab.io →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            EyeD ID Lab{" "}
            <span>· NuStack Digital Ventures</span>
          </div>
          <div className="footer-links">
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
