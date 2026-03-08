import './Hero.css'

export default function Hero() {
  const handleSOS = () => {
    window.open('tel:112', '_self')
  }

  const handleFindPolice = () => {
    if (!navigator.geolocation) {
      alert('Location is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const url = `https://www.google.com/maps/search/police+stations/@${latitude},${longitude},14z`
        window.open(url, '_blank')
      },
      () => alert('Could not get location. Please enable location permissions to find nearby police stations.')
    )
  }

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert('Location is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`
        const text = `My current location: ${url}`
        if (navigator.share) {
          navigator.share({ title: 'My location - Raksha', text, url }).catch(() => {
            navigator.clipboard.writeText(text)
            alert('Location link copied to clipboard.')
          })
        } else {
          navigator.clipboard.writeText(text)
          alert('Location link copied to clipboard. Share it with your trusted contacts.')
        }
      },
      () => alert('Could not get location. Please check permissions.')
    )
  }

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />

      <div className="hero-content">
        {/* Eyebrow */}
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-dot" />
          Women Safety Platform
        </div>

        {/* Title */}
        <h1 className="hero-title">
          Your safety,{' '}
          <span className="highlight">our priority</span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle">
          Raksha is your AI-powered companion for women&apos;s safety —
          emergency help, self-defense guides, legal rights, and trusted tools, all in one place.
        </p>

        {/* Stats */}
        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">24/7</span>
            <span className="hero-stat-label">Active Support</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">6+</span>
            <span className="hero-stat-label">Helplines</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">Free</span>
            <span className="hero-stat-label">Always</span>
          </div>
        </div>

        {/* Primary CTA row — SOS gets full width, secondary buttons below */}
        <div className="hero-actions">
          {/* SOS — visually dominant, full row */}
          <button className="btn btn-accent hero-btn-sos" onClick={handleSOS}>
            <span className="btn-icon">🚨</span>
            Emergency SOS — Call 112
          </button>

          {/* Secondary row: two compact buttons */}
          <div className="hero-secondary-btns">
            <button className="btn hero-btn-loc" onClick={handleShareLocation}>
              <span className="btn-icon">📍</span>
              Share Location
            </button>
            <button className="btn hero-btn-police" onClick={handleFindPolice}>
              <span className="btn-icon">🚓</span>
              Nearby Police
            </button>
          </div>

          {/* Explore link — subtle */}
          <button className="hero-scroll-link" onClick={() => scrollTo('safety-tips')}>
            Explore safety features ↓
          </button>
        </div>
      </div>

      {/* Right visual panel */}
      <div className="hero-visual">
        <div className="dashboard-badge badge-top">
          <div className="badge-icon pulse">🛡️</div>
          <div className="badge-text">
            <strong>24/7</strong>
            <span>Active Support</span>
          </div>
        </div>

        <div className="dashboard-badge badge-middle">
          <div className="badge-icon ring">📡</div>
          <div className="badge-text">
            <strong>Live</strong>
            <span>Location Sharing</span>
          </div>
        </div>

        <div className="hero-card card">
          <h3>✨ Quick tips</h3>
          <ul>
            <li>Save 112 &amp; 1091 in your phone</li>
            <li>Share live location before traveling</li>
            <li>Learn 3 basic self-defense moves</li>
            <li>Know your legal rights</li>
          </ul>
        </div>

        <div className="dashboard-badge badge-bottom">
          <div className="badge-icon bounce">🥋</div>
          <div className="badge-text">
            <strong>Self-Defense</strong>
            <span>Step-by-step guides</span>
          </div>
        </div>
      </div>
    </section>
  )
}
