import express from 'express';
import pool from '../db.js';
import authorize from '../middleware/authorize.js';

const router = express.Router();

// Get all emergency contacts for the logged-in user
router.get('/', authorize, async (req, res) => {
  try {
    const contacts = await pool.query(
      'SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(contacts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Add a new emergency contact
router.post('/', authorize, async (req, res) => {
  try {
    const { name, phone_number, relation } = req.body;
    
    if (!name || !phone_number) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const newContact = await pool.query(
      'INSERT INTO emergency_contacts (user_id, name, phone_number, relation) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, name, phone_number, relation]
    );
    
    res.json(newContact.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Delete an emergency contact
router.delete('/:id', authorize, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the contact belongs to the user
    const contact = await pool.query('SELECT * FROM emergency_contacts WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    
    if (contact.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found or unauthorized' });
    }

    await pool.query('DELETE FROM emergency_contacts WHERE id = $1', [id]);
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
