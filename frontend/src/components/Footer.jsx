import './Footer.css'

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Brand */}
          <div>
            <div className="footer-brand">
              <span className="logo-icon">🛡️</span>
              <span className="logo-text">Raksha</span>
            </div>
            <p className="footer-tagline">
              Women safety, one tap away. Your AI-powered companion for emergency help, legal rights, and safety tools.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <p className="footer-col-title">Quick Links</p>
            <div className="footer-col-links">
              <a href="#hero" onClick={e => { e.preventDefault(); scrollTo('hero') }}>Home</a>
              <a href="#safety-tips" onClick={e => { e.preventDefault(); scrollTo('safety-tips') }}>Safety Tips</a>
              <a href="#emergency" onClick={e => { e.preventDefault(); scrollTo('emergency') }}>Emergency</a>
              <a href="#legal-rights" onClick={e => { e.preventDefault(); scrollTo('legal-rights') }}>Legal Rights</a>
              <a href="#tools" onClick={e => { e.preventDefault(); scrollTo('tools') }}>Safety Tools</a>
              <a href="#journey-tracker" onClick={e => { e.preventDefault(); scrollTo('journey-tracker') }}>Journey Timer</a>
            </div>
          </div>

          {/* Emergency numbers */}
          <div>
            <p className="footer-col-title">Emergency Numbers</p>
            <div className="footer-emergency-nums">
              <div className="footer-num"><strong>112</strong> National Emergency</div>
              <div className="footer-num"><strong>1091</strong> Women Helpline</div>
              <div className="footer-num"><strong>181</strong> Domestic Violence</div>
              <div className="footer-num"><strong>14490</strong> NCW Helpline</div>
              <div className="footer-num"><strong>1930</strong> Cyber Crime</div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-note">
            In case of emergency, call <strong>112</strong> or <strong>1091</strong>. This site is for information only.
          </p>
          <p className="footer-copy">© 2026 Raksha. Made with ❤️ for women's safety.</p>
        </div>
      </div>
    </footer>
  )
}
