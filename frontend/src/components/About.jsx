import './About.css'

export default function About() {
  return (
    <section id="about" className="about">
      <h2 className="section-title">About Raksha</h2>
      <p className="section-subtitle">
        A women safety initiative powered by AI to give you information and support when it matters.
      </p>
      <div className="about-content card">
        <div className="about-text">
          <p>
            <strong>Raksha</strong> means &quot;protection&quot; in Sanskrit. This platform is designed to put
            essential safety information, emergency contacts, and practical tools in one place—
            so you can act quickly and stay informed.
          </p>
          <p>
            Use the <strong>AI chatbot</strong> in the corner anytime to ask about
            safety tips, emergency numbers, legal rights, or to get guidance. It&apos;s here to
            support you 24/7.
          </p>
          <ul>
            <li>Quick access to national emergency (112) and women helplines (1091, 181, 14490)</li>
            <li>Safety tips for travel, home, online, and workplace</li>
            <li>Fake call and pre-travel checklist tools</li>
            <li>Journey safety timer with check-in system</li>
            <li>Know Your Legal Rights – 6 key areas explained</li>
            <li>Share your location with trusted contacts in one tap</li>
          </ul>
        </div>
        <div className="about-stats">
          <div className="about-stat-card">
            <span className="about-stat-icon">🛡️</span>
            <span className="about-stat-value">24/7</span>
            <span className="about-stat-label">Protection</span>
          </div>
          <div className="about-stat-card">
            <span className="about-stat-icon">📞</span>
            <span className="about-stat-value">6+</span>
            <span className="about-stat-label">Helplines</span>
          </div>
          <div className="about-stat-card">
            <span className="about-stat-icon">⚖️</span>
            <span className="about-stat-value">6</span>
            <span className="about-stat-label">Legal Rights</span>
          </div>
          <div className="about-stat-card">
            <span className="about-stat-icon">🤖</span>
            <span className="about-stat-value">AI</span>
            <span className="about-stat-label">Powered</span>
          </div>
        </div>
      </div>
    </section>
  )
}
