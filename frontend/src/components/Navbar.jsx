import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Navbar.css'

const navLinks = [
  { path: '/', hash: '#hero', id: 'hero', label: 'Home' },
  { path: '/safety-tips', id: 'safety-tips', label: 'Safety Tips' },
  { path: '/', hash: '#emergency', id: 'emergency', label: 'Emergency' },
  { path: '/', hash: '#trusted-contacts', id: 'trusted-contacts', label: 'Contacts' },
  { path: '/', hash: '#tools', id: 'tools', label: 'Tools' },
  { path: '/', hash: '#journey-tracker', id: 'journey-tracker', label: 'Journey' },
  { path: '/self-defense', id: 'self-defense', label: 'Self-Defense' },
  { path: '/legal-rights', id: 'legal-rights', label: 'Legal Rights' },
  { path: '/resources', id: 'resources', label: 'Resources' },
  { path: '/about', id: 'about', label: 'About' },
]

export default function Navbar({ onLogout, userRole, userName }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navigate = useNavigate()
  const location = useLocation()

  const handleNavClick = (e, link) => {
    e.preventDefault()
    if (link.path === '/') {
      if (location.pathname !== '/') {
        // Navigate home then scroll to hash
        navigate('/', { state: { scrollTo: link.hash } })
      } else {
        // Already on home, just scroll
        const el = document.getElementById(link.id)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }
    } else {
      // Navigate to separate page
      navigate(link.path)
      window.scrollTo(0, 0)
    }
    setMenuOpen(false)
  }

  useEffect(() => {
    // If we just navigated back to home with a scroll target
    if (location.pathname === '/' && location.state?.scrollTo) {
      const hash = location.state.scrollTo
      const el = document.querySelector(hash)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
      // clear state so it doesn't happen again on refresh
      window.history.replaceState({}, document.title)
    }

    const handleScroll = () => {
      const sections = navLinks.filter(l => l.path === '/').map(link => document.getElementById(link.id)).filter(Boolean)
      let currentSection = 'hero'
      for (let section of sections) {
        if (section.getBoundingClientRect().top <= window.innerHeight / 2) {
          currentSection = section.id
        }
      }
      setActiveSection(currentSection)
    }

    if (location.pathname === '/') {
      window.addEventListener('scroll', handleScroll, { passive: true })
      return () => window.removeEventListener('scroll', handleScroll)
    } else {
      setActiveSection(location.pathname.substring(1)) // Remove leading slash
    }
  }, [location.pathname, location.state])

  return (
    <header className="navbar">
      <div className="navbar-inner">

        {/* Logo */}
        <a href="/" onClick={(e) => handleNavClick(e, navLinks[0])} className="logo">
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
            <a
              key={link.id}
              href={link.path === '/' ? link.hash : link.path}
              onClick={(e) => handleNavClick(e, link)}
              className={`nav-link ${
                (location.pathname === '/' && activeSection === link.id) || 
                (location.pathname !== '/' && location.pathname === link.path) 
                  ? 'active' : ''
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* User badge + Logout */}
        <div className="navbar-user">
          {userRole && (
            <span className={`navbar-role-badge ${userRole === 'admin' ? 'navbar-role-badge--admin' : ''}`}>
              {userRole === 'admin' ? '🔐 Admin' : `👤 ${userName || 'User'}`}
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
