import express from 'express';
import pool from '../db.js';
import authorize from '../middleware/authorize.js';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const router = express.Router();

let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// Start a new journey or SOS trigger
router.post('/start', authorize, async (req, res) => {
  try {
    const { start_location, end_location, status } = req.body;
    
    // Status can be 'in-progress'. If triggered by SOS button, status could be 'alert'
    const journeyStatus = status || 'in-progress';

    const newJourney = await pool.query(
      'INSERT INTO journeys (user_id, start_location, end_location, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, start_location, end_location || 'Unknown', journeyStatus]
    );

    res.json(newJourney.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Get active journey for the user
router.get('/active', authorize, async (req, res) => {
  try {
    const activeJourneys = await pool.query(
      "SELECT * FROM journeys WHERE user_id = $1 AND status IN ('in-progress', 'alert') ORDER BY started_at DESC",
      [req.user.id]
    );
    res.json(activeJourneys.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// End a journey (Mark as completed)
router.put('/:id/end', authorize, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify it belongs to user
    const journey = await pool.query('SELECT * FROM journeys WHERE id = $1 AND user_id = $2', [id, req.user.id]);
    if (journey.rows.length === 0) {
      return res.status(404).json({ error: 'Journey not found or unauthorized' });
    }

    const updatedJourney = await pool.query(
      "UPDATE journeys SET status = 'completed', ended_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );

    res.json(updatedJourney.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Trigger SOS (Alternative fast route)
router.post('/sos', authorize, async (req, res) => {
  try {
    const { current_location, destination, time_passed } = req.body;
    
    const newAlert = await pool.query(
      "INSERT INTO journeys (user_id, start_location, end_location, status) VALUES ($1, $2, $3, 'alert') RETURNING *",
      [req.user.id, current_location || 'Unknown location', destination || 'Emergency']
    );

    // Find the user's name from database to put in the email
    const userQuery = await pool.query('SELECT name, email FROM users WHERE id = $1', [req.user.id]);
    const userName = userQuery.rows[0].name;
    const userEmail = userQuery.rows[0].email;

    const contacts = await pool.query('SELECT name, phone_number FROM emergency_contacts WHERE user_id = $1', [req.user.id]);
    const sentAlerts = [];

    // Notify contacts via Email (100% Free)
    if (transporter) {
      let emailText = `🚨 PUBLIC EMERGENCY SOS ALERT 🚨\n\n${userName} has triggered an emergency panic signal!\n\nLast Known Location: ${current_location || 'Unknown'}\n\nPlease check on ${userName} immediately!`;
      let subjectLine = `🚨 EMERGENCY ALERT FROM ${userName} 🚨`;

      if (time_passed) {
        emailText = `🚨 AUTOMATIC SAFETY TIMER ALERT 🚨\n\n${userName} did not reach their destination in time!\n\nDestination: ${destination || 'Unknown'}\nTime Passed: ${time_passed} minutes\nLast Known Location: ${current_location || 'Unknown'}\n\nPlease check on ${userName} immediately!`;
        subjectLine = `🚨 TIMER EXPIRED: Check on ${userName} 🚨`;
      }

      // 1. Email the user themselves as a confirmation record
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: userEmail,
          subject: time_passed ? `🚨 AUTOMATIC SOS: Timer Expired` : `🚨 SOS CONFIRMATION: Raksha Alert Sent`,
          text: `Your SOS alert was triggered.\nLocation tracked: ${current_location}`
        });
        sentAlerts.push('Self');
      } catch (err) {
         console.error('Self confirmation email failed:', err);
      }

      // 2. Email the Trusted Contacts
      // Since we changed the frontend to ask for email explicitly, we just send to that field.
      for (let contact of contacts.rows) {
        if (contact.phone_number.includes('@')) {
          try {
            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: contact.phone_number, 
              subject: subjectLine,
              text: emailText
            });
            sentAlerts.push(contact.name);
          } catch (err) {
            console.error(`Failed to send email alert to ${contact.phone_number}:`, err.message);
          }
        }
      }
    }

    res.json({ 
      message: 'SOS Alert Triggered Successfully!', 
      alert: newAlert.rows[0],
      notify_contacts: sentAlerts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
