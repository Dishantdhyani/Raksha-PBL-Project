import { useState, useEffect } from 'react'
import './TrustedContacts.css'
import Toast from './Toast'

export default function TrustedContacts() {
  const [contacts, setContacts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: '',
    notes: '',
  })

  // Load contacts from database on mount
  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch('http://localhost:5000/api/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        // Map backend columns to frontend variables
        const mapped = data.map(c => ({
          id: c.id,
          name: c.name,
          email: c.phone_number,
          relationship: c.relation || '',
        }))
        setContacts(mapped)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddContact = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setToastMessage('Please fill in name and email')
      setShowToast(true)
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      setToastMessage('You must be logged in to save contacts')
      setShowToast(true)
      return
    }

    try {
      if (editingId) {
        // Edit existing contact - Not supported in backend yet, just show toast
        setToastMessage('Edit feature connecting soon!')
        setEditingId(null)
      } else {
        // Add new contact to database
        const res = await fetch('http://localhost:5000/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            phone_number: formData.email, // Passing email in the DB's phone_number column
            relation: formData.relationship
          })
        })

        if (res.ok) {
          await fetchContacts()
          setToastMessage('Contact added safely to database')
        } else {
          setToastMessage('Failed to add contact')
        }
      }
      
      setFormData({ name: '', email: '', relationship: '', notes: '' })
      setShowForm(false)
      setShowToast(true)
    } catch (err) {
      console.error(err)
      setToastMessage('Network Error')
      setShowToast(true)
    }
  }

  const handleEditContact = (contact) => {
    setFormData(contact)
    setEditingId(contact.id)
    setShowForm(true)
  }

  const handleDeleteContact = async (id) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      const token = localStorage.getItem('token')
      try {
        const res = await fetch(`http://localhost:5000/api/contacts/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (res.ok) {
          await fetchContacts()
          setToastMessage('Contact deleted securely')
          setShowToast(true)
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handleEmail = (emailAddress) => {
    window.open(`mailto:${emailAddress}`, '_self')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', email: '', relationship: '', notes: '' })
  }

  return (
    <section id="trusted-contacts" className="trusted-contacts">
      <h2 className="section-title">Trusted Contacts</h2>
      <p className="section-subtitle">
        Save your trusted contacts so you can reach them quickly in any situation. Share location or call them instantly.
      </p>

      {!showForm ? (
        <button className="btn btn-primary add-contact-btn" onClick={() => setShowForm(true)}>
          ➕ Add Trusted Contact
        </button>
      ) : (
        <div className="contact-form card">
          <h3>
            {editingId ? 'Edit Contact' : 'Add New Contact'}
          </h3>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              placeholder="e.g., Mom, Best Friend"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Contact Email Address *</label>
            <input
              type="email"
              name="email"
              placeholder="e.g., mom@gmail.com"
              value={formData.email}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Relationship</label>
            <input
              type="text"
              name="relationship"
              placeholder="e.g., Sister, Boyfriend, Colleague"
              value={formData.relationship}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              placeholder="Add any important details (optional)"
              value={formData.notes}
              onChange={handleInputChange}
              className="form-input"
              rows="3"
            ></textarea>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleAddContact}>
              {editingId ? '✓ Update Contact' : '➕ Add Contact'}
            </button>
            <button className="btn btn-ghost" onClick={handleCancel}>
              ✕ Cancel
            </button>
          </div>
        </div>
      )}

      {contacts.length > 0 && (
        <div className="contacts-list">
          <div className="contacts-grid">
            {contacts.map(contact => (
              <div key={contact.id} className="trusted-contact-card card">
                <div className="contact-header">
                  <div className="contact-info">
                    <h3 className="contact-name">{contact.name}</h3>
                    {contact.relationship && (
                      <p className="contact-relationship">{contact.relationship}</p>
                    )}
                  </div>
                  <div className="contact-actions-menu">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => handleEditContact(contact)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteContact(contact.id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="contact-number">
                  <a href={`mailto:${contact.email}`} className="phone-link">
                    📧 {contact.email}
                  </a>
                </div>

                {contact.notes && (
                  <p className="contact-notes">{contact.notes}</p>
                )}

                <div className="contact-buttons">
                  <button
                    className="btn btn-accent"
                    onClick={() => handleEmail(contact.email)}
                  >
                    📧 Email
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      navigator.clipboard.writeText(contact.email)
                      setToastMessage(`${contact.name}'s email copied`)
                      setShowToast(true)
                    }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contacts.length === 0 && !showForm && (
        <div className="empty-state">
          <p>No trusted contacts yet. Add one to get started!</p>
        </div>
      )}

      {showToast && (
        <Toast
          message={toastMessage}
          onClose={() => setShowToast(false)}
        />
      )}
    </section>
  )
}
