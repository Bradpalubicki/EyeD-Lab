import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | EyeD ID Lab",
  description:
    "Terms of Service for EyeD ID Lab — clinical data infrastructure powered by Particle Health.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://eyedlab.io/terms" },
};

export default function TermsPage() {
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
              Terms of Service
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
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using any service, application programming
                interface (API), website, or product offered by EyeD ID Lab
                (&ldquo;EyeD ID Lab,&rdquo; &ldquo;we,&rdquo;
                &ldquo;our,&rdquo; or &ldquo;us&rdquo;), including but not
                limited to eyedlab.io, mypulsescan.com, and
                mypulsescan.health (collectively, the &ldquo;Services&rdquo;),
                you (&ldquo;User,&rdquo; &ldquo;you,&rdquo; or
                &ldquo;your&rdquo;) agree to be legally bound by these Terms of
                Service (&ldquo;Terms&rdquo;). If you do not agree to these
                Terms, you must not access or use the Services.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                These Terms constitute a legally binding agreement between you
                and EyeD ID Lab. By using the Services, you represent that you
                are at least 18 years of age and have the legal authority to
                enter into this agreement on behalf of yourself or the entity
                you represent.
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
                2. Description of Services
              </h2>
              <p>
                EyeD ID Lab provides clinical data infrastructure services,
                including API access to aggregated patient health records
                sourced from national and state health information exchange
                networks (including CommonWell, Carequality, TEFCA, and
                Surescripts), patient identity matching via enterprise Master
                Patient Index (MPI) services, FHIR R4 and C-CDA data delivery,
                and write-back integration with major electronic medical record
                (EMR) systems.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                The Services are powered by Particle Health&rsquo;s underlying
                network infrastructure. Access to the Services is provided under
                the terms of a separate partnership, developer, or licensing
                agreement executed between EyeD ID Lab and your organization. In
                the event of a conflict between these Terms and any such
                agreement, the executed agreement governs.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                EyeD ID Lab reserves the right to modify, suspend, or
                discontinue any portion of the Services at any time, with or
                without notice, and without liability to you.
              </p>
            </section>

            {/* Section 3 */}
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
                3. User Obligations
              </h2>
              <p>You agree that you will:</p>
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
                  Use the Services only for lawful purposes and in compliance
                  with all applicable federal, state, and local laws and
                  regulations, including but not limited to the Health Insurance
                  Portability and Accountability Act (HIPAA), the Health
                  Information Technology for Economic and Clinical Health (HITECH)
                  Act, and applicable state health data privacy laws.
                </li>
                <li>
                  Not use the Services to access, retrieve, transmit, or store
                  patient health information (PHI) except as expressly permitted
                  under a signed Business Associate Agreement (BAA) with EyeD ID
                  Lab.
                </li>
                <li>
                  Not reverse engineer, decompile, disassemble, or attempt to
                  derive the source code of any software component of the
                  Services.
                </li>
                <li>
                  Not use the Services to transmit any content that is unlawful,
                  harmful, defamatory, obscene, or otherwise objectionable.
                </li>
                <li>
                  Maintain the confidentiality of any API keys, credentials, or
                  access tokens issued to you and promptly notify EyeD ID Lab of
                  any unauthorized access or suspected breach.
                </li>
                <li>
                  Not share, resell, or sublicense access to the Services or API
                  without prior written consent from EyeD ID Lab.
                </li>
                <li>
                  Implement and maintain appropriate technical and organizational
                  safeguards to protect any data received through the Services.
                </li>
              </ul>
            </section>

            {/* Section 4 */}
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
                4. Intellectual Property
              </h2>
              <p>
                All content, technology, software, APIs, documentation,
                trademarks, service marks, logos, trade names, and other
                intellectual property associated with the Services
                (&ldquo;EyeD IP&rdquo;) are and shall remain the exclusive
                property of EyeD ID Lab or its licensors. These Terms do not
                grant you any ownership interest in the EyeD IP.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                Subject to your compliance with these Terms and any applicable
                agreement, EyeD ID Lab grants you a limited, non-exclusive,
                non-transferable, revocable license to access and use the
                Services solely for the purposes expressly authorized in writing
                by EyeD ID Lab.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                You retain ownership of any data you submit to the Services.
                By submitting data, you grant EyeD ID Lab a limited license to
                use such data solely to provide and improve the Services, in
                accordance with our Privacy Policy.
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
                5. Disclaimer of Warranties
              </h2>
              <p>
                THE SERVICES ARE PROVIDED ON AN &ldquo;AS IS&rdquo; AND
                &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
                WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                TITLE, AND NON-INFRINGEMENT. EYED ID LAB DOES NOT WARRANT THAT
                THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE
                OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                CLINICAL DATA PROVIDED THROUGH THE SERVICES IS SOURCED FROM
                THIRD-PARTY HEALTH INFORMATION NETWORKS AND IS PROVIDED FOR
                INFORMATIONAL PURPOSES ONLY. EYED ID LAB MAKES NO WARRANTY AS
                TO THE ACCURACY, COMPLETENESS, TIMELINESS, OR FITNESS OF ANY
                CLINICAL DATA FOR ANY SPECIFIC MEDICAL, DIAGNOSTIC, OR
                TREATMENT PURPOSE. THE SERVICES ARE NOT INTENDED TO SUBSTITUTE
                FOR PROFESSIONAL MEDICAL JUDGMENT.
              </p>
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
                6. Limitation of Liability
              </h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT
                SHALL EYED ID LAB, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS,
                PARTNERS, SUPPLIERS, OR LICENSORS BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY
                DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE,
                GOODWILL, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR
                RELATING TO YOUR USE OF OR INABILITY TO USE THE SERVICES, EVEN
                IF EYED ID LAB HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
                DAMAGES.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                IN NO EVENT SHALL EYED ID LAB&rsquo;S TOTAL CUMULATIVE
                LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATING TO
                THESE TERMS OR THE SERVICES EXCEED THE GREATER OF (A) THE
                AMOUNTS PAID BY YOU TO EYED ID LAB DURING THE TWELVE (12)
                MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM,
                OR (B) ONE HUNDRED DOLLARS ($100.00).
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
                CERTAIN WARRANTIES OR LIABILITY. TO THE EXTENT SUCH EXCLUSIONS
                OR LIMITATIONS ARE NOT PERMITTED UNDER APPLICABLE LAW, THE
                FOREGOING LIMITATIONS SHALL APPLY TO THE FULLEST EXTENT
                PERMITTED BY LAW.
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
                7. Indemnification
              </h2>
              <p>
                You agree to defend, indemnify, and hold harmless EyeD ID Lab
                and its officers, directors, employees, agents, and successors
                from and against any claims, liabilities, damages, judgments,
                awards, losses, costs, expenses, or fees (including reasonable
                attorneys&rsquo; fees) arising out of or relating to (a) your
                use of or access to the Services, (b) your violation of these
                Terms, (c) your violation of any applicable law or regulation,
                or (d) your infringement of any third-party right, including any
                intellectual property or privacy right.
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
                8. Governing Law and Dispute Resolution
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the State of Nevada, without regard to its
                conflict of law provisions. Any dispute arising out of or
                relating to these Terms or the Services shall be resolved
                exclusively in the state or federal courts located in Clark
                County, Nevada, and you hereby consent to the personal
                jurisdiction and venue of such courts.
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                Notwithstanding the foregoing, EyeD ID Lab may seek injunctive
                or other equitable relief in any jurisdiction to protect its
                intellectual property rights or confidential information.
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
                9. Termination
              </h2>
              <p>
                EyeD ID Lab may suspend or terminate your access to the
                Services at any time, with or without cause, and with or without
                notice. Upon termination, all licenses granted under these Terms
                will immediately cease and you must stop using the Services. All
                provisions of these Terms that by their nature should survive
                termination shall survive, including but not limited to
                intellectual property, disclaimers, indemnification, and
                limitations of liability.
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
                10. Modifications to Terms
              </h2>
              <p>
                EyeD ID Lab reserves the right to modify these Terms at any
                time. We will provide notice of material changes by updating the
                &ldquo;Last updated&rdquo; date at the top of this page. Your
                continued use of the Services following the posting of updated
                Terms constitutes your acceptance of the revised Terms. If you
                do not agree to the updated Terms, you must stop using the
                Services.
              </p>
            </section>

            {/* Section 11 */}
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
                11. Miscellaneous
              </h2>
              <p>
                These Terms, together with any executed agreement between you
                and EyeD ID Lab and our Privacy Policy, constitute the entire
                agreement between you and EyeD ID Lab regarding the Services
                and supersede all prior agreements and understandings. If any
                provision of these Terms is found to be unenforceable, the
                remaining provisions will remain in full force and effect. The
                failure of EyeD ID Lab to enforce any right or provision of
                these Terms will not be considered a waiver of those rights.
              </p>
            </section>

            {/* Contact */}
            <section
              style={{
                marginTop: "1rem",
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
                12. Contact Us
              </h2>
              <p>
                If you have questions about these Terms of Service, please
                contact us at:
              </p>
              <p style={{ marginTop: "0.75rem" }}>
                <strong style={{ color: "var(--text-primary)" }}>
                  EyeD ID Lab
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
