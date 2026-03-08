import { useState, useEffect } from 'react'
import './EmergencyContacts.css'
import Toast from './Toast'

const contacts = [
  { name: 'National Emergency', number: '112', desc: 'Pan-India police, fire, health. 24/7. Use app or press power button 3× for panic.', primary: true },
  { name: 'Women Helpline (Police)', number: '1091', desc: '24/7 police assistance for women: domestic violence, harassment, assault.', primary: true },
  { name: 'NCW Helpline', number: '14490', desc: 'National Commission for Women – immediate support for women in distress.', primary: false },
  { name: 'Domestic Violence Helpline', number: '181', desc: 'Support and referral for domestic violence.', primary: false },
  { name: 'NCW Helpline (Phone)', number: '7827170170', desc: 'National Commission for Women direct line.', primary: false },
  { name: 'Rape Crisis Helpline', number: '1800-2000-737', desc: 'Toll-free crisis support.', primary: false },
]

export default function EmergencyContacts() {
  const [favorites, setFavorites] = useState([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  // Load favorites from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('raksha_favorites')
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [])

  // Save favorites to localStorage
  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites)
    localStorage.setItem('raksha_favorites', JSON.stringify(newFavorites))
  }

  const call = (num) => {
    const clean = num.replace(/-/g, '')
    window.open(`tel:${clean}`, '_self')
  }

  const copyToClipboard = (num, name) => {
    navigator.clipboard.writeText(num)
    setToastMessage(`${name} copied to clipboard`)
    setShowToast(true)
  }

  const toggleFavorite = (number) => {
    const isFavorite = favorites.includes(number)
    const newFavorites = isFavorite
      ? favorites.filter(fav => fav !== number)
      : [...favorites, number]
    saveFavorites(newFavorites)
  }

  const isFavorite = (number) => favorites.includes(number)

  return (
    <section id="emergency" className="emergency-contacts">
      <h2 className="section-title">Emergency Contacts</h2>
      <p className="section-subtitle">
        Save these numbers. In an emergency, call 112 or 1091 immediately. All services are 24/7 where indicated.
      </p>
      <div className="contacts-grid">
        {contacts.map((c, i) => (
          <div key={i} className={`contact-card card ${c.primary ? 'primary' : ''}`}>
            <div className="contact-header">
              <span className="contact-name">{c.name}</span>
              <div className="contact-badges">
                {c.primary && <span className="badge">24/7</span>}
                <button
                  className={`favorite-btn ${isFavorite(c.number) ? 'active' : ''}`}
                  onClick={() => toggleFavorite(c.number)}
                  title={isFavorite(c.number) ? 'Remove from favorites' : 'Add to favorites'}
                  aria-label={`Toggle favorite for ${c.name}`}
                >
                  {isFavorite(c.number) ? '★' : '☆'}
                </button>
              </div>
            </div>
            <p className="contact-desc">{c.desc}</p>
            <div className="contact-actions">
              <button className="btn btn-accent contact-call" onClick={() => call(c.number)}>
                📞 Call
              </button>
              <button
                className="btn btn-primary contact-copy"
                onClick={() => copyToClipboard(c.number, c.name)}
                title="Copy to clipboard"
              >
                📋 {c.number}
              </button>
            </div>
          </div>
        ))}
      </div>
      {showToast && <Toast message={toastMessage} onClose={() => setShowToast(false)} />}
    </section>
  )
}
