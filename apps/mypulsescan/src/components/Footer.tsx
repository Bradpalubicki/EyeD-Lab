export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">MyPulse<span>Scan</span></div>
            <p className="footer-tagline">
              Patient health record intelligence for modern clinics.
              Connected to 320M+ US patients via CommonWell, Carequality, and TEFCA.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <div className="footer-links">
              <a href="#features" className="footer-link">Features</a>
              <a href="#how-it-works" className="footer-link">How It Works</a>
              <a href="#revenue" className="footer-link">RPM Revenue</a>
              <a href="#calculator" className="footer-link">ROI Calculator</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Practice Types</div>
            <div className="footer-links">
              <a href="#verticals" className="footer-link">Urgent Care</a>
              <a href="#verticals" className="footer-link">Primary Care</a>
              <a href="#verticals" className="footer-link">Insurance-Based</a>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <div className="footer-links">
              <a href="mailto:hello@mypulsescan.com" className="footer-link">Contact</a>
              <a href="mailto:hello@mypulsescan.com" className="footer-link">Request Demo</a>
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">BAA Request</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-legal">
            © {new Date().getFullYear()} MyPulseScan. All rights reserved.
            Powered by NuStack Digital Ventures.
          </div>
          <div className="footer-compliance">
            <span className="compliance-badge">HIPAA Compliant</span>
            <span className="compliance-badge">FHIR R4</span>
            <span className="compliance-badge">TEFCA</span>
            <span className="compliance-badge">BAA Available</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
