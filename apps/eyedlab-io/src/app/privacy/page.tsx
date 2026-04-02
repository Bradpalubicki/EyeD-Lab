import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | EyeD ID Lab",
  description:
    "Privacy Policy for EyeD ID Lab — how we collect, use, and protect data, including HIPAA and SMS/TCPA disclosures.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://eyedlab.io/privacy" },
};

export default function PrivacyPage() {
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

      {/* CONTENT */}
      <main id="main-content" style={{ paddingTop: "68px" }}>
        <div
          style={{
            maxWidth: 800,
            margin: "0 auto",
            padding: "5rem 2rem 6rem",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: "3rem" }}>
            <div className="section-label">Legal</div>
            <h1
              style={{
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1.1,
                marginBottom: "1rem",
              }}
            >
              Privacy Policy
            </h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
              Last updated: April 2, 2026
            </p>
          </div>

          {/* Body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2.5rem",
              color: "var(--text-secondary)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
            }}
          >
            {/* Intro */}
            <section>
              <p>
                EyeD ID Lab (&ldquo;EyeD ID Lab,&rdquo; &ldquo;we,&rdquo;
                &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to
                protecting your privacy and handling data responsibly. This
                Privacy Policy explains how we collect, use, disclose, and
                safeguard information when you access our websites
                (eyedlab.io, mypulsescan.com, mypulsescan.health) or use our
                clinical data infrastructure services (collectively, the
                &ldquo;Services&rdquo;).
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                Please read this Policy carefully. By using the Services, you
                agree to the collection and use of information as described
                herein.
              </p>
            </section>

            {/* Section 1 */}
            <section>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                1. Information We Collect
              </h2>
              <p>
                <strong style={{ color: "var(--text-primary)" }}>
                  1.1 Information You Provide Directly
                </strong>
              </p>
              <ul
                style={{
                  marginTop: "0.5rem",
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <li>
                  Contact information (name, business email address, phone
                  number, organization name) when you submit partnership or
                  developer inquiry forms.
                </li>
                <li>
                  Account credentials when you register for API access or a
                  developer account.
                </li>
                <li>
                  Communications you send us via email or through the Services.
                </li>
              </ul>

              <p style={{ marginTop: "1rem" }}>
                <strong style={{ color: "var(--text-primary)" }}>
                  1.2 Information Collected Automatically
                </strong>
              </p>
              <ul
                style={{
                  marginTop: "0.5rem",
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.4rem",
                }}
              >
                <li>
                  Log data: IP address, browser type, operating system, pages
                  visited, referring URLs, timestamps, and API request metadata.
                </li>
                <li>
                  Cookies and similar tracking technologies used to maintain
                  sessions and analyze usage patterns. You may disable cookies
                  through your browser settings; however, some features of the
                  Services may not function properly as a result.
                </li>
                <li>
                  Device information including device identifiers and network
                  connection data.
                </li>
              </ul>

              <p style={{ marginTop: "1rem" }}>
                <strong style={{ color: "var(--text-primary)" }}>
                  1.3 Clinical and Health Data
                </strong>
              </p>
              <p style={{ marginTop: "0.5rem" }}>
                As a clinical data infrastructure provider, EyeD ID Lab
                processes Protected Health Information (PHI) on behalf of
                covered entities and business associates under executed Business
                Associate Agreements (BAAs). PHI processed through the Services
                is handled in strict compliance with HIPAA, as described in
                Section 3 below.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                2. How We Use Your Information
              </h2>
              <p>We use information we collect to:</p>
              <ul
                style={{
                  marginTop: "0.75rem",
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  Provide, operate, maintain, and improve the Services.
                </li>
                <li>
                  Respond to inquiries, process partnership and developer
                  applications, and communicate with you about the Services.
                </li>
                <li>
                  Send transactional and operational communications, including
                  service updates, security alerts, and support messages.
                </li>
                <li>
                  Monitor and analyze usage patterns to improve performance,
                  security, and user experience.
                </li>
                <li>
                  Detect, prevent, and address fraud, abuse, security incidents,
                  and technical issues.
                </li>
                <li>
                  Comply with legal obligations and enforce our Terms of Service.
                </li>
                <li>
                  Process clinical data queries on behalf of authorized
                  healthcare partners under applicable BAAs.
                </li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>
                We do not sell your personal information to third parties for
                their own marketing purposes.
              </p>
            </section>

            {/* Section 3 — HIPAA */}
            <section
              style={{
                padding: "2rem",
                background: "rgba(13,107,110,0.08)",
                borderRadius: 12,
                border: "1px solid rgba(93,232,192,0.2)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                3. HIPAA Notice — Clinical Data Infrastructure
              </h2>
              <p>
                EyeD ID Lab operates as a{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  Business Associate
                </strong>{" "}
                under the Health Insurance Portability and Accountability Act
                (HIPAA) and the Health Information Technology for Economic and
                Clinical Health (HITECH) Act. We process Protected Health
                Information (PHI) only on behalf of covered entities and other
                business associates that have executed a valid Business Associate
                Agreement (BAA) with EyeD ID Lab.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                EyeD ID Lab implements the following safeguards for PHI:
              </p>
              <ul
                style={{
                  marginTop: "0.75rem",
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Administrative:
                  </strong>{" "}
                  Workforce training, access controls, security officer
                  designation, and incident response procedures.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Physical:
                  </strong>{" "}
                  Data center physical access controls and workstation use
                  policies.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Technical:
                  </strong>{" "}
                  Encryption in transit (TLS 1.2+) and at rest (AES-256), audit
                  logging, automatic logoff, and unique user identification.
                </li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>
                PHI is accessed and used only as necessary to perform services
                under the applicable BAA. EyeD ID Lab does not use PHI for
                marketing or sell PHI to any third party. Our infrastructure is
                HITRUST Certified and SOC 2 Type II audited.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                If you are a patient whose records may be accessed through our
                Services, please contact your healthcare provider regarding your
                rights under HIPAA, including the right to access, amend, and
                receive an accounting of disclosures of your PHI.
              </p>
            </section>

            {/* Section 4 — SMS */}
            <section
              style={{
                padding: "2rem",
                background: "var(--bg-card)",
                borderRadius: 12,
                border: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                4. SMS / Text Messaging Policy (TCPA Compliance)
              </h2>
              <p>
                Where EyeD ID Lab or its products (including MyPulseScan and
                MyPulseScan Health) utilize SMS or text messaging to communicate
                with users, the following terms apply:
              </p>

              <p
                style={{ marginTop: "1rem", color: "var(--text-primary)", fontWeight: 600 }}
              >
                Opt-In
              </p>
              <p style={{ marginTop: "0.4rem" }}>
                You consent to receive SMS messages from EyeD ID Lab only by
                explicitly opting in through a designated opt-in mechanism (such
                as a web form, in-app consent checkbox, or SMS keyword). By
                opting in, you confirm that the phone number you provide is a
                number you own or are authorized to use to receive SMS messages.
              </p>

              <p
                style={{ marginTop: "1rem", color: "var(--text-primary)", fontWeight: 600 }}
              >
                Message Types and Frequency
              </p>
              <p style={{ marginTop: "0.4rem" }}>
                Message types may include account notifications, service alerts,
                authentication codes, and operational updates relevant to your
                use of the Services. Message frequency varies based on account
                activity and the specific product you are using. We will not
                send promotional or marketing SMS messages without your explicit
                consent.
              </p>

              <p
                style={{ marginTop: "1rem", color: "var(--text-primary)", fontWeight: 600 }}
              >
                Opt-Out
              </p>
              <p style={{ marginTop: "0.4rem" }}>
                You may opt out of SMS messages at any time by replying{" "}
                <strong style={{ color: "var(--accent-teal-bright)" }}>
                  STOP
                </strong>{" "}
                to any message you receive from us. After opting out, you will
                receive a single confirmation message and no further SMS messages
                unless you opt in again. You may also opt out by contacting us
                at partnerships@eyedlab.io.
              </p>

              <p
                style={{ marginTop: "1rem", color: "var(--text-primary)", fontWeight: 600 }}
              >
                Help
              </p>
              <p style={{ marginTop: "0.4rem" }}>
                Reply{" "}
                <strong style={{ color: "var(--accent-teal-bright)" }}>
                  HELP
                </strong>{" "}
                to any SMS message for assistance, or contact us at
                partnerships@eyedlab.io.
              </p>

              <p
                style={{ marginTop: "1rem", color: "var(--text-primary)", fontWeight: 600 }}
              >
                Carrier Disclaimer
              </p>
              <p style={{ marginTop: "0.4rem" }}>
                Message and data rates may apply depending on your mobile
                carrier plan. EyeD ID Lab is not responsible for any charges
                your carrier may assess for SMS messages.
              </p>

              <p
                style={{ marginTop: "1rem", color: "var(--text-primary)", fontWeight: 600 }}
              >
                No Sale of SMS Data
              </p>
              <p style={{ marginTop: "0.4rem" }}>
                We do not sell, share, or disclose your mobile phone number or
                SMS opt-in data to third parties for their own marketing
                purposes.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                5. Third-Party Sharing and Disclosure
              </h2>
              <p>
                We may share your information with third parties in the
                following circumstances:
              </p>
              <ul
                style={{
                  marginTop: "0.75rem",
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Particle Health:
                  </strong>{" "}
                  EyeD ID Lab&rsquo;s clinical data infrastructure is powered by
                  Particle Health, a HITRUST-certified health information network
                  platform. Clinical data queries are routed through Particle
                  Health&rsquo;s network to access records from CommonWell,
                  Carequality, TEFCA, and Surescripts. All PHI sharing with
                  Particle Health is governed by applicable BAAs and HIPAA
                  requirements.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Service Providers:
                  </strong>{" "}
                  We engage trusted third-party vendors to help operate the
                  Services (e.g., cloud hosting, analytics, communications
                  platforms). These vendors access information only as necessary
                  to perform services on our behalf and are contractually
                  required to protect it.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Legal Requirements:
                  </strong>{" "}
                  We may disclose information if required to do so by law or in
                  response to valid legal process (such as a court order or
                  subpoena), or when we believe disclosure is necessary to
                  protect the rights, property, or safety of EyeD ID Lab, our
                  users, or the public.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    Business Transfers:
                  </strong>{" "}
                  In connection with a merger, acquisition, financing,
                  reorganization, or sale of assets, your information may be
                  transferred as part of that transaction.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>
                    With Your Consent:
                  </strong>{" "}
                  We may share information with third parties when you have
                  given us explicit consent to do so.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                6. Data Retention
              </h2>
              <p>
                We retain personal information for as long as necessary to
                provide the Services, comply with our legal obligations, resolve
                disputes, and enforce our agreements. When information is no
                longer needed, we delete or anonymize it in accordance with our
                data retention policies. PHI is retained and disposed of in
                accordance with the applicable BAA and HIPAA requirements.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                7. Security
              </h2>
              <p>
                We implement industry-standard technical and organizational
                security measures designed to protect your information against
                unauthorized access, disclosure, alteration, and destruction.
                These measures include TLS encryption for data in transit,
                AES-256 encryption for data at rest, multi-factor
                authentication, role-based access controls, and continuous
                security monitoring.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                No method of transmission over the internet or method of
                electronic storage is 100% secure. While we strive to use
                commercially acceptable means to protect your information, we
                cannot guarantee absolute security.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                8. Your Rights and Choices
              </h2>
              <p>
                Depending on your location and applicable law, you may have the
                following rights regarding your personal information:
              </p>
              <ul
                style={{
                  marginTop: "0.75rem",
                  paddingLeft: "1.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Access:</strong>{" "}
                  Request a copy of the personal information we hold about you.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Correction:</strong>{" "}
                  Request that we correct inaccurate or incomplete personal
                  information.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Deletion:</strong>{" "}
                  Request that we delete your personal information, subject to
                  applicable legal obligations.
                </li>
                <li>
                  <strong style={{ color: "var(--text-primary)" }}>Opt-Out:</strong>{" "}
                  Opt out of certain data uses, including marketing
                  communications.
                </li>
              </ul>
              <p style={{ marginTop: "0.75rem" }}>
                To exercise any of these rights, please contact us at
                partnerships@eyedlab.io. We will respond to verified requests
                within the timeframe required by applicable law.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                9. Children&rsquo;s Privacy
              </h2>
              <p>
                The Services are not directed to children under the age of 13.
                We do not knowingly collect personal information from children
                under 13. If we become aware that we have inadvertently collected
                such information, we will take steps to delete it promptly.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                10. Changes to This Policy
              </h2>
              <p>
                We may update this Privacy Policy periodically. We will notify
                you of material changes by updating the &ldquo;Last
                updated&rdquo; date at the top of this page. We encourage you
                to review this Policy regularly. Your continued use of the
                Services after any changes constitutes your acceptance of the
                updated Policy.
              </p>
            </section>

            {/* Contact */}
            <section
              style={{
                padding: "2rem",
                background: "var(--bg-card)",
                borderRadius: 12,
                border: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                11. Contact Us
              </h2>
              <p>
                If you have questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us at:
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                <strong style={{ color: "var(--text-primary)" }}>
                  EyeD ID Lab — Privacy Team
                </strong>
                <br />
                Email:{" "}
                <a
                  href="mailto:partnerships@eyedlab.io"
                  style={{ color: "var(--accent-teal-bright)" }}
                >
                  partnerships@eyedlab.io
                </a>
                <br />
                Website:{" "}
                <a
                  href="https://eyedlab.io"
                  style={{ color: "var(--accent-teal-bright)" }}
                >
                  eyedlab.io
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            EyeD ID Lab{" "}
            <span>· Powered by Particle Health · NuStack Digital Ventures</span>
          </div>
          <div className="footer-links">
            <a href="/" className="footer-link">
              Home
            </a>
            <a href="/terms" className="footer-link">
              Terms of Service
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
