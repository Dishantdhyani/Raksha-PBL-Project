import { useState, useEffect } from 'react'
import './Navbar.css'

const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'safety-tips', label: 'Safety Tips' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'trusted-contacts', label: 'Contacts' },
  { id: 'tools', label: 'Tools' },
  { id: 'journey-tracker', label: 'Journey' },
  { id: 'self-defense', label: 'Self-Defense' },
  { id: 'legal-rights', label: 'Legal Rights' },
  { id: 'resources', label: 'Resources' },
  { id: 'about', label: 'About' },
]

export default function Navbar({ onLogout, userRole }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => document.getElementById(link.id)).filter(Boolean)
      let currentSection = 'hero'
      for (let section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight / 2) {
          currentSection = section.id
        }
      }
      setActiveSection(currentSection)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <a href="#hero" onClick={(e) => { e.preventDefault(); scrollTo('hero') }} className="logo">
          <span className="logo-icon">🛡️</span>
          <span className="logo-text">Raksha</span>
        </a>

        {/* Hamburger */}
        <button
          className="menu-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
          <span className={menuOpen ? 'open' : ''} />
        </button>

        {/* Nav links */}
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* User badge + Logout */}
        <div className="navbar-user">
          {userRole && (
            <span className={`navbar-role-badge ${userRole === 'admin' ? 'navbar-role-badge--admin' : ''}`}>
              {userRole === 'admin' ? '🔐 Admin' : '👤 User'}
            </span>
          )}
          {onLogout && (
            <button className="navbar-logout-btn" onClick={onLogout} title="Log out">
              ↩ Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
