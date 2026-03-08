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
    number: '',
    relationship: '',
    notes: '',
  })

  // Load contacts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('raksha_trusted_contacts')
    if (saved) {
      setContacts(JSON.parse(saved))
    }
  }, [])

  // Save contacts to localStorage
  const saveContacts = (newContacts) => {
    setContacts(newContacts)
    localStorage.setItem('raksha_trusted_contacts', JSON.stringify(newContacts))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddContact = () => {
    if (!formData.name.trim() || !formData.number.trim()) {
      setToastMessage('Please fill in name and number')
      setShowToast(true)
      return
    }

    if (editingId) {
      // Edit existing contact
      const updatedContacts = contacts.map(c =>
        c.id === editingId
          ? { ...c, ...formData }
          : c
      )
      saveContacts(updatedContacts)
      setToastMessage('Contact updated successfully')
      setEditingId(null)
    } else {
      // Add new contact
      const newContact = {
        id: Date.now(),
        ...formData,
      }
      saveContacts([...contacts, newContact])
      setToastMessage('Contact added successfully')
    }

    setFormData({ name: '', number: '', relationship: '', notes: '' })
    setShowForm(false)
    setShowToast(true)
  }

  const handleEditContact = (contact) => {
    setFormData(contact)
    setEditingId(contact.id)
    setShowForm(true)
  }

  const handleDeleteContact = (id) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(c => c.id !== id)
      saveContacts(updatedContacts)
      setToastMessage('Contact deleted')
      setShowToast(true)
    }
  }

  const handleCall = (number) => {
    const clean = number.replace(/-/g, '')
    window.open(`tel:${clean}`, '_self')
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setFormData({ name: '', number: '', relationship: '', notes: '' })
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
            <label>Phone Number *</label>
            <input
              type="tel"
              name="number"
              placeholder="e.g., +91 98765 43210"
              value={formData.number}
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
                  <a href={`tel:${contact.number.replace(/-/g, '')}`} className="phone-link">
                    📞 {contact.number}
                  </a>
                </div>

                {contact.notes && (
                  <p className="contact-notes">{contact.notes}</p>
                )}

                <div className="contact-buttons">
                  <button
                    className="btn btn-accent"
                    onClick={() => handleCall(contact.number)}
                  >
                    📞 Call
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      navigator.clipboard.writeText(contact.number)
                      setToastMessage(`${contact.name}'s number copied`)
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
